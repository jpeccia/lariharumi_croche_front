
import { Suspense, lazy } from 'react';
import { Gift, Heart, MessageCircle } from 'lucide-react';
import { DonationBox } from '../components/home/DonationBox';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';

// Lazy loading para componentes Kawaii pesados
const CuteBunny = lazy(() => import('../components/shared/KawaiiElements/CuteBunny').then(module => ({ default: module.CuteBunny })));
const CutePanda = lazy(() => import('../components/shared/KawaiiElements/CutePanda').then(module => ({ default: module.CutePanda })));
const CuteCinnamoroll = lazy(() => import('../components/shared/KawaiiElements/CuteCinnamoroll').then(module => ({ default: module.CuteCinnamoroll })));

function Home() {
  // Removido carregamento desnecessário de dados não utilizados


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <FloatingHearts />
    <div className="relative w-40 h-40"></div>
    {/* Hero Section */}
    <div className="relative text-center mb-16">

        <div className="absolute -top-32 sm:-top-4 left-auto right-1 sm:left-auto sm:-right-4">
          <Suspense fallback={<div className="w-16 h-16 bg-pink-100 rounded-full animate-pulse"></div>}>
            <CutePanda />
          </Suspense>
        </div>
        <div className="absolute top-[-160px] left-1/2 transform -translate-x-1/2">
          <Suspense fallback={<div className="w-16 h-16 bg-blue-100 rounded-full animate-pulse"></div>}>
            <CuteCinnamoroll />
          </Suspense>
        </div>
      <h1 className="font-handwritten text-6xl text-purple-800 mb-4">
        Crochê da Lari
      </h1>
      <p className="font-kawaii text-lg text-gray-600 mb-8">
        Peças únicas e personalizadas, feitas à mão com muito carinho 💝
      </p>
      <div className="flex justify-center space-x-4">
        {/* Botão para ver o catálogo */}
        <a 
          href="/catalog" 
          className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full transition-all hover:scale-105"
        >
          Ver Catálogo
        </a>

        {/* Botão para encomendar peça - link para DM do Instagram */}
        <a 
          href="https://www.instagram.com/larifazcroche/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-3 rounded-full transition-all hover:scale-105"
        >
          Encomendar Peça
        </a>
      </div>
      <div className="absolute -top-32 sm:-top-4 left-1 right-auto sm:-left-4 sm:right-auto">
        <Suspense fallback={<div className="w-16 h-16 bg-pink-100 rounded-full animate-pulse"></div>}>
          <CuteBunny />
        </Suspense>
      </div>
    </div>
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105">
          <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce-slow" />
          <h3 className="font-handwritten text-4xl text-purple-800 mb-2">
            Feito com carinho
          </h3>
          <p className="font-kawaii text-gray-600">
            Cada peça é confeccionada com dedicação e carinho
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105">
          <Gift className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce-slow" />
          <h3 className="font-handwritten text-4xl text-purple-800 mb-2">
            Personalização
          </h3>
          <p className="font-kawaii text-gray-600">
            Peças únicas feitas especialmente para você
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105">
          <MessageCircle className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce-slow" />
          <h3 className="font-handwritten text-4xl text-purple-800 mb-2">
            Atendimento
          </h3>
          <p className="font-kawaii text-gray-600">
            Suporte personalizado do início ao fim
          </p>
        </div>
      </div>

      {/* Donation Box */}
      <div className="mb-16">
        <DonationBox />
      </div>
    </div>
  );
}

export default Home;
