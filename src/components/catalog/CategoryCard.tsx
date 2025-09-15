import { memo, useCallback } from 'react';
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
      className="cursor-pointer group hover:transform hover:scale-105 transition-all duration-300"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-48">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
              <div className="text-center text-gray-500">
                <p className="text-sm">Erro ao carregar</p>
              </div>
            </div>
          ) : (
            <img
              loading="lazy"
              src={categoryImageUrl || `${category.image}.webp`}
              alt={category.name}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">{category.name}</h3>
          <p className="text-gray-600 text-sm">{category.description}</p>
        </div>
      </div>
    </div>
  );
}

// Memoiza o componente para evitar re-renderizações desnecessárias
export default memo(CategoryCard);
