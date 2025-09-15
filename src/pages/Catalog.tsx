import { useState, useEffect, useRef } from 'react';
import api, { adminApi } from '../services/api'; // Importando o axios configurado
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCard } from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Stitch } from '../components/shared/KawaiiElements/Stitch';

function Catalog() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const viewProductCatalogRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      
      const sortedCategories = response.data.sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)
      );
  
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const [page, setPage] = useState(1);
  const limit = 12;
  
  const fetchProducts = async (categoryId: number | null, reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;
  
    try {
      setIsLoading(true);
  
      const currentPage = reset ? 1 : page;
      const productsFetched = await adminApi.getProductsByPage(categoryId, currentPage, limit);
      const sorted = productsFetched.sort((a, b) => a.name.localeCompare(b.name));
  
      if (reset) {
        setProducts(sorted);
        setPage(2);
        setHasMore(productsFetched.length === limit);
      } else {
        setProducts((prev) => [...prev, ...sorted]);
        setPage((prev) => prev + 1);
        setHasMore(productsFetched.length === limit);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  // Carregar categorias e produtos quando o componente for montado
  useEffect(() => {
    fetchCategories(); 
  }, []);

  useEffect(() => {
    setHasMore(true); // Reinicia o controle sempre que a categoria muda
    fetchProducts(selectedCategory, true);
  }, [selectedCategory]);
  
  

  useEffect(() => {
    if (selectedCategory !== null && viewProductCatalogRef.current) {
      viewProductCatalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory]);
  
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || isLoading || !hasMore) return;
  
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchProducts(selectedCategory);
      }
    }, {
      rootMargin: '200px', // começa a carregar um pouco antes
    });
  
    observer.observe(loadMoreRef.current);
  
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loadMoreRef.current, isLoading, hasMore, selectedCategory]);
  
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.ID}
                  category={category}
                  onClick={() => {
                    setSelectedCategory(category.ID);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-handwritten text-6xl text-purple-800 mb-8">
            {selectedCategory
              ? `${categories.find((c) => c.ID === selectedCategory)?.name}`
              : 'Todas as Peças'}
          </h2>
          <FloatingHearts />
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)} // Limpa a categoria e exibe todos os produtos
              className="font-kawaii text-purple-600 hover:text-purple-700 text-1xl sm:text-2xl  font-medium hover:scale-105 transition-transform"
            >
              Ver todas as categorias
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={viewProductCatalogRef}>
          {products.length === 0 ? (
            <p>Carregando produtos...</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.ID}
                product={product}
                instagramUsername="larifazcroche"
              />
            ))
          )}
        <div ref={loadMoreRef} className="col-span-full flex justify-center mt-8">
          {isLoading && (
            <span className="text-purple-600 font-kawaii text-xl">Carregando mais peças...</span>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default Catalog;