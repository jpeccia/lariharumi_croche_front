import { Instagram, Github, Linkedin } from 'lucide-react'; // Importando os ícones do Instagram e GitHub
import { SocialLink } from '../components/contact/SocialLink';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { CustomOrderInfo } from '../components/contact/CustomOrderInfo';
import { ProfileSection } from '../components/contact/ProfileSection';
import { CuteCow } from '../components/shared/KawaiiElements/CuteCow';

function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative">
        <FloatingHearts />
        <div className="absolute top-24 sm:-top-12 left-auto right-1 sm:left-6 sm:right-auto">
          <CuteCow />
        </div>



        {/* Header */}
        <div className="relative text-center mb-12">
          <h2 className="font-handwritten text-4xl sm:text-5xl md:text-6xl text-purple-800">
            Sobre Larissa Harumi
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Profile and About Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ProfileSection />
            <CustomOrderInfo />
          </div>

          {/* Social Links Section */}
          <div>
            <h2 className="font-handwritten text-3xl sm:text-4xl text-purple-800 mb-6">
              Onde me Encontrar 💌
            </h2>
            <div className="space-y-4">
              <SocialLink
                platform="Instagram"
                username="lhkowara"
                url="https://instagram.com/lhkowara"
                Icon={Instagram}
              />
            </div>
            <div className="flex justify-center space-y-4 my-8">
              <img src="/logo.png" alt="Logo" className="w-56 sm:w-72" />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-300 text-center py-4 mt-12">
          <p className="text-sm text-gray-600">
            Site criado por <span className="font-bold">João Otávio Peccia</span>
          </p>
        </div>

        {/* Social Media Links in Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Conheça meu trabalho também:</p>
          <div className="flex justify-center space-x-6 mt-2">
          <a href="https://github.com/jpeccia" target="_blank" rel="noopener noreferrer">
              <Github size={24} className="text-gray-800 hover:text-gray-900" />
            </a>
            <a href="https://instagram.com/jpeccia_" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} className="text-purple-600 hover:text-purple-700" />
            </a>
            <a href="https://www.linkedin.com/in/joao-peccia/" target="_blank" rel="noopener noreferrer">
              <Linkedin size={24} className="text-gray-800 hover:text-gray-900" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;
