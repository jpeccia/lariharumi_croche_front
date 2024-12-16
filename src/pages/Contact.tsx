import { Instagram, Heart } from 'lucide-react';
import { SocialLink } from '../components/contact/SocialLink';

function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* About Section */}
        <div>
          <h2 className="text-3xl font-bold text-purple-800 mb-6">
            Sobre Larissa Harumi
          </h2>
          <div className="prose text-gray-600 space-y-4">
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
              <Heart className="w-5 h-5" />
              <span className="font-medium">Feito com carinho</span>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div>
          <h2 className="text-3xl font-bold text-purple-800 mb-6">
            Onde me Encontrar
          </h2>
          <div className="space-y-4">
            <SocialLink
              platform="Instagram"
              username="lhkowara"
              url="https://instagram.com/lhkowara"
              Icon={Instagram}
            />
          </div>

          <div className="mt-8 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
              Encomendas Personalizadas
            </h3>
            <p className="text-gray-700 mb-4">
              Tem uma ideia especial em mente? Entre em contato comigo através do instagram
              para conversarmos sobre sua encomenda
              personalizada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;