import { Instagram } from 'lucide-react';
import { Product } from '../../types/product';
import { memo } from 'react';
import { useImageCache } from '../../hooks/useImageCache';
import { ProductImageDisplay } from '../shared/ProductImageDisplay';
import { usePromotionStore } from '../../store/promotionStore';
import { applyDiscount, getApplicableDiscount, isPromotionActive } from '../../types/promotion';

interface ProductCardProps {
  readonly product: Product;
  readonly instagramUsername: string;
}

export function ProductCard({ product, instagramUsername }: ProductCardProps) {
  // Usa o hook otimizado para carregar imagens (API pública)
  const { imageUrls, isLoading, error } = useImageCache(product.ID, true);
  const promotion = usePromotionStore((s) => s.promotion);
  const active = isPromotionActive(promotion || undefined);
  const basePrice = parsePrice(product.priceRange);
  const discountPct = active ? getApplicableDiscount(promotion || undefined, basePrice) : 0;
  const discountedPrice = discountPct > 0 && !isNaN(basePrice) ? applyDiscount(basePrice, discountPct) : undefined;

  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  return (
    <div className={`group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden relative transition-shadow duration-200 border ${active && discountPct > 0 ? 'border-pink-300' : 'border-gray-100'}`}>
      {/* Container da imagem responsivo */}
      <ProductImageDisplay
        images={imageUrls}
        productName={product.name}
        priceRange={discountedPrice !== undefined ? `R$ ${discountedPrice.toFixed(2)} (de R$ ${basePrice.toFixed(2)})` : product.priceRange}
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
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-pink-600">{discountPct}% OFF</span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">R$ {basePrice.toFixed(2)}</span>
                <span className="text-xs sm:text-sm text-green-700 font-semibold">R$ {discountedPrice.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-gray-400">Promoção válida por tempo limitado</span>
            </div>
          )}
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

function parsePrice(raw: string): number {
  // Remove símbolo de moeda e espaços
  const cleaned = raw
    .replace(/R\$\s?/gi, '')
    .replace(/\./g, '') // remove separador de milhar
    .replace(/,/g, '.') // converte decimal
    .trim();

  // Se for faixa "150-200", pega o primeiro número
  const match = cleaned.match(/\d+(?:\.\d+)?/);
  if (!match) return NaN;
  return Number(match[0]);
}
