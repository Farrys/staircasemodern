import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGallery } from '@/hooks/useGallery';
import { inferCaseMeta, showcaseCases, stripGalleryEmbeddedMeta } from '@/lib/catalogContent';
import { FINISH_LABELS, MATERIAL_LABELS, MODEL_LABELS, RAILING_LABELS, SHAPE_LABELS } from '@/lib/calculator';

export default function GalleryCasePage() {
  const { slug } = useParams<{ slug: string }>();
  const { items, loading } = useGallery();

  const item = useMemo(
    () => items.find((entry) => entry.slug === slug),
    [items, slug],
  );

  const meta = item
    ? inferCaseMeta(item.title, item.description ?? '', item.category, {
        stair_model: item.stair_model ?? undefined,
        stair_shape: item.stair_shape ?? undefined,
        railing_type: item.railing_type ?? undefined,
        finish_type: item.finish_type ?? undefined,
      })
    : null;

  const related = useMemo(
    () => items.filter((entry) => entry.id !== item?.id).slice(0, 3),
    [items, item?.id],
  );

  if (!loading && !item) {
    return <Navigate to="/gallery" replace />;
  }

  return (
    <PageWrapper>
      {loading || !item || !meta ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <section className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
            <div>
              <div className="eyebrow">
                <Sparkles className="h-4 w-4" />
                кейс лестничной студии
              </div>
              <h1 className="page-title mt-5">{item.title}</h1>
              <p className="page-lead mt-4">
                {stripGalleryEmbeddedMeta(item.description || '') || 'Индивидуальный проект лестницы с подбором конструкции, ограждений и отделки под интерьер.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand">
                  {MATERIAL_LABELS[item.category]}
                </span>
                <span className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-primary">
                  {item.price ? `от ${Number(item.price).toLocaleString('ru-RU')} ₸` : 'Цена по запросу'}
                </span>
                {item.is_featured && (
                  <span className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-primary">
                    Избранный кейс
                  </span>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contacts"><Button>Обсудить похожий проект</Button></Link>
                <Link to="/gallery"><Button variant="outline"><ArrowLeft className="h-4 w-4" />Назад в галерею</Button></Link>
              </div>
            </div>

            <Card className="texture-panel">
              <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Паспорт решения</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-brand-light p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Конструкция</p>
                  <p className="mt-2 text-lg font-bold text-text-primary">{MODEL_LABELS[meta.stair_model]}</p>
                </div>
                <div className="rounded-[24px] bg-brand-light p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Форма</p>
                  <p className="mt-2 text-lg font-bold text-text-primary">{SHAPE_LABELS[meta.stair_shape]}</p>
                </div>
                <div className="rounded-[24px] bg-brand-light p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Ограждение</p>
                  <p className="mt-2 text-lg font-bold text-text-primary">{RAILING_LABELS[meta.railing_type]}</p>
                </div>
                <div className="rounded-[24px] bg-brand-light p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Отделка</p>
                  <p className="mt-2 text-lg font-bold text-text-primary">{FINISH_LABELS[meta.finish_type]}</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm leading-7 text-text-secondary">
                <p>Кейс можно использовать как ориентир при обсуждении с клиентом схожей архитектуры, бюджета и визуального сценария лестницы.</p>
                <p>Именно такие карточки усиливают дипломный проект: они показывают не только фото, но и структуру решения, пригодную для подбора и продажи.</p>
              </div>
            </Card>
          </section>

          <section className="mt-10">
            <div className="glass-panel overflow-hidden rounded-[36px] p-4">
              <img src={item.image_url} alt={item.title} className="h-[380px] w-full rounded-[28px] object-cover md:h-[520px]" />
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            {showcaseCases.map((caseItem) => (
              <Card key={caseItem.title} className="texture-panel">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{caseItem.duration}</p>
                    <h3 className="mt-3 text-xl font-bold">{caseItem.title}</h3>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-brand" />
                </div>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{caseItem.result}</p>
                <div className="mt-4 rounded-[22px] bg-brand-light p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Ориентир по бюджету</p>
                  <p className="mt-2 text-lg font-bold text-text-primary">{caseItem.budget}</p>
                </div>
              </Card>
            ))}
          </section>

          {related.length > 0 && (
            <section className="mt-10">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="page-title text-3xl">Похожие работы</h2>
                  <p className="page-lead mt-2">Ещё несколько кейсов, которые помогут продолжить обсуждение с клиентом.</p>
                </div>
                <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Вся галерея <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {related.map((entry) => (
                  <Card key={entry.id} className="overflow-hidden p-0">
                    <img src={entry.image_url} alt={entry.title} className="h-64 w-full object-cover" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-bold">{entry.title}</h3>
                        {entry.price && <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">от {Number(entry.price).toLocaleString('ru-RU')} ₸</span>}
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">{stripGalleryEmbeddedMeta(entry.description || '') || 'Индивидуальный проект лестницы.'}</p>
                      {entry.slug && (
                        <Link to={`/gallery/${entry.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                          Открыть кейс <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </PageWrapper>
  );
}
