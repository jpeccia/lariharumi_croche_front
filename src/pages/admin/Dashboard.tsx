import { useEffect, Suspense, lazy, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Package, FolderOpen, BarChart3, Plus, Eye, Tag } from 'lucide-react';
import { useAnalytics } from '../../services/analytics';
import { CardSkeleton } from '../../components/shared/LoadingStates';
import { useStatsCache } from '../../hooks/useApiCache';

// Lazy loading para componentes administrativos pesados
const ProductManagement = lazy(() => import('../../components/admin/ProductManagement').then(module => ({ default: module.ProductManagement })));
const CategoryManagement = lazy(() => import('../../components/admin/CategoryManagement').then(module => ({ default: module.CategoryManagement })));
const PromotionSettings = lazy(() => import('../../components/admin/PromotionSettings').then(module => ({ default: module.PromotionSettings })));

function AdminDashboard() {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);
  const { trackPageView } = useAnalytics();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'overview' | 'promotions'>('overview');
  // Usar cache para estatísticas
  const { data: stats, loading: isLoadingStats, refresh: refreshStats } = useStatsCache();
  
  const debouncedRefreshStats = useCallback(() => {
    refreshStats(); // Atualizar imediatamente quando há mudanças
  }, [refreshStats]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    } else {
      trackPageView('admin_dashboard');
    }
  }, [isAdmin, navigate, trackPageView]);

  if (!isAdmin) return null;

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'categories', label: 'Categorias', icon: FolderOpen },
    { id: 'promotions', label: 'Promoções', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-800 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Bem-vinda, {user?.name || 'Administradora'}! 👋
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/catalog')}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Eye size={20} />
                <span>Ver Catálogo</span>
              </button>
              <button
                onClick={debouncedRefreshStats}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <BarChart3 size={20} />
                <span>Atualizar Stats</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                {isLoadingStats ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-purple-800">{stats?.totalProducts || 0}</p>
                )}
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Categorias</p>
                {isLoadingStats ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-purple-800">{stats?.totalCategories || 0}</p>
                )}
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos por Categoria</p>
                {isLoadingStats ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-bold text-purple-800">
                      {stats?.productsByCategory ? Object.keys(stats.productsByCategory).length : 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(() => {
                        if (!stats?.productsByCategory) return 'Nenhuma categoria';
                        
                        const entries = Object.entries(stats.productsByCategory);
                        const displayText = entries
                          .slice(0, 2)
                          .map(([category, count]) => `${category}: ${count}`)
                          .join(', ');
                        
                        return entries.length > 2 ? `${displayText}...` : displayText;
                      })()}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'products' | 'categories' | 'overview' | 'promotions')}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
                    >
                      <div className="p-2 bg-purple-500 text-white rounded-lg">
                        <Plus size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-purple-900">Gerenciar Produtos</p>
                        <p className="text-sm text-purple-600">Adicionar, editar ou remover produtos</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('categories')}
                      className="flex items-center space-x-3 p-4 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100 transition-colors text-left"
                    >
                      <div className="p-2 bg-pink-500 text-white rounded-lg">
                        <Plus size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-pink-900">Gerenciar Categorias</p>
                        <p className="text-sm text-pink-600">Organizar produtos por categorias</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dicas para Melhor Experiência</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>✨ Use o editor de imagem para cortar e ajustar suas fotos</li>
                      <li>📸 Faça upload de múltiplas imagens para cada produto</li>
                      <li>🏷️ Organize produtos em categorias para facilitar a navegação</li>
                      <li>💡 Adicione descrições detalhadas para atrair clientes</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <Suspense fallback={<CardSkeleton />}>
                <ProductManagement onDataChange={debouncedRefreshStats} />
              </Suspense>
            )}

            {activeTab === 'categories' && (
              <Suspense fallback={<CardSkeleton />}>
                <CategoryManagement onDataChange={debouncedRefreshStats} />
              </Suspense>
            )}

            {activeTab === 'promotions' && (
              <Suspense fallback={<CardSkeleton />}>
                <PromotionSettings />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
