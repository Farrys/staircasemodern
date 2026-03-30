import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  calculatePrice,
  DEFAULT_CALCULATOR_PARAMS,
  FINISH_LABELS,
  getCalculatorSummary,
  MATERIAL_LABELS,
  MODEL_LABELS,
  RAILING_LABELS,
  SHAPE_LABELS,
} from '@/lib/calculator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { CalculatorParams, CalculatorResult } from '@/types';
import { isPhone, minLength } from '@/lib/validators';

interface OrderState {
  params?: CalculatorParams;
  result?: CalculatorResult;
}

export default function NewOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = (location.state as OrderState | null) ?? {};
  const params = { ...DEFAULT_CALCULATOR_PARAMS, ...(state.params ?? {}) };
  const result = useMemo(() => state.result ?? calculatePrice(params), [params, state.result]);
  const [form, setForm] = useState({
    full_name: user?.full_name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    address: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!user) return;
    if (!minLength(form.full_name, 2) || !isPhone(form.phone) || !minLength(form.address, 5)) {
      toast.error('Заполните ФИО, телефон и адрес объекта');
      return;
    }

    const technicalConfig = [
      `Конфигурация калькулятора:`,
      `Материал: ${MATERIAL_LABELS[params.material]}`,
      `Модель: ${MODEL_LABELS[params.stair_model ?? 'classic']}`,
      `Форма: ${SHAPE_LABELS[params.stair_shape ?? 'straight']}`,
      `Ограждение: ${RAILING_LABELS[params.railing_type ?? 'wooden']}`,
      `Отделка: ${FINISH_LABELS[params.finish_type ?? 'basic']}`,
      `Ступеней: ${params.steps_count}`,
      `Подсветка: ${params.lighting ? 'Да' : 'Нет'}`,
      `Умное освещение: ${params.smart_light ? 'Да' : 'Нет'}`,
      `Расширенная гарантия: ${params.extended_warranty ? 'Да' : 'Нет'}`,
      `Нужен замерщик: ${params.needs_measurement === false ? 'Нет' : 'Да'}`,
      `Этажность: ${params.installation_floor ?? 2}`,
      form.notes ? `Комментарий клиента: ${form.notes}` : null,
    ].filter(Boolean).join('\n');

    setSaving(true);
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        notes: technicalConfig,
        total_price: result.total,
      })
      .select()
      .single();

    if (orderError || !order) {
      setSaving(false);
      return toast.error(orderError?.message ?? 'Не удалось создать заказ');
    }

    const { error: paramsError } = await supabase.from('order_params').insert({
      order_id: order.id,
      material: params.material,
      steps_count: params.steps_count,
      lighting: params.lighting,
      smart_light: params.smart_light,
      extended_warranty: params.extended_warranty,
      base_price: result.base_price,
    });

    setSaving(false);
    if (paramsError) return toast.error(paramsError.message);
    toast.success('Заказ успешно оформлен');
    navigate('/orders');
  };

  return (
    <PageWrapper>
      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <Card className="texture-panel h-fit">
          <h2 className="text-xl font-bold">Сводка заказа</h2>
          <div className="mt-5 space-y-3 text-sm">
            <p><span className="font-semibold">Материал:</span> {MATERIAL_LABELS[params.material]}</p>
            <p><span className="font-semibold">Модель:</span> {MODEL_LABELS[params.stair_model ?? 'classic']}</p>
            <p><span className="font-semibold">Форма:</span> {SHAPE_LABELS[params.stair_shape ?? 'straight']}</p>
            <p><span className="font-semibold">Ограждение:</span> {RAILING_LABELS[params.railing_type ?? 'wooden']}</p>
            <p><span className="font-semibold">Отделка:</span> {FINISH_LABELS[params.finish_type ?? 'basic']}</p>
            <p><span className="font-semibold">Количество ступеней:</span> {params.steps_count}</p>
            <p><span className="font-semibold">Подсветка:</span> {params.lighting ? 'Да' : 'Нет'}</p>
            <p><span className="font-semibold">Умное освещение:</span> {params.smart_light ? 'Да' : 'Нет'}</p>
            <p><span className="font-semibold">Расширенная гарантия:</span> {params.extended_warranty ? 'Да' : 'Нет'}</p>
          </div>
          <div className="mt-6 rounded-[24px] bg-brand-light p-4">
            <p className="text-sm text-text-secondary">Итоговая стоимость</p>
            <p className="mt-2 text-2xl font-bold text-brand">{result.total.toLocaleString('ru-RU')} ₸</p>
          </div>
          <div className="mt-6 rounded-[24px] border border-border p-4 text-sm text-text-secondary">
            {getCalculatorSummary(params).map((item) => (
              <p key={item} className="mt-1 first:mt-0">• {item}</p>
            ))}
          </div>
        </Card>
        <Card>
          <div className="eyebrow">финал маршрута</div>
          <h1 className="mt-5 text-3xl font-bold">Оформление заказа</h1>
          <p className="mt-2 text-text-secondary">Мы передадим менеджеру все выбранные параметры калькулятора и ваши пожелания, чтобы не собирать вводные повторно.</p>
          <div className="mt-6 grid gap-4">
            <Input label="ФИО" value={form.full_name} onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))} />
            <Input label="Телефон" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            <Input label="Email" value={form.email} disabled />
            <Input label="Адрес объекта" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
            <Textarea label="Дополнительные пожелания" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
            <Button loading={saving} onClick={() => void submit()}>Оформить заказ</Button>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
