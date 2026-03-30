import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Review } from '@/types';

export function ReviewTable({
  reviews,
  onApprove,
  onReject,
}: {
  reviews: Review[];
  onApprove: (review: Review) => void;
  onReject: (review: Review) => void;
}) {
  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="texture-panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-brand">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h3 className="font-bold">{review.author_name}</h3>
                <span className="text-sm text-text-secondary">{new Date(review.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
              <p className="mt-3 text-sm text-text-secondary">{review.text}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => onApprove(review)}>Одобрить</Button>
              <Button variant="danger" onClick={() => onReject(review)}>Отклонить</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
