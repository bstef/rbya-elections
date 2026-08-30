-- Cheap, no-downside fixes from the performance advisor:
-- 1. auth.uid() in a RLS policy is re-evaluated per row unless wrapped in
--    a scalar subquery, which Postgres can then evaluate once per query.
-- 2. Three foreign keys had no covering index.
--
-- Left alone: the "multiple permissive policies" warnings (each table's
-- _admin_all + _public_read policy pair) and "unused index" infos (the
-- indexes simply have no data yet). Merging the admin/public policies would
-- make the RLS harder to audit for a negligible gain at this app's actual
-- scale (one election a year, low hundreds of rows).

drop policy "delegates_self_read" on delegates;
create policy "delegates_self_read" on delegates
  for select
  using (auth_user_id = (select auth.uid()));

drop policy "ballots_self_read" on ballots;
create policy "ballots_self_read" on ballots
  for select
  using (
    delegate_id in (select id from delegates where auth_user_id = (select auth.uid()))
  );

drop policy "ballot_selections_self_read" on ballot_selections;
create policy "ballot_selections_self_read" on ballot_selections
  for select
  using (
    ballot_id in (
      select b.id from ballots b
      join delegates d on d.id = b.delegate_id
      where d.auth_user_id = (select auth.uid())
    )
  );

drop policy "admins_self_read" on admins;
create policy "admins_self_read" on admins
  for select
  using (auth_user_id = (select auth.uid()));

create index ballots_delegate_idx on ballots (delegate_id);
create index church_youth_counts_church_idx on church_youth_counts (church_id);
create index delegates_church_idx on delegates (church_id);
