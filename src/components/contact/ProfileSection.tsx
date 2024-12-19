import { Heart } from 'lucide-react';

export function ProfileSection() {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
      <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-pink-100 flex-shrink-0">
        <img
          src="/lari.jpg"
          alt="Larissa Harumi"
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-1">
        <div className="font-kawaii prose text-gray-600 space-y-4">
          <p>
          Bem vindo! Sou a Larissa, tenho 21 aninhos, 
          moro em Cravinhos e sou estudante de Engenharia Elétrica no IFSP.  
          Há mais ou menos 1 ano comecei minha jornada com o crochê e 
          desde então venho me apaixonando e me aventurando cada vez mais por essa arte! 🌻💫
          </p>
          <p>
          Cada peça que crio é única, feita com todo o cuidado e atenção aos detalhes, 
          especialmente para você! ♡ 
          Acredito que o artesanato tem o poder de transformar momentos em algo ainda mais especial.
          </p>
          <p>
            
          </p>
          <div className="flex items-center gap-2 text-pink-500">
            <Heart className="w-5 h-5 animate-bounce-slow" />
            <span className="font-medium">Feito com carinho</span>
          </div>
        </div>
      </div>
    </div>
  );
}