begin;

with base_user as (
  select
    id,
    coalesce(nullif(full_name, ''), 'Александр Н.') as full_name,
    coalesce(nullif(phone, ''), '+7 (701) 555-12-34') as phone,
    email
  from public.users
  order by created_at
  limit 1
),
seed_messages(name, email, phone, text, is_processed) as (
  values
    (
      'Арман К.',
      'arman.demo@stairs-pro.kz',
      '+7 (701) 210-45-10',
      'Нужна лестница на монокосоуре для двухсветной гостиной. Хотим обсудить стеклянное ограждение, тёплую подсветку и ориентир по срокам монтажа.',
      false
    ),
    (
      'Салтанат Д.',
      'saltanat.demo@stairs-pro.kz',
      '+7 (705) 777-90-22',
      'Ищем спокойную дубовую лестницу для загородного дома. Важно понять разницу по бюджету между классическим каркасом и комбинированным ограждением.',
      true
    ),
    (
      'Тимур Е.',
      'timur.demo@stairs-pro.kz',
      '+7 (707) 333-18-44',
      'Нужен выезд на замер и предварительная смета по консольной лестнице. Проём готов, интерьер современный, запуск проекта планируем в ближайший месяц.',
      false
    )
),
inserted_messages as (
  insert into public.messages (name, email, phone, text, is_processed)
  select
    seed_messages.name,
    seed_messages.email,
    seed_messages.phone,
    seed_messages.text,
    seed_messages.is_processed
  from seed_messages
  where not exists (
    select 1
    from public.messages m
    where m.email = seed_messages.email
      and m.text = seed_messages.text
  )
  returning id
),
seed_orders(seed_key, full_name, phone, address, notes, admin_comment, total_price, status, material, steps_count, lighting, smart_light, extended_warranty, base_price, from_status, status_comment) as (
  values
    (
      'demo-order-01',
      'Арман К.',
      '+7 (701) 210-45-10',
      'Алматы, мкр. Нурлытау, ул. Березовая, 18',
      E'Конфигурация калькулятора:\nМатериал: Металл\nМодель: На монокосоуре\nФорма: Г-образная\nОграждение: Стеклянное\nОтделка: Премиальная\nСтупеней: 15\nПодсветка: Да\nУмное освещение: Да\nРасширенная гарантия: Нет\nНужен замерщик: Да\nЭтажность: 2\nКомментарий клиента: Нужен лаконичный современный вид без перегруза.',
      'Подтверждён выезд на замер, ждём финальный размер проёма.',
      745000,
      'processing',
      'metal',
      15,
      true,
      true,
      false,
      320000,
      'new',
      'Связались с клиентом и согласовали первичный выезд.'
    ),
    (
      'demo-order-02',
      'Салтанат Д.',
      '+7 (705) 777-90-22',
      'Алматы, Бостандыкский район, ул. Сосновая, 41',
      E'Конфигурация калькулятора:\nМатериал: Дерево\nМодель: Классическая на тетивах\nФорма: П-образная\nОграждение: Комбинированное\nОтделка: Премиальная\nСтупеней: 17\nПодсветка: Нет\nУмное освещение: Нет\nРасширенная гарантия: Да\nНужен замерщик: Да\nЭтажность: 2\nКомментарий клиента: Нужна тёплая древесина и спокойный семейный сценарий.',
      'Подготовлена уточнённая смета, ожидаем подтверждение по оттенку дуба.',
      692000,
      'confirmed',
      'wood',
      17,
      false,
      false,
      true,
      240000,
      'processing',
      'Смета согласована, проект передан в подтверждение.'
    ),
    (
      'demo-order-03',
      'Тимур Е.',
      '+7 (707) 333-18-44',
      'Алматы, ул. Достык, 126',
      E'Конфигурация калькулятора:\nМатериал: Стекло\nМодель: Консольная / парящая\nФорма: Прямая\nОграждение: Стеклянное\nОтделка: Дизайнерская\nСтупеней: 13\nПодсветка: Да\nУмное освещение: Нет\nРасширенная гарантия: Да\nНужен замерщик: Нет\nЭтажность: 2\nКомментарий клиента: Важно сохранить ощущение воздуха и чистую архитектурную линию.',
      'Заказ в производстве, уточняем график поставки стекла.',
      1185000,
      'production',
      'glass',
      13,
      true,
      false,
      true,
      460000,
      'confirmed',
      'Материалы согласованы, заказ передан в производство.'
    )
),
inserted_orders as (
  insert into public.orders (user_id, full_name, phone, address, notes, admin_comment, total_price, status)
  select
    base_user.id,
    seed_orders.full_name,
    seed_orders.phone,
    seed_orders.address,
    seed_orders.notes,
    seed_orders.admin_comment,
    seed_orders.total_price,
    seed_orders.status
  from base_user
  cross join seed_orders
  where not exists (
    select 1
    from public.orders o
    where o.user_id = base_user.id
      and o.address = seed_orders.address
      and o.full_name = seed_orders.full_name
  )
  returning id, user_id, full_name, address
),
all_seed_orders as (
  select
    o.id as order_id,
    s.seed_key,
    s.material,
    s.steps_count,
    s.lighting,
    s.smart_light,
    s.extended_warranty,
    s.base_price,
    s.from_status,
    s.status,
    s.status_comment
  from base_user
  join seed_orders s on true
  join public.orders o
    on o.user_id = base_user.id
   and o.address = s.address
   and o.full_name = s.full_name
),
updated_orders as (
  update public.orders o
  set
    notes = s.notes,
    admin_comment = s.admin_comment,
    total_price = s.total_price,
    status = s.status,
    phone = s.phone
  from base_user, seed_orders s
  where o.user_id = base_user.id
    and o.address = s.address
    and o.full_name = s.full_name
  returning o.id
)
insert into public.order_params (order_id, material, steps_count, lighting, smart_light, extended_warranty, base_price)
select
  all_seed_orders.order_id,
  all_seed_orders.material,
  all_seed_orders.steps_count,
  all_seed_orders.lighting,
  all_seed_orders.smart_light,
  all_seed_orders.extended_warranty,
  all_seed_orders.base_price
from all_seed_orders
where not exists (
  select 1
  from public.order_params p
  where p.order_id = all_seed_orders.order_id
);

update public.order_params p
set
  material = all_seed_orders.material,
  steps_count = all_seed_orders.steps_count,
  lighting = all_seed_orders.lighting,
  smart_light = all_seed_orders.smart_light,
  extended_warranty = all_seed_orders.extended_warranty,
  base_price = all_seed_orders.base_price
from (
  with base_user as (
    select id
    from public.users
    order by created_at
    limit 1
  ),
  seed_orders(seed_key, full_name, phone, address, notes, admin_comment, total_price, status, material, steps_count, lighting, smart_light, extended_warranty, base_price, from_status, status_comment) as (
    values
      (
        'demo-order-01',
        'Арман К.',
        '+7 (701) 210-45-10',
        'Алматы, мкр. Нурлытау, ул. Березовая, 18',
        E'Конфигурация калькулятора:\nМатериал: Металл\nМодель: На монокосоуре\nФорма: Г-образная\nОграждение: Стеклянное\nОтделка: Премиальная\nСтупеней: 15\nПодсветка: Да\nУмное освещение: Да\nРасширенная гарантия: Нет\nНужен замерщик: Да\nЭтажность: 2\nКомментарий клиента: Нужен лаконичный современный вид без перегруза.',
        'Подтверждён выезд на замер, ждём финальный размер проёма.',
        745000,
        'processing',
        'metal',
        15,
        true,
        true,
        false,
        320000,
        'new',
        'Связались с клиентом и согласовали первичный выезд.'
      ),
      (
        'demo-order-02',
        'Салтанат Д.',
        '+7 (705) 777-90-22',
        'Алматы, Бостандыкский район, ул. Сосновая, 41',
        E'Конфигурация калькулятора:\nМатериал: Дерево\nМодель: Классическая на тетивах\nФорма: П-образная\nОграждение: Комбинированное\nОтделка: Премиальная\nСтупеней: 17\nПодсветка: Нет\nУмное освещение: Нет\nРасширенная гарантия: Да\nНужен замерщик: Да\nЭтажность: 2\nКомментарий клиента: Нужна тёплая древесина и спокойный семейный сценарий.',
        'Подготовлена уточнённая смета, ожидаем подтверждение по оттенку дуба.',
        692000,
        'confirmed',
        'wood',
        17,
        false,
        false,
        true,
        240000,
        'processing',
        'Смета согласована, проект передан в подтверждение.'
      ),
      (
        'demo-order-03',
        'Тимур Е.',
        '+7 (707) 333-18-44',
        'Алматы, ул. Достык, 126',
        E'Конфигурация калькулятора:\nМатериал: Стекло\nМодель: Консольная / парящая\nФорма: Прямая\nОграждение: Стеклянное\nОтделка: Дизайнерская\nСтупеней: 13\nПодсветка: Да\nУмное освещение: Нет\nРасширенная гарантия: Да\nНужен замерщик: Нет\nЭтажность: 2\nКомментарий клиента: Важно сохранить ощущение воздуха и чистую архитектурную линию.',
        'Заказ в производстве, уточняем график поставки стекла.',
        1185000,
        'production',
        'glass',
        13,
        true,
        false,
        true,
        460000,
        'confirmed',
        'Материалы согласованы, заказ передан в производство.'
      )
  )
  select
    o.id as order_id,
    s.material,
    s.steps_count,
    s.lighting,
    s.smart_light,
    s.extended_warranty,
    s.base_price
  from base_user
  join seed_orders s on true
  join public.orders o
    on o.user_id = base_user.id
   and o.address = s.address
   and o.full_name = s.full_name
) as all_seed_orders
where p.order_id = all_seed_orders.order_id;

insert into public.order_status_history (order_id, from_status, to_status, comment)
select
  all_seed_orders.order_id,
  all_seed_orders.from_status,
  all_seed_orders.status,
  all_seed_orders.status_comment
from (
  with base_user as (
    select id
    from public.users
    order by created_at
    limit 1
  ),
  seed_orders(seed_key, full_name, phone, address, notes, admin_comment, total_price, status, material, steps_count, lighting, smart_light, extended_warranty, base_price, from_status, status_comment) as (
    values
      (
        'demo-order-01',
        'Арман К.',
        '+7 (701) 210-45-10',
        'Алматы, мкр. Нурлытау, ул. Березовая, 18',
        E'Конфигурация калькулятора:\nМатериал: Металл\nМодель: На монокосоуре\nФорма: Г-образная\nОграждение: Стеклянное\nОтделка: Премиальная\nСтупеней: 15\nПодсветка: Да\nУмное освещение: Да\nРасширенная гарантия: Нет\nНужен замерщик: Да\nЭтажность: 2\nКомментарий клиента: Нужен лаконичный современный вид без перегруза.',
        'Подтверждён выезд на замер, ждём финальный размер проёма.',
        745000,
        'processing',
        'metal',
        15,
        true,
        true,
        false,
        320000,
        'new',
        'Связались с клиентом и согласовали первичный выезд.'
      ),
      (
        'demo-order-02',
        'Салтанат Д.',
        '+7 (705) 777-90-22',
        'Алматы, Бостандыкский район, ул. Сосновая, 41',
        E'Конфигурация калькулятора:\nМатериал: Дерево\nМодель: Классическая на тетивах\nФорма: П-образная\nОграждение: Комбинированное\nОтделка: Премиальная\nСтупеней: 17\nПодсветка: Нет\nУмное освещение: Нет\nРасширенная гарантия: Да\nНужен замерщик: Да\nЭтажность: 2\nКомментарий клиента: Нужна тёплая древесина и спокойный семейный сценарий.',
        'Подготовлена уточнённая смета, ожидаем подтверждение по оттенку дуба.',
        692000,
        'confirmed',
        'wood',
        17,
        false,
        false,
        true,
        240000,
        'processing',
        'Смета согласована, проект передан в подтверждение.'
      ),
      (
        'demo-order-03',
        'Тимур Е.',
        '+7 (707) 333-18-44',
        'Алматы, ул. Достык, 126',
        E'Конфигурация калькулятора:\nМатериал: Стекло\nМодель: Консольная / парящая\nФорма: Прямая\nОграждение: Стеклянное\nОтделка: Дизайнерская\nСтупеней: 13\nПодсветка: Да\nУмное освещение: Нет\nРасширенная гарантия: Да\nНужен замерщик: Нет\nЭтажность: 2\nКомментарий клиента: Важно сохранить ощущение воздуха и чистую архитектурную линию.',
        'Заказ в производстве, уточняем график поставки стекла.',
        1185000,
        'production',
        'glass',
        13,
        true,
        false,
        true,
        460000,
        'confirmed',
        'Материалы согласованы, заказ передан в производство.'
      )
  )
  select
    o.id as order_id,
    s.from_status,
    s.status,
    s.status_comment
  from base_user
  join seed_orders s on true
  join public.orders o
    on o.user_id = base_user.id
   and o.address = s.address
   and o.full_name = s.full_name
) as all_seed_orders
where not exists (
  select 1
  from public.order_status_history h
  where h.order_id = all_seed_orders.order_id
    and h.to_status = all_seed_orders.status
    and coalesce(h.comment, '') = coalesce(all_seed_orders.status_comment, '')
);

commit;
