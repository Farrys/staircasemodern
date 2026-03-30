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

alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.order_params enable row level security;
alter table public.order_status_history enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.gallery enable row level security;
alter table public.services enable row level security;

drop policy if exists "users_self_or_admin_read" on public.users;
create policy "users_self_or_admin_read"
on public.users
for select
using (
  auth.uid() = id
  or public.is_admin_user()
);

drop policy if exists "users_self_or_admin_update" on public.users;
create policy "users_self_or_admin_update"
on public.users
for update
using (
  auth.uid() = id
  or public.is_admin_user()
)
with check (
  auth.uid() = id
  or public.is_admin_user()
);

drop policy if exists "users_admin_insert" on public.users;
create policy "users_admin_insert"
on public.users
for insert
with check (public.is_admin_user());

drop policy if exists "orders_owner_or_admin_read" on public.orders;
create policy "orders_owner_or_admin_read"
on public.orders
for select
using (
  user_id = auth.uid()
  or public.is_admin_user()
);

drop policy if exists "orders_owner_or_admin_insert" on public.orders;
create policy "orders_owner_or_admin_insert"
on public.orders
for insert
with check (
  user_id = auth.uid()
  or public.is_admin_user()
);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
on public.orders
for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "order_params_owner_or_admin_read" on public.order_params;
create policy "order_params_owner_or_admin_read"
on public.order_params
for select
using (
  public.is_admin_user()
  or exists (
    select 1
    from public.orders o
    where o.id = order_params.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "order_params_owner_or_admin_insert" on public.order_params;
create policy "order_params_owner_or_admin_insert"
on public.order_params
for insert
with check (
  public.is_admin_user()
  or exists (
    select 1
    from public.orders o
    where o.id = order_params.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "order_params_admin_update" on public.order_params;
create policy "order_params_admin_update"
on public.order_params
for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "order_status_history_owner_or_admin_read" on public.order_status_history;
create policy "order_status_history_owner_or_admin_read"
on public.order_status_history
for select
using (
  public.is_admin_user()
  or exists (
    select 1
    from public.orders o
    where o.id = order_status_history.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "order_status_history_admin_insert" on public.order_status_history;
create policy "order_status_history_admin_insert"
on public.order_status_history
for insert
with check (public.is_admin_user());

drop policy if exists "reviews_public_or_owner_or_admin_read" on public.reviews;
create policy "reviews_public_or_owner_or_admin_read"
on public.reviews
for select
using (
  status = 'approved'
  or user_id = auth.uid()
  or public.is_admin_user()
);

drop policy if exists "reviews_owner_insert" on public.reviews;
create policy "reviews_owner_insert"
on public.reviews
for insert
with check (
  user_id = auth.uid()
  or public.is_admin_user()
);

drop policy if exists "reviews_admin_update" on public.reviews;
create policy "reviews_admin_update"
on public.reviews
for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert"
on public.messages
for insert
with check (true);

drop policy if exists "messages_admin_read" on public.messages;
create policy "messages_admin_read"
on public.messages
for select
using (public.is_admin_user());

drop policy if exists "messages_admin_update" on public.messages;
create policy "messages_admin_update"
on public.messages
for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "gallery_public_read" on public.gallery;
create policy "gallery_public_read"
on public.gallery
for select
using (true);

drop policy if exists "gallery_admin_insert" on public.gallery;
create policy "gallery_admin_insert"
on public.gallery
for insert
with check (public.is_admin_user());

drop policy if exists "gallery_admin_update" on public.gallery;
create policy "gallery_admin_update"
on public.gallery
for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "gallery_admin_delete" on public.gallery;
create policy "gallery_admin_delete"
on public.gallery
for delete
using (public.is_admin_user());

drop policy if exists "services_public_read" on public.services;
create policy "services_public_read"
on public.services
for select
using (
  is_active = true
  or public.is_admin_user()
);

drop policy if exists "services_admin_insert" on public.services;
create policy "services_admin_insert"
on public.services
for insert
with check (public.is_admin_user());

drop policy if exists "services_admin_update" on public.services;
create policy "services_admin_update"
on public.services
for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "services_admin_delete" on public.services;
create policy "services_admin_delete"
on public.services
for delete
using (public.is_admin_user());

commit;
