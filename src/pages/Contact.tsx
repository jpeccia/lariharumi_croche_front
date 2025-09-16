import { Instagram, Github, Linkedin, Heart, Sparkles, MapPin, MessageCircle } from 'lucide-react';
import { SocialLink } from '../components/contact/SocialLink';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { CustomOrderInfo } from '../components/contact/CustomOrderInfo';
import { ProfileSection } from '../components/contact/ProfileSection';
import { CuteCow } from '../components/shared/KawaiiElements/CuteCow';
import { SEOHead } from '../components/shared/SEOHead';
import { Suspense } from 'react';

function Contact() {
  return (
    <>
      <SEOHead
        title="Contato - Larissa Harumi | Crochê da Lari"
        description="Entre em contato com Larissa Harumi para encomendas personalizadas de crochê. Conheça mais sobre a artesã e como podemos criar algo especial juntos!"
        keywords={['contato Larissa Harumi', 'encomendas crochê', 'artesã crochê', 'crochê personalizado', 'contato artesanato', 'Larissa Harumi contato']}
        url="/contact"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <FloatingHearts />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Elemento decorativo responsivo */}
          <div className="absolute top-8 sm:top-12 md:-top-12 left-auto right-4 sm:left-4 md:left-6 sm:right-auto z-10">
            <Suspense fallback={<div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full animate-pulse"></div>}>
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                <CuteCow />
              </div>
            </Suspense>
          </div>

          {/* Header Melhorado */}
          <div className="relative text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            <h2 className="font-handwritten text-4xl sm:text-5xl md:text-6xl text-purple-800 mb-4">
              Sobre Larissa Harumi
            </h2>
            <p className="font-kawaii text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça um pouco mais sobre mim e como podemos criar algo especial juntos! ✨
            </p>
          </div>

          {/* Main Content Melhorado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Profile and About Section - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-purple-100">
                <ProfileSection />
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-purple-100">
                <CustomOrderInfo />
              </div>
            </div>

            {/* Social Links Section Melhorada */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-purple-100">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <h2 className="font-handwritten text-3xl sm:text-4xl text-purple-800 mb-2">
                    Onde me Encontrar 💌
                  </h2>
                  <p className="text-gray-600">Vamos conversar sobre seu projeto especial!</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <SocialLink
                    platform="Instagram"
                    username="larifazcroche"
                    url="https://www.instagram.com/larifazcroche/"
                    Icon={Instagram}
                  />
                </div>

                {/* Informações de Contato */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
                  <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Localização
                  </h3>
                  <p className="text-gray-600">Cravinhos, SP</p>
                </div>

                {/* Logo */}
                <div className="flex justify-center">
                  <img src="/logo.png" alt="Logo" className="w-48 sm:w-56 opacity-90 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section Simplificada */}
          <div className="text-center py-8">
            <p className="text-gray-600 text-sm">
              Desenvolvido com 💖 por <span className="font-medium text-purple-700">João Otávio Peccia</span>
            </p>
            
            {/* Social Media Links do Desenvolvedor */}
            <div className="flex justify-center space-x-4 mt-4">
              <a 
                href="https://github.com/jpeccia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://instagram.com/jpeccia_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/joao-peccia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Contact;
