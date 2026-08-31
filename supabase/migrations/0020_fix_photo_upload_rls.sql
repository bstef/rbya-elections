-- The storage insert policy's subquery against `candidates` was silently
-- filtered by that table's own RLS (candidates_public_read only exposes
-- accepted && !ignored rows to anon), so uploading a photo for a
-- not-yet-confirmed nominee -- the exact moment the nominator is asked to
-- add one -- always failed with a bare 400. A SECURITY DEFINER function
-- reads the table directly, the same pattern as is_admin().

create or replace function is_valid_confirm_token(p_token text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from candidates where confirm_token::text = p_token);
$$;

drop policy "candidate_photos_token_scoped_insert" on storage.objects;

create policy "candidate_photos_token_scoped_insert" on storage.objects
  for insert
  with check (
    bucket_id = 'candidate-photos'
    and is_valid_confirm_token((storage.foldername(name))[1])
  );
