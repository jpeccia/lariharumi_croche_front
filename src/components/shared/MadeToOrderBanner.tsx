import { Clock, Heart } from 'lucide-react';

export function MadeToOrderBanner() {
  return (
    <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Clock className="w-8 h-8 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
            Adquira sua peça!
            <Heart className="w-4 h-4 text-pink-500" />
          </h3>
          <p className="text-gray-600">
           Verifique a disponibilidade da peça para pronta entrega ou faça seu pedido sob encomenda. Entre em contato diretamente pelo meu Instagram via DM!
          </p>
        </div>
      </div>
    </div>
  );
}