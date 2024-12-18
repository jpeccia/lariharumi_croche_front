import { Instagram, Github } from 'lucide-react'; // Importando os ícones do Instagram e GitHub
import { SocialLink } from '../components/contact/SocialLink';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { CuteBunny } from '../components/shared/KawaiiElements/CuteBunny';
import { CustomOrderInfo } from '../components/contact/CustomOrderInfo';
import { ProfileSection } from '../components/contact/ProfileSection';

function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative">
        <FloatingHearts />
        
        {/* Header */}
        <div className="relative text-center mb-12">
          <div className="absolute -top-4 -left-4">
            <CuteBunny />
          </div>
          <h2 className="font-handwritten text-4xl text-purple-800">
            Sobre Larissa Harumi ✨
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Profile and About Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ProfileSection />
            <CustomOrderInfo />
          </div>

          {/* Social Links Section */}
          <div>
            <h2 className="font-handwritten text-4xl text-purple-800 mb-6">
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
              <img src="/logo.png" alt="Logo" className="w-72" />
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
              <a href="https://instagram.com/jpeccia" target="_blank" rel="noopener noreferrer">
                <Instagram size={24} className="text-purple-600 hover:text-purple-700" />
              </a>
              <a href="https://github.com/jpeccia" target="_blank" rel="noopener noreferrer">
                <Github size={24} className="text-gray-800 hover:text-gray-900" />
              </a>
            </div>
          </div>

      </div>
    </div>
  );
}

export default Contact;
