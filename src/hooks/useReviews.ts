import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Review, ReviewStatus } from '@/types';

export function useReviews(status?: ReviewStatus, limit?: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) console.error(error);
    setReviews(data ?? []);
    setLoading(false);
  }, [status, limit]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, refetch: fetchReviews };
}
