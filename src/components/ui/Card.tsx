import type { HTMLAttributes, PropsWithChildren } from 'react';

export function Card({ children, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={`glass-panel warm-ring rounded-[30px] p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-glow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
