create table comments (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  type comment_type not null default 'positive',
  content text not null check (char_length(content) between 10 and 5000),
  submitter_name text not null,
  submitter_email citext not null,
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

create index comments_candidate_idx on comments (candidate_id);

-- A positive/support comment on an already-accepted candidate marks them
-- "seconded". Objections (type = 'negative') never trigger this and are
-- never exposed by any public-facing RLS policy -- see 0011.
create or replace function handle_positive_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.type = 'positive' then
    update candidates
    set ready = true
    where id = new.candidate_id and accepted = true;
  end if;
  return new;
end;
$$;

create trigger comments_after_insert
after insert on comments
for each row
execute function handle_positive_comment();
