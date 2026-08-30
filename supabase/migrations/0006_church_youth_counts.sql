-- Drives the delegate quota shown on the registration form:
-- ceil(youth_count / 10.0) delegates allowed per church per election.
-- Admin-maintained; a church with no row here is treated by the app as
-- "quota unknown, committee will confirm" rather than blocking registration.
create table church_youth_counts (
  election_id uuid not null references elections(id) on delete cascade,
  church_id uuid not null references churches(id) on delete cascade,
  youth_count int not null check (youth_count >= 0),
  primary key (election_id, church_id)
);

alter table church_youth_counts enable row level security;
