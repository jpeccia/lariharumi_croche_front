import { Heart, Gift, MessageCircle } from 'lucide-react';
import ProductCarousel from '../components/ProductCarousel';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">
          Crochê Feito com Carinho
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Peças únicas e personalizadas, feitas à mão com muito amor
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full transition-colors">
            Ver Catálogo
          </button>
          <button className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-3 rounded-full transition-colors">
            Encomendar Peça
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-purple-800 mb-2">
            Feito com Amor
          </h3>
          <p className="text-gray-600">
            Cada peça é confeccionada com dedicação e carinho
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <Gift className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-purple-800 mb-2">
            Personalização
          </h3>
          <p className="text-gray-600">
            Peças únicas feitas especialmente para você
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <MessageCircle className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-purple-800 mb-2">
            Atendimento
          </h3>
          <p className="text-gray-600">
            Suporte personalizado do início ao fim
          </p>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-purple-800 mb-8 text-center">
          Nossas Criações
        </h2>
        <ProductCarousel />
      </div>
    </div>
  );
}

export default Home;