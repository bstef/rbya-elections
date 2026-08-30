create table elections (
  id uuid primary key default gen_random_uuid(),
  year int not null unique,
  election_day date not null,
  nomination_opens_at timestamptz not null,
  nomination_cutoff_at timestamptz not null,
  confirmation_cutoff_at timestamptz not null,
  absentee_ballot_deadline timestamptz not null,
  voting_opens_at timestamptz not null,
  voting_closes_at timestamptz not null,
  status election_status not null default 'draft',
  is_current boolean not null default false,
  results_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Only one election can be "current" at a time. This single invariant
-- replaces the old app's implicit "guess the year, fall back to most
-- recent" lookup logic with one unambiguous, admin-controlled flag.
create unique index one_current_election on elections (is_current) where is_current;

alter table elections enable row level security;

create table election_positions (
  election_id uuid not null references elections(id) on delete cascade,
  position position_enum not null,
  -- Number of candidates a delegate may pick for this position on one
  -- ballot, and the number of seats that position can fill. Admin-editable
  -- per election year (e.g. committee seat count can vary year to year).
  seats int not null default 1 check (seats > 0),
  primary key (election_id, position)
);

alter table election_positions enable row level security;

create or replace function current_election()
returns elections
language sql
stable
as $$
  select * from elections where is_current limit 1;
$$;

create or replace function current_election_id()
returns uuid
language sql
stable
as $$
  select id from elections where is_current limit 1;
$$;
