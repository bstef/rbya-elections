create table admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id),
  name text not null,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- security definer + fixed search_path so this can be safely used inside
-- RLS policies on other tables without recursive-policy surprises.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where auth_user_id = auth.uid());
$$;
