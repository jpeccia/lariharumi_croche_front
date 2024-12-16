import { Category } from '../../types/product';

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: number) => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div 
      onClick={() => onClick(category.id)}
      className="cursor-pointer group hover:transform hover:scale-105 transition-all duration-300"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-48">
          <img
            src={category.image}
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