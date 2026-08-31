-- Candidate headshot uploads. Storage path is keyed by confirm_token (never
-- publicly displayed -- only known to the nominator right after submitting
-- and to the nominee via their confirmation link/email), not by the public
-- candidate id, so browsing the public site doesn't hand out a write path
-- into any candidate's photo folder.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'candidate-photos',
  'candidate-photos',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "candidate_photos_public_read" on storage.objects
  for select
  using (bucket_id = 'candidate-photos');

create policy "candidate_photos_token_scoped_insert" on storage.objects
  for insert
  with check (
    bucket_id = 'candidate-photos'
    and (storage.foldername(name))[1] in (select confirm_token::text from candidates)
  );

-- ============================================================
-- set_candidate_photo -- public, token-based (the nominator's or
-- candidate's confirm_token). Just repoints candidates.image_url; the
-- actual file is uploaded directly to storage by the client beforehand
-- (governed by the storage policy above), not through this function.
-- ============================================================
create or replace function set_candidate_photo(p_token uuid, p_image_url text)
returns candidates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidate candidates;
begin
  select * into v_candidate from candidates where confirm_token = p_token;

  if v_candidate is null then
    raise exception 'invalid_token' using errcode = 'P0001';
  end if;

  update candidates
  set image_url = p_image_url
  where id = v_candidate.id
  returning * into v_candidate;

  return v_candidate;
end;
$$;

grant execute on function set_candidate_photo to anon, authenticated;
