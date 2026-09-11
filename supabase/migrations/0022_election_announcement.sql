-- A committee-editable message shown on the homepage announcement bar
-- alongside the automatic nomination/voting/results notices -- for
-- anything that doesn't fit those (a postponement, a venue change, a
-- reminder) without needing a code change to say it.
alter table elections add column if not exists custom_announcement text;
