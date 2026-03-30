begin;

insert into public.services (name, description, price_from, is_active)
select *
from (
  values
    (
      'Проектирование лестницы под интерьер',
      'Разрабатываем конструктивную и визуальную концепцию лестницы под конкретный проём, архитектуру дома и ежедневный сценарий использования. На этапе проектирования определяются геометрия, тип каркаса, ограждение и ориентир по бюджету.',
      120000,
      true
    ),
    (
      'Изготовление лестниц на тетивах',
      'Классические лестницы для частных домов и спокойных интерьерных решений. Подбираем высоту подступенка, глубину проступи, материал ступеней и отделку так, чтобы лестница оставалась удобной, тихой и долговечной.',
      380000,
      true
    ),
    (
      'Лестницы на монокосоуре',
      'Современные открытые конструкции с облегчённым визуальным весом. Подходят для минималистичных интерьеров, двухсветных пространств и домов, где особенно важны воздух, свет и чистая линия марша.',
      520000,
      true
    ),
    (
      'Консольные и парящие лестницы',
      'Премиальный сценарий для архитектурных интерьеров. Используем скрытые узлы крепления, стекло, подсветку и точную стыковку с отделкой, чтобы лестница выглядела лёгкой, чистой и статусной.',
      860000,
      true
    ),
    (
      'Ограждения, стекло и отделка',
      'Подбираем ограждения из дерева, металла, стекла или в комбинированном исполнении. Отдельно прорабатываем оттенок древесины, фурнитуру, покрытие и детали, которые формируют общее впечатление от лестницы.',
      180000,
      true
    ),
    (
      'Замер, доставка и монтаж под ключ',
      'Берём на себя выезд на объект, точный замер, логистику, сборку и финишную сдачу. Клиент получает единый маршрут без потерь между проектированием, производством и монтажом.',
      95000,
      true
    )
) as seed(name, description, price_from, is_active)
where not exists (
  select 1 from public.services s where s.name = seed.name
);

update public.services
set
  description = seed.description,
  price_from = seed.price_from,
  is_active = seed.is_active
from (
  values
    (
      'Проектирование лестницы под интерьер',
      'Разрабатываем конструктивную и визуальную концепцию лестницы под конкретный проём, архитектуру дома и ежедневный сценарий использования. На этапе проектирования определяются геометрия, тип каркаса, ограждение и ориентир по бюджету.',
      120000,
      true
    ),
    (
      'Изготовление лестниц на тетивах',
      'Классические лестницы для частных домов и спокойных интерьерных решений. Подбираем высоту подступенка, глубину проступи, материал ступеней и отделку так, чтобы лестница оставалась удобной, тихой и долговечной.',
      380000,
      true
    ),
    (
      'Лестницы на монокосоуре',
      'Современные открытые конструкции с облегчённым визуальным весом. Подходят для минималистичных интерьеров, двухсветных пространств и домов, где особенно важны воздух, свет и чистая линия марша.',
      520000,
      true
    ),
    (
      'Консольные и парящие лестницы',
      'Премиальный сценарий для архитектурных интерьеров. Используем скрытые узлы крепления, стекло, подсветку и точную стыковку с отделкой, чтобы лестница выглядела лёгкой, чистой и статусной.',
      860000,
      true
    ),
    (
      'Ограждения, стекло и отделка',
      'Подбираем ограждения из дерева, металла, стекла или в комбинированном исполнении. Отдельно прорабатываем оттенок древесины, фурнитуру, покрытие и детали, которые формируют общее впечатление от лестницы.',
      180000,
      true
    ),
    (
      'Замер, доставка и монтаж под ключ',
      'Берём на себя выезд на объект, точный замер, логистику, сборку и финишную сдачу. Клиент получает единый маршрут без потерь между проектированием, производством и монтажом.',
      95000,
      true
    )
) as seed(name, description, price_from, is_active)
where public.services.name = seed.name;

insert into public.gallery (
  title,
  description,
  category,
  slug,
  is_featured,
  display_order,
  stair_model,
  stair_shape,
  railing_type,
  finish_type,
  image_url,
  price
)
select *
from (
  values
    (
      'Дубовая лестница для двухсветной гостиной',
      'Спокойный интерьерный проект для загородного дома: тёплые ступени из дуба, аккуратный металлический каркас и комбинированное ограждение без лишней визуальной тяжести.',
      'wood',
      'dubovaya-lestnica-dlya-dvusvetnoy-gostinoy',
      true,
      1,
      'classic'::public.stair_model_type,
      'u_shaped'::public.stair_shape_type,
      'combo'::public.railing_type_enum,
      'premium'::public.finish_type_enum,
      'https://images.pexels.com/photos/31996198/pexels-photo-31996198.jpeg?cs=srgb&dl=pexels-pexels-user-2152046166-31996198.jpg&fm=jpg',
      540000
    ),
    (
      'Монокосоур со стеклянным ограждением',
      'Современная лестница для светлого частного дома. Конструкция подчёркивает открытость пространства, а стеклянное ограждение сохраняет ощущение воздуха и света.',
      'metal',
      'monokosour-so-steklyannym-ograzhdeniem',
      true,
      2,
      'mono'::public.stair_model_type,
      'l_shaped'::public.stair_shape_type,
      'glass'::public.railing_type_enum,
      'premium'::public.finish_type_enum,
      'https://images.pexels.com/photos/19986294/pexels-photo-19986294.jpeg?cs=srgb&dl=pexels-jay-357831603-19986294.jpg&fm=jpg',
      610000
    ),
    (
      'Консольная лестница для архитектурного интерьера',
      'Парящий сценарий с акцентом на чистую линию марша, стекло и дизайнерскую отделку. Подходит для домов, где лестница становится частью архитектурной композиции.',
      'glass',
      'konsolnaya-lestnica-dlya-arkhitekturnogo-interera',
      true,
      3,
      'console'::public.stair_model_type,
      'straight'::public.stair_shape_type,
      'glass'::public.railing_type_enum,
      'designer'::public.finish_type_enum,
      'https://images.pexels.com/photos/7031569/pexels-photo-7031569.jpeg?cs=srgb&dl=pexels-heyho-7031569.jpg&fm=jpg',
      920000
    ),
    (
      'Ломаный косоур в стиле soft loft',
      'Графичная лестница на ломаном косоуре для современного интерьера с тёплым деревом, чёрным металлом и выразительным ритмом ступеней.',
      'metal',
      'lomanyy-kosour-v-stile-soft-loft',
      false,
      10,
      'zigzag'::public.stair_model_type,
      'straight'::public.stair_shape_type,
      'metal'::public.railing_type_enum,
      'premium'::public.finish_type_enum,
      'https://images.pexels.com/photos/10292830/pexels-photo-10292830.jpeg?cs=srgb&dl=pexels-res-138931537-10292830.jpg&fm=jpg',
      670000
    ),
    (
      'П-образная лестница с комбинированным ограждением',
      'Комфортный семейный маршрут для высокого подъёма: удобный поворот, спокойная пластика марша и отделка, рассчитанная на ежедневную эксплуатацию.',
      'wood',
      'p-obraznaya-lestnica-s-kombinirovannym-ograzhdeniem',
      false,
      11,
      'classic'::public.stair_model_type,
      'u_shaped'::public.stair_shape_type,
      'combo'::public.railing_type_enum,
      'basic'::public.finish_type_enum,
      'https://images.pexels.com/photos/35101954/pexels-photo-35101954.jpeg?cs=srgb&dl=pexels-fer-id-830123815-35101954.jpg&fm=jpg',
      480000
    ),
    (
      'Г-образная лестница с деревянным ограждением',
      'Тёплый интерьерный вариант для коттеджа: натуральная древесина, удобный поворот и мягкая интеграция в жилое пространство.',
      'wood',
      'g-obraznaya-lestnica-s-derevyannym-ograzhdeniem',
      false,
      12,
      'classic'::public.stair_model_type,
      'l_shaped'::public.stair_shape_type,
      'wooden'::public.railing_type_enum,
      'premium'::public.finish_type_enum,
      'https://images.pexels.com/photos/34622755/pexels-photo-34622755.jpeg?cs=srgb&dl=pexels-stephen-leonardi-587681991-34622755.jpg&fm=jpg',
      430000
    ),
    (
      'Винтовая лестница для компактного проёма',
      'Решение для небольших пространств, где важно сохранить проход и сделать лестницу выразительной, но не тяжёлой для интерьера.',
      'metal',
      'vintovaya-lestnica-dlya-kompaktnogo-proyoma',
      false,
      13,
      'mono'::public.stair_model_type,
      'spiral'::public.stair_shape_type,
      'metal'::public.railing_type_enum,
      'basic'::public.finish_type_enum,
      'https://images.pexels.com/photos/13028668/pexels-photo-13028668.jpeg?cs=srgb&dl=pexels-tahir-osman-109306362-13028668.jpg&fm=jpg',
      390000
    ),
    (
      'Лестница со стеклом и тёплой подсветкой',
      'Премиальный кейс для современного дома: стеклянное ограждение, скрытая подсветка и отделка, работающая в связке с общей архитектурой интерьера.',
      'glass',
      'lestnica-so-steklom-i-teploy-podsvetkoy',
      false,
      14,
      'console'::public.stair_model_type,
      'l_shaped'::public.stair_shape_type,
      'glass'::public.railing_type_enum,
      'designer'::public.finish_type_enum,
      'https://images.pexels.com/photos/30586681/pexels-photo-30586681.jpeg?cs=srgb&dl=pexels-jj-carter-402482802-30586681.jpg&fm=jpg',
      980000
    )
) as seed(
  title,
  description,
  category,
  slug,
  is_featured,
  display_order,
  stair_model,
  stair_shape,
  railing_type,
  finish_type,
  image_url,
  price
)
where not exists (
  select 1 from public.gallery g where g.slug = seed.slug
);

update public.gallery
set
  title = seed.title,
  description = seed.description,
  category = seed.category,
  is_featured = seed.is_featured,
  display_order = seed.display_order,
  stair_model = seed.stair_model,
  stair_shape = seed.stair_shape,
  railing_type = seed.railing_type,
  finish_type = seed.finish_type,
  image_url = seed.image_url,
  price = seed.price
from (
  values
    (
      'dubovaya-lestnica-dlya-dvusvetnoy-gostinoy',
      'Дубовая лестница для двухсветной гостиной',
      'Спокойный интерьерный проект для загородного дома: тёплые ступени из дуба, аккуратный металлический каркас и комбинированное ограждение без лишней визуальной тяжести.',
      'wood',
      true,
      1,
      'classic'::public.stair_model_type,
      'u_shaped'::public.stair_shape_type,
      'combo'::public.railing_type_enum,
      'premium'::public.finish_type_enum,
      'https://images.pexels.com/photos/31996198/pexels-photo-31996198.jpeg?cs=srgb&dl=pexels-pexels-user-2152046166-31996198.jpg&fm=jpg',
      540000
    ),
    (
      'monokosour-so-steklyannym-ograzhdeniem',
      'Монокосоур со стеклянным ограждением',
      'Современная лестница для светлого частного дома. Конструкция подчёркивает открытость пространства, а стеклянное ограждение сохраняет ощущение воздуха и света.',
      'metal',
      true,
      2,
      'mono'::public.stair_model_type,
      'l_shaped'::public.stair_shape_type,
      'glass'::public.railing_type_enum,
      'premium'::public.finish_type_enum,
      'https://images.pexels.com/photos/19986294/pexels-photo-19986294.jpeg?cs=srgb&dl=pexels-jay-357831603-19986294.jpg&fm=jpg',
      610000
    ),
    (
      'konsolnaya-lestnica-dlya-arkhitekturnogo-interera',
      'Консольная лестница для архитектурного интерьера',
      'Парящий сценарий с акцентом на чистую линию марша, стекло и дизайнерскую отделку. Подходит для домов, где лестница становится частью архитектурной композиции.',
      'glass',
      true,
      3,
      'console'::public.stair_model_type,
      'straight'::public.stair_shape_type,
      'glass'::public.railing_type_enum,
      'designer'::public.finish_type_enum,
      'https://images.pexels.com/photos/7031569/pexels-photo-7031569.jpeg?cs=srgb&dl=pexels-heyho-7031569.jpg&fm=jpg',
      920000
    ),
    (
      'lomanyy-kosour-v-stile-soft-loft',
      'Ломаный косоур в стиле soft loft',
      'Графичная лестница на ломаном косоуре для современного интерьера с тёплым деревом, чёрным металлом и выразительным ритмом ступеней.',
      'metal',
      false,
      10,
      'zigzag'::public.stair_model_type,
      'straight'::public.stair_shape_type,
      'metal'::public.railing_type_enum,
      'premium'::public.finish_type_enum,
      'https://images.pexels.com/photos/10292830/pexels-photo-10292830.jpeg?cs=srgb&dl=pexels-res-138931537-10292830.jpg&fm=jpg',
      670000
    ),
    (
      'p-obraznaya-lestnica-s-kombinirovannym-ograzhdeniem',
      'П-образная лестница с комбинированным ограждением',
      'Комфортный семейный маршрут для высокого подъёма: удобный поворот, спокойная пластика марша и отделка, рассчитанная на ежедневную эксплуатацию.',
      'wood',
      false,
      11,
      'classic'::public.stair_model_type,
      'u_shaped'::public.stair_shape_type,
      'combo'::public.railing_type_enum,
      'basic'::public.finish_type_enum,
      'https://images.pexels.com/photos/35101954/pexels-photo-35101954.jpeg?cs=srgb&dl=pexels-fer-id-830123815-35101954.jpg&fm=jpg',
      480000
    ),
    (
      'g-obraznaya-lestnica-s-derevyannym-ograzhdeniem',
      'Г-образная лестница с деревянным ограждением',
      'Тёплый интерьерный вариант для коттеджа: натуральная древесина, удобный поворот и мягкая интеграция в жилое пространство.',
      'wood',
      false,
      12,
      'classic'::public.stair_model_type,
      'l_shaped'::public.stair_shape_type,
      'wooden'::public.railing_type_enum,
      'premium'::public.finish_type_enum,
      'https://images.pexels.com/photos/34622755/pexels-photo-34622755.jpeg?cs=srgb&dl=pexels-stephen-leonardi-587681991-34622755.jpg&fm=jpg',
      430000
    ),
    (
      'vintovaya-lestnica-dlya-kompaktnogo-proyoma',
      'Винтовая лестница для компактного проёма',
      'Решение для небольших пространств, где важно сохранить проход и сделать лестницу выразительной, но не тяжёлой для интерьера.',
      'metal',
      false,
      13,
      'mono'::public.stair_model_type,
      'spiral'::public.stair_shape_type,
      'metal'::public.railing_type_enum,
      'basic'::public.finish_type_enum,
      'https://images.pexels.com/photos/13028668/pexels-photo-13028668.jpeg?cs=srgb&dl=pexels-tahir-osman-109306362-13028668.jpg&fm=jpg',
      390000
    ),
    (
      'lestnica-so-steklom-i-teploy-podsvetkoy',
      'Лестница со стеклом и тёплой подсветкой',
      'Премиальный кейс для современного дома: стеклянное ограждение, скрытая подсветка и отделка, работающая в связке с общей архитектурой интерьера.',
      'glass',
      false,
      14,
      'console'::public.stair_model_type,
      'l_shaped'::public.stair_shape_type,
      'glass'::public.railing_type_enum,
      'designer'::public.finish_type_enum,
      'https://images.pexels.com/photos/30586681/pexels-photo-30586681.jpeg?cs=srgb&dl=pexels-jj-carter-402482802-30586681.jpg&fm=jpg',
      980000
    )
) as seed(slug, title, description, category, is_featured, display_order, stair_model, stair_shape, railing_type, finish_type, image_url, price)
where public.gallery.slug = seed.slug;

commit;
