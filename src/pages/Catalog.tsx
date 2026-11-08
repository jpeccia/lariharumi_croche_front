import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { Search, Heart, ArrowLeft, ArrowUp, ChevronDown, X } from 'lucide-react';
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

type SortOption = 'nome' | 'menor' | 'maior';

/**
 * Tamanho de página aplicado no cliente para a visão de categoria.
 * O endpoint /products/category/:id devolve TODOS os produtos de uma vez e,
 * sem paginar, o grid renderiza dezenas de <img> apontando para os originais
 * full-res no i.ibb.co ao mesmo tempo. O i.ibb.co estrangula conexões
 * concorrentes (~12-15), então o excedente trava e as imagens não carregam.
 * Paginando em 12 mantemos as requisições de imagem abaixo desse teto.
 */
const CATEGORY_PAGE_SIZE = 12;

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
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('nome');
  const [showTopButton, setShowTopButton] = useState(false);
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

  // Evita avisos de variáveis não utilizadas mantendo as otimizações disponíveis
  void mobileOptimization;
  void createThrottledCallback;

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

      // Populate the image cache BEFORE triggering a re-render so every
      // ProductCard finds its images already resolved on the first render.
      preloadImages(sortedProducts);

      setProducts(sortedProducts);
      setCurrentPage(page);
      setPaginationInfo(paginationInfo);

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

  // Mostrar botão "voltar ao topo" após rolar
  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 520);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    // Categoria é paginada no cliente (dados já em memória): só troca a página.
    // Todas/busca são paginadas no servidor: refetch da página pedida.
    const clientPaginated = selectedCategory !== null && !searchTerm;
    if (!clientPaginated) {
      fetchProducts(selectedCategory, page, searchTerm);
    }
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

  /** @description Limpa todos os filtros ativos (categoria, busca e desconto). */
  const handleClearFilters = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSelectedCategory(null);
    setInputValue('');
    setSearchTerm('');
    setShowOnlyDiscounted(false);
    trackClick('clear_filters', 'catalog');
  }, [trackClick]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (selectedCategory !== null && viewProductCatalogRef.current) {
      viewProductCatalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory]);

  // Volta para a primeira página ao mudar ordenação ou filtro de desconto,
  // evitando ficar numa página inexistente após a lista encolher/reordenar.
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, showOnlyDiscounted]);

  const hasActiveFilters = selectedCategory !== null || !!searchTerm || showOnlyDiscounted;

  /** @description Ordena a lista de produtos da página atual conforme a opção escolhida. */
  const sortProducts = useCallback((list: Product[]): Product[] => {
    const arr = [...list];
    if (sortBy === 'menor') {
      arr.sort((a, b) => (extractNumericPrice(a.priceRange) || 0) - (extractNumericPrice(b.priceRange) || 0));
    } else if (sortBy === 'maior') {
      arr.sort((a, b) => (extractNumericPrice(b.priceRange) || 0) - (extractNumericPrice(a.priceRange) || 0));
    } else {
      arr.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
    }
    return arr;
  }, [sortBy]);

  /**
   * Lista final exibida + paginação.
   * Na visão de categoria a paginação é feita no cliente (o backend devolve
   * todos os produtos), limitando quantas imagens carregam por vez e evitando
   * o estrangulamento do i.ibb.co. Nas demais visões (todas/busca) mantém a
   * paginação vinda do servidor.
   */
  const display = useMemo(() => {
    const filtered = sortProducts(products).filter((p) => {
      if (!showOnlyDiscounted) return true;
      const basePrice = extractNumericPrice(p.priceRange);
      if (isNaN(basePrice)) return false;
      return promoActive && getApplicableDiscount(promotion || undefined, basePrice) > 0;
    });

    const isClientPaginated = selectedCategory !== null && !searchTerm;

    if (isClientPaginated) {
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / CATEGORY_PAGE_SIZE));
      const safePage = Math.min(Math.max(1, currentPage), totalPages);
      const start = (safePage - 1) * CATEGORY_PAGE_SIZE;
      return {
        filtered,
        pageItems: filtered.slice(start, start + CATEGORY_PAGE_SIZE),
        totalPages,
        total,
        limit: CATEGORY_PAGE_SIZE,
      };
    }

    return {
      filtered,
      pageItems: filtered,
      totalPages: paginationInfo?.totalPages ?? 1,
      total: paginationInfo?.total ?? filtered.length,
      limit: paginationInfo?.limit ?? 10,
    };
  }, [products, sortProducts, showOnlyDiscounted, promoActive, promotion, selectedCategory, searchTerm, currentPage, paginationInfo]);

  const chipBase = 'whitespace-nowrap px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 flex-none';
  const chipInactive = 'bg-white border-purple-100 text-gray-600 hover:border-purple-300 hover:text-purple-700';
  const chipActive = 'bg-gradient-to-r from-pink-100 to-purple-100 border-purple-200 text-purple-800';

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

        {/* Sub-barra fixa do catálogo (fica logo abaixo do menu principal / navbar) */}
        <div className="sticky top-16 z-30 bg-white/85 backdrop-blur-md border-b border-purple-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 sm:gap-3 py-3 flex-wrap">
              {/* Busca */}
              <div className="relative order-1 w-full sm:w-72 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Buscar peça (mín. 3 letras)..."
                  className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                {inputValue && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Limpar busca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Chips de categoria (navegação rápida) */}
              <div className="order-3 sm:order-2 flex-1 min-w-0 overflow-x-auto flex gap-2 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  onClick={handleShowAllProducts}
                  className={`${chipBase} ${selectedCategory === null ? chipActive : chipInactive}`}
                >
                  Todas
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.ID}
                    onClick={() => handleCategoryClick(category.ID)}
                    onMouseEnter={() => prefetchCategory(category.ID)}
                    className={`${chipBase} ${selectedCategory === category.ID ? chipActive : chipInactive}`}
                  >
                    {category.name}
                  </button>
                ))}
                <button
                  onClick={() => setShowOnlyDiscounted((v) => !v)}
                  className={`${chipBase} inline-flex items-center gap-1.5 ${showOnlyDiscounted ? 'bg-pink-500 border-transparent text-white' : chipInactive}`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  Com desconto
                </button>
              </div>

              {/* Ordenação */}
              <div className="order-2 sm:order-3 relative flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Ordenar"
                  className="appearance-none pl-3 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="nome">Nome (A–Z)</option>
                  <option value="menor">Menor preço</option>
                  <option value="maior">Maior preço</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
              <div className="text-center mb-12">
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h1 className="font-handwritten text-4xl sm:text-5xl lg:text-6xl text-purple-800 mb-3">
                  Catálogo de Peças
                </h1>
                <p className="font-kawaii text-lg text-gray-600 max-w-2xl mx-auto">
                  Explore nossa coleção única de peças de crochê feitas com muito carinho! ✨
                </p>
              </div>
            </CascadeAnimation>

            {/* Seção de Categorias */}
            <CascadeAnimation delay={300}>
              <div className="mb-12">
                <div className="text-center mb-6">
                  <h2 className="font-handwritten text-3xl sm:text-4xl text-purple-800 mb-1">
                    Categorias
                  </h2>
                  <p className="text-gray-600 text-sm">Toque numa categoria para filtrar as peças</p>
                </div>

                {categoriesLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
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
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {categories?.map((category, index) => (
                      <div key={category.ID} style={{ animationDelay: `${400 + index * 80}ms` }}>
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

            {/* Header dos Produtos + contexto */}
            <CascadeAnimation delay={500}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                <div className="flex items-center gap-4">
                  {selectedCategory && (
                    <button
                      onClick={handleShowAllProducts}
                      className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors flex-none"
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
                          ? categories?.find((c) => c.ID === selectedCategory)?.name
                          : showOnlyDiscounted
                            ? 'Peças com desconto'
                            : 'Todas as Peças'}
                    </h2>
                    {products.length > 0 && (
                      <p className="text-gray-600 text-sm mt-0.5">
                        {display.total} peça{display.total !== 1 ? 's' : ''} encontrada{display.total !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 rounded-full border border-purple-100 bg-white text-sm font-semibold text-purple-600 hover:border-pink-400 hover:text-pink-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Limpar filtros
                  </button>
                )}
              </div>
            </CascadeAnimation>

            {/* Grid de Produtos */}
            <CascadeAnimation delay={600}>
              <div
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
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
                      <>
                        {Array.from({ length: 8 }).map((_, index) => (
                          <SkeletonProductCard key={index} />
                        ))}
                      </>
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
                              ? `Nenhuma peça encontrada para "${searchTerm}"`
                              : 'Nenhuma peça encontrada'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Tente outra categoria ou limpe os filtros.
                          </p>
                          {hasActiveFilters && (
                            <button
                              onClick={handleClearFilters}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                              Ver todas as peças
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (display.filtered.length === 0) {
                    return (
                      <div className="col-span-full text-center py-12">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 max-w-md mx-auto">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🏷️</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Nenhuma peça com desconto nesta seleção
                          </h3>
                          <button
                            onClick={() => setShowOnlyDiscounted(false)}
                            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            Mostrar todas
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return display.pageItems.map((product, index) => (
                    <div key={product.ID} style={{ animationDelay: `${index * 40}ms` }}>
                      <ProductCard
                        product={product}
                        instagramUsername="larifazcroche"
                        priority={index < 8}
                      />
                    </div>
                  ));
                })()}
              </div>
            </CascadeAnimation>

            {/* Paginação (servidor para Todas/busca, cliente para categoria) */}
            {display.totalPages > 1 && (
              <CascadeAnimation delay={700}>
                <div className="mt-12">
                  {/* Paginação para desktop */}
                  <div className="hidden sm:block">
                    <Pagination
                      currentPage={Math.min(currentPage, display.totalPages)}
                      totalPages={display.totalPages}
                      onPageChange={handlePageChange}
                      showInfo={true}
                      itemsPerPage={display.limit}
                      totalItems={display.total}
                      className="justify-center"
                    />
                  </div>

                  {/* Paginação compacta para mobile */}
                  <div className="sm:hidden">
                    <CompactPagination
                      currentPage={Math.min(currentPage, display.totalPages)}
                      totalPages={display.totalPages}
                      onPageChange={handlePageChange}
                      className="justify-center"
                    />
                  </div>
                </div>
              </CascadeAnimation>
            )}
          </div>
        </div>

        {/* Botão voltar ao topo */}
        <button
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          className={`fixed right-4 bottom-4 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            showTopButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Indicador de busca em andamento */}
        {isSearching && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-sm border border-purple-100 shadow-lg rounded-full px-4 py-2">
            <span className="text-sm text-purple-600 font-medium animate-pulse">
              🔍 Buscando por "{searchTerm}"...
            </span>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default Catalog;
