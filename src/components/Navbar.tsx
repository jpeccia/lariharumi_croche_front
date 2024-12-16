import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-pink-400" />
            <span className="font-bold text-lg text-purple-800">Larissa Harumi</span>
          </Link>
          
          <div className="flex space-x-8">
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