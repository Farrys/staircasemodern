import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass-panel rounded-[32px] border-dashed px-6 py-14 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-light">
        <Icon className="h-8 w-8 text-brand" />
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight">{title}</h3>
      {description && <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-text-secondary">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
