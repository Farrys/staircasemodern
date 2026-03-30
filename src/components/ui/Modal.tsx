import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function Modal({
  open,
  title,
  onClose,
  children,
  size = 'md',
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void; size?: 'md' | 'lg' | 'xl' }>) {
  if (!open || typeof document === 'undefined') return null;

  const maxWidthClass = size === 'xl' ? 'max-w-6xl' : size === 'lg' ? 'max-w-4xl' : 'max-w-2xl';

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/62 p-4 backdrop-blur-sm sm:p-6">
      <div
        className={`relative flex max-h-[min(90vh,calc(100vh-7rem))] w-full ${maxWidthClass} flex-col overflow-hidden rounded-[30px] border border-border shadow-soft backdrop-blur-2xl`}
        style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 94%, white 6%)' }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-6 py-5 sm:px-8">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-text-secondary transition hover:border-brand hover:text-brand"
            style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 90%, white 10%)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 sm:py-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
