import { useEffect, useState } from 'react';
import { ArrowRight, Layers3, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types';
import { materialAxis, modelAxis, packagePlans, shapeAxis } from '@/lib/catalogContent';

const serviceHighlights = [
  'Полный цикл: от брифа и замера до чистого монтажа на объекте',
  'Подбор конструкции под интерьер, а не просто под размер проёма',
  'Спокойная коммуникация: клиент понимает смету, сроки и этапы',
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('services').select('*').eq('is_active', true).order('name');
      setServices(data ?? []);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <PageWrapper>
      <section className="grid gap-8 lg:grid-cols-[1.02fr,0.98fr]">
        <div>
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            услуги и этапы работы
          </div>
          <h1 className="page-title mt-5">Полный цикл работ по лестницам: от архитектурной идеи до монтажа</h1>
          <p className="page-lead">
            Проектируем, подбираем материалы, рассчитываем бюджет, изготавливаем и сопровождаем монтаж как единый согласованный процесс.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/calculator"><Button>Получить расчёт</Button></Link>
            <Link to="/contacts"><Button variant="outline">Обсудить проект</Button></Link>
          </div>
        </div>

        <Card className="texture-panel">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-light">
              <Layers3 className="h-7 w-7 text-brand" />
            </div>
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Что получает заказчик</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-text-secondary">
                {serviceHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-4 w-4 flex-none text-brand" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-12">
        <div className="mb-8 grid gap-6 xl:grid-cols-4">
          <Card className="texture-panel xl:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Каталог решений</p>
                <h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Подбор по конструкции, форме и материалу</h2>
              </div>
              <Link to="/gallery"><Button variant="outline">Открыть кейсы</Button></Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold">По конструкции</h3>
                <div className="mt-4 space-y-3">
                  {modelAxis.map((item) => (
                    <div key={item.value} className="rounded-[22px] bg-brand-light p-4">
                      <p className="font-semibold text-text-primary">{item.label}</p>
                      <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold">По форме</h3>
                <div className="mt-4 space-y-3">
                  {shapeAxis.map((item) => (
                    <div key={item.value} className="rounded-[22px] bg-brand-light p-4">
                      <p className="font-semibold text-text-primary">{item.label}</p>
                      <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="texture-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">По материалу</p>
            <div className="mt-4 space-y-3">
              {materialAxis.map((item) => (
                <div key={item.value} className="rounded-[22px] bg-brand-light p-4">
                  <p className="font-semibold text-text-primary">{item.label}</p>
                  <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="texture-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Вызов замерщика</p>
            <h3 className="mt-4 text-2xl font-bold">Если объект уже готов, можно сразу перейти к замеру</h3>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Оставьте контакты, адрес и удобное время - менеджер подтвердит выезд, а параметры замера потом попадут в заказ без повторного заполнения.
            </p>
            <div className="mt-6">
              <Link to="/contacts"><Button fullWidth>Оставить заявку на замер</Button></Link>
            </div>
          </Card>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="page-title text-3xl">Актуальные услуги</h2>
            <p className="page-lead mt-2">Основные направления работы студии: от проектирования и подбора решения до монтажа на объекте.</p>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : services.length === 0 ? (
          <EmptyState icon={Wrench} title="Активные услуги пока не добавлены" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Card key={service.id} className="texture-panel flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-light text-brand">
                    <span className="text-sm font-bold">0{index + 1}</span>
                  </div>
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand">
                    {service.price_from ? `от ${Number(service.price_from).toLocaleString('ru-RU')} ₸` : 'по запросу'}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold">{service.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-text-secondary">{service.description || 'Услуга рассчитывается индивидуально под параметры объекта и выбранные материалы.'}</p>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-semibold text-brand">Индивидуальный подход</span>
                  <ArrowRight className="h-4 w-4 text-brand" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="page-title text-3xl">Уровни реализации</h2>
            <p className="page-lead mt-2">Несколько уровней исполнения помогают быстрее подобрать решение под интерьер, бюджет и желаемый визуальный эффект.</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {packagePlans.map((plan) => (
            <Card key={plan.id} className="texture-panel flex h-full flex-col">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{plan.subtitle}</p>
              <h3 className="mt-3 text-2xl font-bold">{plan.title}</h3>
              <p className="mt-2 text-sm font-semibold text-brand">{plan.price}</p>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{plan.summary}</p>
              <div className="mt-5 space-y-2 text-sm text-text-secondary">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-4 w-4 flex-none text-brand" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
