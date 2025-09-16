
import { HeartHandshake, Sparkles, Gift, Star, Heart, ArrowRight, Zap, Package, PiggyBank } from 'lucide-react';
import { CuteCinnamoroll2 } from '../shared/KawaiiElements/CuteCinnamoroll2';
import { Harry } from '../shared/KawaiiElements/Harry';
import { Cat } from '../shared/KawaiiElements/Cat';
import { Suspense } from 'react';

export function DonationBox() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-8 shadow-2xl border border-purple-100">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Header com ícone melhorado */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl border-4 border-white">
                <PiggyBank className="w-12 h-12 text-white group-hover:text-pink-100 transition-colors duration-300 drop-shadow-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h2 className="font-handwritten text-3xl sm:text-4xl md:text-5xl text-purple-800 mb-4 relative">
            Caixinha Solidária
            <div className="absolute -top-2 -right-1 sm:-top-2 sm:-right-2">
              <Suspense fallback={<div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-100 rounded-full animate-pulse"></div>}>
                <div className="w-6 h-6 sm:w-8 sm:h-8">
                  <CuteCinnamoroll2 />
                </div>
              </Suspense>
            </div>
          </h2>
          
          <p className="font-kawaii text-lg text-gray-600 mb-2 max-w-2xl mx-auto leading-relaxed">
            Ooi! Que tal ajudar essa artesã independente a continuar criando peças únicas cheias de amor e muita magia crochetada? ✨
          </p>
          <p className="text-sm text-purple-600 font-medium">
            Sua generosidade transforma fios em sonhos! 🧶💖
          </p>
        </div>

        {/* Seção de objetivos com design moderno */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="font-handwritten text-3xl text-purple-800 mb-2">
              Nossos Objetivos
            </h3>
            <p className="text-gray-600">Juntos podemos fazer a diferença!</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Objetivo 1 - Materiais */}
            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-pink-100">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src="/materiais.jpg"
                  alt="Compra de materiais"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                  <Gift className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-purple-800 mb-2">Materiais Premium</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Compra de fios de qualidade e materiais especiais para criar peças ainda mais lindas! 🧶🐼
                </p>
              </div>
            </div>
            
            {/* Objetivo 2 - Feirinhas */}
            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src="/feirinha.jpg"
                  alt="Feirinha da lari!"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-purple-800 mb-2">Feirinhas Artesanais</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Participação em feirinhas para levar o crochê da Lari para mais pessoas! 🛍✨
                </p>
              </div>
            </div>

            {/* Objetivo 3 - Sorteios */}
            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src="/sorteio.jpg"
                  alt="Sorteios temáticos"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-purple-800 mb-2">Sorteios Temáticos</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Mais sorteios incríveis para espalhar alegria e magia crochetada! 🎉🎁
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action melhorado */}
        <div className="text-center">
          {/* Gato grudado no topo do botão */}
          <div className="flex justify-center -mb-8">
            <Suspense fallback={<div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>}>
              <Cat />
            </Suspense>
          </div>
          
          {/* Botão principal com design kawaii */}
          <div className="relative inline-block">
            <a
              href="/donation"
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform overflow-hidden"
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Ícones */}
              <Zap className="w-6 h-6 group-hover:animate-pulse" />
              <span className="relative z-10">Expelliarmus! Apoiar e espalhar boas energias</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            
          </div>
          
          {/* Texto de apoio */}
          <div className="mt-6 space-y-2">
            <p className="text-sm text-purple-600 font-medium">
              Sua generosidade significa muito! 💝
            </p>
            <p className="text-xs text-gray-500">
              Cada contribuição ajuda a transformar sonhos em realidade ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}