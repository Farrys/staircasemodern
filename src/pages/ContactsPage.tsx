import { useState } from 'react';
import toast from 'react-hot-toast';
import { Clock4, Headset, Mail, MapPin, MessageCircleMore, Phone, Sparkles } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/lib/siteConfig';
import { isEmail, minLength } from '@/lib/validators';
import { packagePlans, trustReasons } from '@/lib/catalogContent';

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', text: '' });
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!minLength(form.name, 2) || !isEmail(form.email) || !minLength(form.text, 5)) {
      toast.error('Проверьте корректность заполнения формы');
      return;
    }

    setSending(true);
    const [messageInsert, functionInvoke] = await Promise.allSettled([
      supabase.from('messages').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        text: form.text,
      }),
      supabase.functions.invoke('contact-message', {
        body: form,
      }),
    ]);
    setSending(false);

    const insertError =
      messageInsert.status === 'fulfilled' ? messageInsert.value.error : new Error('messages insert failed');
    const functionError =
      functionInvoke.status === 'fulfilled' ? functionInvoke.value.error : new Error('contact function failed');

    if (insertError && functionError) {
      return toast.error(insertError.message || functionError.message || 'Не удалось отправить заявку');
    }

    toast.success('Сообщение успешно отправлено');
    setForm({ name: '', email: '', phone: '', text: '' });
  };

  return (
    <PageWrapper>
      <section className="grid gap-8 lg:grid-cols-[1.02fr,0.98fr]">
        <div>
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            контакты и поддержка
          </div>
          <h1 className="page-title mt-5">Свяжитесь со студией удобным способом: форма, чат или прямой контакт</h1>
          <p className="page-lead">
            Оставьте заявку через форму, задайте вопрос в чате или свяжитесь со студией напрямую по телефону и почте.
          </p>
        </div>

        <Card className="texture-panel">
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold leading-none">Как мы обычно начинаем диалог</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-text-secondary">
              <p>1. Вы оставляете параметры объекта или короткий запрос.</p>
              <p>2. Мы быстро понимаем, нужен ли звонок, замер или предварительный расчёт.</p>
            <p>3. После этого согласовываем удобный следующий шаг: консультацию, замер или подготовку сметы.</p>
            </div>
        </Card>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.92fr,1.08fr]">
        <div className="space-y-6">
          <Card className="texture-panel">
            <h2 className="text-xl font-bold">Контактные данные</h2>
            <div className="mt-6 space-y-5 text-sm text-text-secondary">
              <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-brand" /> {siteConfig.contacts.phoneDisplay}</p>
              <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-brand" /> {siteConfig.contacts.email}</p>
              <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-brand" /> {siteConfig.contacts.address}</p>
              <p className="flex items-center gap-3"><Clock4 className="h-5 w-5 text-brand" /> {siteConfig.contacts.weekdayHours}, {siteConfig.contacts.chatHours.toLowerCase()}</p>
            </div>
          </Card>

          <Card className="texture-panel">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-brand-light p-3"><Headset className="h-6 w-6 text-brand" /></div>
              <div>
                <h2 className="text-xl font-bold">Онлайн-чат для первичного брифа</h2>
                <p className="mt-2 text-sm text-text-secondary">В чате можно быстро передать вводные по проекту, выбрать тему обращения и оставить контакты для продолжения диалога.</p>
                <p className="mt-3 text-sm font-medium text-brand">Это удобный способ начать разговор, если вопрос ещё не оформился в полноценную заявку.</p>
              </div>
            </div>
          </Card>

          <Card className="texture-panel">
            <h2 className="text-xl font-bold">Почему так удобнее начать диалог</h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-text-secondary">
              {trustReasons.slice(0, 3).map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-4 w-4 flex-none text-brand" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="texture-panel">
          <div className="flex items-center gap-3">
            <MessageCircleMore className="h-6 w-6 text-brand" />
            <h2 className="text-xl font-bold">Форма обращения</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-text-secondary">Форма подойдёт, если вы хотите подробно описать задачу, сроки, материалы и ожидания по проекту.</p>
          <div className="mt-6 space-y-4">
            <Input label="Имя" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
              <Input label="Телефон" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>
            <Textarea label="Сообщение" value={form.text} onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))} className="min-h-40" />
            <Button fullWidth loading={sending} onClick={() => void submit()}>Отправить заявку</Button>
          </div>
        </Card>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="page-title text-3xl">Если нужен быстрый ориентир по уровню проекта</h2>
            <p className="page-lead mt-2">Перед отправкой заявки можно сразу сориентироваться, к какому уровню исполнения ближе ваш объект.</p>
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
                  <p key={feature}>• {feature}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
