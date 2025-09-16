import { useRef, useState } from 'react';
import { Coffee, IceCream, Cake, Sparkles, ChevronLeft, ChevronRight, Heart, Copy, Check } from 'lucide-react';
import { DonationTier } from '../components/home/DonationBox/DonationTier';
import { KawaiiMascot } from '../components/home/DonationBox/KawaiiMascot';
import { CuteBunny } from '../components/shared/KawaiiElements/CuteBunny';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { Suspense } from 'react';

// Caminhos das imagens de QR Code
const qrCodeImages: Record<number, string> = {
  5: '/qrcode5.jpg',
  10: '/qrcode10.jpg',
  15: '/qrcode15.jpg',
};

const messages = [
  {
    message: "Ficou muito lindinho e idêntico a foto! Cada detalhe perfeito, você tem um dom especial! 🥰✨",
    author: "Duda S.",
    emoji: "🌸"
  },
  {
    message: "Ficou lindo demais! A gente amou cada ponto, cada carinho que você colocou! ❤️",
    author: "Amanda L.",
    emoji: "💕"
  },
  {
    message: "Oie! Simplesmente não tem defeito nenhum! Seu trabalho é lindo, cada detalhe, a concha, a pulseira... eu amei! Os olhinhos ficaram lindos! Você é uma artista incrível! 😍",
    author: "Beatriz V.",
    emoji: "🌟"
  },
  {
    message: "Entreguei pra ela ontem e ela amou o presente! Ficou ainda mais lindo do que imaginávamos! 🎁",
    author: "Pedro",
    emoji: "🎉"
  },
  {
    message: "Recebi seu trabalhinho e ficou perfeito! Você é uma excelente artista com talento excepcional! Minha namorada também amou! Você vai muito longe com esse talento! 💖",
    author: "Rogério M.",
    emoji: "🦋"
  },
  {
    message: "Nossa, ficou incrível! Superou tudo que eu estava imaginando! Você é demais, Larih! ✨",
    author: "Lucas B.",
    emoji: "💫"
  },
  {
    message: "Oi! Encomendei a Invejinha e o Grinch com você, e só queria dizer que você é extremamente talentosa! Cada peça é uma obra de arte! 🌟💖",
    author: "Maria Paula",
    emoji: "🎨"
  },
  {
    message: "Você é simplesmente incrível! Cada detalhe, cada ponto único, o carinho e a delicadeza que você coloca em cada trabalho são impressionantes! Parabéns pelo talento e pelo amor que transmite! 😍💖",
    author: "Anônimo",
    emoji: "💝"
  },
  {
    message: "Cada peça sua é como um abraço de fios! Você transforma simples linhas em sonhos coloridos! Obrigada por espalhar tanta alegria! 🧶✨",
    author: "Cliente Feliz",
    emoji: "🌈"
  },
  {
    message: "Seu trabalho é pura magia! Cada crochê que você faz carrega tanto amor e dedicação! Você é uma inspiração! 💫🦄",
    author: "Fã Número 1",
    emoji: "🦄"
  }
];

export function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [copiedPix, setCopiedPix] = useState(false);
  const itemsPerPage = 2;
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  // Chave PIX para copiar
  const pixKey = "16982207951"; // Substitua pela chave PIX real

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

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar PIX:', err);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <FloatingHearts />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="relative text-center mb-16">
          {/* Elementos decorativos */}
          <div className="absolute -top-8 -left-8 transform -rotate-12">
            <Suspense fallback={<div className="w-16 h-16 bg-pink-100 rounded-full animate-pulse"></div>}>
              <CuteBunny />
            </Suspense>
          </div>
          <div className="absolute -top-8 -right-8 transform rotate-12">
            <Suspense fallback={<div className="w-16 h-16 bg-pink-100 rounded-full animate-pulse"></div>}>
              <CuteBunny />
            </Suspense>
          </div>

          {/* Mascote e Cabeçalho */}
          <div className="mb-8">
            <KawaiiMascot />
          </div>
          
          <h2 className="font-handwritten text-4xl sm:text-5xl lg:text-6xl text-purple-800 mb-4 flex items-center justify-center gap-3">
            Caixinha Solidária da Lari!
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </h2>
          
          <p className="font-kawaii text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ooi! Se você se encantou com meu trabalho e quer me ajudar a continuar criando peças únicas cheias de amor e magia crochetada, fique à vontade para contribuir! 
            Cada doação é como um abraço quentinho que me incentiva a seguir transformando fios em sonhos! ✨🧶💕
          </p>
        </div>

        {/* Opções de doação melhoradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <DonationTier
            icon={Coffee}
            title="Cafezinho"
            amount="R$ 5"
            description="Um cafézinho para iniciar o dia! ☕️"
            onClick={() => handlePixDonation(5)}
            isSelected={selectedAmount === 5}
          />
          <DonationTier
            icon={IceCream}
            title="Sorvetinho"
            amount="R$ 10"
            description="Um docinho para adoçar meu dia! 🍦"
            onClick={() => handlePixDonation(10)}
            isSelected={selectedAmount === 10}
          />
          <DonationTier
            icon={Cake}
            title="Bolinho"
            amount="R$ 15"
            description="Uma fatia de bolo para celebrar! 🍰"
            onClick={() => handlePixDonation(15)}
            isSelected={selectedAmount === 15}
          />
        </div>

        {/* Seção de Pagamento */}
        {selectedAmount !== null && (
          <div className="text-center mb-16" ref={qrCodeRef}>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-purple-100 max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                Doação de R$ {selectedAmount},00 💖
              </h3>
              
              <p className="text-gray-600 mb-6">
                Escaneie o QR Code ou copie a chave PIX para fazer sua doação
              </p>

              {/* QR Code */}
              <div className="inline-block bg-white p-4 rounded-2xl shadow-md mb-6">
                <img
                  src={qrCodeImages[selectedAmount]}
                  alt={`QR Code para R$ ${selectedAmount}`}
                  className="rounded-xl"
                />
              </div>

              {/* Chave PIX para copiar */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Chave PIX:</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-lg font-mono text-gray-800 bg-white px-4 py-2 rounded-lg border">
                    {pixKey}
                  </code>
                  <button
                    onClick={copyPixKey}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      copiedPix 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                  >
                    {copiedPix ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copiedPix && (
                  <p className="text-green-600 text-sm mt-2">Chave PIX copiada! 🎉</p>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Obrigada pelo seu apoio! Cada contribuição faz a diferença 💝
              </p>
            </div>
          </div>
        )}

        {/* Mensagens de Apoio Melhoradas */}
        <div className="mb-16">
          <h3 className="font-handwritten text-4xl text-center text-purple-800 mb-8">
            Depoimentos Fofos dos Clientes 💌✨
          </h3>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-purple-100">
            <div className="relative flex items-center">
              {/* Setas de Navegação Melhoradas */}
              <button
                onClick={handlePrev}
                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-600 hover:text-purple-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>

              {/* Mensagens */}
              <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mx-3 sm:mx-6">
                {currentMessages.map((msg, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center flex-shrink-0 text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                        {msg.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{msg.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-purple-800 font-semibold text-xs sm:text-sm">{msg.author}</p>
                      <div className="flex space-x-1">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-600 hover:text-purple-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Indicadores de página melhorados */}
            <div className="flex justify-center mt-8 space-x-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentPage 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125 shadow-md' 
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mensagem de Rodapé Melhorada */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-purple-100 max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            <h4 className="font-handwritten text-2xl text-purple-800 mb-4">
              Muito Obrigada pelo Seu Apoio! 💖
            </h4>
            <p className="font-kawaii text-lg text-gray-600 leading-relaxed mb-4">
              Cada contribuição é como um abraço quentinho que me incentiva a continuar criando peças únicas cheias de amor e magia crochetada! 
              Com seu apoio, posso investir em materiais de qualidade e participar de feirinhas para levar meu trabalho para mais pessoas! ✨🧶
            </p>
            <p className="text-purple-600 font-medium">
              Você está ajudando uma artesã independente a transformar sonhos em realidade! 🌈💫
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationPage;
