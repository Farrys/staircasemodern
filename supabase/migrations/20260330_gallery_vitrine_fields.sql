begin;

alter table public.gallery
  add column if not exists slug text,
  add column if not exists is_featured boolean not null default false,
  add column if not exists display_order integer not null default 0;

update public.gallery
set slug = lower(
  trim(
    both '-' from regexp_replace(
      regexp_replace(
        regexp_replace(
          translate(
            coalesce(title, ''),
            'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ',
            'abvgdeejzijklmnoprstufhccss_y_euaABVGDEEJZIJKLMNOPRSTUFHCCSS_Y_EUA'
          ),
          '[^a-zA-Z0-9]+',
          '-',
          'g'
        ),
        '-{2,}',
        '-',
        'g'
      ),
      '(^-|-$)',
      '',
      'g'
    )
  )
)
where slug is null or btrim(slug) = '';

update public.gallery
set slug = 'gallery-item-' || substring(id::text from 1 for 8)
where slug is null or slug = '';

with duplicated as (
  select
    id,
    slug,
    row_number() over (partition by slug order by created_at, id) as rn
  from public.gallery
)
update public.gallery as g
set slug = d.slug || '-' || substring(g.id::text from 1 for 8)
from duplicated as d
where g.id = d.id and d.rn > 1;

update public.gallery
set display_order = 999
where coalesce(is_featured, false) = false and coalesce(display_order, 0) = 0;

create unique index if not exists gallery_slug_key on public.gallery (slug);
create index if not exists gallery_featured_display_idx on public.gallery (is_featured desc, display_order asc, created_at desc);

commit;
