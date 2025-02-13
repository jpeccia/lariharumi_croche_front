import { useState, useEffect } from 'react';
import api from '../services/api';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCard } from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Stitch } from '../components/shared/KawaiiElements/Stitch';

function Catalog() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

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

  const fetchProducts = async (categoryId: number | null, page: number) => {
    try {
      let url = `/products?page=${page}&limit=6`; // Ajuste conforme o backend

      if (categoryId) {
        url = `/products/category/${categoryId}?page=${page}&limit=6`;
      }

      const response = await api.get(url);
      
      setProducts(response.data.products); // A API agora retorna um objeto { products, totalPages }
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory, currentPage);
  }, [selectedCategory, currentPage]);

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
        <h2 className="font-handwritten text-6xl text-purple-800 mb-8 text-center">- Categorias -</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.ID}
              category={category}
              onClick={() => {
                setSelectedCategory(category.ID);
                setCurrentPage(1); // Resetar a página ao mudar de categoria
              }}
            />
          ))}
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
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className="font-kawaii text-purple-600 hover:text-purple-700 text-1xl sm:text-2xl font-medium hover:scale-105 transition-transform"
            >
              Ver todas as categorias
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p>Carregando produtos...</p>
          ) : (
            products.map((product) => (
              <ProductCard key={product.ID} product={product} instagramUsername="lhkowara" />
            ))
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-2 text-white bg-purple-600 rounded-lg ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
            >
              Anterior
            </button>
            <span className="px-4 py-2 mx-2 text-lg font-bold">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 mx-2 text-white bg-purple-600 rounded-lg ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;
