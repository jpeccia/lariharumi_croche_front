import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Navbar from './components/Navbar';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { SkipLinks } from './components/shared/SkipLinks';
import { usePromotionStore } from './store/promotionStore';
import { promotionSchema } from './schemas/promotionSchema';

// Lazy loading para todas as páginas principais
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Care = lazy(() => import('./pages/Care'));
const Contact = lazy(() => import('./pages/Contact'));
const LoginPage = lazy(() => import('./pages/Login'));
const DonationPage = lazy(() => import('./pages/DonationPage'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

// Componente de loading otimizado
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
    <div className="text-center">
      <LoadingSpinner size="lg" color="purple" text="Carregando página..." />
      <div className="mt-4 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

function App() {
  const setPromotion = usePromotionStore((s) => s.setPromotion);

  // Importa promoção via parâmetro de URL (?promo=BASE64 ou #promo=BASE64)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      let promoEncoded = searchParams.get('promo');
      if (!promoEncoded && window.location.hash.startsWith('#promo=')) {
        promoEncoded = window.location.hash.replace('#promo=', '');
      }
      if (promoEncoded) {
        // Decodificar Base64 URL-safe
        const normalized = promoEncoded.replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = atob(normalized);
        const parsed = JSON.parse(jsonStr);
        const validated = promotionSchema.safeParse(parsed);
        if (validated.success) {
          setPromotion(validated.data);
        } else {
          console.warn('Promoção inválida no parâmetro de URL:', validated.error?.message);
        }
      }
    } catch (e) {
      console.warn('Falha ao importar promoção via URL:', e);
    }
  }, [setPromotion]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <SkipLinks />
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/login" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <LoginPage />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/catalog" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Catalog />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/care" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Care />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/donation" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <DonationPage />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              </ErrorBoundary>
            } 
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;