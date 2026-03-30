begin;

do $$
begin
  create type public.stair_model_type as enum ('classic', 'mono', 'zigzag', 'console');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.stair_shape_type as enum ('straight', 'l_shaped', 'u_shaped', 'spiral');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.railing_type_enum as enum ('wooden', 'metal', 'glass', 'combo');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.finish_type_enum as enum ('basic', 'premium', 'designer');
exception
  when duplicate_object then null;
end $$;

alter table public.gallery
  add column if not exists stair_model public.stair_model_type,
  add column if not exists stair_shape public.stair_shape_type,
  add column if not exists railing_type public.railing_type_enum,
  add column if not exists finish_type public.finish_type_enum;

update public.gallery
set
  stair_model = case
    when description ~* '\[model:(classic|mono|zigzag|console)\]' then substring(description from '\[model:(classic|mono|zigzag|console)\]')::public.stair_model_type
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* '(консоль|парящ)' then 'console'::public.stair_model_type
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* 'монокос' then 'mono'::public.stair_model_type
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* '(ломан|зигзаг)' then 'zigzag'::public.stair_model_type
    else coalesce(stair_model, 'classic'::public.stair_model_type)
  end,
  stair_shape = case
    when description ~* '\[shape:(straight|l_shaped|u_shaped|spiral)\]' then substring(description from '\[shape:(straight|l_shaped|u_shaped|spiral)\]')::public.stair_shape_type
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* 'винтов' then 'spiral'::public.stair_shape_type
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* 'п-образ' then 'u_shaped'::public.stair_shape_type
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* '(г-образ|поворот)' then 'l_shaped'::public.stair_shape_type
    else coalesce(stair_shape, 'straight'::public.stair_shape_type)
  end,
  railing_type = case
    when description ~* '\[railing:(wooden|metal|glass|combo)\]' then substring(description from '\[railing:(wooden|metal|glass|combo)\]')::public.railing_type_enum
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* 'стекл' then 'glass'::public.railing_type_enum
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* 'комб' then 'combo'::public.railing_type_enum
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* 'металл' then 'metal'::public.railing_type_enum
    else coalesce(railing_type, 'wooden'::public.railing_type_enum)
  end,
  finish_type = case
    when description ~* '\[finish:(basic|premium|designer)\]' then substring(description from '\[finish:(basic|premium|designer)\]')::public.finish_type_enum
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* '(дизайн|премиум)' then 'designer'::public.finish_type_enum
    when coalesce(title, '') || ' ' || coalesce(description, '') ~* '(масло|шпон|тониров)' then 'premium'::public.finish_type_enum
    else coalesce(finish_type, 'basic'::public.finish_type_enum)
  end;

update public.gallery
set description = nullif(
  trim(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(coalesce(description, ''), '\[model:(classic|mono|zigzag|console)\]', '', 'gi'),
          '\[shape:(straight|l_shaped|u_shaped|spiral)\]',
          '',
          'gi'
        ),
        '\[railing:(wooden|metal|glass|combo)\]',
        '',
        'gi'
      ),
      '\[finish:(basic|premium|designer)\]',
      '',
      'gi'
    )
  ),
  ''
)
where description is not null;

alter table public.gallery
  alter column stair_model set default 'classic'::public.stair_model_type,
  alter column stair_shape set default 'straight'::public.stair_shape_type,
  alter column railing_type set default 'wooden'::public.railing_type_enum,
  alter column finish_type set default 'basic'::public.finish_type_enum;

update public.gallery
set
  stair_model = coalesce(stair_model, 'classic'::public.stair_model_type),
  stair_shape = coalesce(stair_shape, 'straight'::public.stair_shape_type),
  railing_type = coalesce(railing_type, 'wooden'::public.railing_type_enum),
  finish_type = coalesce(finish_type, 'basic'::public.finish_type_enum);

alter table public.gallery
  alter column stair_model set not null,
  alter column stair_shape set not null,
  alter column railing_type set not null,
  alter column finish_type set not null;

create index if not exists gallery_stair_model_idx on public.gallery (stair_model);
create index if not exists gallery_stair_shape_idx on public.gallery (stair_shape);
create index if not exists gallery_railing_type_idx on public.gallery (railing_type);
create index if not exists gallery_finish_type_idx on public.gallery (finish_type);

commit;
