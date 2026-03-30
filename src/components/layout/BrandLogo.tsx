import type { HTMLAttributes } from 'react';

interface BrandLogoProps extends HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

function StairIcon({ compact }: { compact: boolean }) {
  return (
    <svg
      viewBox="0 0 180 180"
      aria-hidden="true"
      className={compact ? 'h-10 w-10 flex-none' : 'h-24 w-24 flex-none'}
      fill="none"
    >
      <g stroke="rgb(var(--color-brand))" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 139c35-8 79-8 123 0" strokeWidth="5" opacity="0.55" />
        <path d="M48 126h82" strokeWidth="8" />
        <path d="M55 114h71" strokeWidth="8" />
        <path d="M61 102h61" strokeWidth="8" />
        <path d="M66 90h52" strokeWidth="8" />
        <path d="M71 78h44" strokeWidth="8" />
        <path d="M76 66h34" strokeWidth="8" />
        <path d="M52 120 121 70" strokeWidth="6" />
        <path d="M123 54c0 19-4 34-14 49-5 8-10 16-10 30" strokeWidth="9" />
        <path d="M120 67v37" strokeWidth="6" />
        <path d="M106 77v39" strokeWidth="5" />
        <path d="M93 86v40" strokeWidth="5" />
        <path d="M80 95v34" strokeWidth="5" />
        <path d="M68 104v27" strokeWidth="5" />
        <path d="M44 65h19" strokeWidth="6" />
        <path d="M116 43h20" strokeWidth="6" />
      </g>

      <g fill="rgb(var(--color-brand))">
        <circle cx="52" cy="56" r="8" />
        <circle cx="122" cy="43" r="8" />
        <rect x="44" y="65" width="16" height="39" rx="3" />
        <rect x="115" y="50" width="16" height="44" rx="3" />
        <path d="M145 26l2.5-6 2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5z" />
        <path d="M130 41l1.8-4.4 1.8 4.4 4.4 1.8-4.4 1.8-1.8 4.4-1.8-4.4-4.4-1.8z" />
        <path d="M82 48l3-7.2 3 7.2 7.2 3-7.2 3-3 7.2-3-7.2-7.2-3z" />
      </g>
    </svg>
  );
}

export function BrandLogo({ compact = false, className = '', ...props }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`.trim()} {...props}>
      <StairIcon compact={compact} />

      <div className="leading-none">
        <span
          className={
            compact
              ? 'block text-[1.18rem] font-extrabold tracking-tight text-text-primary'
              : 'block text-[3.1rem] font-extrabold tracking-tight text-text-primary'
          }
        >
          Staircase Pro
        </span>
      </div>
    </div>
  );
}
