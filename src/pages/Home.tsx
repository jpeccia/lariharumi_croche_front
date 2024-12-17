// src/pages/Home.tsx

import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCarousel from '../components/ProductCarousel';
import { useNavigate } from 'react-router-dom'; // Importar hook de navegação

function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const history = useNavigate(); // Hook de navegação para redirecionamento

  // Função para carregar categorias e produtos do back-end
  const fetchData = async () => {
    try {
      const categoriesResponse = await api.get('/categories');
      const productsResponse = await api.get('/products');
      
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Função para redirecionar para a página de doação
  const handleDonateClick = () => {
    history.push('/doacao'); // Redirecionando para a página de doação
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">Crochê Feito com Carinho</h1>
        <p className="text-lg text-gray-600 mb-8">Peças únicas e personalizadas, feitas à mão com muito amor</p>
        <div className="flex justify-center space-x-4">
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full transition-colors">Ver Catálogo</button>
          <button className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-3 rounded-full transition-colors">Encomendar Peça</button>
        </div>

        {/* Botão de doação - Contribua com a caixinha da Lari */}
        <div className="mt-8">
          <button
            onClick={handleDonateClick} // Ao clicar, redireciona
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors"
          >
            Contribua com a caixinha da Lari 💛
          </button>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-purple-800 mb-8 text-center">Nossas Criações</h2>
        <ProductCarousel categories={categories} products={products} />
      </div>
    </div>
  );
}

export default Home;
