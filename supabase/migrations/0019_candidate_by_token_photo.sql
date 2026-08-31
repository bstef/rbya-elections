-- Adds image_url to the pre-confirmation lookup so /confirm/[token] can
-- show an existing photo (if the nominator already uploaded one) before
-- the candidate decides whether to add/replace it.

drop function get_candidate_by_token(uuid);

create function get_candidate_by_token(p_token uuid)
returns table (
  name text,
  "position" position_enum,
  church text,
  location text,
  image_url text,
  submitter_name text,
  confirmed_at timestamptz,
  accepted boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select c.name, c.position, c.church, c.location, c.image_url, c.submitter_name, c.confirmed_at, c.accepted
  from candidates c
  where c.confirm_token = p_token;
$$;

grant execute on function get_candidate_by_token to anon, authenticated;
