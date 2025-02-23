import { useState, useEffect, useRef } from 'react';
import api from '../services/api'; // Importando o axios configurado
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCard } from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Stitch } from '../components/shared/KawaiiElements/Stitch';

function getPromotionEndTime() {
  const now = new Date();
  // Define 18:00 de hoje
  const promotionStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    18,
    0,
    0
  );
  // Mesmo que o usuário acesse antes das 18:00, a promoção termina 48h após as 18:00.
  return new Date(promotionStart.getTime() + 48 * 60 * 60 * 1000);
}

// Componente que exibe o countdown da promoção
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const promotionEnd = getPromotionEndTime();
    return promotionEnd.getTime() - Date.now();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const promotionEnd = getPromotionEndTime();
      const newTimeLeft = promotionEnd.getTime() - Date.now();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Formata o tempo restante para dd hh:mm:ss ou hh:mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  return (
    <span className="text-2xl text-purple-800 mb-4">
      Promoção acaba em {formatTime(timeLeft)}!<br />
      - 5% OFF nas compras acima de R$30<br />
      - 10% OFF nas compras de R$100-R$200
    </span>
  );
}


function Catalog() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const viewProductCatalogRef = useRef<HTMLDivElement>(null);

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

  const fetchProducts = async (categoryId: number | null) => {
    try {
      let url = '/products';
      if (categoryId) {
        url = `/products/category/${categoryId}`;
      }
  
      const response = await api.get(url);  
      // Ordena os produtos por nome antes de atualizar o estado
      const sortedProducts = response.data.sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)
      );
  
      setProducts(sortedProducts); // Atualiza o estado com os produtos ordenados
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

  // Rolagem automática para a seção de produtos quando uma categoria é selecionada
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
      <CountdownTimer />

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
                    console.log('Categoria selecionada:', category.ID); // Verifica se o ID está correto
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