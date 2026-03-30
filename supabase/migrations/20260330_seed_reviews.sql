begin;

with base_user as (
  select id
  from public.users
  order by created_at
  limit 1
),
seed(author_name, rating, text) as (
  values
    (
      'Айдана С.',
      5,
      'Понравилось, что всё прошло спокойно и без лишней суеты: от первого разговора до монтажа. Лестница получилась аккуратной, удобной и очень хорошо вписалась в интерьер дома.'
    ),
    (
      'Максим Т.',
      5,
      'Заказывали лестницу на монокосоуре со стеклянным ограждением. Отдельно отмечу точность замера, аккуратный монтаж и то, как внимательно подошли к деталям отделки.'
    ),
    (
      'Жанар К.',
      5,
      'Нужен был современный вариант без визуальной тяжести. Получили понятную смету, несколько предложений по материалам и хороший результат по срокам.'
    )
)
insert into public.reviews (user_id, author_name, rating, text, status)
select
  base_user.id,
  seed.author_name,
  seed.rating,
  seed.text,
  'approved'
from base_user
cross join seed
where not exists (
  select 1
  from public.reviews r
  where r.author_name = seed.author_name
    and r.text = seed.text
);

commit;
