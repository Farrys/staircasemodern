import type { OrderStatus } from '@/types';

const styles: Record<OrderStatus, string> = {
  new: 'bg-[#efe7dc] text-[#6d4b35]',
  processing: 'bg-[#f8e7bf] text-[#78581c]',
  confirmed: 'bg-[#eadfcd] text-[#654b2f]',
  production: 'bg-[#efdbc7] text-[#8a5a36]',
  ready: 'bg-[#e8dfd2] text-[#625141]',
  installed: 'bg-[#ded8cb] text-[#51453a]',
  completed: 'bg-[#dce8d8] text-[#31543a]',
  cancelled: 'bg-[#f1d8d5] text-[#8d3b36]',
};

const labels: Record<OrderStatus, string> = {
  new: 'Новый',
  processing: 'В обработке',
  confirmed: 'Подтверждён',
  production: 'В производстве',
  ready: 'Готов к установке',
  installed: 'Установлен',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
}

export const ORDER_STATUS_LABELS = labels;
