import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquareMore } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ReviewTable } from '@/components/admin/ReviewTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useReviews } from '@/hooks/useReviews';
import { supabase } from '@/lib/supabase';
import type { Review, ReviewStatus } from '@/types';

export default function AdminReviewsPage() {
  const { reviews, loading, refetch } = useReviews();
  const [tab, setTab] = useState<ReviewStatus>('pending');

  const filtered = useMemo(() => reviews.filter((review) => review.status === tab), [reviews, tab]);

  const updateStatus = async (review: Review, status: ReviewStatus) => {
    const { error } = await supabase.from('reviews').update({ status }).eq('id', review.id);
    if (error) return toast.error(error.message);
    toast.success('Статус отзыва обновлён');
    await refetch();
  };

  return (
    <PageWrapper>
      <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
        <AdminSidebar />
        <div>
          <div className="mb-6 grid gap-6 lg:grid-cols-[1fr,0.8fr]">
            <div>
              <div className="eyebrow">репутация бренда</div>
              <h1 className="mt-5 text-3xl font-bold">Модерация отзывов</h1>
              <p className="mt-2 text-text-secondary">Экран управления социальным доказательством: здесь удобно быстро одобрять сильные отзывы и не пропускать новые публикации.</p>
            </div>
            <div className="rounded-[24px] bg-brand-light p-5 text-sm leading-7 text-text-secondary">
              Одобряйте содержательные отзывы и отклоняйте слабые или пустые комментарии, чтобы раздел оставался полезным для новых клиентов.
            </div>
          </div>
          <div className="mb-6 flex flex-wrap gap-3">
            {[
              ['pending', 'На модерации'],
              ['approved', 'Одобрены'],
              ['rejected', 'Отклонены'],
            ].map(([value, label]) => (
              <button key={value} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${tab === value ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`} onClick={() => setTab(value as ReviewStatus)}>{label}</button>
            ))}
          </div>
          {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState icon={MessageSquareMore} title="Отзывов в этом разделе нет" /> : <ReviewTable reviews={filtered} onApprove={(review) => void updateStatus(review, 'approved')} onReject={(review) => void updateStatus(review, 'rejected')} />}
        </div>
      </div>
    </PageWrapper>
  );
}
