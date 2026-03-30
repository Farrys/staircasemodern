import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { GalleryItem } from '@/types';

export function useGallery(limit?: number) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('gallery')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) console.error(error);
    setItems(data ?? []);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return { items, loading, refetch: fetchItems };
}
