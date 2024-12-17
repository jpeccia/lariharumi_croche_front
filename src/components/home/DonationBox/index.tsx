import React from 'react';
import { Coffee, IceCream, Cake, Sparkles } from 'lucide-react';
import { KawaiiMascot } from './KawaiiMascot';
import { DonationTier } from './DonationTier';
import { SupportMessage } from './SupportMessage';
import { FloatingHearts } from '../../shared/KawaiiElements/FloatingHearts';
import { CuteBunny } from '../../shared/KawaiiElements/CuteBunny';

export function DonationBox() {
  const handleDonation = (amount: number) => {
    window.open(`https://ko-fi.com/larissaharumi/${amount}`, '_blank');
  };

  return (
    <div className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-sm overflow-hidden">
      <FloatingHearts />
      
      <div className="max-w-3xl mx-auto relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 transform -rotate-12">
          <CuteBunny />
        </div>
        <div className="absolute -top-4 -right-4 transform rotate-12">
          <CuteBunny />
        </div>

        {/* Mascot and Header */}
        <div className="text-center mb-12">
          <KawaiiMascot />
          <h2 className="font-handwritten text-3xl text-purple-800 mt-6 mb-3 flex items-center justify-center gap-2">
            Apoie Meu Trabalho! 
            <Sparkles className="w-6 h-6 text-yellow-400 animate-wiggle" />
          </h2>
          <p className="font-kawaii text-gray-600">
            Oii! Que tal me ajudar a continuar criando peças fofas e cheias de amor? 
            Cada doação é como um abraço quentinho que me incentiva a seguir tecendo sonhos! 🧶💕
          </p>
        </div>

        {/* Donation Tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <DonationTier
            icon={Coffee}
            title="Cafezinho"
            amount="R$ 5"
            description="Um cafézinho para me manter inspirada! ☕️"
            onClick={() => handleDonation(5)}
          />
          <DonationTier
            icon={IceCream}
            title="Sorvetinho"
            amount="R$ 10"
            description="Um docinho para adoçar meu dia! 🍦"
            onClick={() => handleDonation(10)}
          />
          <DonationTier
            icon={Cake}
            title="Bolinho"
            amount="R$ 15"
            description="Uma fatia de bolo para celebrar! 🍰"
            onClick={() => handleDonation(15)}
          />
        </div>

        {/* Recent Support Messages */}
        <div className="space-y-4">
          <h3 className="font-handwritten text-2xl text-center text-purple-800 mb-6">
            Mensagens Fofas de Apoio 💌
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <SupportMessage
              message="Suas peças são incríveis! Continue espalhando amor através do crochê! 💕"
              author="Mari S."
            />
            <SupportMessage
              message="Amei meu amigurumi! Cada pontinho feito com tanto carinho ✨"
              author="Júlia K."
            />
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <p className="font-kawaii text-sm text-gray-500">
            Cada contribuição me ajuda a comprar mais novelos e criar mais peças cheias de amor! 
            Muito obrigada pelo seu apoio! 🌸
          </p>
        </div>
      </div>
    </div>
  );
}