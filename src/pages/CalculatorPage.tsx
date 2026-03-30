import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Landmark, Layers3, Lightbulb, Shield, Sparkles, SplitSquareVertical, WandSparkles } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import {
  calculatePrice,
  DEFAULT_CALCULATOR_PARAMS,
  FINISH_LABELS,
  MATERIAL_LABELS,
  MODEL_LABELS,
  OPTION_LABELS,
  RAILING_LABELS,
  SHAPE_LABELS,
} from '@/lib/calculator';
import { useAuth } from '@/hooks/useAuth';
import type { CalculatorParams, FinishType, Material, RailingType, StairModel, StairShape } from '@/types';

const modelMeta: { key: StairModel; icon: typeof Layers3; desc: string }[] = [
  { key: 'classic', icon: Layers3, desc: 'Практичная классика для прямых и поворотных решений.' },
  { key: 'mono', icon: SplitSquareVertical, desc: 'Современный открытый каркас с лёгким визуальным весом.' },
  { key: 'zigzag', icon: Landmark, desc: 'Выразительный металлический косоур для акцентных интерьеров.' },
  { key: 'console', icon: WandSparkles, desc: 'Эффект парящей лестницы для современных пространств.' },
];

const shapeMeta: StairShape[] = ['straight', 'l_shaped', 'u_shaped', 'spiral'];
const railingMeta: RailingType[] = ['wooden', 'metal', 'glass', 'combo'];
const finishMeta: FinishType[] = ['basic', 'premium', 'designer'];

const optionBaseClass = 'editorial-option p-5 text-left';
const selectedClass = 'editorial-option-active';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const initial = (location.state as CalculatorParams | null) ?? DEFAULT_CALCULATOR_PARAMS;
  const [params, setParams] = useState<CalculatorParams>({ ...DEFAULT_CALCULATOR_PARAMS, ...initial });
  const result = useMemo(() => calculatePrice(params), [params]);

  const goToOrder = () => {
    if (user) return navigate('/orders/new', { state: { params, result } });
    sessionStorage.setItem('pendingOrderParams', JSON.stringify({ params, result }));
    navigate('/auth');
  };

  return (
    <PageWrapper>
      <section className="editorial-panel editorial-shell grid gap-8 p-6 sm:p-8 xl:grid-cols-[1.1fr,0.9fr] xl:p-10">
        <div className="relative z-10 max-w-3xl">
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            интеллектуальный расчёт
          </div>
          <h1 className="page-title mt-6 max-w-4xl text-5xl sm:text-6xl xl:text-[4.75rem]">
            Калькулятор стоимости лестницы с живым пересчётом конфигурации
          </h1>
          <p className="page-lead mt-5 max-w-2xl text-base sm:text-xl">
            Подберите материал, форму, ограждение и отделку, чтобы быстро получить ориентир по бюджету и подготовить основу для дальнейшего расчёта.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="editorial-chip px-4 py-2 text-sm font-semibold">Живой пересчёт цены</span>
            <span className="editorial-chip px-4 py-2 text-sm font-semibold">Понятный ориентир</span>
            <span className="editorial-chip px-4 py-2 text-sm font-semibold">Передача в заказ без дубляжа</span>
          </div>
        </div>

        <div className="editorial-panel relative z-10 p-6 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.34em] text-brand">Curated estimate</div>
          <h2 className="mt-5 font-['Cormorant_Garamond'] text-4xl font-bold leading-none text-text-primary">
            Что делает этот расчёт полезным
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-text-secondary sm:text-base">
            <p>Расчёт помогает сразу понять ориентир по бюджету и увидеть, как на стоимость влияют материал, форма, ограждение и дополнительные опции.</p>
            <p>Собранную конфигурацию можно использовать как основу для точной сметы после замера и согласования отделки.</p>
          </div>
          <div className="mt-8 space-y-3">
            {[
              { title: 'Быстрый ориентир', value: '15 мин', desc: 'на подбор конфигурации и материалов' },
              { title: 'Гибкий диапазон', value: '300+', desc: 'вариаций по формам, ограждениям и отделке' },
              { title: 'Передача в заказ', value: '1 клик', desc: 'до отправки собранной конфигурации менеджеру' },
            ].map((item) => (
              <div key={item.title} className="editorial-summary flex items-start justify-between gap-4 px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">{item.desc}</p>
                </div>
                <span className="font-['Cormorant_Garamond'] text-4xl font-bold text-brand">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.28fr,0.82fr]">
        <div className="space-y-6">
          <section className="editorial-panel p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">01 Material</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">Выберите материал</h2>
              </div>
              <span className="font-['Cormorant_Garamond'] text-6xl font-bold leading-none text-brand/55">01</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {(['wood', 'metal', 'glass'] as Material[]).map((material) => {
                const active = params.material === material;
                return (
                  <button
                    key={material}
                    className={`${optionBaseClass} ${active ? selectedClass : ''}`}
                    onClick={() => setParams((prev) => ({ ...prev, material }))}
                  >
                    <h3 className="text-xl font-semibold">{MATERIAL_LABELS[material]}</h3>
                    <p className={`mt-3 text-sm leading-6 ${active ? 'text-[#3f2f20]' : 'text-text-secondary'}`}>
                      Исполнение под размеры объекта и выбранный стиль пространства.
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="editorial-panel p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">02 Structure</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">Конструктив и форма</h2>
              </div>
              <span className="font-['Cormorant_Garamond'] text-6xl font-bold leading-none text-brand/55">02</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {modelMeta.map(({ key, icon: Icon, desc }) => {
                const active = params.stair_model === key;
                return (
                  <button
                    key={key}
                    className={`${optionBaseClass} ${active ? selectedClass : ''}`}
                    onClick={() => setParams((prev) => ({ ...prev, stair_model: key }))}
                  >
                    <Icon className={`h-6 w-6 ${active ? 'text-[#4a3524]' : 'text-brand'}`} />
                    <h3 className="mt-4 text-lg font-semibold">{MODEL_LABELS[key]}</h3>
                    <p className={`mt-2 text-sm leading-6 ${active ? 'text-[#3f2f20]' : 'text-text-secondary'}`}>{desc}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {shapeMeta.map((shape) => {
                const active = params.stair_shape === shape;
                return (
                  <button
                    key={shape}
                    className={`rounded-[20px] border px-4 py-4 text-sm font-semibold transition ${
                      active
                        ? 'editorial-option-active'
                        : 'border-border bg-transparent text-text-secondary hover:border-brand hover:text-text-primary'
                    }`}
                    onClick={() => setParams((prev) => ({ ...prev, stair_shape: shape }))}
                  >
                    {SHAPE_LABELS[shape]}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="editorial-panel p-6 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">03 Steps</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">Количество ступеней</h2>
              </div>
              <span className="editorial-chip px-4 py-2 text-base font-bold">{params.steps_count}</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={params.steps_count}
              onChange={(e) => setParams((prev) => ({ ...prev, steps_count: Number(e.target.value) }))}
              className="w-full accent-brand"
            />
            <div className="mt-3 flex justify-between text-xs text-text-secondary">
              <span>5 ступеней</span>
              <span>30 ступеней</span>
            </div>
          </section>

          <section className="editorial-panel p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">04 Finish</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">Ограждение и отделка</h2>
              </div>
              <span className="font-['Cormorant_Garamond'] text-6xl font-bold leading-none text-brand/55">04</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {railingMeta.map((railing) => {
                const active = params.railing_type === railing;
                return (
                  <button
                    key={railing}
                    className={`${optionBaseClass} ${active ? selectedClass : ''}`}
                    onClick={() => setParams((prev) => ({ ...prev, railing_type: railing }))}
                  >
                    <h3 className="text-lg font-semibold">{RAILING_LABELS[railing]}</h3>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {finishMeta.map((finish) => {
                const active = params.finish_type === finish;
                return (
                  <button
                    key={finish}
                    className={`${optionBaseClass} ${active ? selectedClass : ''}`}
                    onClick={() => setParams((prev) => ({ ...prev, finish_type: finish }))}
                  >
                    <h3 className="text-lg font-semibold">{FINISH_LABELS[finish]}</h3>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="editorial-panel p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">05 Options</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">Дополнительные опции</h2>
              </div>
              <span className="font-['Cormorant_Garamond'] text-6xl font-bold leading-none text-brand/55">05</span>
            </div>
            <div className="space-y-4">
              {([
                { key: 'lighting', label: OPTION_LABELS.lighting, Icon: Lightbulb },
                { key: 'smart_light', label: OPTION_LABELS.smart_light, Icon: Sparkles },
                { key: 'extended_warranty', label: OPTION_LABELS.extended_warranty, Icon: Shield },
              ] as const).map(({ key, label, Icon }) => {
                const typedKey = key as keyof CalculatorParams;
                return (
                  <label key={key} className="editorial-summary flex cursor-pointer items-center justify-between gap-4 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-border p-2.5">
                        <Icon className="h-5 w-5 text-brand" />
                      </div>
                      <span className="font-medium text-text-primary">{label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(params[typedKey])}
                      onChange={(e) => setParams((prev) => ({ ...prev, [typedKey]: e.target.checked }))}
                      className="h-5 w-5 rounded accent-brand"
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="editorial-summary block px-4 py-4">
                <span className="text-sm font-medium text-text-primary">Этажность монтажа</span>
                <select
                  value={params.installation_floor ?? 2}
                  onChange={(e) => setParams((prev) => ({ ...prev, installation_floor: Number(e.target.value) as 1 | 2 | 3 }))}
                  className="mt-3 w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand"
                  style={{
                    background: 'color-mix(in srgb, var(--panel-bg-main) 95%, black 5%)',
                    color: 'rgb(var(--color-text-primary))',
                  }}
                >
                  <option value={1}>1 уровень / антресоль</option>
                  <option value={2}>2 этажа</option>
                  <option value={3}>3 этажа и более</option>
                </select>
              </label>
              <label className="editorial-summary flex cursor-pointer items-center justify-between gap-4 px-4 py-4">
                <div>
                  <p className="font-medium text-text-primary">Нужен бесплатный выезд замерщика</p>
                  <p className="mt-1 text-sm text-text-secondary">Оставим отметку для менеджера при оформлении заказа</p>
                </div>
                <input
                  type="checkbox"
                  checked={params.needs_measurement !== false}
                  onChange={(e) => setParams((prev) => ({ ...prev, needs_measurement: e.target.checked }))}
                  className="h-5 w-5 rounded accent-brand"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="xl:sticky xl:top-24 xl:h-fit">
          <section className="editorial-panel editorial-shell p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand">Live summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">Итоговый расчёт</h2>
              </div>
              <span className="font-['Cormorant_Garamond'] text-6xl font-bold leading-none text-brand/55">09</span>
            </div>

            <div className="mt-5 rounded-[28px] bg-[linear-gradient(135deg,rgba(246,235,214,0.98),rgba(227,200,154,0.96))] p-5 text-[#2e2318] shadow-[0_18px_42px_rgba(0,0,0,0.16)]">
              <p className="text-lg font-semibold">{MODEL_LABELS[params.stair_model ?? 'classic']}</p>
              <p className="mt-1 text-sm text-[#5f4735]">
                {SHAPE_LABELS[params.stair_shape ?? 'straight']} • {RAILING_LABELS[params.railing_type ?? 'wooden']}
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between text-text-secondary"><span>Базовая цена</span><span className="font-semibold text-text-primary">{result.base_price.toLocaleString('ru-RU')} ₸</span></div>
              <div className="flex items-center justify-between text-text-secondary"><span>Конструктив</span><span className="font-semibold text-text-primary">{result.model_cost.toLocaleString('ru-RU')} ₸</span></div>
              <div className="flex items-center justify-between text-text-secondary"><span>Форма лестницы</span><span className="font-semibold text-text-primary">{result.shape_cost.toLocaleString('ru-RU')} ₸</span></div>
              <div className="flex items-center justify-between text-text-secondary"><span>Стоимость ступеней</span><span className="font-semibold text-text-primary">{result.steps_cost.toLocaleString('ru-RU')} ₸</span></div>
              <div className="flex items-center justify-between text-text-secondary"><span>Ограждение</span><span className="font-semibold text-text-primary">{result.railing_cost.toLocaleString('ru-RU')} ₸</span></div>
              <div className="flex items-center justify-between text-text-secondary"><span>Отделка</span><span className="font-semibold text-text-primary">{result.finish_cost.toLocaleString('ru-RU')} ₸</span></div>
              <div className="flex items-center justify-between text-text-secondary"><span>Опции</span><span className="font-semibold text-text-primary">{result.options_cost.toLocaleString('ru-RU')} ₸</span></div>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-end justify-between gap-3">
                <span className="text-base font-semibold text-text-primary">Итого</span>
                <span className="font-['Cormorant_Garamond'] text-5xl font-bold leading-none text-brand">{result.total.toLocaleString('ru-RU')} ₸</span>
              </div>
            </div>

            <div className="editorial-summary mt-6 space-y-3 px-4 py-4 text-sm text-text-secondary">
              <p>• Предварительная смета обновляется мгновенно.</p>
              <p>• Точный расчёт уточняется после замера и подтверждения отделки.</p>
              <p>• Конфигурацию можно сразу передать в заказ без повторного заполнения.</p>
            </div>

            <Button className="mt-6" fullWidth onClick={goToOrder}>
              Оформить заказ <ArrowRight className="h-4 w-4" />
            </Button>
          </section>
        </aside>
      </div>
    </PageWrapper>
  );
}
