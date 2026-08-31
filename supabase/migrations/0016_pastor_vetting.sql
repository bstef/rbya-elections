-- Pastor vetting: an admin-triggered email link (mirrors the nominee
-- confirmation flow) where the candidate's pastor/youth-leader vouches for
-- them. Orthogonal to candidate_state() -- it's a separate signal shown as
-- its own badge, not a gate on ballot inclusion (candidates remain
-- eligible for the ballot based on accepted/ignored only, same as before).

alter table candidates
  add column pastor_approval_token uuid not null default gen_random_uuid() unique,
  add column pastor_requested_at timestamptz,
  add column pastor_approved boolean,
  add column pastor_responded_at timestamptz;

-- ============================================================
-- request_pastor_vetting -- admin-only. Requires pastor_contact to already
-- be on file (candidate supplies it when confirming their own nomination).
-- Returns the candidate row (including pastor_approval_token) so the admin
-- UI can display/copy the link until real email sending is wired up (see
-- src/lib/email/send.ts).
-- ============================================================
create or replace function request_pastor_vetting(p_candidate_id uuid)
returns candidates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidate candidates;
begin
  if not is_admin() then
    raise exception 'not_authorized' using errcode = 'P0001';
  end if;

  select * into v_candidate from candidates where id = p_candidate_id;

  if v_candidate is null then
    raise exception 'candidate_not_found' using errcode = 'P0001';
  end if;

  if v_candidate.pastor_contact is null then
    raise exception 'no_pastor_contact_on_file' using errcode = 'P0001';
  end if;

  update candidates
  set pastor_requested_at = now()
  where id = p_candidate_id
  returning * into v_candidate;

  return v_candidate;
end;
$$;

grant execute on function request_pastor_vetting to authenticated;

-- ============================================================
-- get_pastor_vetting_candidate -- public, token-based lookup for the
-- /vet/[token] page. Same rationale as get_candidate_by_token: the
-- candidate isn't necessarily publicly readable yet, so this returns just
-- enough fields for the pastor to recognize who they're vouching for.
-- ============================================================
create or replace function get_pastor_vetting_candidate(p_token uuid)
returns table (
  name text,
  "position" position_enum,
  church text,
  location text,
  submitter_name text,
  pastor_approved boolean,
  pastor_responded_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select c.name, c.position, c.church, c.location, c.submitter_name,
         c.pastor_approved, c.pastor_responded_at
  from candidates c
  where c.pastor_approval_token = p_token;
$$;

grant execute on function get_pastor_vetting_candidate to anon, authenticated;

-- ============================================================
-- respond_pastor_vetting -- public, token-based, one-shot.
-- ============================================================
create or replace function respond_pastor_vetting(p_token uuid, p_approved boolean)
returns candidates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidate candidates;
begin
  select * into v_candidate from candidates where pastor_approval_token = p_token;

  if v_candidate is null then
    raise exception 'invalid_token' using errcode = 'P0001';
  end if;

  if v_candidate.pastor_responded_at is not null then
    raise exception 'already_responded' using errcode = 'P0001';
  end if;

  update candidates
  set pastor_approved = p_approved,
      pastor_responded_at = now()
  where id = v_candidate.id
  returning * into v_candidate;

  return v_candidate;
end;
$$;

grant execute on function respond_pastor_vetting to anon, authenticated;

-- ============================================================
-- get_candidate_status -- public, token-based (the same confirm_token the
-- nominee already has) personal status page for a candidate: where they
-- stand on confirmation, seconding, and pastor vetting, plus how many
-- public notes of support they've received.
-- ============================================================
create or replace function get_candidate_status(p_token uuid)
returns table (
  name text,
  "position" position_enum,
  church text,
  location text,
  confirmed_at timestamptz,
  accepted boolean,
  ready boolean,
  ignored boolean,
  pastor_requested_at timestamptz,
  pastor_approved boolean,
  pastor_responded_at timestamptz,
  positive_comment_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.name, c.position, c.church, c.location, c.confirmed_at,
    c.accepted, c.ready, c.ignored,
    c.pastor_requested_at, c.pastor_approved, c.pastor_responded_at,
    (select count(*) from comments cm where cm.candidate_id = c.id and cm.type = 'positive')
  from candidates c
  where c.confirm_token = p_token;
$$;

grant execute on function get_candidate_status to anon, authenticated;
