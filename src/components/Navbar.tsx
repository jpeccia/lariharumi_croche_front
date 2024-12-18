import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-pink-400" />
            <span className="font-bold text-lg text-purple-800">Larissa Harumi</span>
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-pink-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop and mobile menu */}
          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } lg:flex lg:space-x-8 space-y-4 lg:space-y-0 absolute top-16 left-0 w-full bg-white p-4 lg:static lg:w-auto lg:p-0 transition-all duration-300 ease-in-out max-h-screen overflow-auto`}
          >
            <Link
              to="/"
              className={`${
                isActive('/')
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-pink-500'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className={`${
                isActive('/catalog')
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-pink-500'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Catálogo
            </Link>
            <Link
              to="/care"
              className={`${
                isActive('/care')
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-pink-500'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Cuidados
            </Link>
            <Link
              to="/donation"
              className={`${
                isActive('/donation')
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-pink-500'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Doação
            </Link>
            <Link
              to="/contact"
              className={`${
                isActive('/contact')
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-pink-500'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Contato
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
