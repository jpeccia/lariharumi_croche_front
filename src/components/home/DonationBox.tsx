import React from 'react';
import { HeartHandshake, Sparkles, Coffee } from 'lucide-react';

export function DonationBox() {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 shadow-sm">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <HeartHandshake className="w-16 h-16 text-pink-400" />
            <Sparkles className="w-6 h-6 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          Caixinha Solidária
        </h2>
        
        <p className="text-gray-600 mb-6">
          Se você aprecia meu trabalho e deseja apoiar esta artesã independente,
          considere fazer uma contribuição. Cada doação ajuda a manter vivo o amor
          pelo artesanato e permite que eu continue criando peças únicas com todo carinho.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1452827073306-6e6e661baf57?auto=format&fit=crop&q=80&w=800"
              alt="Artesã trabalhando em crochê"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-600">
              Cada peça é feita com dedicação e amor, 
              transformando fios em histórias únicas
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1614771637369-ed94441a651a?auto=format&fit=crop&q=80&w=800"
              alt="Materiais de artesanato"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-600">
              Sua contribuição ajuda a manter viva a arte do crochê
              e incentiva o artesanato local
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <a
            href="/donation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105"
          >
            <Coffee className="w-5 h-5" />
            <span>Apoiar com um Cafezinho</span>
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Sua generosidade significa muito! 💝
          </p>
        </div>
      </div>
    </div>
  );
}