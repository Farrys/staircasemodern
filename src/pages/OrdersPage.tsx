import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, ORDER_STATUS_LABELS } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useOrders } from '@/hooks/useOrders';
import { MATERIAL_LABELS } from '@/lib/calculator';

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <PageWrapper>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow">история проекта</div>
          <h1 className="mt-5 text-3xl font-bold">Мои заказы</h1>
          <p className="mt-2 text-text-secondary">История заказов, параметры проекта, комментарии администратора и движение по этапам производства.</p>
        </div>
        <Link to="/orders/new"><Button>Новый заказ</Button></Link>
      </div>
      {loading ? <Spinner /> : orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="У вас пока нет заказов"
          description="Сначала рассчитайте стоимость, затем оформите заказ в несколько кликов."
          action={<Link to="/calculator"><Button>Перейти к калькулятору</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="texture-panel">
              <button className="w-full text-left" onClick={() => setExpanded((prev) => prev === order.id ? null : order.id)}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-bold">Заказ #{order.id.slice(-8)}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{new Date(order.created_at).toLocaleString('ru-RU')}</p>
                  </div>
                  <div className="grid gap-2 text-sm md:grid-cols-4 md:items-center">
                    <span>{order.params ? MATERIAL_LABELS[order.params.material] : '—'}</span>
                    <span>{order.params?.steps_count ?? '—'} ступ.</span>
                    <span>{Number(order.total_price).toLocaleString('ru-RU')} ₸</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </button>
              {expanded === order.id && (
                <div className="mt-5 grid gap-4 rounded-[24px] bg-brand-light p-4 text-sm text-text-primary">
                  <div className="grid gap-3 md:grid-cols-2">
                    <p><span className="font-semibold">ФИО:</span> {order.full_name}</p>
                    <p><span className="font-semibold">Телефон:</span> {order.phone}</p>
                    <p><span className="font-semibold">Адрес:</span> {order.address}</p>
                    <p><span className="font-semibold">Статус:</span> {ORDER_STATUS_LABELS[order.status]}</p>
                    <p><span className="font-semibold">Подсветка:</span> {order.params?.lighting ? 'Да' : 'Нет'}</p>
                    <p><span className="font-semibold">Умное освещение:</span> {order.params?.smart_light ? 'Да' : 'Нет'}</p>
                    <p><span className="font-semibold">Расширенная гарантия:</span> {order.params?.extended_warranty ? 'Да' : 'Нет'}</p>
                    <p><span className="font-semibold">Базовая цена:</span> {Number(order.params?.base_price ?? 0).toLocaleString('ru-RU')} ₸</p>
                  </div>
                  <p><span className="font-semibold">Пожелания:</span> {order.notes || '—'}</p>
                  <p><span className="font-semibold">Комментарий администратора:</span> {order.admin_comment || '—'}</p>
                  <div>
                    <p className="font-semibold">Хронология статусов</p>
                    <div className="mt-3 space-y-2">
                      {(order.history ?? []).map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-[20px] px-4 py-3"
                          style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 88%, white 12%)' }}
                        >
                          <p className="font-medium">{ORDER_STATUS_LABELS[entry.to_status]}</p>
                          <p className="text-xs text-text-secondary">{new Date(entry.created_at).toLocaleString('ru-RU')}</p>
                          {entry.comment && <p className="mt-1 text-text-secondary">{entry.comment}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
