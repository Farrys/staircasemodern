import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  newOrders: number;
  inProgress: number;
  completed: number;
  pendingReviews: number;
  users: number;
  unprocessedMessages: number;
  activeChats: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const load = async () => {
      const [newOrders, inProgress, completed, pendingReviews, users, unprocessedMessages, activeChats] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['processing', 'confirmed', 'production', 'ready', 'installed']),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_processed', false),
        supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).in('status', ['new', 'active']),
      ]);

      setStats({
        newOrders: newOrders.count ?? 0,
        inProgress: inProgress.count ?? 0,
        completed: completed.count ?? 0,
        pendingReviews: pendingReviews.count ?? 0,
        users: users.count ?? 0,
        unprocessedMessages: unprocessedMessages.count ?? 0,
        activeChats: activeChats.count ?? 0,
      });
    };
    void load();

    const channel = supabase
      .channel('dashboard-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        void load();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        void load();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        void load();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const cards = stats ? [
    ['Новые заказы', stats.newOrders],
    ['Заказы в работе', stats.inProgress],
    ['Завершённые заказы', stats.completed],
    ['Отзывы на модерации', stats.pendingReviews],
    ['Пользователи', stats.users],
    ['Необработанные обращения', stats.unprocessedMessages],
    ['Активные чаты', stats.activeChats],
  ] : [];

  return (
    <PageWrapper>
      <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
        <AdminSidebar />
        <div>
          <div className="mb-6 grid gap-6 lg:grid-cols-[1fr,0.8fr]">
            <div>
              <div className="eyebrow">операционный центр</div>
              <h1 className="page-title mt-5 text-3xl">Панель администратора</h1>
              <p className="page-lead mt-2 text-base">Ключевые показатели по заказам, отзывам, обращениям и активности пользователей в одном рабочем экране.</p>
            </div>
            <Card className="texture-panel">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">оперативный фокус</p>
              <p className="mt-3 text-sm leading-7 text-text-secondary">Начинайте с новых заказов, затем проверяйте обращения и отзывы на модерации, чтобы все клиентские сценарии двигались без задержек.</p>
            </Card>
          </div>
          {!stats ? <Spinner /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value]) => <Card key={String(label)} className="texture-panel"><p className="text-sm text-text-secondary">{label}</p><p className="mt-4 text-3xl font-extrabold text-brand">{value}</p></Card>)}</div>}
        </div>
      </div>
    </PageWrapper>
  );
}
