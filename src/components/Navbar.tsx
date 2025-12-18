import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Sparkles, Home, Grid3X3, Shield, Gift, MessageCircle } from 'lucide-react';
import { useState, useEffect, memo } from 'react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/catalog', label: 'Catálogo', icon: Grid3X3 },
  { path: '/care', label: 'Cuidados', icon: Shield },
  { path: '/donation', label: 'Doação', icon: Gift },
  { path: '/contact', label: 'Contato', icon: MessageCircle },
];

/**
 * Main navigation bar component.
 * Memoized to prevent re-renders when parent components update.
 */
function NavbarComponent() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para mudar aparência da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu mobile ao clicar em um link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Fechar menu mobile ao pressionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-purple-100' 
          : 'bg-white/80 backdrop-blur-sm shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
              onClick={handleLinkClick}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-6 w-6 text-pink-500 group-hover:text-pink-600 transition-colors duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-purple-800 group-hover:text-purple-600 transition-colors duration-300">
                  Larissa Harumi
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Artesã 🧶🤍🌸
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      active
                        ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors duration-300 ${
                      active ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-500'
                    }`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    
                    {/* Indicador ativo */}
                    {active && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-105"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-lg z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="px-4 py-6 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    active 
                      ? 'bg-gradient-to-br from-pink-200 to-purple-200' 
                      : 'bg-gray-100 group-hover:bg-purple-100'
                  }`}>
                    <Icon className={`w-4 h-4 transition-colors duration-300 ${
                      active ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-500'
                    }`} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Spacer para compensar a navbar fixa */}
      <div className="h-16" />
    </>
  );
}

export default memo(NavbarComponent);
