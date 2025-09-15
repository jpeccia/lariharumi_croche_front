import { useState, useEffect, useRef, useCallback } from 'react';
import api, { publicApi } from '../services/api';
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
import { Pagination, CompactPagination } from '../components/shared/Pagination';

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const viewProductCatalogRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginatedResponse<Product>['pagination'] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
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

  const fetchProducts = useCallback(async (categoryId: number | null, page: number = 1, searchQuery: string = '') => {
    if (isLoading) return;
  
    try {
      setIsLoading(true);
      setIsSearching(!!searchQuery);
  
      const config: PaginationConfig = {
        page: page,
        limit: 10,
      };
      
      let response;
      if (searchQuery.trim()) {
        // Usar busca se há termo de pesquisa
        response = await publicApi.searchProducts(searchQuery, config);
      } else {
        // Usar listagem normal
        response = await publicApi.getProductsByPage(categoryId, config);
      }
      
      // Compatibilidade: verificar diferentes estruturas de resposta
      let productsFetched: Product[];
      let paginationInfo: PaginatedResponse<Product>['pagination'] | null = null;
      
      if (response && typeof response === 'object' && 'data' in response && 'metadata' in response) {
        // Nova estrutura com data e metadata (lista geral paginada)
        const apiResponse = response as { data: Product[]; metadata: any };
        productsFetched = apiResponse.data;
        paginationInfo = {
          page: apiResponse.metadata.page || page,
          limit: apiResponse.metadata.limit || config.limit,
          total: apiResponse.metadata.total || productsFetched.length,
          totalPages: apiResponse.metadata.totalPages || Math.ceil(productsFetched.length / config.limit),
          hasNext: apiResponse.metadata.hasNext || false,
          hasPrev: apiResponse.metadata.hasPrev || page > 1
        };
      } else if (response && typeof response === 'object' && 'data' in response && 'pagination' in response) {
        // Estrutura PaginatedResponse
        const paginatedResponse = response as PaginatedResponse<Product>;
        productsFetched = paginatedResponse.data;
        paginationInfo = paginatedResponse.pagination;
      } else if (Array.isArray(response)) {
        // Array simples (produtos por categoria ou busca sem paginação)
        productsFetched = response as Product[];
        
        if (categoryId) {
          // Produtos por categoria: sem paginação
          paginationInfo = null;
        } else {
          // Busca ou lista geral: criar paginação
          paginationInfo = {
            page: page,
            limit: config.limit,
            total: productsFetched.length,
            totalPages: Math.ceil(productsFetched.length / config.limit),
            hasNext: productsFetched.length === config.limit,
            hasPrev: page > 1
          };
        }
      } else {
        console.error('Resposta da API:', response);
        throw new Error('Formato de resposta inválido da API');
      }
      
      // Filtrar produtos deletados (soft delete) - apenas se o campo existir
      const activeProducts = productsFetched.filter(product => 
        !product.isDeleted && !product.deletedAt
      );
  
      setProducts(activeProducts);
      setCurrentPage(page);
      setPaginationInfo(paginationInfo);
      
      // Pré-carrega imagens dos produtos da página atual
      const productIds = activeProducts.map((product: Product) => product.ID);
      preloadImages(productIds);
      
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showProductLoadError();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  
  

  // Carregar produtos apenas após categorias estarem carregadas
  useEffect(() => {
    startRenderMeasurement();
    trackPageView('catalog');
    endRenderMeasurement('Catalog');
  }, [startRenderMeasurement, endRenderMeasurement, trackPageView]);

  // Carregar produtos iniciais após categorias estarem prontas
  useEffect(() => {
    if (categoriesLoaded && !isLoading) {
      setCurrentPage(1);
      fetchProducts(selectedCategory, 1, searchTerm);
    }
  }, [categoriesLoaded]);

  // Carregar produtos quando categoria muda (apenas se categorias já carregaram)
  useEffect(() => {
    if (categoriesLoaded) {
      setCurrentPage(1);
      fetchProducts(selectedCategory, 1, searchTerm);
    }
  }, [selectedCategory]);

  // Carregar produtos quando termo de busca muda
  useEffect(() => {
    if (categoriesLoaded) {
      setCurrentPage(1);
      fetchProducts(selectedCategory, 1, searchTerm);
    }
  }, [searchTerm]);
  
  

  // Callbacks otimizados
  const handleCategoryClick = createThrottledCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
    trackClick('category', 'catalog');
  }, 300);

  const handleShowAllProducts = createThrottledCallback(() => {
    setSelectedCategory(null);
    trackClick('show_all_products', 'catalog');
  }, 300);

  const handlePageChange = createThrottledCallback((page: number) => {
    setCurrentPage(page);
    fetchProducts(selectedCategory, page, searchTerm);
    trackClick('page_change', 'catalog');
    
    // Scroll para o topo dos produtos
    viewProductCatalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 300);

  const handleSearch = createThrottledCallback((query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
    fetchProducts(selectedCategory, 1, query);
    trackClick('search', 'catalog');
  }, 500);

  const handleClearSearch = createThrottledCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchProducts(selectedCategory, 1, '');
    trackClick('clear_search', 'catalog');
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
        {/* Campo de Busca */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar peças de crochê..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {isSearching && (
              <div className="mt-2 text-center">
                <span className="text-sm text-purple-600 font-medium">
                  🔍 Buscando por "{searchTerm}"...
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="font-handwritten text-6xl text-purple-800 mb-8">
              {searchTerm 
                ? `Resultados para "${searchTerm}"`
                : selectedCategory
                ? categories.find((c) => c.ID === selectedCategory)?.name
                : 'Todas as Peças'}
            </h2>
          </div>
          <FloatingHearts />
           {selectedCategory && !searchTerm && (
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
                    <p className="text-xl mb-2">
                      {searchTerm 
                        ? `Nenhum produto encontrado para "${searchTerm}"`
                        : 'Nenhum produto encontrado'
                      }
                    </p>
                    <p className="text-sm">
                      {searchTerm 
                        ? 'Tente buscar por outro termo ou limpar a busca'
                        : 'Tente ajustar os filtros ou buscar por outro termo'
                      }
                    </p>
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Limpar busca
                      </button>
                    )}
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
        </div>

        {/* Paginação */}
        {paginationInfo && paginationInfo.totalPages > 1 && (
          <div className="mt-12">
            {/* Paginação para desktop */}
            <div className="hidden sm:block">
              <Pagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
                showInfo={true}
                itemsPerPage={paginationInfo.limit}
                totalItems={paginationInfo.total}
                className="justify-center"
              />
            </div>
            
            {/* Paginação compacta para mobile */}
            <div className="sm:hidden">
              <CompactPagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
                className="justify-center"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;