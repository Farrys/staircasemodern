import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { OrderTable } from '@/components/admin/OrderTable';
import { Drawer } from '@/components/ui/Drawer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { StatusBadge, ORDER_STATUS_LABELS } from '@/components/ui/Badge';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/lib/supabase';
import { MATERIAL_LABELS } from '@/lib/calculator';
import type { Order, OrderStatus } from '@/types';
import { ClipboardList } from 'lucide-react';

const statusChain: OrderStatus[] = ['new', 'processing', 'confirmed', 'production', 'ready', 'installed', 'completed'];

function getNextStatuses(status: OrderStatus) {
  if (status === 'cancelled' || status === 'completed') return [];
  const index = statusChain.indexOf(status);
  return statusChain.slice(index + 1, index + 2);
}

export default function AdminOrdersPage() {
  const { orders, loading, refetch } = useOrders(true);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const target = `${order.full_name} ${order.phone}`.toLowerCase();
    const matchesSearch = target.includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [orders, filter, search]);

  const openDrawer = (order: Order) => {
    setSelected(order);
    setStatus(order.status);
    setComment(order.admin_comment ?? '');
  };

  const save = async () => {
    if (!selected || !status) return;
    setSaving(true);
    const previousStatus = selected.status;
    const { error } = await supabase.from('orders').update({ status, admin_comment: comment }).eq('id', selected.id);
    if (!error && previousStatus !== status) {
      await supabase.from('order_status_history').insert({
        order_id: selected.id,
        from_status: previousStatus,
        to_status: status,
        comment,
      });
    }
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success('Заказ обновлён');
    setSelected(null);
    await refetch();
  };

  return (
    <PageWrapper>
      <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
        <AdminSidebar />
        <div>
          <div className="mb-6 grid gap-6 lg:grid-cols-[1fr,0.8fr]">
            <div>
              <div className="eyebrow">производственный поток</div>
              <h1 className="mt-5 text-3xl font-bold">Управление заказами</h1>
              <p className="mt-2 text-text-secondary">Здесь отслеживаются клиенты, параметры проекта, бюджет и переходы между этапами производства.</p>
            </div>
            <Card className="texture-panel">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">как работать быстрее</p>
              <p className="mt-3 text-sm leading-7 text-text-secondary">Сначала фильтруйте новые и активные заказы, а в карточке заказа фиксируйте комментарий вместе со сменой статуса, чтобы история проекта сохранялась без потерь.</p>
            </Card>
          </div>
          {loading ? <Spinner /> : filteredOrders.length === 0 ? <EmptyState icon={ClipboardList} title="Заказы не найдены" /> : (
            <OrderTable
              orders={filteredOrders}
              filter={filter}
              search={search}
              onFilterChange={setFilter}
              onSearchChange={setSearch}
              onSelect={openDrawer}
            />
          )}
        </div>
      </div>

      <Drawer open={Boolean(selected)} title={selected ? `Заказ #${selected.id.slice(-8)}` : ''} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-6">
            <Card className="texture-panel">
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <p><span className="font-semibold">Клиент:</span> {selected.full_name}</p>
                <p><span className="font-semibold">Телефон:</span> {selected.phone}</p>
                <p><span className="font-semibold">Адрес:</span> {selected.address}</p>
                <p><span className="font-semibold">Сумма:</span> {Number(selected.total_price).toLocaleString('ru-RU')} ₸</p>
                <p><span className="font-semibold">Материал:</span> {selected.params ? MATERIAL_LABELS[selected.params.material] : '—'}</p>
                <p><span className="font-semibold">Ступени:</span> {selected.params?.steps_count ?? '—'}</p>
              </div>
              <div className="mt-4"><StatusBadge status={selected.status} /></div>
              <p className="mt-4 text-sm text-text-secondary">Пожелания: {selected.notes || '—'}</p>
            </Card>

            <Card className="texture-panel">
              <h3 className="text-lg font-bold">Смена статуса</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${status === selected.status ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`}
                  onClick={() => setStatus(selected.status)}
                >
                  {ORDER_STATUS_LABELS[selected.status]}
                </button>
                {getNextStatuses(selected.status).map((item) => (
                  <button key={item} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${status === item ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`} onClick={() => setStatus(item)}>{ORDER_STATUS_LABELS[item]}</button>
                ))}
                {selected.status !== 'cancelled' && selected.status !== 'completed' && (
                  <button
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold ${status === 'cancelled' ? 'bg-red-600 text-white shadow-card' : 'border border-red-500/30 text-red-200'}`}
                    style={status === 'cancelled' ? undefined : { background: 'rgba(127, 29, 29, 0.28)' }}
                    onClick={() => setStatus('cancelled')}
                  >
                    Отменён
                  </button>
                )}
              </div>
              <div className="mt-4">
                <Textarea label="Комментарий администратора" value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
              <Button className="mt-4" loading={saving} onClick={() => void save()}>Сохранить</Button>
            </Card>

            <Card className="texture-panel">
              <h3 className="text-lg font-bold">Хронология</h3>
              <div className="mt-4 space-y-3">
                {(selected.history ?? []).map((entry) => (
                  <div key={entry.id} className="rounded-[22px] bg-brand-light p-4 text-sm text-text-primary">
                    <p className="font-semibold">{ORDER_STATUS_LABELS[entry.to_status]}</p>
                    <p className="text-text-secondary">{new Date(entry.created_at).toLocaleString('ru-RU')}</p>
                    {entry.comment && <p className="mt-2 text-text-secondary">{entry.comment}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </PageWrapper>
  );
}
