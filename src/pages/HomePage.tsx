import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Layers3,
  MessageCircleMore,
  PaintBucket,
  Ruler,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Truck,
  WandSparkles,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGallery } from '@/hooks/useGallery';
import { useReviews } from '@/hooks/useReviews';
import { Spinner } from '@/components/ui/Spinner';
import { packagePlans, showcaseCases, stripGalleryEmbeddedMeta, trustReasons } from '@/lib/catalogContent';

const benefits = [
  { icon: BadgeCheck, title: 'Точное попадание в интерьер', text: 'Мы проектируем лестницу как архитектурный объект, а не как отдельный набор ступеней и перил.' },
  { icon: ShieldCheck, title: 'Инженерная надёжность', text: 'Продумываем геометрию, нагрузку, сценарии эксплуатации и безопасный шаг ещё до запуска производства.' },
  { icon: TimerReset, title: 'Прозрачный процесс', text: 'От первого контакта до монтажа клиент понимает сроки, этапы и состав сметы без серых зон.' },
  { icon: PaintBucket, title: 'Материалы без компромиссов', text: 'Работаем с металлом, натуральным деревом, стеклом, комбинированными ограждениями и сложной отделкой.' },
];

const tiers = [
  { title: 'Comfort', price: 'от 220 000 ₸', text: 'Лаконичные решения для загородных домов и спокойных современных интерьеров.' },
  { title: 'Signature', price: 'от 420 000 ₸', text: 'Индивидуальные формы, выразительные ограждения, точная стыковка с отделкой и мебелью.' },
  { title: 'Architect', price: 'от 760 000 ₸', text: 'Проекты для сложной архитектуры: консольные марши, стекло, подсветка, премиальная фурнитура.' },
];

const process = [
  { icon: MessageCircleMore, title: 'Диалог и бриф', text: 'Собираем вводные: габариты, стиль интерьера, материалы, ожидания по срокам и бюджету.' },
  { icon: Ruler, title: 'Замер и концепция', text: 'Выезжаем на объект, фиксируем геометрию, слабые места и предлагаем архитектурный сценарий лестницы.' },
  { icon: Layers3, title: 'Производство и отделка', text: 'Запускаем металлокаркас, столярную часть, стекло, покраску и декоративные узлы как единый комплект.' },
  { icon: Truck, title: 'Монтаж и сдача', text: 'Аккуратно собираем конструкцию на объекте, проверяем узлы и передаём рекомендации по уходу.' },
];

const faqs = [
  {
    q: 'Когда лучше запускать проект лестницы?',
    a: 'Идеально после понимания чистовых отметок и финальных размеров проёма. Но консультацию и предварительный бюджет лучше получить заранее, чтобы не ошибиться с геометрией.',
  },
  {
    q: 'Можно ли адаптировать лестницу под готовый интерьер?',
    a: 'Да. Мы подбираем форму, оттенок древесины, тип ограждений, подступенки, подсветку и ритм конструкции под уже выбранный стиль помещения.',
  },
  {
    q: 'Что получает клиент после обращения?',
    a: 'Понятный маршрут: консультация, примерный бюджет, замер, финальная смета, запуск производства и контроль монтажа без разрывов между этапами.',
  },
];

export default function HomePage() {
  const { items, loading: galleryLoading } = useGallery(6);
  const { reviews, loading: reviewsLoading } = useReviews('approved', 3);
  const featuredItems = items.filter((item) => item.is_featured).slice(0, 3);
  const galleryPreview = (featuredItems.length > 0 ? featuredItems : items).slice(0, 3);

  return (
    <PageWrapper>
      <section className="relative grid items-center gap-10 overflow-hidden py-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-[2rem] border border-[#d8b892]/45 opacity-60 animate-float" />
        <div className="pointer-events-none absolute right-[8%] top-4 h-24 w-72 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.42),rgba(255,255,255,0))] opacity-60 blur-2xl animate-wave" />
        <div>
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            премиальная столярно-металлическая студия
          </div>
          <h1 className="hero-title mt-6">Лестницы, которые собирают интерьер вокруг себя</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Staircase Pro помогает пройти путь от идеи до монтажа без хаоса: от первой консультации и подбора конфигурации
            до точной сметы, согласования материалов и запуска проекта в работу.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/calculator"><Button>Рассчитать проект</Button></Link>
            <Link to="/gallery"><Button variant="outline">Посмотреть кейсы</Button></Link>
            <Link to="/portfolio"><Button variant="secondary">О студии и мастере</Button></Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Card className="texture-panel">
              <p className="text-3xl font-extrabold text-brand">15 мин</p>
              <p className="mt-2 text-sm text-text-secondary">на первичную оценку и подбор конфигурации</p>
            </Card>
            <Card className="texture-panel">
              <p className="text-3xl font-extrabold text-brand">300+</p>
              <p className="mt-2 text-sm text-text-secondary">вариаций по материалам, формам и ограждениям</p>
            </Card>
            <Card className="texture-panel">
              <p className="text-3xl font-extrabold text-brand">5 лет</p>
              <p className="mt-2 text-sm text-text-secondary">расширенная гарантия на ключевые узлы проекта</p>
            </Card>
          </div>
        </div>

        <div className="glass-panel warm-ring relative rounded-[36px] p-6">
          <div className="pointer-events-none absolute -right-10 top-10 h-28 w-28 rounded-[2rem] border border-[#d7b38a]/40 opacity-55 animate-drift" />
          <div className="surface-gradient rounded-[30px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">curated experience</p>
                <h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Подберём сценарий под ваш дом, бюджет и стиль</h2>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border/70 bg-[color:color-mix(in_srgb,var(--panel-bg-main)_88%,transparent)] text-brand shadow-card">
                <WandSparkles className="h-7 w-7" />
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Вместо безличного прайса мы собираем несколько уровней решения: от спокойной базовой модели
              до выразительной интерьерной лестницы с индивидуальной отделкой.
            </p>

            <div className="mt-6 grid gap-4">
              {tiers.map((tier) => (
                <div key={tier.title} className="rounded-[24px] border border-border/70 bg-[color:color-mix(in_srgb,var(--panel-bg-main)_78%,transparent)] p-4 shadow-card">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{tier.title}</h3>
                    <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand">{tier.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{tier.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-border/70 bg-[color:color-mix(in_srgb,var(--panel-bg-main)_72%,transparent)] p-4">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-brand" />
                <p className="font-semibold text-text-primary">Онлайн-консьерж проекта</p>
              </div>
              <p className="mt-2 text-sm text-text-secondary">Через чат можно передать бриф, попросить подбор материала, обсудить замер и заранее собрать все ключевые вводные.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-6 grid gap-6 lg:grid-cols-[0.72fr,1.28fr]">
          <div>
            <h2 className="page-title">Почему выбирают Staircase Pro</h2>
            <p className="page-lead">
              Понятный маршрут, аккуратная подача проектов и быстрый выход на расчёт помогают перейти от интереса к предметному обсуждению без лишних шагов.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="texture-panel">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-light">
                    <Icon className="h-7 w-7 text-brand" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="page-title">Пакеты реализации</h2>
            <p className="page-lead mt-2">
              Несколько уровней исполнения помогают сразу соотнести пожелания по интерьеру, состав работ и ориентир по бюджету.
            </p>
          </div>
          <Link to="/contacts"><Button variant="outline">Вызвать замерщика</Button></Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {packagePlans.map((plan) => (
            <Card key={plan.id} className="texture-panel flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{plan.subtitle}</p>
                  <h3 className="mt-3 text-2xl font-bold">{plan.title}</h3>
                </div>
                <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand">{plan.price}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{plan.summary}</p>
              <div className="mt-5 space-y-3 text-sm text-text-secondary">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-brand" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-4">
                <Link to="/calculator" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Подобрать конфигурацию <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[0.9fr,1.1fr]">
        <Card className="texture-panel">
          <div className="eyebrow">доверие и сервис</div>
          <h2 className="mt-5 font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Почему клиенту проще принять решение именно здесь</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-text-secondary">
            {trustReasons.map((reason) => (
              <div key={reason} className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-4 w-4 flex-none text-brand" />
                <p>{reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {showcaseCases.map((item) => (
            <Card key={item.title} className="texture-panel flex h-full flex-col">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{item.duration}</p>
              <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{item.result}</p>
              <div className="mt-5 rounded-[22px] bg-brand-light p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Бюджет</p>
                <p className="mt-2 text-lg font-bold text-text-primary">{item.budget}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[0.95fr,1.05fr]">
        <Card className="texture-panel">
          <div className="eyebrow">клиентский маршрут</div>
          <h2 className="mt-5 font-['Cormorant_Garamond'] text-4xl font-bold leading-none">От первого запроса до согласованного проекта</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-text-secondary">
            <p>Изучите кейсы, соберите конфигурацию в калькуляторе, передайте вводные через чат и выберите удобный формат дальнейшего общения.</p>
            <p>Так проще сравнить варианты, понять уровень бюджета и быстрее перейти к замеру, согласованию материалов и запуску в работу.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/calculator"><Button>Открыть калькулятор</Button></Link>
            <Link to="/contacts"><Button variant="outline">Связаться с менеджером</Button></Link>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="texture-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">UX-фишка</p>
            <h3 className="mt-3 text-xl font-bold">Диалоговый чат вместо пустой формы</h3>
            <p className="mt-2 text-sm text-text-secondary">Через чат удобно передать вводные по проекту, задать вопрос по материалам и быстро выйти на содержательный разговор с менеджером.</p>
          </Card>
          <Card className="texture-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Визуал</p>
            <h3 className="mt-3 text-xl font-bold">Кремовая палитра и интерьерное настроение</h3>
            <p className="mt-2 text-sm text-text-secondary">Палитра и фактуры перекликаются с деревом, металлом, стеклом и тёплым жилым пространством.</p>
          </Card>
          <Card className="texture-panel sm:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Релизная подача</p>
            <h3 className="mt-3 text-xl font-bold">Цельный маршрут от знакомства до заявки</h3>
            <p className="mt-2 text-sm text-text-secondary">Понятная структура, сильная витрина и аккуратная подача помогают быстрее перейти от интереса к реальному обсуждению проекта.</p>
          </Card>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="page-title">{featuredItems.length > 0 ? 'Избранные кейсы' : 'Последние работы'}</h2>
            <p className="page-lead mt-2">
              {featuredItems.length > 0
                ? 'Ключевые проекты студии, по которым удобно оценить уровень исполнения, материалы и характер решений.'
                : 'Подборка актуальных проектов для знакомства с подходом студии, диапазоном решений и уровнем отделки.'}
            </p>
          </div>
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">Смотреть все <ArrowRight className="h-4 w-4" /></Link>
        </div>

        {galleryLoading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryPreview.map((item) => (
              <Card key={item.id} className="overflow-hidden p-0">
                <div className="relative">
                  <img src={item.image_url} alt={item.title} className="h-64 w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d2819]/55 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    {item.price && <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">от {Number(item.price).toLocaleString('ru-RU')} ₸</span>}
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{stripGalleryEmbeddedMeta(item.description || '') || 'Индивидуальный проект лестницы с подбором конструкции и отделки под интерьер.'}</p>
                  {item.slug && (
                    <Link to={`/gallery/${item.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                      Открыть кейс <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="py-10">
        <div className="mb-6 flex items-center gap-3">
          <PaintBucket className="h-6 w-6 text-brand" />
          <h2 className="page-title">Как проходит работа над проектом</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {process.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="texture-panel">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-light"><Icon className="h-7 w-7 text-brand" /></div>
                  <span className="text-2xl font-extrabold text-brand/45">0{index + 1}</span>
                </div>
                <h3 className="mt-4 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{step.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="py-10">
        <h2 className="page-title mb-6">Отзывы клиентов</h2>
        {reviewsLoading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {reviews.map((review) => (
              <Card key={review.id} className="texture-panel">
                <div className="text-lg text-brand">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <h3 className="mt-3 text-lg font-bold">{review.author_name}</h3>
                <p className="mt-1 text-xs text-text-secondary">{new Date(review.created_at).toLocaleDateString('ru-RU')}</p>
                <p className="mt-3 text-sm text-text-secondary">{review.text}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[1.05fr,0.95fr]">
        <Card className="texture-panel">
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Частые вопросы перед заказом</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-[24px] bg-brand-light p-5">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>

        <section className="surface-gradient warm-ring rounded-[34px] px-8 py-10">
          <div className="eyebrow">финальный шаг</div>
          <h2 className="mt-5 font-['Cormorant_Garamond'] text-5xl font-bold leading-none">Готовы обсудить будущую лестницу?</h2>
          <p className="mt-4 max-w-2xl text-text-secondary">Соберите параметры в калькуляторе, откройте чат или оставьте заявку через контакты. Мы поможем подобрать решение и подготовим понятный следующий шаг по проекту.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link to="/calculator"><Button>Перейти в калькулятор</Button></Link>
            <Link to="/contacts"><Button variant="outline">Открыть контакты</Button></Link>
          </div>
        </section>
      </section>
    </PageWrapper>
  );
}
