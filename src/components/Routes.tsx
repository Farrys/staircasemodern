import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute() {
  const location = useLocation();
  const { loading, session } = useAuth();
  if (loading) return <Spinner />;
  if (!session) return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function AdminRoute() {
  const { loading, session, user } = useAuth();
  if (loading) return <Spinner />;
  if (!session) return <Navigate to="/auth" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
