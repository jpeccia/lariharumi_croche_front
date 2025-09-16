import { Heart, Sparkles, MapPin } from 'lucide-react';

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
            Olá! Sou a Larissa 💖
          </h3>
          
          <div className="font-kawaii prose text-gray-600 space-y-4">
            <p className="text-lg leading-relaxed">
              Bem vindo! Sou a Larissa, tenho 21 aninhos, 
              moro em Cravinhos e sou estudante de Engenharia Elétrica no IFSP.  
              Há mais ou menos 1 ano comecei minha jornada com o crochê e 
              desde então venho me apaixonando e me aventurando cada vez mais por essa arte! 🌻💫
            </p>
            <p className="text-lg leading-relaxed">
              Cada peça que crio é única, feita com todo o cuidado e atenção aos detalhes, 
              especialmente para você! ♡ 
              Acredito que o artesanato tem o poder de transformar momentos em algo ainda mais especial.
            </p>
          </div>
        </div>
      </div>

      {/* Informação de localização */}
      <div className="mt-8">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-purple-800">Localização</h4>
          </div>
          <p className="text-gray-700">Cravinhos, São Paulo</p>
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