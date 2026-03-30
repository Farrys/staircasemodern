import type {
  CalculatorParams,
  CalculatorResult,
  FinishType,
  Material,
  RailingType,
  StairModel,
  StairShape,
} from '@/types';

export const MATERIAL_LABELS: Record<Material, string> = {
  wood: 'Дерево',
  metal: 'Металл',
  glass: 'Стекло',
};

export const MODEL_LABELS: Record<StairModel, string> = {
  classic: 'Классическая на тетивах',
  mono: 'На монокосоуре',
  zigzag: 'На ломаном косоуре',
  console: 'Консольная / парящая',
};

export const SHAPE_LABELS: Record<StairShape, string> = {
  straight: 'Прямая',
  l_shaped: 'Г-образная',
  u_shaped: 'П-образная',
  spiral: 'Винтовая',
};

export const RAILING_LABELS: Record<RailingType, string> = {
  wooden: 'Деревянное ограждение',
  metal: 'Металлическое ограждение',
  glass: 'Стеклянное ограждение',
  combo: 'Комбинированное ограждение',
};

export const FINISH_LABELS: Record<FinishType, string> = {
  basic: 'Базовая отделка',
  premium: 'Премиальная отделка',
  designer: 'Дизайнерская отделка',
};

export const BASE_PRICES: Record<Material, number> = {
  wood: 240000,
  metal: 320000,
  glass: 460000,
};

export const STEP_MULTIPLIERS: Record<Material, number> = {
  wood: 18000,
  metal: 24000,
  glass: 34000,
};

export const MODEL_PRICES: Record<StairModel, number> = {
  classic: 0,
  mono: 120000,
  zigzag: 180000,
  console: 340000,
};

export const SHAPE_PRICES: Record<StairShape, number> = {
  straight: 0,
  l_shaped: 85000,
  u_shaped: 160000,
  spiral: 230000,
};

export const RAILING_PRICES: Record<RailingType, number> = {
  wooden: 70000,
  metal: 95000,
  glass: 220000,
  combo: 145000,
};

export const FINISH_PRICES: Record<FinishType, number> = {
  basic: 0,
  premium: 90000,
  designer: 170000,
};

export const OPTION_PRICES = {
  lighting: 65000,
  smart_light: 120000,
  extended_warranty: 45000,
  needs_measurement: 0,
};

export const OPTION_LABELS = {
  lighting: 'Подсветка ступеней',
  smart_light: 'Умное управление освещением',
  extended_warranty: 'Расширенная гарантия 5 лет',
  needs_measurement: 'Нужен выезд замерщика',
};

export const DEFAULT_CALCULATOR_PARAMS: CalculatorParams = {
  material: 'wood',
  steps_count: 12,
  lighting: false,
  smart_light: false,
  extended_warranty: false,
  stair_model: 'classic',
  stair_shape: 'straight',
  railing_type: 'wooden',
  finish_type: 'basic',
  installation_floor: 2,
  needs_measurement: true,
};

export function calculatePrice(params: CalculatorParams): CalculatorResult {
  const material = params.material;
  const model = params.stair_model ?? 'classic';
  const shape = params.stair_shape ?? 'straight';
  const railing = params.railing_type ?? 'wooden';
  const finish = params.finish_type ?? 'basic';

  const base_price = BASE_PRICES[material];
  const steps_cost = params.steps_count * STEP_MULTIPLIERS[material];
  const model_cost = MODEL_PRICES[model];
  const shape_cost = SHAPE_PRICES[shape];
  const railing_cost = RAILING_PRICES[railing];
  const finish_cost = FINISH_PRICES[finish];

  let options_cost = 0;
  if (params.lighting) options_cost += OPTION_PRICES.lighting;
  if (params.smart_light) options_cost += OPTION_PRICES.smart_light;
  if (params.extended_warranty) options_cost += OPTION_PRICES.extended_warranty;
  if ((params.installation_floor ?? 2) > 2) options_cost += 55000;

  const total = base_price + steps_cost + options_cost + model_cost + shape_cost + railing_cost + finish_cost;

  return {
    base_price,
    steps_cost,
    options_cost,
    model_cost,
    railing_cost,
    finish_cost,
    shape_cost,
    total,
  };
}

export function getCalculatorSummary(params: CalculatorParams) {
  return [
    `Модель: ${MODEL_LABELS[params.stair_model ?? 'classic']}`,
    `Форма: ${SHAPE_LABELS[params.stair_shape ?? 'straight']}`,
    `Ограждение: ${RAILING_LABELS[params.railing_type ?? 'wooden']}`,
    `Отделка: ${FINISH_LABELS[params.finish_type ?? 'basic']}`,
    `Этажность: ${params.installation_floor ?? 2}`,
    `Нужен замер: ${params.needs_measurement === false ? 'Нет' : 'Да'}`,
  ];
}
