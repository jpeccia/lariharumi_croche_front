import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { adminApi } from '../../services/api';
import { Category } from '../../types/product';

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: number) => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const [categoryImageUrl, setCategoryImageUrl] = useState<string>(''); // URL da imagem

  useEffect(() => {
    const fetchCategoryImage = async () => {
      try {
        const image = await adminApi.getCategoryImage(category.ID);
        setCategoryImageUrl(image);
      } catch (error) {
        console.error('Erro ao carregar imagem da categoria:', error);
      }
    };

    fetchCategoryImage();
  }, [category.ID]);

  return (
    <div 
      onClick={() => onClick(category.ID)}
      className="cursor-pointer group hover:transform hover:scale-105 transition-all duration-300"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-48">
          <LazyLoadImage
            alt={category.name}
            src={categoryImageUrl || category.image} // Usa imagem carregada ou default
            effect="blur" // Efeito de blur enquanto carrega
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">{category.name}</h3>
          <p className="text-gray-600 text-sm">{category.description}</p>
        </div>
      </div>
    </div>
  );
}
