import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function useOrders(admin = false) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*, params:order_params(*), history:order_status_history(*)')
      .order('created_at', { ascending: false });

    if (!admin) query = query.eq('user_id', user.id);

    const { data, error } = await query;
    if (error) console.error(error);
    setOrders(((data as Order[]) ?? []).map((item) => ({
      ...item,
      history: item.history?.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)) ?? [],
    })));
    setLoading(false);
  }, [user, admin]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, refetch: fetchOrders };
}
