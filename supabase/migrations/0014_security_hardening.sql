-- Addresses two real findings from the Supabase security advisor after
-- applying the initial schema (run get_advisors to see the full report):
--
-- 1. `handle_new_delegate_user` and `handle_positive_comment` are trigger
--    functions only, never meant to be called directly -- but Postgres
--    grants EXECUTE to PUBLIC by default on function creation, so
--    PostgREST was exposing them at /rest/v1/rpc/*. Revoking public
--    execute doesn't affect the triggers themselves (trigger firing isn't
--    gated by the invoking role's EXECUTE privilege).
-- 2. A handful of functions were missing `set search_path`, which the
--    advisor flags as a search_path-injection hardening measure even for
--    non-SECURITY-DEFINER functions.
--
-- The many "anon/authenticated can execute this SECURITY DEFINER function"
-- warnings for submit_nomination, confirm_candidate, submit_comment,
-- register_delegates, is_verified_delegate, submit_ballot,
-- compute_position_results, and set_current_election are expected and
-- intentional -- that's the entire point of those RPCs (see 0010/0013).

revoke execute on function handle_new_delegate_user() from public, anon, authenticated;
revoke execute on function handle_positive_comment() from public, anon, authenticated;

create or replace function candidate_state(c candidates)
returns text
language sql
stable
set search_path = public
as $$
  select case
    when c.ignored then 'removed'
    when c.confirmed_at is not null and c.accepted = false then 'declined'
    when c.accepted = true and c.ready then 'seconded'
    when c.accepted = true and not c.ready then 'accepted'
    else 'nominated'
  end;
$$;

create or replace function current_election()
returns elections
language sql
stable
set search_path = public
as $$
  select * from elections where is_current limit 1;
$$;

create or replace function current_election_id()
returns uuid
language sql
stable
set search_path = public
as $$
  select id from elections where is_current limit 1;
$$;

create or replace function enforce_ballot_seat_limit()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_election_id uuid;
  v_position position_enum;
  v_seats int;
  v_count int;
begin
  select b.election_id, b.position into v_election_id, v_position
  from ballots b where b.id = new.ballot_id;

  select seats into v_seats
  from election_positions
  where election_id = v_election_id and position = v_position;

  select count(*) into v_count
  from ballot_selections
  where ballot_id = new.ballot_id;

  if v_count >= coalesce(v_seats, 1) then
    raise exception 'too_many_selections' using errcode = 'P0001';
  end if;

  return new;
end;
$$;
