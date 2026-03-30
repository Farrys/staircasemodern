import { Award, BadgeCheck, Hammer, ShieldCheck, Star, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGallery } from '@/hooks/useGallery';
import { Spinner } from '@/components/ui/Spinner';
import { packagePlans, showcaseCases, stripGalleryEmbeddedMeta, trustReasons } from '@/lib/catalogContent';

const metrics = [
  ['15+', 'лет в изготовлении лестниц'],
  ['300+', 'реализованных проектов'],
  ['5 лет', 'расширенная гарантия'],
  ['24/7', 'сопровождение клиента в чате'],
];

const strengths = [
  { icon: Hammer, title: 'Индивидуальное производство', text: 'Каждая лестница рассчитывается под конкретную архитектуру и повседневный сценарий жизни семьи.' },
  { icon: ShieldCheck, title: 'Безопасность и ресурс', text: 'Учитываются нагрузка, высота подъёма, ширина марша и ощущение комфорта при ежедневном использовании.' },
  { icon: Award, title: 'Внимание к отделке', text: 'Материалы, цвет, фактура и ограждение подбираются так, чтобы лестница выглядела частью интерьера, а не отдельным объектом.' },
  { icon: Users, title: 'Понятный процесс', text: 'Клиент видит этапы, сроки и состав сметы без перегруза техническими деталями и без потери контроля.' },
];

export default function PortfolioPage() {
  const { items, loading } = useGallery(3);
  const featuredItems = items.filter((item) => item.is_featured).slice(0, 3);
  const portfolioPreview = (featuredItems.length > 0 ? featuredItems : items).slice(0, 3);

  return (
    <PageWrapper>
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div>
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            портрет мастера и студии
          </div>
          <h1 className="page-title mt-5">Портфолио мастера, подход к работе и проекты, по которым выбирают Staircase Pro</h1>
          <p className="page-lead">
            Здесь собраны профессиональный подход, цифры доверия и проекты, по которым удобно оценить уровень студии, характер решений и качество исполнения.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/gallery"><Button>Смотреть все работы</Button></Link>
            <Link to="/calculator"><Button variant="outline">Рассчитать проект</Button></Link>
          </div>
        </div>

        <div className="glass-panel warm-ring overflow-hidden rounded-[34px] p-4">
          <div className="grid gap-4 md:grid-cols-[0.82fr,1fr]">
            <img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80"
              alt="Мастер по изготовлению лестниц"
              className="h-full min-h-[360px] w-full rounded-[28px] object-cover"
            />
            <div className="surface-gradient rounded-[28px] p-6">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-brand"
                style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 72%, white 28%)' }}
              >
                <BadgeCheck className="h-4 w-4" /> Проверенный практический опыт
              </div>
              <h2 className="mt-5 font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Александр Мельников</h2>
              <p className="mt-2 text-sm font-medium text-text-secondary">Мастер по проектированию и изготовлению лестниц под ключ</p>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                Специализируется на современных, комбинированных и интерьерно-выразительных лестницах для частных домов,
                двухсветных пространств и объектов, где важны геометрия, долговечность и чистая визуальная подача.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['дерево', 'металл', 'стекло', 'подсветка', '3D-концепция'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-text-secondary"
                    style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 84%, white 16%)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}
                <span className="ml-2 text-sm font-semibold text-text-primary">Высокая оценка клиентов</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([value, label]) => (
          <Card key={label} className="texture-panel p-5">
            <div className="text-3xl font-extrabold tracking-tight text-brand">{value}</div>
            <div className="mt-2 text-sm text-text-secondary">{label}</div>
          </Card>
        ))}
      </section>

      <section className="mt-14">
        <div className="mb-6 max-w-3xl">
          <h2 className="page-title text-3xl">Подход мастера к работе</h2>
          <p className="page-lead text-base sm:text-lg">Здесь собран профессиональный профиль студии: кто ведёт проект, за счёт чего достигается качество и почему клиенту спокойнее проходить весь маршрут с одним подрядчиком.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {strengths.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="texture-panel">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-light"><Icon className="h-6 w-6 text-brand" /></div>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1fr,1fr]">
        <Card className="texture-panel">
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Что обычно входит в работу</h2>
          <div className="mt-5 space-y-3 text-sm leading-7 text-text-secondary">
            <p>• первичная консультация по типу лестницы, материалам и бюджету;</p>
            <p>• выезд на замер и уточнение геометрии объекта;</p>
            <p>• подбор модели, ограждения, отделки и визуального сценария;</p>
            <p>• предварительная смета и согласование технического решения;</p>
            <p>• производство, монтаж и контроль качества после установки.</p>
          </div>
        </Card>
        <Card className="texture-panel">
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Кому этот подход подходит лучше всего</h2>
          <div className="mt-5 space-y-3 text-sm leading-7 text-text-secondary">
            <p>• владельцам частных домов и коттеджей;</p>
            <p>• заказчикам, которым нужна современная лестница без визуальной тяжести;</p>
            <p>• дизайнерам и архитекторам, которым важна аккуратная интеграция конструкции в интерьер;</p>
            <p>• клиентам, которым нужен прозрачный процесс от замера до монтажа.</p>
          </div>
        </Card>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <Card className="texture-panel">
          <div className="eyebrow">что усиливает доверие</div>
          <h2 className="mt-5 font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Не только мастер, но и понятная система работы</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-text-secondary">
            {trustReasons.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <BadgeCheck className="mt-1 h-4 w-4 flex-none text-brand" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {packagePlans.map((plan) => (
            <Card key={plan.id} className="texture-panel flex h-full flex-col">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{plan.subtitle}</p>
              <h3 className="mt-3 text-xl font-bold">{plan.title}</h3>
              <p className="mt-2 text-sm font-semibold text-brand">{plan.price}</p>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{plan.summary}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="page-title text-3xl">Типовые кейсы для обсуждения</h2>
            <p className="page-lead text-base sm:text-lg">Подборка ориентиров по формату проекта, срокам и бюджету для первого предметного обсуждения.</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {showcaseCases.map((item) => (
            <Card key={item.title} className="texture-panel">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{item.duration}</p>
              <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{item.result}</p>
              <div className="mt-5 rounded-[22px] bg-brand-light p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Ориентировочный бюджет</p>
                <p className="mt-2 text-lg font-bold text-text-primary">{item.budget}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="page-title text-3xl">{featuredItems.length > 0 ? 'Избранные кейсы' : 'Несколько работ из галереи'}</h2>
            <p className="page-lead text-base sm:text-lg">
              {featuredItems.length > 0
                ? 'Здесь собраны проекты, которые лучше всего показывают характер студии, уровень отделки и качество исполнения.'
                : 'Подборка актуальных примеров, которые помогают увидеть диапазон решений по конструкции, форме и материалам.'}
            </p>
          </div>
          <Link to="/gallery" className="hidden items-center gap-2 text-sm font-semibold text-brand md:inline-flex">Все работы <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portfolioPreview.map((item) => (
              <Card key={item.id} className="overflow-hidden p-0">
                <img src={item.image_url} alt={item.title} className="h-64 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold">{item.title}</h3>
                    {item.price && <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">от {Number(item.price).toLocaleString('ru-RU')} ₸</span>}
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{stripGalleryEmbeddedMeta(item.description || '') || 'Индивидуальный проект лестницы.'}</p>
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
    </PageWrapper>
  );
}
