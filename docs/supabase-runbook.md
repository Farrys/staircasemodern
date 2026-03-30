# Supabase Runbook

Этот файл фиксирует рабочий порядок применения миграций и demo-seed файлов для проекта `Staircase Pro`.

## 1. Перед запуском

- Убедитесь, что базовая схема проекта уже существует:
  - `public.users`
  - `public.gallery`
  - `public.services`
  - `public.orders`
  - `public.order_params`
  - `public.order_status_history`
  - `public.reviews`
  - `public.messages`
- Если вы хотите полностью живую demo-среду, сначала создайте demo-пользователей:

```bash
npm run seed:demo-users
```

Это особенно полезно перед запуском:

- `20260330_seed_reviews.sql`
- `20260330_seed_messages_and_orders.sql`

Потому что оба файла опираются на наличие хотя бы одного пользователя в `public.users`.

## 2. Обязательные структурные миграции

Применяйте по порядку:

1. [20260330_gallery_catalog_fields.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_gallery_catalog_fields.sql)
2. [20260330_gallery_vitrine_fields.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_gallery_vitrine_fields.sql)
3. [20260330_gallery_storage_policies.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_gallery_storage_policies.sql)
4. [20260330_core_rls_hardening.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_core_rls_hardening.sql)
5. [20260330_realtime_chat.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_realtime_chat.sql)

Что они делают:

- `gallery_catalog_fields`: добавляет структурные поля каталога в `gallery`
- `gallery_vitrine_fields`: добавляет `slug`, `is_featured`, `display_order`
- `gallery_storage_policies`: настраивает bucket `gallery` и storage policy
- `core_rls_hardening`: включает базовую защиту по RLS для основных таблиц
- `realtime_chat`: создаёт таблицы realtime-чата и его access model

## 3. Demo-content seed файлы

После структурных миграций можно запускать наполнение:

1. [20260330_seed_services_and_gallery.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_seed_services_and_gallery.sql)
2. [20260330_seed_reviews.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_seed_reviews.sql)
3. [20260330_seed_messages_and_orders.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_seed_messages_and_orders.sql)
4. [20260330_seed_realtime_chat.sql](/c:/Users/Farrys/Desktop/staircase_modern_project/supabase/migrations/20260330_seed_realtime_chat.sql)

Что важно:

- `seed_services_and_gallery` умеет не только вставлять, но и обновлять demo-услуги и кейсы
- `seed_reviews` вставляет отзывы только если их ещё нет
- `seed_messages_and_orders` требует хотя бы одного пользователя в `public.users`
- `seed_realtime_chat` зависит от уже применённого `20260330_realtime_chat.sql`

## 4. Рекомендуемый полный порядок для чистой demo-среды

1. `npm run seed:demo-users`
2. `20260330_gallery_catalog_fields.sql`
3. `20260330_gallery_vitrine_fields.sql`
4. `20260330_gallery_storage_policies.sql`
5. `20260330_core_rls_hardening.sql`
6. `20260330_realtime_chat.sql`
7. `20260330_seed_services_and_gallery.sql`
8. `20260330_seed_reviews.sql`
9. `20260330_seed_messages_and_orders.sql`
10. `20260330_seed_realtime_chat.sql`

## 5. Что проверять после применения

- Публичная галерея открывается и фильтруется
- Админ может:
  - загрузить изображение в галерею
  - заменить изображение
  - удалить кейс без ошибок storage
- В профиле клиента видны demo-заказы
- В админке видны:
  - обращения
  - отзывы
  - галерея
  - realtime-чаты
- Клиентский чат:
  - создаёт сессию
  - сохраняет историю
  - показывает ответ менеджера

## 6. Что ещё важно перед реальным релизом

- Перевыпустить `SUPABASE_SERVICE_ROLE_KEY`, если он хоть раз засвечивался вне локальной машины
- Проверить storage policy на боевом проекте после деплоя
- Проверить, что у админ-пользователей в `public.users.role` действительно стоит `admin`
- По возможности заменить demo-контент и demo-изображения на реальные

## 7. Практическая пометка

Текущие seed-файлы ориентированы на удобную demo-среду:

- они в основном обновляют или добавляют данные
- они не очищают таблицы автоматически

Если позже понадобится полностью пересобрать demo-контент с нуля, имеет смысл сделать отдельный `reset_demo_content.sql`.
