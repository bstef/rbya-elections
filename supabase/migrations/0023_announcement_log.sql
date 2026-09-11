-- Every time the homepage announcement is set or cleared, keep a record
-- of when and to what -- so "wait, when did we say that?" has a real
-- answer instead of relying on memory. A null message means it was
-- cleared at that timestamp.
create table announcement_log (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id),
  message text,
  created_at timestamptz not null default now()
);

alter table announcement_log enable row level security;

create policy "announcement_log_admin_all" on announcement_log
  for all
  using (is_admin())
  with check (is_admin());
