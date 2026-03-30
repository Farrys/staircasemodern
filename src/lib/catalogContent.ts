import type { FinishType, Material, RailingType, StairModel, StairShape } from '@/types';

const GALLERY_META_PATTERN = /\[(model|shape|railing|finish):([a-z_]+)\]/gi;

export interface PackagePlan {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  summary: string;
  features: string[];
}

export interface CatalogAxisItem<T extends string> {
  value: T;
  label: string;
  description: string;
}

export interface ShowcaseCase {
  title: string;
  material: Material;
  stair_model: StairModel;
  stair_shape: StairShape;
  railing_type: RailingType;
  finish_type: FinishType;
  duration: string;
  budget: string;
  result: string;
}

export const packagePlans: PackagePlan[] = [
  {
    id: 'base',
    title: 'Base',
    subtitle: 'Спокойный старт',
    price: 'от 220 000 ₸',
    summary: 'Для домов, где важен чистый конструктив, понятный бюджет и аккуратный монтаж без декоративного перегруза.',
    features: ['Типовые формы и отделка', 'Быстрый запуск в производство', 'Подходит для дач и загородных домов'],
  },
  {
    id: 'interior',
    title: 'Interior',
    subtitle: 'Интерьерный уровень',
    price: 'от 420 000 ₸',
    summary: 'Для клиентов, которые хотят, чтобы лестница работала как часть интерьера и поддерживала архитектуру пространства.',
    features: ['Индивидуальная конфигурация', 'Подбор ограждений и оттенков', 'Точная интеграция в интерьер'],
  },
  {
    id: 'signature',
    title: 'Signature',
    subtitle: 'Премиальный сценарий',
    price: 'от 760 000 ₸',
    summary: 'Для сложных объектов с подсветкой, стеклом, дизайнерской отделкой и акцентом на визуальный эффект.',
    features: ['Сложные формы и узлы', 'Стекло, подсветка, премиум-фурнитура', 'Расширенное проектное сопровождение'],
  },
];

export const materialAxis: CatalogAxisItem<Material>[] = [
  { value: 'wood', label: 'Дерево', description: 'Тёплые интерьерные решения с натуральной текстурой и тактильностью.' },
  { value: 'metal', label: 'Металл', description: 'Чистый архитектурный силуэт, высокая жёсткость и современный характер.' },
  { value: 'glass', label: 'Стекло', description: 'Лёгкая подача, эффект воздуха и премиальное восприятие пространства.' },
];

export const modelAxis: CatalogAxisItem<StairModel>[] = [
  { value: 'classic', label: 'На тетивах', description: 'Надёжная классика для семейных домов и спокойных интерьеров.' },
  { value: 'mono', label: 'Монокосоур', description: 'Открытая современная конструкция с облегчённым визуальным весом.' },
  { value: 'zigzag', label: 'Ломаный косоур', description: 'Графичный каркас для акцентных современных пространств.' },
  { value: 'console', label: 'Консольная', description: 'Парящий эффект для премиальных интерьеров и сложной архитектуры.' },
];

export const shapeAxis: CatalogAxisItem<StairShape>[] = [
  { value: 'straight', label: 'Прямая', description: 'Минималистичный и удобный маршрут движения.' },
  { value: 'l_shaped', label: 'Г-образная', description: 'Рациональное решение для частных домов с поворотом.' },
  { value: 'u_shaped', label: 'П-образная', description: 'Комфортный сценарий для более высоких подъёмов и широких пространств.' },
  { value: 'spiral', label: 'Винтовая', description: 'Компактный вариант для ограниченного проёма или декоративной подачи.' },
];

export const railingAxis: CatalogAxisItem<RailingType>[] = [
  { value: 'wooden', label: 'Деревянное', description: 'Мягкая подача для тёплых жилых интерьеров.' },
  { value: 'metal', label: 'Металлическое', description: 'Строгая геометрия и современный характер.' },
  { value: 'glass', label: 'Стеклянное', description: 'Максимум воздуха и визуальной лёгкости.' },
  { value: 'combo', label: 'Комбинированное', description: 'Баланс декоративности, безопасности и фактур.' },
];

export const finishAxis: CatalogAxisItem<FinishType>[] = [
  { value: 'basic', label: 'Базовая', description: 'Практичное решение без лишнего декоративного слоя.' },
  { value: 'premium', label: 'Премиальная', description: 'Тщательный подбор фактур, оттенков и материалов под интерьер.' },
  { value: 'designer', label: 'Дизайнерская', description: 'Акцентная отделка для статусных и нестандартных объектов.' },
];

export const trustReasons = [
  'Предварительный расчёт ещё до звонка и замера',
  'Фиксация параметров заказа без Excel и мессенджер-хаоса',
  'Понятный маршрут: консультация, замер, смета, производство, монтаж',
  'Кейсы, отзывы и галерея внутри одной системы',
];

export const showcaseCases: ShowcaseCase[] = [
  {
    title: 'Лестница для двухсветной гостиной',
    material: 'wood',
    stair_model: 'classic',
    stair_shape: 'u_shaped',
    railing_type: 'combo',
    finish_type: 'premium',
    duration: '28 дней',
    budget: 'от 540 000 ₸',
    result: 'Собрали мягкий интерьерный маршрут с дубовыми ступенями и спокойным металлическим каркасом.',
  },
  {
    title: 'Монокосоур для современного дома',
    material: 'metal',
    stair_model: 'mono',
    stair_shape: 'l_shaped',
    railing_type: 'glass',
    finish_type: 'premium',
    duration: '24 дня',
    budget: 'от 610 000 ₸',
    result: 'Сохранили лёгкость пространства за счёт стекла, тонкого каркаса и тёплой отделки ступеней.',
  },
  {
    title: 'Парящая лестница под архитектурный проект',
    material: 'glass',
    stair_model: 'console',
    stair_shape: 'straight',
    railing_type: 'glass',
    finish_type: 'designer',
    duration: '35 дней',
    budget: 'от 920 000 ₸',
    result: 'Сделали эффектную консольную подачу с подсветкой и высоким визуальным классом узлов.',
  },
];

export function readGalleryEmbeddedMeta(description = '') {
  let stair_model: StairModel | undefined;
  let stair_shape: StairShape | undefined;
  let railing_type: RailingType | undefined;
  let finish_type: FinishType | undefined;

  const cleanDescription = description
    .replace(GALLERY_META_PATTERN, (_, key: string, value: string) => {
      if (key === 'model') stair_model = value as StairModel;
      if (key === 'shape') stair_shape = value as StairShape;
      if (key === 'railing') railing_type = value as RailingType;
      if (key === 'finish') finish_type = value as FinishType;
      return '';
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    stair_model,
    stair_shape,
    railing_type,
    finish_type,
    cleanDescription,
  };
}

export function stripGalleryEmbeddedMeta(description = '') {
  return readGalleryEmbeddedMeta(description).cleanDescription;
}

export function encodeGalleryDescription(
  description = '',
  meta: Partial<Pick<ShowcaseCase, 'stair_model' | 'stair_shape' | 'railing_type' | 'finish_type'>>,
) {
  const cleanDescription = stripGalleryEmbeddedMeta(description);
  const tokens = [
    meta.stair_model ? `[model:${meta.stair_model}]` : '',
    meta.stair_shape ? `[shape:${meta.stair_shape}]` : '',
    meta.railing_type ? `[railing:${meta.railing_type}]` : '',
    meta.finish_type ? `[finish:${meta.finish_type}]` : '',
  ].filter(Boolean);

  return [tokens.join(' '), cleanDescription].filter(Boolean).join('\n').trim();
}

export function inferCaseMeta(
  title: string,
  description = '',
  fallbackMaterial: Material = 'wood',
  persistedMeta?: Partial<Pick<ShowcaseCase, 'stair_model' | 'stair_shape' | 'railing_type' | 'finish_type'>>,
) {
  const embeddedMeta = readGalleryEmbeddedMeta(description);
  const source = `${title} ${embeddedMeta.cleanDescription}`.toLowerCase();

  const stair_model: StairModel =
    persistedMeta?.stair_model ??
    embeddedMeta.stair_model ??
    (source.includes('консоль') || source.includes('парящ')
      ? 'console'
      : source.includes('монокос')
        ? 'mono'
        : source.includes('ломан') || source.includes('зигзаг')
          ? 'zigzag'
          : 'classic');

  const stair_shape: StairShape =
    persistedMeta?.stair_shape ??
    embeddedMeta.stair_shape ??
    (source.includes('винтов')
      ? 'spiral'
      : source.includes('п-образ')
        ? 'u_shaped'
        : source.includes('г-образ') || source.includes('поворот')
          ? 'l_shaped'
          : 'straight');

  const railing_type: RailingType =
    persistedMeta?.railing_type ??
    embeddedMeta.railing_type ??
    (source.includes('стекл')
      ? 'glass'
      : source.includes('комб')
        ? 'combo'
        : source.includes('металл')
          ? 'metal'
          : 'wooden');

  const finish_type: FinishType =
    persistedMeta?.finish_type ??
    embeddedMeta.finish_type ??
    (source.includes('дизайн') || source.includes('премиум')
      ? 'designer'
      : source.includes('масло') || source.includes('шпон') || source.includes('тониров')
        ? 'premium'
        : 'basic');

  return {
    material: fallbackMaterial,
    stair_model,
    stair_shape,
    railing_type,
    finish_type,
  };
}
