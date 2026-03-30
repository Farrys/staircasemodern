import { Search } from 'lucide-react';
import { StatusBadge, ORDER_STATUS_LABELS } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { MATERIAL_LABELS } from '@/lib/calculator';
import type { Order, OrderStatus } from '@/types';

export function OrderTable({
  orders,
  filter,
  search,
  onFilterChange,
  onSearchChange,
  onSelect,
}: {
  orders: Order[];
  filter: 'all' | OrderStatus;
  search: string;
  onFilterChange: (value: 'all' | OrderStatus) => void;
  onSearchChange: (value: string) => void;
  onSelect: (order: Order) => void;
}) {
  return (
    <div className="glass-panel warm-ring rounded-[28px]">
      <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full lg:max-w-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <Input
              label="Поиск по клиенту или телефону"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              placeholder="Введите имя или телефон"
            />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Фильтр по статусу</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange('all')}
              className={`rounded-2xl px-3 py-2 text-sm font-medium ${filter === 'all' ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`}
            >
              Все
            </button>
            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange(status)}
                className={`rounded-2xl px-3 py-2 text-sm font-medium ${filter === status ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`}
              >
                {ORDER_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-light text-left text-text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 font-medium">Клиент</th>
              <th className="px-4 py-3 font-medium">Материал</th>
              <th className="px-4 py-3 font-medium">Ступени</th>
              <th className="px-4 py-3 font-medium">Сумма</th>
              <th className="px-4 py-3 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="cursor-pointer border-t border-border transition hover:bg-brand-light/50" onClick={() => onSelect(order)}>
                <td className="px-4 py-4">{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                <td className="px-4 py-4">
                  <div className="font-semibold">{order.full_name}</div>
                  <div className="text-text-secondary">{order.phone}</div>
                </td>
                <td className="px-4 py-4">{order.params ? MATERIAL_LABELS[order.params.material] : '—'}</td>
                <td className="px-4 py-4">{order.params?.steps_count ?? '—'}</td>
                <td className="px-4 py-4">{Number(order.total_price).toLocaleString('ru-RU')} ₸</td>
                <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
