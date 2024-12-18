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
          Olá! Meu nome é Larissa, 
          moro em Cravinhos e sou estudante de Engenharia Elétrica no IFSP. 
          Há um tempo me apaixonei pelo crochê e 
          desde então venho fazendo todas as peças com muito carinho!
          </p>
          <p>
            Cada peça que crio é única e feita especialmente para você, com todo
            o cuidado e atenção aos detalhes. Acredito que o artesanato tem o
            poder de tornar momentos ainda mais especiais.
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