import { useState, useEffect } from 'react';
import api from '../services/api'; // Importando o axios configurado
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCard } from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Stitch } from '../components/shared/KawaiiElements/Stitch';

function Catalog() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Função para carregar categorias do back-end
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data); // Setando as categorias
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Função para carregar todos os produtos ou os produtos de uma categoria específica
  const fetchProducts = async (categoryId: number | null) => {
    try {
      let url = '/products'; // URL para todos os produtos
      if (categoryId) {
        url = `/products/category/${categoryId}`; // URL para produtos da categoria específica
      }

      const response = await api.get(url);
      setProducts(response.data); // Setando os produtos filtrados ou todos os produtos
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Carregar categorias e produtos quando o componente for montado
  useEffect(() => {
    fetchCategories(); // Carregar categorias ao montar o componente
  }, []);

  // Carregar os produtos de acordo com a categoria selecionada ou mostrar todos
  useEffect(() => {
    fetchProducts(selectedCategory); // Recarregar os produtos sempre que a categoria mudar
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => setSelectedCategory(category.id)} // Atualiza a categoria selecionada
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
              ? `${categories.find((c) => c.id === selectedCategory)?.name}`
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
            <p>Carregando produtos...</p> // Exibe mensagem de carregamento se não houver produtos
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                instagramUsername="lhkowara"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog;
