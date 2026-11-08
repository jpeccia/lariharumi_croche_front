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

/**
 * Envolve cada página lazy com um ErrorBoundary próprio e o fallback de carregamento.
 * Evita repetir a mesma árvore ErrorBoundary > Suspense em todas as rotas.
 */
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
  </ErrorBoundary>
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
          <Route path="/" element={<LazyRoute><Home /></LazyRoute>} />
          <Route path="/login" element={<LazyRoute><LoginPage /></LazyRoute>} />
          <Route path="/catalog" element={<LazyRoute><Catalog /></LazyRoute>} />
          <Route path="/care" element={<LazyRoute><Care /></LazyRoute>} />
          <Route path="/donation" element={<LazyRoute><DonationPage /></LazyRoute>} />
          <Route path="/contact" element={<LazyRoute><Contact /></LazyRoute>} />
          <Route path="/admin" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;