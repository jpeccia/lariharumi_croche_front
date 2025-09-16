import { Droplets, Sun, Wind, Thermometer, Sparkles, Heart } from 'lucide-react';
import { CareCard } from '../components/care/CareCard';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { CutePanda } from '../components/shared/KawaiiElements/CutePanda';
import { Suspense } from 'react';

const careInstructions = [
  {
    id: 1,
    title: 'Lavagem',
    description: 'Lave suas peças de crochê à mão com água fria ou morna. Use sabão neutro e evite esfregar com força para não danificar as fibras. Não torcer e enxaguar com água corrente (tire o excesso da água com uma toalha).',
    Icon: Droplets
  },
  {
    id: 2,
    title: 'Secagem',
    description: 'Seque as peças na horizontal, sobre uma toalha limpa, longe da luz solar direta. Não torça o item, apenas pressione suavemente para remover o excesso de água.',
    Icon: Sun
  },
  {
    id: 3,
    title: 'Armazenamento',
    description: 'Guarde as peças dobradas em local fresco e seco. Evite pendurar itens de crochê, pois podem deformar devido ao próprio peso.',
    Icon: Wind
  },
  {
    id: 4,
    title: 'Temperatura',
    description: 'Não use água quente ou secadora. Altas temperaturas podem encolher ou deformar as peças de crochê.',
    Icon: Thermometer
  }
];

function Care() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <FloatingHearts />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section Melhorado */}
        <div className="relative text-center mb-16">
          {/* Elemento decorativo no topo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-purple-600 animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          <h1 className="font-handwritten text-5xl sm:text-6xl lg:text-7xl text-purple-800 mb-6">
            Cuidados com suas Peças
          </h1>
          <p className="font-kawaii text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Para que suas peças de crochê durem mais tempo e mantenham sua beleza,
            siga estas recomendações de cuidados especiais ✨
          </p>
        </div>

        {/* Cards de Cuidados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {careInstructions.map((instruction) => (
            <CareCard
              key={instruction.id}
              title={instruction.title}
              description={instruction.description}
              Icon={instruction.Icon}
            />
          ))}
        </div>

        {/* Seção de Dicas Adicionais Melhorada */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-purple-100">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Conteúdo */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-purple-800">
                  Dicas Adicionais
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ul className="font-kawaii space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Evite usar alvejantes ou produtos químicos agressivos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Para peças brancas, use água oxigenada volume 10 diluída</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Guarde as peças protegidas de poeira e insetos</span>
                  </li>
                </ul>
                
                <ul className="font-kawaii space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Não deixe de molho com outros produtos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Em caso de manchas, lave imediatamente com água fria</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use sabão neutro para preservar as fibras</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Panda decorativo */}
            <div className="flex-shrink-0">
              <Suspense fallback={<div className="w-32 h-32 bg-pink-100 rounded-full animate-pulse"></div>}>
                <CutePanda />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-purple-800 mb-4">
              Precisa de Mais Ajuda?
            </h3>
            <p className="text-gray-600 mb-6">
              Entre em contato comigo no Instagram para tirar suas dúvidas sobre os cuidados das suas peças!
            </p>
            <a
              href="https://www.instagram.com/larifazcroche/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            >
              <Heart className="w-5 h-5" />
              <span>Falar no Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Care;