import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

const styles: Record<Variant, string> = {
  primary: 'border border-[#a66f47]/45 bg-gradient-to-r from-brand via-[#9b6740] to-[#c28c58] text-white shadow-glow hover:brightness-105',
  secondary: 'border border-border bg-[color:color-mix(in_srgb,var(--panel-bg-main)_96%,transparent)] text-brand hover:bg-[color:color-mix(in_srgb,var(--panel-bg-main)_100%,transparent)]',
  outline: 'border border-border bg-[color:color-mix(in_srgb,var(--panel-bg-main)_92%,transparent)] text-text-primary hover:border-brand hover:bg-[color:color-mix(in_srgb,var(--panel-bg-main)_100%,transparent)] hover:text-brand',
  danger: 'border border-red-500/30 bg-gradient-to-r from-red-500 to-rose-500 text-white hover:brightness-110',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
