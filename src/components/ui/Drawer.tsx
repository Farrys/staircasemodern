import type { PropsWithChildren } from 'react';
import { X } from 'lucide-react';

export function Drawer({
  open,
  title,
  onClose,
  children,
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2f2118]/30 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-border shadow-soft backdrop-blur-2xl"
        style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 95%, white 5%)' }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b border-border px-6 py-4 backdrop-blur-xl"
          style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 97%, white 3%)' }}
        >
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-text-secondary transition hover:border-brand hover:text-brand"
            style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 92%, white 8%)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </aside>
    </div>
  );
}
