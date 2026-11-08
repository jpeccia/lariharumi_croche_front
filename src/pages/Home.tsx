
import { Suspense, lazy } from 'react';
import { Gift, Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { DonationBox } from '../components/home/DonationBox';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { PromotionBanner } from '../components/shared/PromotionBanner';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { SEOHead } from '../components/shared/SEOHead';
import { openIgDm } from '../utils/instagram';

// Lazy loading para componentes Kawaii pesados
const CuteBunny = lazy(() => import('../components/shared/KawaiiElements/CuteBunny').then(module => ({ default: module.CuteBunny })));
const CutePanda = lazy(() => import('../components/shared/KawaiiElements/CutePanda').then(module => ({ default: module.CutePanda })));
const CuteCinnamoroll = lazy(() => import('../components/shared/KawaiiElements/CuteCinnamoroll').then(module => ({ default: module.CuteCinnamoroll })));
const Cat = lazy(() => import('../components/shared/KawaiiElements/Cat').then(module => ({ default: module.Cat })));

function Home() {
  useMobileOptimization();

  return (
    <>
      <SEOHead
        title="Crochê da Lari - Peças Únicas e Personalizadas"
        description="Descubra peças de crochê únicas e personalizadas feitas à mão com muito carinho pela Larissa Harumi. Catálogo completo, cuidados especiais, encomendas personalizadas e muito mais!"
        keywords={['crochê', 'artesanato', 'peças únicas', 'personalizadas', 'Larissa Harumi', 'feito à mão', 'crochê personalizado', 'artesanato brasileiro', 'peças de crochê', 'encomendas', 'handmade', 'craft']}
        url="/"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <FloatingHearts />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section Redesenhado */}
        <div className="relative text-center mb-20">
          {/* Cinnamoroll acima do título */}
          <div className="flex justify-center mb-6">
            <Suspense fallback={<div className="w-20 h-20 bg-blue-100 rounded-full animate-pulse"></div>}>
              <CuteCinnamoroll />
            </Suspense>
          </div>

          {/* Título Principal */}
          <h1 className="font-handwritten text-4xl sm:text-6xl lg:text-7xl text-purple-800 mb-6 relative break-words">
            Crochê da Lari
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6">
              <Suspense fallback={<div className="w-12 h-12 bg-pink-100 rounded-full animate-pulse"></div>}>
                <CutePanda />
              </Suspense>
            </div>
          </h1>

          {/* Subtítulo */}
          <p className="font-kawaii text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Peças únicas e personalizadas, feitas à mão com muito carinho 💝
          </p>

          {/* Botões Modernos */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a 
              href="/catalog" 
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            >
              <Gift className="w-5 h-5" />
              <span>Ver Catálogo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            <a 
              href={`https://ig.me/m/larifazcroche?text=${encodeURIComponent('Oi Lari! Adorei suas peças 😍 Gostaria de encomendar uma peça. Podemos conversar sobre tamanho, cores e prazo?')}`}
              onClick={(e) => {
                e.preventDefault();
                openIgDm('larifazcroche', 'Oi Lari! Adorei suas peças 😍 Gostaria de encomendar uma peça. Podemos conversar sobre tamanho, cores e prazo?');
              }}
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Encomendar Peça</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          {/* CuteBunny no canto */}
          <div className="absolute -top-8 -right-8 sm:-top-12 sm:-right-12">
            <Suspense fallback={<div className="w-16 h-16 bg-pink-100 rounded-full animate-pulse"></div>}>
              <CuteBunny />
            </Suspense>
          </div>
        </div>

        {/* Banner de Promoção */}
        <PromotionBanner />

        {/* Features Section Melhorada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
            <div className="relative mb-6">
              <Heart className="w-16 h-16 text-pink-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h3 className="font-handwritten text-3xl text-purple-800 mb-4">
              Feito com carinho
            </h3>
            <p className="font-kawaii text-gray-600 leading-relaxed">
              Cada peça é confeccionada com dedicação e carinho especial
            </p>
          </div>

          <div className="group text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
            <div className="relative mb-6">
              <Gift className="w-16 h-16 text-pink-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h3 className="font-handwritten text-3xl text-purple-800 mb-4">
              Personalização
            </h3>
            <p className="font-kawaii text-gray-600 leading-relaxed">
              Peças únicas feitas especialmente para você
            </p>
          </div>

          <div className="group text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
            <div className="relative mb-6">
              <MessageCircle className="w-16 h-16 text-pink-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h3 className="font-handwritten text-3xl text-purple-800 mb-4">
              Atendimento
            </h3>
            <p className="font-kawaii text-gray-600 leading-relaxed">
              Suporte personalizado do início ao fim
            </p>
          </div>
        </div>

        {/* Donation Box com Gato */}
        <div className="mb-16">
          <DonationBox />
        </div>
      </div>
      </div>
    </>
  );
}

export default Home;
