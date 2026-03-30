import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Eye, ImageOff, Sparkles } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGallery } from '@/hooks/useGallery';
import { inferCaseMeta, materialAxis, modelAxis, railingAxis, shapeAxis, showcaseCases, stripGalleryEmbeddedMeta } from '@/lib/catalogContent';
import { MATERIAL_LABELS, MODEL_LABELS, RAILING_LABELS, SHAPE_LABELS } from '@/lib/calculator';
import type { GalleryItem, Material, StairModel, StairShape } from '@/types';

type MaterialFilter = 'all' | Material;
type ModelFilter = 'all' | StairModel;
type ShapeFilter = 'all' | StairShape;

export default function GalleryPage() {
  const { items, loading } = useGallery();
  const [materialFilter, setMaterialFilter] = useState<MaterialFilter>('all');
  const [modelFilter, setModelFilter] = useState<ModelFilter>('all');
  const [shapeFilter, setShapeFilter] = useState<ShapeFilter>('all');
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const enrichedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        meta: inferCaseMeta(item.title, item.description ?? '', item.category, {
          stair_model: item.stair_model ?? undefined,
          stair_shape: item.stair_shape ?? undefined,
          railing_type: item.railing_type ?? undefined,
          finish_type: item.finish_type ?? undefined,
        }),
      })),
    [items],
  );

  const filteredItems = useMemo(
    () =>
      enrichedItems.filter((item) => {
        const materialOk = materialFilter === 'all' || item.category === materialFilter;
        const modelOk = modelFilter === 'all' || item.meta.stair_model === modelFilter;
        const shapeOk = shapeFilter === 'all' || item.meta.stair_shape === shapeFilter;
        return materialOk && modelOk && shapeOk;
      }),
    [enrichedItems, materialFilter, modelFilter, shapeFilter],
  );

  const selectedMeta = selected
    ? inferCaseMeta(selected.title, selected.description ?? '', selected.category, {
        stair_model: selected.stair_model ?? undefined,
        stair_shape: selected.stair_shape ?? undefined,
        railing_type: selected.railing_type ?? undefined,
        finish_type: selected.finish_type ?? undefined,
      })
    : null;

  return (
    <PageWrapper>
      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div>
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            живая витрина проектов
          </div>
          <h1 className="page-title mt-5">Галерея выполненных лестниц с многоосевым фильтром</h1>
          <p className="page-lead">
            Подборка кейсов, по которой удобно сравнить материалы, конструктив и форму лестницы ещё до личной консультации.
          </p>
        </div>

        <Card className="texture-panel">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Быстрый подбор сценария</h2>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                Используйте фильтры, чтобы быстро показать клиенту нужный визуальный сценарий: материал, конструкцию и форму лестницы.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant={materialFilter === 'all' ? 'primary' : 'outline'} onClick={() => setMaterialFilter('all')}>
                  Все материалы
                </Button>
                {materialAxis.map((item) => (
                  <Button key={item.value} variant={materialFilter === item.value ? 'primary' : 'outline'} onClick={() => setMaterialFilter(item.value)}>
                    {item.label}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant={modelFilter === 'all' ? 'primary' : 'outline'} onClick={() => setModelFilter('all')}>
                  Все конструкции
                </Button>
                {modelAxis.map((item) => (
                  <Button key={item.value} variant={modelFilter === item.value ? 'primary' : 'outline'} onClick={() => setModelFilter(item.value)}>
                    {item.label}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant={shapeFilter === 'all' ? 'primary' : 'outline'} onClick={() => setShapeFilter('all')}>
                  Все формы
                </Button>
                {shapeAxis.map((item) => (
                  <Button key={item.value} variant={shapeFilter === item.value ? 'primary' : 'outline'} onClick={() => setShapeFilter(item.value)}>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="page-title text-3xl">Презентационные кейсы</h2>
            <p className="page-lead mt-2">Подборка ориентиров по срокам, бюджету и характеру решения для первого обсуждения проекта.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {railingAxis.slice(0, 3).map((item) => (
              <span key={item.value} className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {showcaseCases.map((item) => (
            <Card key={item.title} className="texture-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{item.duration}</p>
                  <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                </div>
                <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand">{item.budget}</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-text-secondary">
                <p><span className="font-semibold text-text-primary">Конструкция:</span> {MODEL_LABELS[item.stair_model]}</p>
                <p><span className="font-semibold text-text-primary">Форма:</span> {SHAPE_LABELS[item.stair_shape]}</p>
                <p><span className="font-semibold text-text-primary">Ограждение:</span> {RAILING_LABELS[item.railing_type]}</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{item.result}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        {loading ? (
          <Spinner />
        ) : filteredItems.length === 0 ? (
          <Card className="texture-panel flex flex-col items-center justify-center gap-3 py-16 text-center">
            <ImageOff className="h-12 w-12 text-text-secondary" />
            <p className="font-semibold">По выбранным параметрам работ пока нет</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group cursor-pointer overflow-hidden p-0" onClick={() => setSelected(item)}>
                <div className="relative overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d1e14]/70 via-transparent to-transparent opacity-90" />
                  <div
                    className="absolute left-4 top-4 rounded-full border border-border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand"
                    style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 52%, white 48%)' }}
                  >
                    {MATERIAL_LABELS[item.category]}
                  </div>
                  <div
                    className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-border text-brand shadow-card"
                    style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 52%, white 48%)' }}
                  >
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <ArrowUpRight className="h-4 w-4 text-brand" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                    <span>{MODEL_LABELS[item.meta.stair_model]}</span>
                    <span>•</span>
                    <span>{SHAPE_LABELS[item.meta.stair_shape]}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">{stripGalleryEmbeddedMeta(item.description || '') || 'Описание проекта будет доступно позже.'}</p>
                  {item.slug && (
                    <Link
                      to={`/gallery/${item.slug}`}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand"
                    >
                      Страница кейса <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Modal open={Boolean(selected)} title={selected?.title ?? ''} onClose={() => setSelected(null)}>
        {selected && selectedMeta && (
          <div className="space-y-5">
            <img src={selected.image_url} alt={selected.title} className="max-h-[60vh] w-full rounded-[24px] object-cover" />
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand">{MATERIAL_LABELS[selected.category]}</span>
              <span className="text-sm font-semibold text-brand">{selected.price ? `${Number(selected.price).toLocaleString('ru-RU')} ₸` : 'Цена по запросу'}</span>
            </div>
            <div className="grid gap-2 rounded-[24px] bg-brand-light p-4 text-sm text-text-primary md:grid-cols-3">
              <p><span className="font-semibold">Конструкция:</span> {MODEL_LABELS[selectedMeta.stair_model]}</p>
              <p><span className="font-semibold">Форма:</span> {SHAPE_LABELS[selectedMeta.stair_shape]}</p>
              <p><span className="font-semibold">Ограждение:</span> {RAILING_LABELS[selectedMeta.railing_type]}</p>
            </div>
            <p className="text-text-secondary">{stripGalleryEmbeddedMeta(selected.description || '') || 'Описание отсутствует'}</p>
            {selected.slug && (
              <Link to={`/gallery/${selected.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                Открыть отдельную страницу кейса <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
