import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-2.5">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <input
        className={`w-full rounded-2xl border border-border px-4 py-3.5 text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-brand focus:ring-4 ${className}`}
        style={{
          background: 'color-mix(in srgb, var(--panel-bg-main) 94%, white 6%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          ['--tw-ring-color' as string]: 'color-mix(in srgb, rgb(var(--color-brand)) 24%, transparent)',
        }}
        {...props}
      />
      {error && <span className="text-xs text-status-danger">{error}</span>}
    </label>
  );
}

export function Textarea({
  label,
  error,
  className = '',
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block space-y-2.5">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <textarea
        className={`min-h-32 w-full rounded-2xl border border-border px-4 py-3.5 text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-brand focus:ring-4 ${className}`}
        style={{
          background: 'color-mix(in srgb, var(--panel-bg-main) 94%, white 6%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          ['--tw-ring-color' as string]: 'color-mix(in srgb, rgb(var(--color-brand)) 24%, transparent)',
        }}
        {...props}
      />
      {error && <span className="text-xs text-status-danger">{error}</span>}
    </label>
  );
}
