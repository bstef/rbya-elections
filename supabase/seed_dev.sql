-- Development seed data. Safe to re-run against a fresh dev project.
-- Admin rows are NOT seeded here because they require a real auth.users id
-- -- create the admin's login first (Supabase dashboard or
-- supabase.auth.admin.createUser), then run:
--   insert into admins (auth_user_id, name) values ('<uuid>', 'Committee Admin');

insert into elections (
  year, election_day,
  nomination_opens_at, nomination_cutoff_at, confirmation_cutoff_at,
  absentee_ballot_deadline, voting_opens_at, voting_closes_at,
  status, is_current, results_published
) values (
  extract(year from now())::int,
  (now() + interval '30 days')::date,
  now() - interval '10 days',
  now() + interval '28 days',
  now() + interval '28 days',
  now() + interval '27 days',
  now() + interval '29 days',
  now() + interval '31 days',
  'nominations_open',
  true,
  false
)
on conflict (year) do nothing;

insert into election_positions (election_id, position, seats)
select e.id, p.position, p.seats
from current_election() e
cross join (values
  ('president'::position_enum, 1),
  ('vice_president_east'::position_enum, 1),
  ('vice_president_west'::position_enum, 1),
  ('treasurer'::position_enum, 1),
  ('controller'::position_enum, 1),
  ('committee'::position_enum, 15)
) as p(position, seats)
on conflict (election_id, position) do nothing;

insert into churches (name, city_state, pastor_name, youth_leader_name)
values
  ('First Romanian Baptist Church', 'Chicago, IL', 'Pastor Ionescu', 'Maria Pop'),
  ('Bethel Romanian Baptist Church', 'Portland, OR', 'Pastor Cojan', 'Daniel Har')
on conflict (name) do nothing;

insert into church_youth_counts (election_id, church_id, youth_count)
select e.id, c.id, yc.youth_count
from current_election() e
join churches c on c.name in ('First Romanian Baptist Church', 'Bethel Romanian Baptist Church')
join (values
  ('First Romanian Baptist Church', 23),
  ('Bethel Romanian Baptist Church', 8)
) as yc(name, youth_count) on yc.name = c.name
on conflict (election_id, church_id) do nothing;

insert into candidates (
  election_id, position, name, church, location, email,
  background, reasons, submitter_name, submitter_email,
  confirmed_at, accepted, ready
)
select e.id, x.position, x.name, x.church, x.location, x.email,
  x.background, x.reasons, x.submitter_name, x.submitter_email,
  now(), true, x.ready
from current_election() e
cross join (values
  ('president'::position_enum, 'Mihai Har', 'First Romanian Baptist Church', 'Chicago, IL', 'mihai.har@example.com',
   'Long-time youth leader and RBYA committee alumnus with a decade of service.',
   'Proven leadership and a heart for the youth of our churches.',
   'Ana Pace', 'ana.pace@example.com', true),
  ('president'::position_enum, 'David Pace', 'Bethel Romanian Baptist Church', 'Portland, OR', 'david.pace@example.com',
   'Active in youth ministry for six years, currently a deacon-in-training.',
   'Wants to bring fresh energy and better communication to the committee.',
   'Elena Cojan', 'elena.cojan@example.com', false),
  ('committee'::position_enum, 'Elena Cojan', 'Bethel Romanian Baptist Church', 'Portland, OR', 'elena.cojan@example.com',
   'Worship team lead and youth Sunday-school teacher.',
   'Wants to help coordinate music and worship across RBYA events.',
   'David Pace', 'david.pace@example.com', true),
  ('committee'::position_enum, 'Ana Pace', 'First Romanian Baptist Church', 'Chicago, IL', 'ana.pace@example.com',
   'Social media coordinator for her home church youth group.',
   'Hopes to modernize RBYA outreach and communication.',
   'Mihai Har', 'mihai.har@example.com', false)
) as x(position, name, church, location, email, background, reasons, submitter_name, submitter_email, ready)
where not exists (
  select 1 from candidates c where c.email = x.email and c.election_id = e.id
);
