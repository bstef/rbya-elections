-- The ballot-integrity fix: a real per-position ballot instead of the old
-- app's one-row-per-candidate approve/disapprove checkbox, which let a
-- voter approve multiple candidates for a single-seat position.

create table ballots (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  delegate_id uuid not null references delegates(id) on delete cascade,
  position position_enum not null,
  submitted_at timestamptz not null default now(),
  -- One submission per position per delegate, enforced by the database --
  -- not a racy "did they already vote" pre-check in application code.
  unique (election_id, delegate_id, position)
);

alter table ballots enable row level security;

create table ballot_selections (
  id uuid primary key default gen_random_uuid(),
  ballot_id uuid not null references ballots(id) on delete cascade,
  candidate_id uuid not null references candidates(id),
  unique (ballot_id, candidate_id)
);

alter table ballot_selections enable row level security;

create index ballot_selections_ballot_idx on ballot_selections (ballot_id);
create index ballot_selections_candidate_idx on ballot_selections (candidate_id);

-- Defense in depth: even though the only write path is the submit_ballot
-- RPC (which already validates seat counts before inserting), this trigger
-- makes "never more than `seats` picks" a property of the table itself.
create or replace function enforce_ballot_seat_limit()
returns trigger
language plpgsql
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

create trigger ballot_selections_before_insert
before insert on ballot_selections
for each row
execute function enforce_ballot_seat_limit();
