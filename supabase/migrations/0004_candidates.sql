create table candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  position position_enum not null,
  name text not null,
  church text not null,
  location text not null,
  email citext not null,
  background text not null check (char_length(background) between 10 and 5000),
  reasons text not null check (char_length(reasons) between 10 and 5000),
  submitter_name text not null,
  submitter_email citext not null,
  image_url text,
  pastor_contact citext,
  confirm_token uuid not null default gen_random_uuid() unique,
  confirmed_at timestamptz,
  accepted boolean,
  ready boolean not null default false,
  ignored boolean not null default false,
  created_at timestamptz not null default now()
);

alter table candidates enable row level security;

create index candidates_election_position_idx on candidates (election_id, position);

-- Derived state, mirrors the old app's Candidate.State computed property.
-- "ready" (seconded) is a display/social-proof label only, never a gate for
-- ballot inclusion -- eligibility is election_id + accepted + not ignored.
create or replace function candidate_state(c candidates)
returns text
language sql
stable
as $$
  select case
    when c.ignored then 'removed'
    when c.confirmed_at is not null and c.accepted = false then 'declined'
    when c.accepted = true and c.ready then 'seconded'
    when c.accepted = true and not c.ready then 'accepted'
    else 'nominated'
  end;
$$;
