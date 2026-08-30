-- Row Level Security policies. RLS is "deny by default": a table with RLS
-- enabled and no matching policy denies the operation entirely, regardless
-- of any broader table-level GRANT. That is what makes it safe that we
-- never grant anon/authenticated direct INSERT on candidates, comments,
-- delegates, ballots, or ballot_selections -- their only write path is the
-- SECURITY DEFINER RPCs in 0010, which run as the function owner and so
-- bypass RLS by design (the standard Supabase pattern for this).

-- ---------------- churches ----------------
create policy "churches_public_read" on churches
  for select
  using (true);

create policy "churches_admin_all" on churches
  for all
  using (is_admin())
  with check (is_admin());

-- ---------------- elections ----------------
create policy "elections_public_read" on elections
  for select
  using (true);

create policy "elections_admin_all" on elections
  for all
  using (is_admin())
  with check (is_admin());

-- ---------------- election_positions ----------------
create policy "election_positions_public_read" on election_positions
  for select
  using (true);

create policy "election_positions_admin_all" on election_positions
  for all
  using (is_admin())
  with check (is_admin());

-- ---------------- candidates ----------------
-- Public/voter read is limited to accepted, non-ignored nominees -- the
-- old app's actual (correct) filter. All writes happen via the
-- submit_nomination / confirm_candidate RPCs; admins additionally get a
-- direct UPDATE path for moderation (e.g. toggling `ignored`).
create policy "candidates_public_read" on candidates
  for select
  using (not ignored and accepted = true);

create policy "candidates_admin_all" on candidates
  for all
  using (is_admin())
  with check (is_admin());

-- ---------------- comments ----------------
-- Objections (type = 'negative') are never visible to anon/authenticated --
-- only admins can see them, to prep what's read aloud live at Convention.
create policy "comments_public_read_positive" on comments
  for select
  using (type = 'positive');

create policy "comments_admin_all" on comments
  for all
  using (is_admin())
  with check (is_admin());

-- ---------------- church_youth_counts ----------------
create policy "church_youth_counts_admin_all" on church_youth_counts
  for all
  using (is_admin())
  with check (is_admin());

-- ---------------- delegates ----------------
-- A delegate may see only their own row (bound via auth_user_id after
-- magic-link sign-in); registration and vote-eligibility checks happen via
-- the RPCs, not direct table access.
create policy "delegates_self_read" on delegates
  for select
  using (auth_user_id = auth.uid());

create policy "delegates_admin_all" on delegates
  for all
  using (is_admin())
  with check (is_admin());

-- ---------------- ballots / ballot_selections ----------------
-- No insert policy exists for anon/authenticated on either table -- the
-- only write path is the submit_ballot RPC. Delegates may review their own
-- past submissions; admins get read-only audit access (no direct mutate).
create policy "ballots_self_read" on ballots
  for select
  using (
    delegate_id in (select id from delegates where auth_user_id = auth.uid())
  );

create policy "ballots_admin_read" on ballots
  for select
  using (is_admin());

create policy "ballot_selections_self_read" on ballot_selections
  for select
  using (
    ballot_id in (
      select b.id from ballots b
      join delegates d on d.id = b.delegate_id
      where d.auth_user_id = auth.uid()
    )
  );

create policy "ballot_selections_admin_read" on ballot_selections
  for select
  using (is_admin());

-- ---------------- admins ----------------
-- An admin can see their own admins row; nobody else can see any row here
-- (there is deliberately no admin_all/manage policy -- admin provisioning
-- happens out-of-band via the Supabase dashboard, per the plan).
create policy "admins_self_read" on admins
  for select
  using (auth_user_id = auth.uid());
