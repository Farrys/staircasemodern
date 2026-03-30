begin;

create extension if not exists pgcrypto;

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  client_token text not null default encode(gen_random_bytes(24), 'hex'),
  name text,
  email text,
  phone text,
  status text not null default 'new',
  last_message text,
  last_sender text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_sessions_status_check check (status in ('new', 'active', 'closed'))
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  sender text not null,
  text text not null,
  created_at timestamptz not null default now(),
  constraint chat_messages_sender_check check (sender in ('client', 'manager', 'system'))
);

alter table public.chat_sessions
  add column if not exists client_token text;

update public.chat_sessions
set client_token = encode(gen_random_bytes(24), 'hex')
where client_token is null or btrim(client_token) = '';

alter table public.chat_sessions
  alter column client_token set default encode(gen_random_bytes(24), 'hex'),
  alter column client_token set not null;

create index if not exists chat_sessions_last_message_at_idx on public.chat_sessions (last_message_at desc);
create index if not exists chat_messages_session_id_idx on public.chat_messages (session_id, created_at);
create unique index if not exists chat_sessions_client_token_idx on public.chat_sessions (client_token);

create or replace function public.set_chat_sessions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_chat_token()
returns text
language sql
stable
as $$
  select nullif(current_setting('request.headers', true)::json ->> 'x-chat-token', '');
$$;

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

create or replace function public.guard_chat_sessions_mutation()
returns trigger
language plpgsql
as $$
declare
  current_token text;
begin
  if public.is_admin_user() then
    return new;
  end if;

  current_token := public.current_chat_token();

  if auth.uid() is null and current_token is null then
    return new;
  end if;

  if current_token is null then
    raise exception 'chat token required';
  end if;

  if tg_op = 'INSERT' then
    new.client_token := current_token;
    if new.status not in ('new', 'active') then
      new.status := 'new';
    end if;
    if new.last_sender is not null and new.last_sender not in ('client', 'system') then
      raise exception 'client cannot create manager messages';
    end if;
    return new;
  end if;

  if old.client_token is distinct from current_token then
    raise exception 'forbidden chat session update';
  end if;

  new.client_token := old.client_token;

  if new.status = 'closed' then
    raise exception 'client cannot close chat session';
  end if;

  if new.last_sender is not null and new.last_sender not in ('client', 'system') then
    raise exception 'client cannot impersonate manager';
  end if;

  return new;
end;
$$;

create or replace function public.guard_chat_messages_mutation()
returns trigger
language plpgsql
as $$
declare
  current_token text;
begin
  if public.is_admin_user() then
    return new;
  end if;

  current_token := public.current_chat_token();

  if auth.uid() is null and current_token is null then
    return new;
  end if;

  if current_token is null then
    raise exception 'chat token required';
  end if;

  if new.sender not in ('client', 'system') then
    raise exception 'client cannot insert manager messages';
  end if;

  if not exists (
    select 1
    from public.chat_sessions s
    where s.id = new.session_id
      and s.client_token = current_token
  ) then
    raise exception 'forbidden chat message insert';
  end if;

  return new;
end;
$$;

drop trigger if exists set_chat_sessions_updated_at on public.chat_sessions;
create trigger set_chat_sessions_updated_at
before update on public.chat_sessions
for each row
execute function public.set_chat_sessions_updated_at();

drop trigger if exists guard_chat_sessions_mutation on public.chat_sessions;
create trigger guard_chat_sessions_mutation
before insert or update on public.chat_sessions
for each row
execute function public.guard_chat_sessions_mutation();

drop trigger if exists guard_chat_messages_mutation on public.chat_messages;
create trigger guard_chat_messages_mutation
before insert on public.chat_messages
for each row
execute function public.guard_chat_messages_mutation();

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat_sessions_public_read" on public.chat_sessions;
drop policy if exists "chat_sessions_admin_or_client_read" on public.chat_sessions;
create policy "chat_sessions_admin_or_client_read"
on public.chat_sessions
for select
using (
  public.is_admin_user()
  or client_token = public.current_chat_token()
);

drop policy if exists "chat_sessions_public_insert" on public.chat_sessions;
drop policy if exists "chat_sessions_admin_or_client_insert" on public.chat_sessions;
create policy "chat_sessions_admin_or_client_insert"
on public.chat_sessions
for insert
with check (
  public.is_admin_user()
  or client_token = public.current_chat_token()
);

drop policy if exists "chat_sessions_public_update" on public.chat_sessions;
drop policy if exists "chat_sessions_admin_or_client_update" on public.chat_sessions;
create policy "chat_sessions_admin_or_client_update"
on public.chat_sessions
for update
using (
  public.is_admin_user()
  or client_token = public.current_chat_token()
)
with check (
  public.is_admin_user()
  or client_token = public.current_chat_token()
);

drop policy if exists "chat_messages_public_read" on public.chat_messages;
drop policy if exists "chat_messages_admin_or_client_read" on public.chat_messages;
create policy "chat_messages_admin_or_client_read"
on public.chat_messages
for select
using (
  public.is_admin_user()
  or exists (
    select 1
    from public.chat_sessions s
    where s.id = chat_messages.session_id
      and s.client_token = public.current_chat_token()
  )
);

drop policy if exists "chat_messages_public_insert" on public.chat_messages;
drop policy if exists "chat_messages_admin_or_client_insert" on public.chat_messages;
create policy "chat_messages_admin_or_client_insert"
on public.chat_messages
for insert
with check (
  public.is_admin_user()
  or (
    sender in ('client', 'system')
    and exists (
      select 1
      from public.chat_sessions s
      where s.id = chat_messages.session_id
        and s.client_token = public.current_chat_token()
    )
  )
);

drop policy if exists "chat_messages_public_update" on public.chat_messages;
drop policy if exists "chat_messages_admin_update" on public.chat_messages;
create policy "chat_messages_admin_update"
on public.chat_messages
for update
using (public.is_admin_user())
with check (public.is_admin_user());

commit;
