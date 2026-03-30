begin;

with seed_sessions(seed_key, name, email, phone, status, last_message, last_sender, last_message_at) as (
  values
    (
      'demo-chat-01',
      'Арман К.',
      'arman.demo@stairs-pro.kz',
      '+7 (701) 210-45-10',
      'active',
      'Хотим обсудить стеклянное ограждение и сроки монтажа.',
      'client',
      now() - interval '35 minutes'
    ),
    (
      'demo-chat-02',
      'Салтанат Д.',
      'saltanat.demo@stairs-pro.kz',
      '+7 (705) 777-90-22',
      'new',
      'Ищем спокойную дубовую лестницу и хотим понять разницу по бюджету.',
      'client',
      now() - interval '18 minutes'
    ),
    (
      'demo-chat-03',
      'Тимур Е.',
      'timur.demo@stairs-pro.kz',
      '+7 (707) 333-18-44',
      'closed',
      'Спасибо, смету получили. Вернёмся после согласования с дизайнером.',
      'manager',
      now() - interval '2 hours'
    )
),
inserted_sessions as (
  insert into public.chat_sessions (name, email, phone, status, last_message, last_sender, last_message_at)
  select
    seed_sessions.name,
    seed_sessions.email,
    seed_sessions.phone,
    seed_sessions.status,
    seed_sessions.last_message,
    seed_sessions.last_sender,
    seed_sessions.last_message_at
  from seed_sessions
  where not exists (
    select 1
    from public.chat_sessions s
    where s.email = seed_sessions.email
      and s.phone = seed_sessions.phone
  )
  returning id, email, phone
),
updated_sessions as (
  update public.chat_sessions s
  set
    name = seed_sessions.name,
    status = seed_sessions.status,
    last_message = seed_sessions.last_message,
    last_sender = seed_sessions.last_sender,
    last_message_at = seed_sessions.last_message_at
  from seed_sessions
  where s.email = seed_sessions.email
    and s.phone = seed_sessions.phone
  returning s.id, s.email, s.phone
),
seed_messages(email, phone, sender, text, created_at) as (
  values
    ('arman.demo@stairs-pro.kz', '+7 (701) 210-45-10', 'client', 'Здравствуйте. Нужна лестница на монокосоуре для двухсветной гостиной.', now() - interval '42 minutes'),
    ('arman.demo@stairs-pro.kz', '+7 (701) 210-45-10', 'manager', 'Добрый день. Подскажите высоту подъёма и желаемый материал ступеней.', now() - interval '39 minutes'),
    ('arman.demo@stairs-pro.kz', '+7 (701) 210-45-10', 'client', 'Материал ступеней хотим дуб, ограждение скорее стеклянное.', now() - interval '35 minutes'),

    ('saltanat.demo@stairs-pro.kz', '+7 (705) 777-90-22', 'client', 'Ищем спокойную дубовую лестницу для загородного дома.', now() - interval '18 minutes'),
    ('saltanat.demo@stairs-pro.kz', '+7 (705) 777-90-22', 'system', 'Контакты сохранены. Менеджер видит диалог и вернётся с ответом в ближайшее время.', now() - interval '17 minutes'),

    ('timur.demo@stairs-pro.kz', '+7 (707) 333-18-44', 'client', 'Нужна предварительная смета по консольной лестнице.', now() - interval '2 hours 25 minutes'),
    ('timur.demo@stairs-pro.kz', '+7 (707) 333-18-44', 'manager', 'Подготовим ориентир по бюджету и запросим размеры проёма.', now() - interval '2 hours 10 minutes'),
    ('timur.demo@stairs-pro.kz', '+7 (707) 333-18-44', 'manager', 'Спасибо, смету получили. Вернёмся после согласования с дизайнером.', now() - interval '2 hours')
)
insert into public.chat_messages (session_id, sender, text, created_at)
select
  s.id,
  seed_messages.sender,
  seed_messages.text,
  seed_messages.created_at
from seed_messages
join public.chat_sessions s
  on s.email = seed_messages.email
 and s.phone = seed_messages.phone
where not exists (
  select 1
  from public.chat_messages m
  where m.session_id = s.id
    and m.sender = seed_messages.sender
    and m.text = seed_messages.text
);

commit;
