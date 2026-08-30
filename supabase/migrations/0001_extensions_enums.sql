-- Extensions and shared enum types used across the schema.

create extension if not exists citext;
create extension if not exists pgcrypto;

create type position_enum as enum (
  'president',
  'vice_president_east',
  'vice_president_west',
  'treasurer',
  'controller',
  'committee'
);
-- Extensible later via `alter type position_enum add value '...'` if the
-- org's department structure changes.

create type comment_type as enum ('positive', 'negative');

create type delegate_type as enum ('present', 'absentee');

create type election_status as enum (
  'draft',
  'nominations_open',
  'nominations_closed',
  'voting_open',
  'voting_closed',
  'completed'
);
