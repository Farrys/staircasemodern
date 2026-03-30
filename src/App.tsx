import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { FloatingSupportWidget } from '@/components/common/FloatingSupportWidget';
import { ProtectedRoute, AdminRoute } from '@/components/Routes';
import { Spinner } from '@/components/ui/Spinner';
import { useTheme } from '@/contexts/ThemeContext';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const GalleryCasePage = lazy(() => import('@/pages/GalleryCasePage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const CalculatorPage = lazy(() => import('@/pages/CalculatorPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const ContactsPage = lazy(() => import('@/pages/ContactsPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const NewOrderPage = lazy(() => import('@/pages/NewOrderPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminReviewsPage = lazy(() => import('@/pages/admin/AdminReviewsPage'));
const AdminMessagesPage = lazy(() => import('@/pages/admin/AdminMessagesPage'));
const AdminGalleryPage = lazy(() => import('@/pages/admin/AdminGalleryPage'));
const AdminServicesPage = lazy(() => import('@/pages/admin/AdminServicesPage'));

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const appRoutes = (
    <Suspense fallback={<div className="container-page py-16"><Spinner /></div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:slug" element={<GalleryCasePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<NewOrderPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/messages" element={<AdminMessagesPage />} />
          <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden text-text-primary">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        {isAdminRoute ? (
          <div className="min-h-[calc(100vh-88px)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel-bg-main)_82%,transparent),color-mix(in_srgb,var(--panel-bg-secondary)_88%,transparent))]">
            {appRoutes}
          </div>
        ) : (
          <>
            {appRoutes}
            <Footer />
            <FloatingSupportWidget />
          </>
        )}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '18px',
              padding: '14px 16px',
              background: theme === 'dark' ? 'rgba(29, 25, 23, 0.96)' : 'rgba(255, 250, 242, 0.96)',
              color: theme === 'dark' ? '#ede3cf' : '#36251a',
              border: theme === 'dark' ? '1px solid rgba(78, 69, 59, 0.95)' : '1px solid rgba(221, 207, 189, 0.95)',
              boxShadow: theme === 'dark' ? '0 18px 40px rgba(0, 0, 0, 0.32)' : '0 18px 40px rgba(80, 53, 31, 0.12)',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
