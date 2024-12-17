// src/pages/Home.tsx

import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCarousel from '../components/ProductCarousel';
import { useNavigate } from 'react-router-dom'; // Importar hook de navegação
import { Gift, Heart, MessageCircle } from 'lucide-react';
import { DonationBox } from '../components/home/DonationBox';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { CuteBunny } from '../components/shared/KawaiiElements/CuteBunny';

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


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative text-center mb-16">
        <FloatingHearts />
        <h1 className="font-handwritten text-4xl text-purple-800 mb-4">
          Crochê da Lari 🧶
        </h1>
        <p className="font-kawaii text-lg text-gray-600 mb-8">
          Peças únicas e personalizadas, feitas à mão com muito carinho 💝
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full transition-all hover:scale-105">
            Ver Catálogo
          </button>
          <button className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-3 rounded-full transition-all hover:scale-105">
            Encomendar Peça
          </button>
        </div>
        <div className="absolute -bottom-8 left-1/4 transform -translate-x-1/2">
          <CuteBunny />
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105">
          <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce-slow" />
          <h3 className="font-handwritten text-xl text-purple-800 mb-2">
            Feito com carinho
          </h3>
          <p className="font-kawaii text-gray-600">
            Cada peça é confeccionada com dedicação e carinho
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105">
          <Gift className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce-slow" />
          <h3 className="font-handwritten text-xl text-purple-800 mb-2">
            Personalização
          </h3>
          <p className="font-kawaii text-gray-600">
            Peças únicas feitas especialmente para você
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105">
          <MessageCircle className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce-slow" />
          <h3 className="font-handwritten text-xl text-purple-800 mb-2">
            Atendimento
          </h3>
          <p className="font-kawaii text-gray-600">
            Suporte personalizado do início ao fim
          </p>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="mb-16">
        <h2 className="font-handwritten text-2xl text-purple-800 mb-8 text-center">Nossas Criações</h2>
        <ProductCarousel categories={categories} products={products} />
      </div>

      {/* Donation Box */}
      <div className="mb-16">
        <DonationBox />
      </div>
    </div>
  );
}

export default Home;
