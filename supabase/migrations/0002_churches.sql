create table churches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  city_state text,
  pastor_name text,
  youth_leader_name text,
  created_at timestamptz not null default now()
);

alter table churches enable row level security;
