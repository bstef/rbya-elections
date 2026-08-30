-- Admin-only RPCs for operations that need to be atomic across more than
-- one row, where relying on two sequential client-side UPDATEs would risk
-- leaving the database in a broken intermediate state (e.g. no election
-- marked current at all, which every page on the site depends on).

create or replace function set_current_election(p_election_id uuid)
returns elections
language plpgsql
security definer
set search_path = public
as $$
declare
  v_election elections;
begin
  if not is_admin() then
    raise exception 'not_authorized' using errcode = 'P0001';
  end if;

  update elections set is_current = false where is_current = true and id <> p_election_id;
  update elections set is_current = true where id = p_election_id
  returning * into v_election;

  if v_election is null then
    raise exception 'election_not_found' using errcode = 'P0001';
  end if;

  return v_election;
end;
$$;

grant execute on function set_current_election to authenticated;
