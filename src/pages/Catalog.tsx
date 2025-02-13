import { useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Importando o axios configurado
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCard } from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Stitch } from '../components/shared/KawaiiElements/Stitch';

function Catalog() {
  const [categories, setCategories] = useState<any[]>([]); // Estado para categorias
  const [products, setProducts] = useState<any[]>([]); // Estado para produtos
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1); // Para carregar mais produtos conforme o scroll

  const fetchCategories = async () => {
    if (categories.length > 0) return; // Evitar nova requisição se as categorias já foram carregadas

    try {
      const response = await api.get('/categories');
      setCategories(response.data); 
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchProducts = async (categoryId: number | null, page: number) => {
    setLoading(true); // Ativa o estado de carregamento
    try {
      let url = '/products';
      if (categoryId) {
        url = `/products/category/${categoryId}`;
      }

      const response = await api.get(url, { params: { page } });
      const fetchedProducts = response.data;

      // Se não houver mais produtos, atualiza o estado
      if (fetchedProducts.length < 20) {
        setHasMore(false);
      }

      setProducts((prev) => [...prev, ...fetchedProducts]); // Adiciona os novos produtos
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  const loadMoreProducts = () => {
    if (!hasMore || loading) return; // Não carrega mais produtos se já tiver carregado tudo
    setPage((prev) => prev + 1); // Aumenta a página para carregar mais
  };

  // Carregar categorias ao montar o componente
  useEffect(() => {
    fetchCategories(); 
  }, []);

  // Carregar produtos da categoria selecionada ou mostrar todos
  useEffect(() => {
    setProducts([]); // Limpa os produtos ao mudar a categoria
    setPage(1); // Reinicia a página
    setHasMore(true); // Permite carregar mais produtos
    fetchProducts(selectedCategory, 1); // Carrega os produtos da categoria selecionada ou todos
  }, [selectedCategory]);

  // Carregar mais produtos quando a página mudar
  useEffect(() => {
    if (page === 1) return; // Evita chamada para a primeira página
    fetchProducts(selectedCategory, page); 
  }, [page, selectedCategory]);

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
                    console.log('Categoria selecionada:', category.ID);
                    setSelectedCategory(category.ID); // Muda a categoria selecionada
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p>Carregando produtos...</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.ID}
                product={product}
                instagramUsername="lhkowara"
              />
            ))
          )}
        </div>

        {/* Carregar mais produtos */}
        {loading && <p>Carregando mais produtos...</p>}
        {!loading && hasMore && (
          <button
            onClick={loadMoreProducts}
            className="w-full bg-purple-600 text-white py-2 rounded-md"
          >
            Carregar mais
          </button>
        )}
      </div>
    </div>
  );
}

export default Catalog;
