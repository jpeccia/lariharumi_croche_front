import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Search, Grid, List, Heart, ArrowLeft } from 'lucide-react';
import { publicApi } from '../services/api';
import CategoryCard from '../components/catalog/CategoryCard';
import ProductCard from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';
import { PromotionBanner } from '../components/shared/PromotionBanner';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Stitch } from '../components/shared/KawaiiElements/Stitch';
import { SEOHead } from '../components/shared/SEOHead';
import { preloadImages } from '../hooks/useImageCache';
import { showProductLoadError } from '../utils/toast';
import { Product } from '../types/product';
import { PaginatedResponse, PaginationConfig } from '../types/api';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import { useAnalytics } from '../services/analytics';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { SkeletonProductCard, SkeletonCategoryCard } from '../components/shared/SkeletonLoader';
import { useCategoriesCache } from '../hooks/useApiCache';
import { Pagination, CompactPagination } from '../components/shared/Pagination';
import { PageTransition, CascadeAnimation, FadeIn } from '../components/shared/PageTransition';
import { usePromotionStore } from '../store/promotionStore';
import { isPromotionActive, getApplicableDiscount } from '../types/promotion';
import { extractNumericPrice } from '../utils/price';

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const viewProductCatalogRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginatedResponse<Product>['pagination'] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productsCacheRef = useRef<Map<string, { products: Product[]; pagination: PaginatedResponse<Product>['pagination'] | null; timestamp: number }>>(new Map());
  const prefetchingRef = useRef<Set<string>>(new Set());

  // Hooks de otimização
  const mobileOptimization = useMobileOptimization();
  const performanceOptimization = usePerformanceOptimization();
  const startRenderMeasurement = performanceOptimization?.startRenderMeasurement || (() => { });
  const endRenderMeasurement = performanceOptimization?.endRenderMeasurement || (() => { });
  const createThrottledCallback = performanceOptimization?.createThrottledCallback || ((callback: any) => callback);
  const analytics = useAnalytics();
  const trackPageView = analytics?.trackPageView || (() => { });
  const trackClick = analytics?.trackClick || (() => { });
  const promotion = usePromotionStore((s) => s.promotion);
  const promoActive = isPromotionActive(promotion || undefined);

  // Cache de categorias
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategoriesCache();


  // Monitorar quando categorias são carregadas
  useEffect(() => {
    if (categories && !categoriesLoading) {
      setCategoriesLoaded(true);
    }
  }, [categories, categoriesLoading]);

  /**
   * Fetches products from the API, cancelling any in-flight request via AbortController.
   * Supports fetching by category, by search query, or all products with pagination.
   */
  const fetchProducts = useCallback(async (categoryId: number | null, page: number = 1, searchQuery: string = '') => {
    const CACHE_TTL_MS = 5 * 60 * 1000;
    const cacheKey = searchQuery ? `search:${searchQuery}:${page}` : `cat:${categoryId ?? 'all'}:${page}`;

    const cached = productsCacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setProducts(cached.products);
      setCurrentPage(page);
      setPaginationInfo(cached.pagination);
      setIsLoading(false);
      setIsSearching(false);
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      setIsSearching(!!searchQuery);

      const config: PaginationConfig = {
        page: page,
        limit: 10,
      };

      let response;
      if (searchQuery.trim()) {
        response = await publicApi.searchProducts(searchQuery, config);
      } else {
        response = await publicApi.getProductsByPage(categoryId, config);
      }

      if (controller.signal.aborted) return;

      let productsFetched: Product[];
      let paginationInfo: PaginatedResponse<Product>['pagination'] | null = null;

      if (response && typeof response === 'object' && 'data' in response && 'metadata' in response) {
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
        const paginatedResponse = response as PaginatedResponse<Product>;
        productsFetched = paginatedResponse.data;
        paginationInfo = paginatedResponse.pagination;
      } else if (Array.isArray(response)) {
        productsFetched = response as Product[];

        if (categoryId) {
          paginationInfo = null;
        } else {
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

      const activeProducts = productsFetched.filter(product =>
        !product.isDeleted && !product.deletedAt
      );

      const sortedProducts = [...activeProducts].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
      );

      productsCacheRef.current.set(cacheKey, {
        products: sortedProducts,
        pagination: paginationInfo,
        timestamp: Date.now(),
      });

      setProducts(sortedProducts);
      setCurrentPage(page);
      setPaginationInfo(paginationInfo);

      preloadImages(sortedProducts);

    } catch (error: unknown) {
      if (controller.signal.aborted) return;
      console.error('Erro ao buscar produtos:', error);
      showProductLoadError();
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setIsSearching(false);
      }
    }
  }, []);




  useEffect(() => {
    startRenderMeasurement();
    trackPageView('catalog');
    endRenderMeasurement('Catalog');
  }, [startRenderMeasurement, endRenderMeasurement, trackPageView]);

  /**
   * Single consolidated effect that reacts to category, search, or initial load changes.
   * Replaces three separate useEffects to prevent race conditions and stale closures.
   */
  useEffect(() => {
    if (!categoriesLoaded) return;
    setCurrentPage(1);
    fetchProducts(selectedCategory, 1, searchTerm);
  }, [categoriesLoaded, selectedCategory, searchTerm, fetchProducts]);

  /**
   * Cleanup: abort in-flight requests and clear debounce timer on unmount.
   */
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  /** @description Selects a category and lets the consolidated effect trigger the fetch. */
  const handleCategoryClick = useCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
    trackClick('category', 'catalog');
  }, [trackClick]);

  /**
   * Prefetches products for a category in the background when the user hovers a CategoryCard.
   * Silently populates the cache so the click fetch returns instantly from cache.
   */
  const prefetchCategory = useCallback(async (categoryId: number) => {
    const CACHE_TTL_MS = 5 * 60 * 1000;
    const cacheKey = `cat:${categoryId}:1`;

    if (productsCacheRef.current.has(cacheKey) && Date.now() - (productsCacheRef.current.get(cacheKey)?.timestamp ?? 0) < CACHE_TTL_MS) return;
    if (prefetchingRef.current.has(cacheKey)) return;

    prefetchingRef.current.add(cacheKey);
    try {
      const response = await publicApi.getProductsByPage(categoryId, { page: 1, limit: 10 });
      let productsFetched: Product[] = [];
      let paginationResult: PaginatedResponse<Product>['pagination'] | null = null;

      if (response && typeof response === 'object' && 'data' in response && 'metadata' in response) {
        const apiResponse = response as { data: Product[]; metadata: any };
        productsFetched = apiResponse.data;
        paginationResult = {
          page: apiResponse.metadata.page || 1,
          limit: apiResponse.metadata.limit || 10,
          total: apiResponse.metadata.total || productsFetched.length,
          totalPages: apiResponse.metadata.totalPages || Math.ceil(productsFetched.length / 10),
          hasNext: apiResponse.metadata.hasNext || false,
          hasPrev: false
        };
      } else if (response && typeof response === 'object' && 'data' in response && 'pagination' in response) {
        const paginatedResponse = response as PaginatedResponse<Product>;
        productsFetched = paginatedResponse.data;
        paginationResult = paginatedResponse.pagination;
      } else if (Array.isArray(response)) {
        productsFetched = response as Product[];
        paginationResult = null;
      }

      const activeProducts = productsFetched.filter(p => !p.isDeleted && !p.deletedAt);
      const sortedProducts = [...activeProducts].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));

      productsCacheRef.current.set(cacheKey, {
        products: sortedProducts,
        pagination: paginationResult,
        timestamp: Date.now(),
      });

      preloadImages(sortedProducts);
    } catch {
      /* Prefetch silently fails */
    } finally {
      prefetchingRef.current.delete(cacheKey);
    }
  }, []);

  /** @description Clears the selected category to show all products. */
  const handleShowAllProducts = useCallback(() => {
    setSelectedCategory(null);
    trackClick('show_all_products', 'catalog');
  }, [trackClick]);

  /** @description Handles pagination: fetches products for the given page. */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchProducts(selectedCategory, page, searchTerm);
    trackClick('page_change', 'catalog');
    viewProductCatalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [fetchProducts, selectedCategory, searchTerm, trackClick]);

  /**
   * Debounced search handler. Updates the input display value immediately
   * and only triggers the actual search (sets searchTerm) after 500ms and
   * when the query has at least 3 characters (or is cleared).
   */
  const handleSearchInput = useCallback((query: string) => {
    setInputValue(query);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      if (query.length >= 3 || query.length === 0) {
        setSearchTerm(query);
        trackClick('search', 'catalog');
      }
    }, 500);
  }, [trackClick]);

  /** @description Clears both the input display and the search term. */
  const handleClearSearch = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setInputValue('');
    setSearchTerm('');
    trackClick('clear_search', 'catalog');
  }, [trackClick]);


  useEffect(() => {
    if (selectedCategory !== null && viewProductCatalogRef.current) {
      viewProductCatalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory]);

  return (
    <PageTransition>
      <SEOHead
        title="Catálogo de Produtos - Crochê da Lari"
        description="Explore nosso catálogo completo de peças de crochê únicas e personalizadas. Amigurumis, acessórios, decorações e muito mais, todos feitos à mão com muito carinho!"
        keywords={['catálogo crochê', 'produtos crochê', 'amigurumis', 'acessórios crochê', 'decoração crochê', 'peças personalizadas', 'Larissa Harumi']}
        url="/catalog"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <FloatingHearts />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative">
            {/* Elemento decorativo */}
            <div className="absolute top-24 -right-3 sm:-top-2 sm:-right-4 sm:left-auto z-10">
              <Suspense fallback={<div className="w-16 h-16 bg-pink-100 rounded-full animate-pulse"></div>}>
                <Stitch />
              </Suspense>
            </div>

            {/* Banner */}
            <FadeIn delay={100}>
              {promoActive ? <PromotionBanner /> : <MadeToOrderBanner />}
            </FadeIn>

            {/* Header Principal */}
            <CascadeAnimation delay={200}>
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-purple-600" />
                  </div>
                </div>
                <h1 className="font-handwritten text-4xl sm:text-5xl lg:text-6xl text-purple-800 mb-4">
                  Catálogo de Peças
                </h1>
                <p className="font-kawaii text-lg text-gray-600 max-w-2xl mx-auto">
                  Explore nossa coleção única de peças de crochê feitas com muito carinho! ✨
                </p>
              </div>
            </CascadeAnimation>

            {/* Banner de Promoção */}
            {/* <PromotionBanner /> */}

            {/* Seção de Categorias */}
            <CascadeAnimation delay={300}>
              <div className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="font-handwritten text-3xl sm:text-4xl text-purple-800 mb-2">
                    Categorias
                  </h2>
                  <p className="text-gray-600">Escolha uma categoria para ver as peças</p>
                </div>

                {categoriesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <SkeletonCategoryCard key={index} />
                    ))}
                  </div>
                ) : categoriesError ? (
                  <div className="text-center py-12">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 max-w-md mx-auto">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">😔</span>
                      </div>
                      <p className="text-red-600 mb-4 font-medium">Erro ao carregar categorias</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories?.map((category, index) => (
                      <div key={category.ID} style={{ animationDelay: `${400 + index * 100}ms` }}>
                        <CategoryCard
                          category={category}
                          onClick={() => handleCategoryClick(category.ID)}
                          onMouseEnter={() => prefetchCategory(category.ID)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CascadeAnimation>

            {/* Barra de Busca e Filtros */}
            <CascadeAnimation delay={500}>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Campo de Busca */}
                  <div className="flex-1 relative">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Buscar peças de crochê (mín. 3 letras)..."
                        value={inputValue}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      {inputValue && (
                        <button
                          onClick={handleClearSearch}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {isSearching && (
                      <div className="mt-2 text-center">
                        <span className="text-sm text-purple-600 font-medium animate-pulse">
                          🔍 Buscando por "{searchTerm}"...
                        </span>
                      </div>
                    )}
                    {inputValue.length > 0 && inputValue.length < 3 && (
                      <div className="mt-2 text-center">
                        <span className="text-sm text-gray-400">
                          Digite mais {3 - inputValue.length} letra{3 - inputValue.length > 1 ? 's' : ''} para buscar
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botões de Visualização */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                          ? 'bg-purple-100 text-purple-600'
                          : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                          ? 'bg-purple-100 text-purple-600'
                          : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <label className="ml-3 flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={showOnlyDiscounted} onChange={(e) => setShowOnlyDiscounted(e.target.checked)} />
                      Mostrar apenas com desconto
                    </label>
                  </div>
                </div>
              </div>
            </CascadeAnimation>

            {/* Header dos Produtos */}
            <CascadeAnimation delay={600}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  {selectedCategory && (
                    <button
                      onClick={handleShowAllProducts}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm font-medium">Voltar</span>
                    </button>
                  )}
                  <div>
                    <h2 className="font-handwritten text-3xl sm:text-4xl text-purple-800">
                      {searchTerm
                        ? `Resultados para "${searchTerm}"`
                        : selectedCategory
                          ? categories.find((c) => c.ID === selectedCategory)?.name
                          : 'Todas as Peças'}
                    </h2>
                    {paginationInfo && (
                      <p className="text-gray-600 text-sm mt-1">
                        {paginationInfo.total} peça{paginationInfo.total !== 1 ? 's' : ''} encontrada{paginationInfo.total !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CascadeAnimation>

            {/* Grid de Produtos */}
            <CascadeAnimation delay={700}>
              <div
                className={`${viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                  }`}
                ref={viewProductCatalogRef}
              >
                {(() => {
                  // Não mostrar produtos até categorias carregarem
                  if (!categoriesLoaded) {
                    return (
                      <div className="col-span-full text-center py-12">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 max-w-md mx-auto">
                          <LoadingSpinner size="lg" text="Carregando categorias..." />
                        </div>
                      </div>
                    );
                  }

                  if (isLoading && products.length === 0) {
                    return (
                      <div className="col-span-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {Array.from({ length: 8 }).map((_, index) => (
                            <SkeletonProductCard key={index} />
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (products.length === 0) {
                    return (
                      <div className="col-span-full text-center py-12">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 max-w-md mx-auto">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔍</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {searchTerm
                              ? `Nenhum produto encontrado para "${searchTerm}"`
                              : 'Nenhum produto encontrado'
                            }
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {searchTerm
                              ? 'Tente buscar por outro termo ou limpar a busca'
                              : 'Tente ajustar os filtros ou buscar por outro termo'
                            }
                          </p>
                          {searchTerm && (
                            <button
                              onClick={handleClearSearch}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                              Limpar busca
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return products
                    .filter((p) => {
                      if (!showOnlyDiscounted) return true;
                      const basePrice = extractNumericPrice(p.priceRange);
                      if (isNaN(basePrice)) return false;
                      return promoActive && getApplicableDiscount(promotion || undefined, basePrice) > 0;
                    })
                    .map((product, index) => (
                      <div key={product.ID} style={{ animationDelay: `${800 + index * 50}ms` }}>
                        <ProductCard
                          product={product}
                          instagramUsername="larifazcroche"
                        />
                      </div>
                    ));
                })()}
              </div>
            </CascadeAnimation>

            {/* Paginação */}
            {paginationInfo && paginationInfo.totalPages > 1 && (
              <CascadeAnimation delay={900}>
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
              </CascadeAnimation>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Catalog;