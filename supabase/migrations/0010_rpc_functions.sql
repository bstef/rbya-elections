-- All public writes and the voter's ballot write go through these
-- SECURITY DEFINER functions. No table grants exist that let a client
-- bypass a window check, a token check, or the ballot seat-limit trigger --
-- see 0011_rls_policies.sql for the corresponding (lack of) table grants.

-- ============================================================
-- submit_nomination -- public, no login required
-- ============================================================
create or replace function submit_nomination(
  p_position position_enum,
  p_name text,
  p_church text,
  p_location text,
  p_email citext,
  p_background text,
  p_reasons text,
  p_submitter_name text,
  p_submitter_email citext,
  p_pastor_contact citext default null,
  p_image_url text default null
)
returns candidates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_election elections;
  v_candidate candidates;
begin
  select * into v_election from elections where is_current limit 1;

  if v_election is null then
    raise exception 'no_current_election' using errcode = 'P0001';
  end if;

  if now() < v_election.nomination_opens_at or now() > v_election.nomination_cutoff_at then
    raise exception 'nominations_closed' using errcode = 'P0001';
  end if;

  insert into candidates (
    election_id, position, name, church, location, email,
    background, reasons, submitter_name, submitter_email,
    pastor_contact, image_url
  ) values (
    v_election.id, p_position, p_name, p_church, p_location, p_email,
    p_background, p_reasons, p_submitter_name, p_submitter_email,
    p_pastor_contact, p_image_url
  )
  returning * into v_candidate;

  return v_candidate;
end;
$$;

grant execute on function submit_nomination to anon, authenticated;

-- ============================================================
-- confirm_candidate -- public, token-based (no login), one-shot
-- ============================================================
create or replace function confirm_candidate(
  p_token uuid,
  p_accept boolean,
  p_pastor_contact citext default null
)
returns candidates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidate candidates;
  v_election elections;
begin
  select * into v_candidate from candidates where confirm_token = p_token;

  if v_candidate is null then
    raise exception 'invalid_token' using errcode = 'P0001';
  end if;

  select * into v_election from elections where id = v_candidate.election_id;

  if v_election is not null and now() > v_election.confirmation_cutoff_at then
    raise exception 'confirmation_window_closed' using errcode = 'P0001';
  end if;

  if v_candidate.confirmed_at is not null then
    raise exception 'already_confirmed' using errcode = 'P0001';
  end if;

  update candidates
  set confirmed_at = now(),
      accepted = p_accept,
      pastor_contact = coalesce(p_pastor_contact, pastor_contact)
  where id = v_candidate.id
  returning * into v_candidate;

  return v_candidate;
end;
$$;

grant execute on function confirm_candidate to anon, authenticated;

-- ============================================================
-- get_candidate_by_token -- public, token-based lookup used to render the
-- /confirm/[token] page. Exists because candidates_public_read (0011) only
-- exposes accepted candidates -- a pending nomination isn't selectable by
-- anon at all otherwise, so this returns just enough fields for context
-- without opening up the whole table to anonymous browsing.
-- ============================================================
create or replace function get_candidate_by_token(p_token uuid)
returns table (
  name text,
  position position_enum,
  church text,
  location text,
  submitter_name text,
  confirmed_at timestamptz,
  accepted boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select c.name, c.position, c.church, c.location, c.submitter_name, c.confirmed_at, c.accepted
  from candidates c
  where c.confirm_token = p_token;
$$;

grant execute on function get_candidate_by_token to anon, authenticated;

-- ============================================================
-- submit_comment -- public, no login required
-- ============================================================
create or replace function submit_comment(
  p_candidate_id uuid,
  p_type comment_type,
  p_content text,
  p_submitter_name text,
  p_submitter_email citext
)
returns comments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidate candidates;
  v_comment comments;
begin
  select * into v_candidate from candidates where id = p_candidate_id and not ignored;

  if v_candidate is null then
    raise exception 'candidate_not_found' using errcode = 'P0001';
  end if;

  insert into comments (candidate_id, type, content, submitter_name, submitter_email)
  values (p_candidate_id, p_type, p_content, p_submitter_name, p_submitter_email)
  returning * into v_comment;

  return v_comment;
end;
$$;

grant execute on function submit_comment to anon, authenticated;

-- ============================================================
-- register_delegates -- public church self-registration, no login.
-- Lands as verified = false; committee verifies in /admin/delegates.
-- p_delegates shape: [{ "name": "...", "email": "...", "delegate_type": "present" | "absentee" }, ...]
-- ============================================================
create or replace function register_delegates(
  p_church_name text,
  p_city_state text,
  p_pastor_name text,
  p_youth_leader_name text,
  p_registered_by_name text,
  p_registered_by_email citext,
  p_delegates jsonb
)
returns setof delegates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_election elections;
  v_church churches;
  v_delegate jsonb;
begin
  select * into v_election from elections where is_current limit 1;

  if v_election is null then
    raise exception 'no_current_election' using errcode = 'P0001';
  end if;

  if p_delegates is null or jsonb_array_length(p_delegates) = 0 then
    raise exception 'no_delegates_provided' using errcode = 'P0001';
  end if;

  select * into v_church from churches where lower(name) = lower(p_church_name);

  if v_church is null then
    insert into churches (name, city_state, pastor_name, youth_leader_name)
    values (p_church_name, p_city_state, p_pastor_name, p_youth_leader_name)
    returning * into v_church;
  else
    update churches
    set city_state = coalesce(p_city_state, city_state),
        pastor_name = coalesce(p_pastor_name, pastor_name),
        youth_leader_name = coalesce(p_youth_leader_name, youth_leader_name)
    where id = v_church.id;
  end if;

  for v_delegate in select * from jsonb_array_elements(p_delegates)
  loop
    insert into delegates (
      election_id, church_id, name, email, delegate_type,
      registered_by_name, registered_by_email, verified
    ) values (
      v_election.id,
      v_church.id,
      v_delegate->>'name',
      (v_delegate->>'email')::citext,
      coalesce((v_delegate->>'delegate_type')::delegate_type, 'present'),
      p_registered_by_name,
      p_registered_by_email,
      false
    )
    on conflict (election_id, email) do update
      set name = excluded.name,
          delegate_type = excluded.delegate_type,
          registered_by_name = excluded.registered_by_name,
          registered_by_email = excluded.registered_by_email;
  end loop;

  return query
    select * from delegates
    where election_id = v_election.id and church_id = v_church.id;
end;
$$;

grant execute on function register_delegates to anon, authenticated;

-- ============================================================
-- is_verified_delegate -- public, boolean-only check used by /login to
-- decide whether to send a magic link at all, without exposing any
-- delegate row to anon (delegates has no anon select policy at all -- see
-- 0011). Returns a bare boolean, nothing else, so it can't be used to
-- enumerate or read delegate data.
-- ============================================================
create or replace function is_verified_delegate(p_email citext)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from delegates d
    join elections e on e.id = d.election_id
    where e.is_current
      and d.email = p_email
      and d.verified
  );
$$;

grant execute on function is_verified_delegate to anon, authenticated;

-- ============================================================
-- submit_ballot -- requires an authenticated, verified delegate session.
-- Note: absentee delegates may vote for ANY RBYA committee position
-- (president/VP/treasurer/controller/committee-member are all "committee"
-- seats per the org's guidelines) -- the guideline's restriction is against
-- voting on *other convention business* (e.g. constitutional amendments),
-- which has no representation in this schema at all in v1. So there is no
-- per-position restriction to enforce here; a future `motions` table would
-- carry that restriction if/when "other business" voting is added.
-- ============================================================
create or replace function submit_ballot(
  p_position position_enum,
  p_candidate_ids uuid[]
)
returns ballots
language plpgsql
security definer
set search_path = public
as $$
declare
  v_election elections;
  v_delegate delegates;
  v_seats int;
  v_ballot ballots;
  v_candidate_id uuid;
  v_valid_count int;
  v_selection_count int;
begin
  select * into v_election from elections where is_current limit 1;

  if v_election is null then
    raise exception 'no_current_election' using errcode = 'P0001';
  end if;

  select * into v_delegate
  from delegates
  where auth_user_id = auth.uid()
    and election_id = v_election.id
    and verified
  for update;

  if v_delegate is null then
    raise exception 'not_a_registered_delegate' using errcode = 'P0001';
  end if;

  if now() < v_election.voting_opens_at or now() > v_election.voting_closes_at then
    raise exception 'voting_closed' using errcode = 'P0001';
  end if;

  if v_delegate.delegate_type = 'absentee' and now() > v_election.absentee_ballot_deadline then
    raise exception 'absentee_deadline_passed' using errcode = 'P0001';
  end if;

  select seats into v_seats
  from election_positions
  where election_id = v_election.id and position = p_position;

  if v_seats is null then
    raise exception 'unknown_position' using errcode = 'P0001';
  end if;

  v_selection_count := coalesce(array_length(p_candidate_ids, 1), 0);

  if v_selection_count > v_seats then
    raise exception 'too_many_selections' using errcode = 'P0001';
  end if;

  if v_selection_count > 0 then
    select count(*) into v_valid_count
    from candidates
    where id = any(p_candidate_ids)
      and election_id = v_election.id
      and position = p_position
      and accepted = true
      and not ignored;

    if v_valid_count <> v_selection_count then
      raise exception 'invalid_candidate_selection' using errcode = 'P0001';
    end if;
  end if;

  begin
    insert into ballots (election_id, delegate_id, position)
    values (v_election.id, v_delegate.id, p_position)
    returning * into v_ballot;
  exception
    when unique_violation then
      raise exception 'already_voted' using errcode = 'P0001';
  end;

  if v_selection_count > 0 then
    foreach v_candidate_id in array p_candidate_ids
    loop
      insert into ballot_selections (ballot_id, candidate_id)
      values (v_ballot.id, v_candidate_id);
    end loop;
  end if;

  return v_ballot;
end;
$$;

grant execute on function submit_ballot to authenticated;
