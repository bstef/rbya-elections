create table delegates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  church_id uuid not null references churches(id),
  name text not null,
  email citext not null,
  delegate_type delegate_type not null default 'present',
  -- true once the committee confirms the church's self-submitted
  -- registration. Only verified delegates can log in and vote.
  verified boolean not null default false,
  auth_user_id uuid references auth.users(id),
  registered_by_name text,
  registered_by_email citext,
  created_at timestamptz not null default now(),
  unique (election_id, email)
);

alter table delegates enable row level security;

create index delegates_election_idx on delegates (election_id);
create index delegates_auth_user_idx on delegates (auth_user_id);

-- Binds a Supabase auth identity (created on magic-link sign-in) to the
-- pre-existing delegate row with the matching email, so "who is voting" is
-- resolved from a real auth.uid() rather than a code stashed in session.
create or replace function handle_new_delegate_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update delegates
  set auth_user_id = new.id
  where lower(email) = lower(new.email) and auth_user_id is null;
  return new;
end;
$$;

create trigger on_auth_user_created_bind_delegate
after insert on auth.users
for each row
execute function handle_new_delegate_user();
