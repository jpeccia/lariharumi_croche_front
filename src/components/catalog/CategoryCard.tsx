import { memo, useCallback, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types/product';
import { env } from '../../env';

interface CategoryCardProps {
  readonly category: Category;
  readonly onClick: (categoryId: number) => void;
  readonly onMouseEnter?: (categoryId: number) => void;
}

/**
 * Resolves the category image URL that already comes in the `/categories` payload.
 * Avoids an extra `GET /categories/{id}/image` request per card (N+1 redundant
 * round-trips), so the image shows together with the list. Normalizes relative paths
 * just in case the backend ever returns one.
 */
function resolveCategoryImage(image?: string): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image;
  }
  const normalized = image.startsWith('/') ? image : `/${image}`;
  return `${env.VITE_API_BASE_URL}${normalized}`;
}

function CategoryCard({ category, onClick, onMouseEnter }: CategoryCardProps) {
  const [errored, setErrored] = useState(false);
  const imageSrc = resolveCategoryImage(category.image);

  const handleClick = useCallback(() => {
    onClick(category.ID);
  }, [onClick, category.ID]);

  /** @description Fires prefetch callback when user hovers the card. */
  const handleMouseEnter = useCallback(() => {
    onMouseEnter?.(category.ID);
  }, [onMouseEnter, category.ID]);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className="group cursor-pointer animate-slide-up"
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-purple-100 overflow-hidden transition-all duration-300 hover:-translate-y-1.5">
        {/* Imagem compacta (quadrada) — vem direto do payload de categorias, sem request extra */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
          {imageSrc && !errored ? (
            <img
              loading="lazy"
              src={imageSrc}
              alt={category.name}
              onError={() => setErrored(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <span className="text-2xl">📷</span>
            </div>
          )}
        </div>

        {/* Nome em HTML (legível e nítido, independente da imagem) */}
        <div className="p-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-purple-800 group-hover:text-purple-600 transition-colors duration-300 leading-tight line-clamp-2">
            {category.name}
          </h3>
          <ArrowRight className="w-4 h-4 text-purple-300 group-hover:text-purple-600 transition-all duration-300 transform group-hover:translate-x-0.5 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

// Memoiza o componente para evitar re-renderizações desnecessárias
export default memo(CategoryCard);
