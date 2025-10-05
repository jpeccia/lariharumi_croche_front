import { Instagram } from 'lucide-react';
import { Product } from '../../types/product';
import { memo } from 'react';
import { useImageCache } from '../../hooks/useImageCache';
import { ProductImageDisplay } from '../shared/ProductImageDisplay';

interface ProductCardProps {
  readonly product: Product;
  readonly instagramUsername: string;
}

export function ProductCard({ product, instagramUsername }: ProductCardProps) {
  // Usa o hook otimizado para carregar imagens (API pública)
  const { imageUrls, isLoading, error } = useImageCache(product.ID, true);

  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden relative transition-shadow duration-200 border border-gray-100">
      {/* Container da imagem responsivo */}
      <ProductImageDisplay
        images={imageUrls}
        productName={product.name}
        priceRange={product.priceRange}
        isLoading={isLoading}
        error={error}
        className="rounded-t-xl"
      />
      
      {/* Conteúdo do card responsivo */}
      <div className="p-3 sm:p-4 relative z-10">
        <div className="mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>
        
        {/* Botão de ação responsivo */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm"
        >
          <Instagram size={14} className="sm:w-4 sm:h-4" />
          <span>Encomendar no Instagram</span>
        </a>
      </div>
    </div>
  );
}

// Memoiza o componente para evitar re-renderizações desnecessárias
export default memo(ProductCard);
