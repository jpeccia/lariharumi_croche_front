import { useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Lazy loading para componentes administrativos pesados
const ProductManagement = lazy(() => import('../../components/admin/ProductManagement').then(module => ({ default: module.ProductManagement })));
const CategoryManagement = lazy(() => import('../../components/admin/CategoryManagement').then(module => ({ default: module.CategoryManagement })));

function AdminDashboard() {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin); // Agora, é um booleano

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null; // Não renderiza nada se não for admin

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Painel Administrativo</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          }>
            <ProductManagement />
          </Suspense>
        </div>
        <Suspense fallback={
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        }>
          <CategoryManagement />
        </Suspense>
        <div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
