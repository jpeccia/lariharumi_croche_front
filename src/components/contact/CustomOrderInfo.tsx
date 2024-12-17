import { Clock, MessageCircle, Sparkles } from 'lucide-react';

export function CustomOrderInfo() {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 shadow-sm">
      <h3 className="font-handwritten text-xl text-purple-800 mb-4 flex items-center gap-2">
        Encomendas Personalizadas 
        <Sparkles className="w-5 h-5 text-yellow-400" />
      </h3>
      
      <div className="space-y-4 font-kawaii">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-pink-400 mt-1" />
          <p className="text-gray-700">
            Para encomendas personalizadas, entre em contato através do Direct do Instagram. Adoro criar peças únicas e especiais para cada pessoa! 💝
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-pink-400 mt-1" />
          <div className="text-gray-700">
            <p className="mb-2">Prazos aproximados:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Amigurumis pequenos: 3-5 dias</li>
              <li>Amigurumis médios/grandes: 7-10 dias</li>
              <li>Peças personalizadas especiais: a combinar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}