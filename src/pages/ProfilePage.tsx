import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, UserRound } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { minLength } from '@/lib/validators';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '' });

  useEffect(() => {
    setForm({ full_name: user?.full_name ?? '', phone: user?.phone ?? '' });
  }, [user]);

  const save = async () => {
    if (!user) return;
    if (!minLength(form.full_name, 2)) return toast.error('Введите имя');
    const { error } = await supabase.from('users').update(form).eq('id', user.id);
    if (error) return toast.error(error.message);
    await refreshProfile();
    toast.success('Профиль сохранён');
  };

  return (
    <PageWrapper>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <Card className="texture-panel">
          <div className="eyebrow">личный кабинет</div>
          <h1 className="mt-5 font-['Cormorant_Garamond'] text-5xl font-bold leading-none">Профиль клиента и контактные данные</h1>
          <div
            className="mt-6 rounded-[24px] p-5 text-sm leading-7 text-text-secondary"
            style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 88%, white 12%)' }}
          >
            Обновляйте имя и телефон, чтобы менеджеру было проще связаться с вами по заказу и подтвердить замер, сроки или монтаж.
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-text-secondary">
            <ShieldCheck className="h-5 w-5 text-brand" />
            Email используется как идентификатор аккаунта и не редактируется с этой страницы.
          </div>
        </Card>
        <Card>
          <div className="mb-6 flex items-center gap-3"><UserRound className="h-7 w-7 text-brand" /><h1 className="text-3xl font-bold">Профиль</h1></div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Имя" value={form.full_name} onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))} />
            <Input label="Телефон" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            <Input label="Email" value={user?.email ?? ''} disabled />
          </div>
          <Button className="mt-6" onClick={() => void save()}>Сохранить</Button>
        </Card>
      </div>
    </PageWrapper>
  );
}
