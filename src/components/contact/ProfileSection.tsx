import { Heart } from 'lucide-react';

export function ProfileSection() {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
      <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-pink-100 flex-shrink-0">
        <img
          src="https://scontent-gru2-2.cdninstagram.com/v/t51.2885-19/464677514_1917146825430614_1083711388709687409_n.jpg?_nc_ht=scontent-gru2-2.cdninstagram.com&_nc_cat=102&_nc_ohc=F3Ouht719BIQ7kNvgGVQjMe&_nc_gid=91eeb084e119494794137d4f29ce4a92&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AYDyAJhH1sIHcpkZFK6oovLNHAOQPlUlm3s5sAnvI0k5VA&oe=6766C88A&_nc_sid=7a9f4b"
          alt="Larissa Harumi"
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-1">
        <div className="font-kawaii prose text-gray-600 space-y-4">
          <p>
            Olá! Sou a Larissa, artesã apaixonada por crochê e criadora de peças únicas
            feitas com muito carinho. Minha jornada começou há alguns anos, quando
            descobri no crochê uma forma de expressar criatividade e amor através
            do artesanato.
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