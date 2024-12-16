import React from 'react';
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
            Feito sob encomenda
            <Heart className="w-4 h-4 text-pink-500" />
          </h3>
          <p className="text-gray-600">
            Todas as peças são confeccionadas após o pedido, com muito carinho e atenção aos detalhes
          </p>
        </div>
      </div>
    </div>
  );
}