-- Per-position tally: vote_share is votes / total ballots cast for that
-- position (the correct denominator now that a ballot is one row per
-- delegate per position, not one row per candidate). A candidate is
-- elected if they clear 50% AND rank within the position's seat count --
-- if fewer than `seats` candidates clear 50%, the remaining seats stay
-- vacant rather than being backfilled by non-majority candidates. This is
-- the applied interpretation of the constitution's ">50%" rule and is
-- surfaced on /admin/results so the committee can see it explicitly.
--
-- Gated so non-admins can only see results once the election is marked
-- results_published -- defense in depth on top of the app only calling
-- this after checking that flag itself.
create or replace function compute_position_results(p_election_id uuid, p_position position_enum)
returns table (
  candidate_id uuid,
  candidate_name text,
  vote_count bigint,
  total_ballots bigint,
  vote_share numeric,
  seats int,
  rank_by_votes bigint,
  elected boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_published boolean;
begin
  select results_published into v_published from elections where id = p_election_id;

  if not coalesce(v_published, false) and not is_admin() then
    raise exception 'results_not_published' using errcode = 'P0001';
  end if;

  return query
  with totals as (
    select count(*)::bigint as total_ballots
    from ballots
    where election_id = p_election_id and position = p_position
  ),
  seats_cte as (
    select coalesce(
      (select ep.seats from election_positions ep
       where ep.election_id = p_election_id and ep.position = p_position),
      1
    ) as seats
  ),
  tallies as (
    select
      c.id as candidate_id,
      c.name as candidate_name,
      count(bs.id)::bigint as vote_count
    from candidates c
    left join ballot_selections bs on bs.candidate_id = c.id
    left join ballots b
      on b.id = bs.ballot_id
      and b.election_id = p_election_id
      and b.position = p_position
    where c.election_id = p_election_id
      and c.position = p_position
      and c.accepted = true
      and not c.ignored
    group by c.id, c.name
  ),
  ranked as (
    select
      t.candidate_id,
      t.candidate_name,
      t.vote_count,
      tot.total_ballots,
      case when tot.total_ballots > 0
        then round(t.vote_count::numeric / tot.total_ballots, 4)
        else 0
      end as vote_share,
      rank() over (order by t.vote_count desc) as rank_by_votes
    from tallies t
    cross join totals tot
  )
  select
    r.candidate_id,
    r.candidate_name,
    r.vote_count,
    r.total_ballots,
    r.vote_share,
    s.seats,
    r.rank_by_votes,
    (r.vote_share > 0.5 and r.rank_by_votes <= s.seats) as elected
  from ranked r
  cross join seats_cte s
  order by r.vote_count desc;
end;
$$;

grant execute on function compute_position_results to anon, authenticated;
