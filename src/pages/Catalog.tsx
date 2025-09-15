import { useState, useEffect, useRef, useCallback } from 'react';
import api, { adminApi } from '../services/api';
import CategoryCard from '../components/catalog/CategoryCard';
import ProductCard from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Stitch } from '../components/shared/KawaiiElements/Stitch';
import { preloadImages } from '../hooks/useImageCache';
import { showCatalogError, showCategoryLoadError, showProductLoadError } from '../utils/toast';
import { Category, Product } from '../types/product';
import { PaginatedResponse, PaginationConfig } from '../types/api';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import { useAnalytics } from '../services/analytics';
import { LoadingSpinner, CardSkeleton } from '../components/shared/LoadingStates';
import { useCategoriesCache, useProductsCache } from '../hooks/useApiCache';
import { CacheIndicator } from '../components/shared/CacheIndicator';

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const viewProductCatalogRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginatedResponse<Product>['pagination'] | null>(null);
  
  // Hooks de otimização
  const { deviceInfo, getOptimalGridColumns, getAnimationConfig } = useMobileOptimization();
  const { startRenderMeasurement, endRenderMeasurement, createThrottledCallback } = usePerformanceOptimization();
  const { trackPageView, trackClick } = useAnalytics();
  
  // Cache de categorias
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategoriesCache();
  
  // Configuração de paginação
  const paginationConfig: PaginationConfig = {
    page: currentPage,
    limit: 12,
    sortBy: 'name',
    sortOrder: 'asc'
  };


  // Monitorar quando categorias são carregadas
  useEffect(() => {
    if (categories && !categoriesLoading) {
      setCategoriesLoaded(true);
    }
  }, [categories, categoriesLoading]);

  const fetchProducts = useCallback(async (categoryId: number | null, reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;
  
    try {
      setIsLoading(true);
  
      const pageToFetch = reset ? 1 : currentPage;
      const config: PaginationConfig = {
        page: pageToFetch,
        limit: 12,
        sortBy: 'name',
        sortOrder: 'asc'
      };
      
      const response: PaginatedResponse<Product> = await adminApi.getProductsByPage(categoryId, config);
      const productsFetched = response.data;
      
      // Filtrar produtos deletados (soft delete)
      const activeProducts = productsFetched.filter(product => !product.isDeleted);
  
      if (reset) {
        setProducts(activeProducts);
        setCurrentPage(2);
        setHasMore(response.pagination.hasNext);
        setPaginationInfo(response.pagination);
        
        // Pré-carrega imagens dos produtos da primeira página
        const productIds = activeProducts.map((product: Product) => product.ID);
        preloadImages(productIds);
      } else {
        setProducts((prev) => [...prev, ...activeProducts]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(response.pagination.hasNext);
        setPaginationInfo(response.pagination);
        
        // Pré-carrega imagens dos novos produtos
        const productIds = activeProducts.map((product: Product) => product.ID);
        preloadImages(productIds);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showProductLoadError();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, currentPage]);
  
  
  

  // Carregar produtos apenas após categorias estarem carregadas
  useEffect(() => {
    startRenderMeasurement();
    trackPageView('catalog');
    endRenderMeasurement('Catalog');
  }, [startRenderMeasurement, endRenderMeasurement, trackPageView]);

  // Carregar produtos iniciais após categorias estarem prontas
  useEffect(() => {
    if (categoriesLoaded && !isLoading) {
      setHasMore(true);
      fetchProducts(selectedCategory, true);
    }
  }, [categoriesLoaded]);

  // Carregar produtos quando categoria muda (apenas se categorias já carregaram)
  useEffect(() => {
    if (categoriesLoaded) {
      setHasMore(true);
      fetchProducts(selectedCategory, true);
    }
  }, [selectedCategory]);
  
  

  // Callbacks otimizados
  const handleCategoryClick = createThrottledCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
    trackClick('category', 'catalog');
  }, 300);

  const handleShowAllProducts = createThrottledCallback(() => {
    setSelectedCategory(null);
    trackClick('show_all_products', 'catalog');
  }, 300);

  const scrollToProducts = createThrottledCallback(() => {
    viewProductCatalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    trackClick('scroll_to_products', 'catalog');
  }, 300);

  useEffect(() => {
    if (selectedCategory !== null && viewProductCatalogRef.current) {
      viewProductCatalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory]);
  
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ref = loadMoreRef.current;
    if (!ref || isLoading || !hasMore) return;
  
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchProducts(selectedCategory);
      }
    }, {
      rootMargin: '200px', // começa a carregar um pouco antes
    });
  
    observer.observe(ref);
  
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [isLoading, hasMore, selectedCategory, fetchProducts]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FloatingHearts />
      <div className="relative">
        <div className="absolute top-24 -right-3 sm:-top-2 sm:-right-4 sm:left-auto">
          <Stitch />
        </div>
        <MadeToOrderBanner />
      </div>

      <div className="mb-12">
        <h2 className="font-handwritten text-6xl text-purple-800 mb-8 text-center">
          - Categorias -
        </h2>
        

        <div className="flex items-center justify-between mb-8">
          <div className="flex-grow">
            {categoriesLoading ? (
              <div className={`grid gap-6 ${getOptimalGridColumns(3) === 1 ? 'grid-cols-1' : getOptimalGridColumns(3) === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            ) : categoriesError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Erro ao carregar categorias</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${getOptimalGridColumns(3) === 1 ? 'grid-cols-1' : getOptimalGridColumns(3) === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {categories?.map((category) => (
                  <CategoryCard
                    key={category.ID}
                    category={category}
                    onClick={() => handleCategoryClick(category.ID)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="font-handwritten text-6xl text-purple-800 mb-8">
              {selectedCategory
                ? categories.find((c) => c.ID === selectedCategory)?.name
                : 'Todas as Peças'}
            </h2>
            {paginationInfo && (
              <CacheIndicator 
                cached={false} // Será atualizado quando implementarmos cache no frontend
                requestTime={0}
                className="mb-8"
              />
            )}
          </div>
          <FloatingHearts />
           {selectedCategory && (
             <button
               onClick={handleShowAllProducts}
               className="font-kawaii text-purple-600 hover:text-purple-700 text-1xl sm:text-2xl font-medium hover:scale-105 transition-transform"
             >
               Ver todas as categorias
             </button>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={viewProductCatalogRef}>
          {(() => {
            // Não mostrar produtos até categorias carregarem
            if (!categoriesLoaded) {
              return (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <LoadingSpinner size="medium" text="Carregando categorias..." />
                  </div>
                </div>
              );
            }
            
            if (isLoading && products.length === 0) {
              return (
                <div className="col-span-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <CardSkeleton key={index} />
                    ))}
                  </div>
                </div>
              );
            }
            
            if (products.length === 0) {
              return (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <p className="text-xl mb-2">Nenhum produto encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros ou buscar por outro termo</p>
                  </div>
                </div>
              );
            }
            
            return products.map((product) => (
              <ProductCard
                key={product.ID}
                product={product}
                instagramUsername="larifazcroche"
              />
            ));
          })()}
        <div ref={loadMoreRef} className="col-span-full flex justify-center mt-8">
          {isLoading && (
            <LoadingSpinner size="small" text="Carregando mais peças..." />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default Catalog;