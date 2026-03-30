import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquareMore } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { minLength } from '@/lib/validators';

export default function ReviewsPage() {
  const { reviews, loading, refetch } = useReviews('approved');
  const { user } = useAuth();
  const [form, setForm] = useState({ author_name: user?.full_name ?? '', rating: 5, text: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, author_name: user?.full_name ?? prev.author_name }));
  }, [user?.full_name]);

  const submit = async () => {
    if (!user) return;
    if (!minLength(form.author_name, 2) || !minLength(form.text, 8)) {
      toast.error('Заполните имя и текст отзыва');
      return;
    }

    setSending(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      author_name: form.author_name,
      rating: form.rating,
      text: form.text,
    });
    setSending(false);
    if (error) return toast.error(error.message);
    toast.success('Отзыв отправлен на модерацию');
    setForm({ author_name: user.full_name, rating: 5, text: '' });
    await refetch();
  };

  return (
    <PageWrapper>
      <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <div>
          <div className="eyebrow">опыт клиентов</div>
          <h1 className="mt-5 text-3xl font-bold">Отзывы</h1>
          <p className="mt-2 text-text-secondary">Отзывы клиентов о реализованных проектах, качестве монтажа и общем впечатлении от работы со студией.</p>
          <div className="mt-8 grid gap-4">
            {loading ? <Spinner /> : reviews.map((review) => (
              <Card key={review.id} className="texture-panel">
                <div className="text-brand">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <div className="mt-3 flex items-center justify-between">
                  <h3 className="font-bold">{review.author_name}</h3>
                  <span className="text-sm text-text-secondary">{new Date(review.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <p className="mt-3 text-sm text-text-secondary">{review.text}</p>
              </Card>
            ))}
          </div>
        </div>
        <Card className="texture-panel h-fit">
          <div className="flex items-center gap-3"><MessageSquareMore className="h-6 w-6 text-brand" /><h2 className="text-xl font-bold">Оставить отзыв</h2></div>
          {!user ? (
            <p className="mt-4 text-sm text-text-secondary">Авторизуйтесь, чтобы поделиться впечатлением о проекте и качестве работы.</p>
          ) : (
            <div className="mt-6 space-y-4">
              <Input label="Имя" value={form.author_name} onChange={(e) => setForm((prev) => ({ ...prev, author_name: e.target.value }))} />
              <div>
                <p className="mb-2 text-sm font-medium">Рейтинг</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold ${form.rating === value ? 'bg-brand text-white' : 'bg-brand-light text-brand'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <Textarea label="Текст отзыва" value={form.text} onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))} />
              <Button fullWidth loading={sending} onClick={() => void submit()}>Отправить</Button>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}
