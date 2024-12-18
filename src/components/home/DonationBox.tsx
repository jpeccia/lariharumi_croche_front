
import { HeartHandshake, Sparkles } from 'lucide-react';
import { CuteCinnamoroll2 } from '../shared/KawaiiElements/CuteCinnamoroll2';
import { Harry } from '../shared/KawaiiElements/Harry';
import { Cat } from '../shared/KawaiiElements/Cat';

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
        Ooi! Que tal ajudar essa artesã independente a 
        continuar criando peças únicas cheias de amor e muita magia crochetada? 
        </p>

        <h3 className="text-2xl font-bold text-purple-800 mb-4">
        Objetivos
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <img
              src="https://img.freepik.com/fotos-premium/maos-segurando-um-novelo-de-la_155165-11960.jpg"
              alt="Compra de materiais 🧶🐼"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-600">
            Compra de materiais 🧶🐼
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <img
              src="/lari.jpg"
              alt="Feirinha da lari!"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-600">
            Realização e participação de feirinhas 🛍
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <img
              src="/natal.jpg"
              alt="Sorteios temáticos"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-600">
            Trazer mais sorteios temáticos 🎉🎁
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
        <Cat />
          <a
            href="/donation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>Expelliarmus! Apoiar e espalhar boas energias</span>
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Sua generosidade significa muito! 💝
          </p>
        </div>

      </div>
    </div>
  );
}