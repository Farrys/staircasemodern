import { Clock3, Mail, MapPin, Phone, ShieldCheck, MessageCircleMore, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '@/lib/siteConfig';
import { BrandLogo } from '@/components/layout/BrandLogo';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel-bg-main)_72%,transparent),color-mix(in_srgb,var(--panel-bg-secondary)_88%,transparent))] backdrop-blur-xl">
      <div className="container-page grid gap-8 py-10 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <h3 className="inline-flex items-center gap-2 text-lg font-bold text-text-primary"><Sparkles className="h-5 w-5 text-brand" /> {siteConfig.brandName}</h3>
          <p className="mt-3 text-sm leading-7 text-text-secondary">Студия лестниц под ключ: от точного замера и проектирования до монтажа, сопровождения и деликатной интеграции в интерьер.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-2 text-xs font-semibold text-brand">
            <ShieldCheck className="h-4 w-4" /> Гарантия на конструкцию и монтаж
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Контакты</h4>
          <div className="mt-3 space-y-2 text-sm text-text-secondary">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /> {siteConfig.contacts.phoneDisplay}</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand" /> {siteConfig.contacts.email}</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" /> {siteConfig.contacts.address}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Режим работы</h4>
          <div className="mt-3 space-y-2 text-sm text-text-secondary">
            <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand" /> {siteConfig.contacts.weekdayHours}</p>
            <p>{siteConfig.contacts.saturdayHours}</p>
            <p>{siteConfig.contacts.chatHours}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Навигация</h4>
          <div className="mt-3 grid gap-2 text-sm text-text-secondary">
            <Link to="/calculator" className="hover:text-brand">Калькулятор</Link>
            <Link to="/gallery" className="hover:text-brand">Галерея</Link>
            <Link to="/portfolio" className="hover:text-brand">Портфолио</Link>
            <Link to="/contacts" className="inline-flex items-center gap-2 font-semibold text-brand"><MessageCircleMore className="h-4 w-4" /> Связаться с нами</Link>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col gap-4 border-t border-border/60 py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-xs uppercase tracking-[0.26em] text-text-muted">Staircase Pro. Digital showroom for custom staircases.</p>
        <BrandLogo className="scale-[0.82] origin-right self-start md:self-auto" />
      </div>
    </footer>
  );
}
