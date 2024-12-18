import React, { useState, useEffect } from 'react';
import { Category } from '../../types/product';
import { adminApi } from '../../services/api';

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: number) => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const [categoryImageUrl, setCategoryImageUrl] = useState<string>(''); // Estado para armazenar a URL da imagem

  useEffect(() => {
    const fetchCategoryImage = async () => {
      try {
        const image = await adminApi.getCategoryImage(category.id); // Supondo que você tenha uma função getCategoryImage
        setCategoryImageUrl(image); // Salva a URL da imagem no estado
      } catch (error) {
        console.error('Erro ao carregar imagem da categoria:', error);
      }
    };

    fetchCategoryImage(); // Carrega a imagem da categoria quando o componente for montado
  }, [category.id]);

  return (
    <div 
      onClick={() => onClick(category.id)}
      className="cursor-pointer group hover:transform hover:scale-105 transition-all duration-300"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-48">
          <img
            src={categoryImageUrl || category.image} // Se a imagem da categoria não for carregada, usa a imagem default da categoria
            alt={category.name}
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
