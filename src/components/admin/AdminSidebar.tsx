import { LayoutDashboard, Package, MessageSquare, Images, Wrench, Star } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { BrandLogo } from '@/components/layout/BrandLogo';

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Заказы', icon: Package },
  { to: '/admin/reviews', label: 'Отзывы', icon: Star },
  { to: '/admin/messages', label: 'Обращения', icon: MessageSquare },
  { to: '/admin/gallery', label: 'Галерея', icon: Images },
  { to: '/admin/services', label: 'Услуги', icon: Wrench },
];

export function AdminSidebar() {
  return (
    <aside className="glass-panel warm-ring rounded-[28px] p-4">
      <div className="mb-4 rounded-[22px] bg-brand-light p-4">
        <BrandLogo compact className="scale-[0.8] origin-left" />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-brand">admin space</p>
        <p className="mt-2 font-['Cormorant_Garamond'] text-3xl font-bold leading-none text-text-primary">Управление проектом</p>
        <Link to="/" className="mt-4 inline-flex text-sm font-semibold text-brand hover:opacity-80">
          Вернуться на сайт
        </Link>
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              end={item.to === '/admin'}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand text-white shadow-card' : 'text-text-primary hover:bg-brand-light hover:text-brand'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
