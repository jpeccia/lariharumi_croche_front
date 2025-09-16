import { Clock, Sparkles, MessageCircle } from 'lucide-react';

export function CustomOrderInfo() {
  return (
    <div>
      <h3 className="font-handwritten text-4xl text-purple-800 mb-6 flex items-center gap-3">
        Encomendas
        <Sparkles className="w-6 h-6 text-yellow-400" />
      </h3>
      
      <div className="space-y-6 font-kawaii">
        {/* Como fazer encomenda */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-purple-800 text-lg mb-2">Como fazer sua encomenda:</h4>
              <p className="text-gray-700 leading-relaxed">
                Entre em contato pelo Instagram <span className="font-bold text-purple-600">@larifazcroche</span> 
                e me conte sobre sua ideia! Vamos conversar sobre tamanho, cores, prazo e todos os detalhes especiais.
              </p>
            </div>
          </div>
        </div>
        
        {/* Prazos */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h4 className="font-bold text-purple-800 text-lg mb-2">Prazos aproximados:</h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Os prazos de cada peça dependem muito do tamanho e quantidade de pedidos!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Caso precisar de alguma peça para uma determinada data é só me avisar!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}