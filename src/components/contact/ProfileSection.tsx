import { Heart, Sparkles } from 'lucide-react';

export function ProfileSection() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
        <div className="relative mx-auto md:mx-0">
          <div className="w-56 h-56 rounded-full overflow-hidden shadow-xl border-4 border-purple-100 flex-shrink-0">
            <img
              src="/lari.jpg"
              alt="Larissa Harumi"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
          {/* Decoração */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="font-handwritten text-3xl text-purple-800 mb-4">
            Bem-vindo ao Lari Faz Crochê! 💖
          </h3>

          <div className="font-kawaii prose text-gray-600 space-y-4">
            <p className="text-lg leading-relaxed">
              Tenho 23 anos, sou formada em Engenharia Elétrica e atualmente estou me
              aventurando no mundo do empreendedorismo, unindo duas paixões: o crochê e
              o universo fitness.
            </p>
            <p className="text-lg leading-relaxed">
              O crochê faz parte da minha história há algum tempo e se tornou muito mais
              do que uma atividade ou um hobby. É algo que realmente amo fazer! Gosto de
              cada etapa do processo, desde escolher os fios até ver uma ideia ganhar
              forma através das minhas mãos.
            </p>
            <p className="text-lg leading-relaxed">
              Para mim, o artesanato tem uma beleza única, pois não existem duas peças
              exatamente iguais. Cada criação é feita com cuidado, carinho e atenção aos
              detalhes, carregando um pouquinho de dedicação e amor em cada ponto. 🌻💫
            </p>
            <p className="text-lg leading-relaxed">
              Espero que você encontre por aqui um pouquinho da minha paixão!
            </p>
            <p className="text-lg leading-relaxed">
              Com carinho,<br />
              <span className="font-handwritten text-2xl text-purple-700">Lari Harumi ♡</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mensagem especial */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-full border border-purple-200">
          <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
          <span className="font-medium text-purple-800">Feito com muito carinho e dedicação</span>
          <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}