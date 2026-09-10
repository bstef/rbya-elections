-- Church names aren't globally unique in practice -- many congregations
-- share a generic name ("First Romanian Baptist Church", "Romanian Baptist
-- Church") across different cities. Replace the name-only uniqueness with
-- (name, city_state), and add phone/website so the church directory can
-- carry the same contact fields as the RBA source list.

alter table churches drop constraint if exists churches_name_key;
alter table churches add constraint churches_name_city_state_key unique (name, city_state);

alter table churches
  add column if not exists phone text,
  add column if not exists website text;
