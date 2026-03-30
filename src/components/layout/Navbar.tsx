import { Link, NavLink } from 'react-router-dom';
import { Menu, LogOut, Moon, Phone, MessageCircleMore, Sparkles, SunMedium, LayoutDashboard, UserRound, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/lib/siteConfig';
import { useTheme } from '@/contexts/ThemeContext';
import { BrandLogo } from '@/components/layout/BrandLogo';

const links = [
  ['/', 'Главная'],
  ['/services', 'Услуги'],
  ['/gallery', 'Галерея'],
  ['/portfolio', 'Портфолио'],
  ['/calculator', 'Калькулятор'],
  ['/reviews', 'Отзывы'],
  ['/contacts', 'Контакты'],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/90 bg-[color:color-mix(in_srgb,var(--panel-bg-main)_98%,transparent)] backdrop-blur-2xl">
      <div className="border-b border-border/85 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--panel-bg-main)_99%,transparent),color-mix(in_srgb,var(--panel-bg-secondary)_97%,transparent),color-mix(in_srgb,var(--surface-start)_82%,transparent))]">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-2.5 text-xs text-text-secondary">
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.contacts.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 px-3 py-1 font-medium text-text-primary shadow-sm"
              style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 96%, transparent)' }}
            >
              <Phone className="h-3.5 w-3.5 text-brand" /> {siteConfig.contacts.phoneDisplay}
            </a>
            <span className="inline-flex items-center gap-2 font-medium text-text-secondary">
              <Sparkles className="h-3.5 w-3.5 text-brand" /> {siteConfig.tagline}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="theme-toggle" type="button">
              {theme === 'dark' ? <SunMedium className="h-3.5 w-3.5 text-brand" /> : <Moon className="h-3.5 w-3.5 text-brand" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <a
              href={siteConfig.social.primaryHref}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 px-3 py-1 font-semibold text-brand shadow-sm"
              style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 94%, transparent)' }}
            >
            <MessageCircleMore className="h-3.5 w-3.5" /> {siteConfig.social.primaryLabel}
            </a>
          </div>
        </div>
      </div>
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Link to="/" className="shrink-0">
          <BrandLogo compact />
        </Link>
        <nav className="hidden items-center gap-2 xl:flex">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'text-[#2f2419] shadow-sm'
                    : 'text-text-primary hover:text-text-primary'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(246, 236, 218, 0.98), rgba(224, 198, 152, 0.96))',
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.12)',
                    }
                  : {
                      background: 'color-mix(in srgb, var(--panel-bg-main) 72%, transparent)',
                    }
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 xl:flex">
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin"><Button variant="secondary" className="whitespace-nowrap"><LayoutDashboard className="h-4 w-4" />Админ</Button></Link>}
              <Link to="/profile"><Button variant="outline" className="whitespace-nowrap"><UserRound className="h-4 w-4" />Профиль</Button></Link>
              <Link to="/orders"><Button variant="outline" className="whitespace-nowrap"><ClipboardList className="h-4 w-4" />Мои заказы</Button></Link>
              <Button variant="outline" className="whitespace-nowrap" onClick={() => void signOut()}><LogOut className="h-4 w-4" />Выйти</Button>
            </>
          ) : (
            <>
              <Link to="/calculator"><Button variant="outline">Быстрый расчёт</Button></Link>
              <Link to="/auth"><Button>Войти</Button></Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 xl:hidden">
          <button onClick={toggleTheme} className="theme-toggle" type="button">
            {theme === 'dark' ? <SunMedium className="h-3.5 w-3.5 text-brand" /> : <Moon className="h-3.5 w-3.5 text-brand" />}
          </button>
          <button
            className="rounded-2xl border border-border p-2.5 text-text-primary"
            style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 95%, transparent)' }}
            onClick={() => setOpen((value) => !value)}
          >
          <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/80 bg-[color:color-mix(in_srgb,var(--panel-bg-main)_98%,transparent)] xl:hidden">
          <div className="container-page flex flex-col gap-3 py-4">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-text-primary transition hover:text-brand"
                style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 84%, transparent)' }}
              >
                {label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)}><Button variant="outline" fullWidth>Профиль</Button></Link>
                <Link to="/orders" onClick={() => setOpen(false)}><Button variant="outline" fullWidth>Мои заказы</Button></Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)}><Button variant="secondary" fullWidth>Админ</Button></Link>}
                <Button variant="outline" onClick={() => void signOut()} fullWidth>Выйти</Button>
              </>
            ) : (
              <>
                <Link to="/calculator" onClick={() => setOpen(false)}><Button variant="outline" fullWidth>Быстрый расчёт</Button></Link>
                <Link to="/auth" onClick={() => setOpen(false)}><Button fullWidth>Войти</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
