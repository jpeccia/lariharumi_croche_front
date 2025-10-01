import { Gift, Sparkles, Clock } from 'lucide-react';

export function PromotionBanner() {
  return (
    <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-6 border border-pink-200 shadow-sm">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-handwritten text-xl font-semibold text-purple-800">
            ✨ PROMOÇÃO ESPECIAL NO AR! ✨
          </h2>
        </div>
        
        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
          Outubro é o mês de celebrar quem ensina com carinho e quem ilumina nossos dias com alegria! 💞
        </p>
        
        <p className="text-gray-700 text-sm mb-3">
          Para comemorar o Dia das Crianças e o Dia dos Professores, o site inteiro está com
        </p>
        
        <div className="flex justify-center items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-pink-600" />
          <span className="font-bold text-2xl bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md">
            10% DE DESCONTO!
          </span>
          <Gift className="w-5 h-5 text-pink-600" />
        </div>
        
        <p className="text-gray-600 text-sm mb-3">
          É a sua chance de garantir aquele presente perfeito ou se dar um mimo que você tanto queria!
        </p>
        
        <div className="flex justify-center items-center gap-2 bg-orange-100 rounded-lg p-2 border border-orange-200">
          <Clock className="w-4 h-4 text-orange-600" />
          <p className="text-orange-800 text-sm font-medium">
            <span className="font-semibold">Mas atenção:</span> a promoção é válida apenas para pedidos feitos até o dia <span className="font-bold">15/10/2025</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
