// DonationPage.tsx
import React, { useState } from 'react';
import { Coffee, IceCream, Cake, Sparkles } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { DonationTier } from '../components/home/DonationBox/DonationTier';
import { KawaiiMascot } from '../components/home/DonationBox/KawaiiMascot';
import { SupportMessage } from '../components/home/DonationBox/SupportMessage';
import { CuteBunny } from '../components/shared/KawaiiElements/CuteBunny';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';


export function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const pixKey = import.meta.env.VITE_PIX_KEY;

  const handlePixDonation = (amount: number) => {
    setSelectedAmount(amount);
  };

  const generatePixCode = (amount: number) => {
    return `00020126330014BR.GOV.BCB.PIX0111${pixKey}520400005303986540${amount
      .toFixed(2)
      .replace('.', '')}5802BR5909Larissa6009Sao Paulo62070503***6304`;
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
          <h2 className="font-handwritten text-4xl text-purple-800 mt-6 mb-3 flex items-center justify-center gap-2">
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
            onClick={() => handlePixDonation(5)}
          />
          <DonationTier
            icon={IceCream}
            title="Sorvetinho"
            amount="R$ 10"
            description="Um docinho para adoçar meu dia! 🍦"
            onClick={() => handlePixDonation(10)}
          />
          <DonationTier
            icon={Cake}
            title="Bolinho"
            amount="R$ 15"
            description="Uma fatia de bolo para celebrar! 🍰"
            onClick={() => handlePixDonation(15)}
          />
        </div>

        {/* QR Code Display */}
        {selectedAmount !== null && (
          <div className="text-center mt-8 my-12">
            <h3 className="text-xl font-bold text-purple-800 mb-4">
              Escaneie o QR Code para doar R$ {selectedAmount},00 💖
            </h3>
            <div className="inline-block bg-white p-4 rounded-xl shadow-md">
              <QRCodeCanvas
                value={generatePixCode(selectedAmount)}
                size={200}
                includeMargin={true}
                level="H"
              />
            </div>
          </div>
        )}

        {/* Recent Support Messages */}
        <div className="space-y-4">
          <h3 className="font-handwritten text-4xl text-center text-purple-800 mb-6">
            Mensagens Fofas de Apoio 💌
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <SupportMessage
              message="Suas peças são incríveis! Continue espalhando amor através do crochê! 💕"
              author="João O. P."
            />
            <SupportMessage
              message="Amei meu amigurumi! Cada pontinho feito com tanto carinho ✨"
              author="Lhko"
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
