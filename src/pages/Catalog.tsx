import { useState, useEffect, useRef } from 'react';
import CategoryCard from '../components/catalog/CategoryCard';
import ProductCard from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Stitch } from '../components/shared/KawaiiElements/Stitch';
import { MobileOptimizedLoading } from '../components/MobileOptimizedLoading';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import { useAnalytics } from '../services/analytics';

function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const viewProductCatalogRef = useRef<HTMLDivElement>(null);
  
  const { categories, isLoading: categoriesLoading, fetchCategories } = useCategories();
  const { products, isLoading: productsLoading, hasMore, fetchProducts, resetProducts } = useProducts();
  const { deviceInfo, getAnimationConfig } = useMobileOptimization();
  const { startRenderMeasurement, endRenderMeasurement, createThrottledCallback } = usePerformanceOptimization();
  const { trackPageView, trackClick } = useAnalytics();
  
  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    isLoading: productsLoading,
    onLoadMore: () => fetchProducts(selectedCategory, false)
  });
  
  // Carregar categorias quando o componente for montado
  useEffect(() => {
    startRenderMeasurement();
    fetchCategories();
    trackPageView('catalog');
    endRenderMeasurement('Catalog');
  }, [fetchCategories, startRenderMeasurement, endRenderMeasurement, trackPageView]);

  useEffect(() => {
    resetProducts();
    fetchProducts(selectedCategory, true);
  }, [selectedCategory, fetchProducts, resetProducts]);

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

  const selectedCategoryData = categories.find(cat => cat.ID === selectedCategory);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <FloatingHearts />
      <Stitch />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Catálogo Kawaii ✨
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
              Descubra peças únicas feitas com muito amor e carinho
            </p>
            <button
              onClick={scrollToProducts}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 animate-bounce"
            >
              Ver Produtos 🎀
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Categorias 🎨
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore nossas categorias especiais e encontre exatamente o que você procura
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleShowAllProducts}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white shadow-md'
              }`}
            >
              Todas as Peças 🌟
            </button>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center items-center py-12">
              <MobileOptimizedLoading size="medium" text="Carregando categorias..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.ID}
                  category={category}
                  onClick={() => handleCategoryClick(category.ID)}
                  isSelected={selectedCategory === category.ID}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div ref={viewProductCatalogRef} className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {selectedCategoryData ? `${selectedCategoryData.name} 🎀` : 'Todas as Peças ✨'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {selectedCategoryData 
                ? `Peças especiais da categoria ${selectedCategoryData.name.toLowerCase()}`
                : 'Uma coleção completa de peças únicas e especiais'
              }
            </p>
          </div>

          {productsLoading && products.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <MobileOptimizedLoading size="medium" text="Carregando produtos..." />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500">
                Tente selecionar uma categoria diferente ou verificar novamente mais tarde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.ID}
                  ref={index === products.length - 1 ? lastElementRef : null}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {productsLoading && products.length > 0 && (
            <div className="flex justify-center items-center py-8">
              <MobileOptimizedLoading size="small" text="Carregando mais produtos..." />
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">✨ Você viu todos os produtos disponíveis!</p>
            </div>
          )}
        </div>
      </div>

      {/* Made to Order Banner */}
      <MadeToOrderBanner />
    </div>
  );
}

export default Catalog;