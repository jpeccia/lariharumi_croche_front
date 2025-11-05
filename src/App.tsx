import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Navbar from './components/Navbar';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { SkipLinks } from './components/shared/SkipLinks';
import { usePromotionStore } from './store/promotionStore';
import { decodePromotion } from './utils/promotionShare';
import { promotionSchema } from './schemas/promotionSchema';
import { publicApi } from './services/api';

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

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('promo');
      if (encoded) {
        const decoded = decodePromotion(encoded);
        if (decoded) {
          const parsed = promotionSchema.safeParse(decoded);
          if (parsed.success) {
            setPromotion(parsed.data);
          }
        }
        // Se veio via URL, não busca do backend nesta navegação
        return;
      }
    } catch (e) {
      // ignore hydration errors
    }

    // Sem parâmetro ?promo, buscar promoção pública do backend
    (async () => {
      try {
        const remote = await publicApi.getPromotion();
        if (remote) {
          const parsed = promotionSchema.safeParse(remote);
          if (parsed.success) {
            setPromotion(parsed.data);
          }
        }
      } catch {
        // falhas silenciosas: navegação continua
      }
    })();
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