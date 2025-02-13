import { useRef, useState } from 'react';
import { Coffee, IceCream, Cake, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { DonationTier } from '../components/home/DonationBox/DonationTier';
import { KawaiiMascot } from '../components/home/DonationBox/KawaiiMascot';
import { CuteBunny } from '../components/shared/KawaiiElements/CuteBunny';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';

// Caminhos das imagens de QR Code
const qrCodeImages: Record<number, string> = {
  5: '/qrcode5.jpg',
  10: '/qrcode10.jpg',
  15: '/qrcode15.jpg',
};

const messages = [
  {
    message: "Ficou muito lindinho e idêntico a foto 🥰🥰",
    author: "Duda S.",
  },
  {
    message: "Ficou lindo a gente amou ❤",
    author: "Amanda L.",
  },
  {
    message:
      "Oie boa tarde! Simplesmente não tem defeito nenhum seu trabalho é lindo cada detalhe a concha a pulseira eu amei. Os olhinhos ficaram lindos 😍 Parabéns",
    author: "Beatriz V.",
  },
  {
    message: "Entreguei pra ela ontem, ela amoou o presente",
    author: "Pedro",
  },
  {
    message:
      "Eu recebi o seu trabalhinho e ficou perfeito, ficou ótimo. Você é uma excelente artista, tem um talento excepcional. Minha namorada também amou. Vais muito longe com esse talento.",
    author: "Rogério M.",
  },
  {
    message: "Nossa, ficou incrível, ficou mtt lindo Larih. Superou oq eu estava imaginando",
    author: "Lucas B.",
  },
  {
    message: "Oi, tudo bem? Sou a Maria Paula! Encomendei a Invejinha e o Grinch com você, e eu só queria dizer que você é extremamente talentosa! 🌟💖",
    author: "Lucas B.",
  },
];

export function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;
  const qrCodeRef = useRef<HTMLDivElement | null>(null); // Referência para o QR Code


  const totalPages = Math.ceil(messages.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const currentMessages = messages.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePixDonation = (amount: number) => {
    setSelectedAmount(amount);

    if (qrCodeRef.current) {
      qrCodeRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  };

  

  return (
    <div className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-sm overflow-hidden">
      <FloatingHearts />

      <div className="max-w-3xl mx-auto relative">
        {/* Elementos decorativos */}
        <div className="absolute -top-4 -left-4 transform -rotate-12">
          <CuteBunny />
        </div>
        <div className="absolute -top-4 -right-4 transform rotate-12">
          <CuteBunny />
        </div>

        {/* Mascote e Cabeçalho */}
        <div className="text-center mb-12">
          <KawaiiMascot />
          <h2 className="font-handwritten text-4xl text-purple-800 mt-6 mb-3 flex items-center justify-center gap-2">
            Apoie Meu Trabalho!
            <Sparkles className="w-6 h-6 text-yellow-400 animate-wiggle" />
          </h2>
          <p className="font-kawaii text-gray-600">
            Se tocar no seu coração e quiser ver mais coisinhas legais por aqui,
            sintam-se à vontade para doar.
            Cada doação é como um abraço quentinho que me incentiva a seguir crochetando sonhos! ✨🌸
          </p>
        </div>

        {/* Opções de doação */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <DonationTier
            icon={Coffee}
            title="Cafezinho"
            amount="R$ 5"
            description="Um cafézinho para iniciar o dia! ☕️"
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

        {/* Exibição do QR Code */}
        {selectedAmount !== null && (
          <div className="text-center mt-8 my-12" ref={qrCodeRef}>
            <h3 className="text-xl font-bold text-purple-800 mb-4">
              Escaneie o QR Code para doar R$ {selectedAmount},00 💖
            </h3>
            <div className="inline-block bg-white p-4 rounded-xl shadow-md">
              <img
                src={qrCodeImages[selectedAmount]}
                alt={`QR Code para R$ ${selectedAmount}`}
                className="rounded-md"
              />
            </div>
          </div>
        )}

        {/* Mensagens de Apoio Recentes */}
        <div className="space-y-4 relative">
  <h3 className="font-handwritten text-4xl text-center text-purple-800 mb-6">
    Mensagens Fofas de Apoio 💌
  </h3>

  <div className="relative flex items-center">
    {/* Setas de Navegação */}
    <button
      onClick={handlePrev}
      className="flex-shrink-0 text-purple-600 hover:text-purple-800"
    >
      <ChevronLeft size={36} />
    </button>

    {/* Mensagens */}
    <div className="flex-grow grid md:grid-cols-2 gap-4 mx-auto">
      {currentMessages.map((msg, index) => (
        <div
          key={index}
          className="flex flex-col justify-between bg-white p-4 rounded-lg shadow-md min-h-[150px] max-h-[200px]"
        >
          <p className="text-gray-700 text-sm">{msg.message}</p>
          <p className="text-right text-purple-800 font-bold mt-4">{msg.author}</p>
        </div>
      ))}
    </div>

    <button
      onClick={handleNext}
      className="flex-shrink-0 text-purple-600 hover:text-purple-800"
    >
      <ChevronRight size={36} />
    </button>
  </div>
</div>

        {/* Mensagem de Rodapé */}
        <div className="text-center mt-12">
          <p className="font-kawaii text-sm text-gray-500">
            Cada contribuição me ajudará a transformar cada vez mais fios em histórias únicas! Muito obrigada pelo apoio! 🦋
          </p>
        </div>
      </div>
    </div>
  );
}
