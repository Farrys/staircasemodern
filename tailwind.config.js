/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        'brand-hover': 'rgb(var(--color-brand-hover) / <alpha-value>)',
        'brand-light': 'rgb(var(--color-brand-light) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        status: {
          danger: '#ef4444',
        },
        cream: {
          50: 'rgb(var(--color-cream-50) / <alpha-value>)',
          100: 'rgb(var(--color-cream-100) / <alpha-value>)',
          200: 'rgb(var(--color-cream-200) / <alpha-value>)',
          300: 'rgb(var(--color-cream-300) / <alpha-value>)',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(75, 46, 25, 0.12)',
        glow: '0 22px 55px rgba(138, 90, 54, 0.24)',
        card: '0 16px 40px rgba(80, 53, 31, 0.10)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(215, 179, 138, 0.35), transparent 34%), radial-gradient(circle at bottom right, rgba(138, 90, 54, 0.18), transparent 28%), radial-gradient(circle at center, rgba(255, 248, 237, 0.42), transparent 46%)',
        'grain-soft': 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0, transparent 38%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.22) 0, transparent 22%)',
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        pulseSlow: 'pulseSlow 8s ease-in-out infinite',
        fadeUp: 'fadeUp 0.65s ease both',
        drift: 'drift 18s ease-in-out infinite alternate',
        wave: 'wave 20s linear infinite',
        shimmer: 'shimmer 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '100%': { transform: 'translate3d(30px, -20px, 0) scale(1.12)' },
        },
        wave: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(-2%) translateY(1.2%)' },
          '100%': { transform: 'translateX(-4%) translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
