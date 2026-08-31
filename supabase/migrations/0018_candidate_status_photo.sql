-- Adds image_url to the candidate's personal status page lookup so
-- /status/[token] can show their current headshot (or lack of one)
-- alongside the upload control.

drop function get_candidate_status(uuid);

create function get_candidate_status(p_token uuid)
returns table (
  name text,
  "position" position_enum,
  church text,
  location text,
  image_url text,
  confirmed_at timestamptz,
  accepted boolean,
  ready boolean,
  ignored boolean,
  pastor_requested_at timestamptz,
  pastor_approved boolean,
  pastor_responded_at timestamptz,
  positive_comment_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.name, c.position, c.church, c.location, c.image_url, c.confirmed_at,
    c.accepted, c.ready, c.ignored,
    c.pastor_requested_at, c.pastor_approved, c.pastor_responded_at,
    (select count(*) from comments cm where cm.candidate_id = c.id and cm.type = 'positive')
  from candidates c
  where c.confirm_token = p_token;
$$;

grant execute on function get_candidate_status to anon, authenticated;
