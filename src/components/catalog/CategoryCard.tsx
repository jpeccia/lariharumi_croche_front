import { memo, useCallback } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Category } from '../../types/product';
import { useCategoryImageCache } from '../../hooks/useImageCache';

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: number) => void;
}

function CategoryCard({ category, onClick }: CategoryCardProps) {
  // Usa o hook otimizado para carregar imagem da categoria
  const { imageUrl: categoryImageUrl, isLoading, error } = useCategoryImageCache(category.ID);
  
  const handleClick = useCallback(() => {
    onClick(category.ID);
  }, [onClick, category.ID]);

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer animate-slide-up"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-purple-100 overflow-hidden transition-all duration-300 hover:-translate-y-2">
        <div className="relative h-56 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center text-gray-500">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">📷</span>
                </div>
                <p className="text-sm font-medium">Erro ao carregar</p>
              </div>
            </div>
          ) : (
            <>
              <img
                loading="lazy"
                src={categoryImageUrl || `${category.image}.webp`}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Ícone de decoração */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-purple-800 group-hover:text-purple-600 transition-colors duration-300">
              {category.name}
            </h3>
            <ArrowRight className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
          </div>
          
          {category.description && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {category.description}
            </p>
          )}
          
          {/* Indicador de clique */}
          <div className="mt-4 flex items-center text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Explorar peças</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoiza o componente para evitar re-renderizações desnecessárias
export default memo(CategoryCard);
