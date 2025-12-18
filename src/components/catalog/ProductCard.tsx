import { Instagram } from 'lucide-react';
import { Product } from '../../types/product';
import { memo } from 'react';
import { useImageCache } from '../../hooks/useImageCache';
import { ProductImageDisplay } from '../shared/ProductImageDisplay';
import { usePromotionStore } from '../../store/promotionStore';
import { applyDiscount, getApplicableDiscount, isPromotionActive } from '../../types/promotion';
import { extractNumericPrice, formatBRL } from '../../utils/price';
import { openIgDm } from '../../utils/instagram';

interface ProductCardProps {
  readonly product: Product;
  readonly instagramUsername: string;
}

export function ProductCard({ product, instagramUsername }: ProductCardProps) {
  // Usa o hook otimizado para carregar imagens (API pública)
  const { imageUrls, isLoading, error } = useImageCache(product.ID, true);
  const promotion = usePromotionStore((s) => s.promotion);
  const active = isPromotionActive(promotion || undefined);
  const basePrice = extractNumericPrice(product.priceRange);
  const discountPct = active ? getApplicableDiscount(promotion || undefined, basePrice) : 0;
  const discountedPrice = discountPct > 0 && !isNaN(basePrice) ? applyDiscount(basePrice, discountPct) : undefined;

  // Link de DM do Instagram com mensagem pré-preenchida incluindo o nome do produto
  const dmMessage = `Oi Lari! Adorei suas peças 😍 Gostaria de encomendar o "${product.name}". Podemos conversar sobre tamanho, cores e prazo?`;
  const instagramUrl = `https://ig.me/m/${instagramUsername}?text=${encodeURIComponent(dmMessage)}`;

  return (
    <div className={`group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden relative transition-shadow duration-200 border ${active && discountPct > 0 ? 'border-pink-300' : 'border-gray-100'}`}>
      {/* Container da imagem responsivo */}
      <ProductImageDisplay
        images={imageUrls}
        productName={product.name}
        priceRange={discountedPrice ? formatBRL(discountedPrice) : formatBRL(basePrice)}
        discountPercentage={discountPct > 0 ? discountPct : undefined}
        originalPrice={discountPct > 0 && !isNaN(basePrice) ? formatBRL(basePrice) : undefined}
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
          {active && discountPct > 0 && !isNaN(basePrice) && (
            <p className="mt-2 text-[10px] sm:text-xs text-pink-500 font-medium">
              ✨ Promoção válida por tempo limitado
            </p>
          )}
        </div>
        
        {/* Botão de ação responsivo */}
        <a
          href={instagramUrl}
          onClick={(e) => {
            e.preventDefault();
            openIgDm(instagramUsername, dmMessage);
          }}
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
