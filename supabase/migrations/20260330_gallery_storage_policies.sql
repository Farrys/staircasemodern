begin;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table storage.objects enable row level security;

drop policy if exists "gallery_public_read" on storage.objects;
create policy "gallery_public_read"
on storage.objects
for select
using (bucket_id = 'gallery');

drop policy if exists "gallery_admin_insert" on storage.objects;
create policy "gallery_admin_insert"
on storage.objects
for insert
with check (
  bucket_id = 'gallery'
  and public.is_admin_user()
);

drop policy if exists "gallery_admin_update" on storage.objects;
create policy "gallery_admin_update"
on storage.objects
for update
using (
  bucket_id = 'gallery'
  and public.is_admin_user()
)
with check (
  bucket_id = 'gallery'
  and public.is_admin_user()
);

drop policy if exists "gallery_admin_delete" on storage.objects;
create policy "gallery_admin_delete"
on storage.objects
for delete
using (
  bucket_id = 'gallery'
  and public.is_admin_user()
);

commit;
