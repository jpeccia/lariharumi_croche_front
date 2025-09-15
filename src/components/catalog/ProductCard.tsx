import { Instagram, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Product } from '../../types/product';
import { useState, useEffect, memo, useCallback } from 'react';
import { useImageCache } from '../../hooks/useImageCache';
interface ProductCardProps {
  product: Product;
  instagramUsername: string;
}

export function ProductCard({ product, instagramUsername }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Usa o hook otimizado para carregar imagens
  const { imageUrls, isLoading, error } = useImageCache(product.ID);

  // Preload da próxima imagem apenas se há imagens carregadas
  useEffect(() => {
    if (imageUrls.length > 1) {
      const nextIndex = (currentImageIndex + 1) % imageUrls.length;
      const img = new Image();
      img.src = imageUrls[nextIndex];
    }
  }, [currentImageIndex, imageUrls]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
  
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  }, [imageUrls.length]);
  
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  }, [imageUrls.length]);

  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
      <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
            <div className="text-center text-gray-500">
              <p className="text-sm">Erro ao carregar imagem</p>
            </div>
          </div>
        ) : imageUrls.length > 0 ? (
          <>
          <button
            onClick={handlePrevImage}
            className="absolute left-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
          >
            <ChevronLeft size={24} />
          </button>
                <img
                  loading="lazy"
                  onClick={openModal}
                  srcSet={`${imageUrls[currentImageIndex].replace(/\.(jpg|png)$/, '.webp')} 1x, ${imageUrls[currentImageIndex]} 1x`}
                  src={imageUrls[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
          <button
            onClick={handleNextImage}
            className="absolute right-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
          >
            <ChevronRight size={24} />
          </button>
          </>
        ) : (
          <img
            loading="lazy"
            src="/default-image.jpg"
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        <button
          onClick={openModal}
          className="absolute bottom-2 right-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow z-10"
        >
          <Maximize2 size={20} />
        </button>
        <div className="absolute top-2 right-2 bg-pink-100 px-3 py-1 rounded-full z-10">
          <span className="text-sm font-medium text-pink-600">R$ {product.priceRange}</span>
        </div>
      </div>
      <div className="p-4 relative z-10">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full transition-colors"
        >
          <Instagram size={18} />
          <span>Encomendar no Instagram</span>
        </a>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            {/* Botão de fechar com z-index maior */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-50 text-gray-600 hover:text-gray-800 bg-white p-1 rounded-full shadow"
            >
              <X size={24} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={handlePrevImage}
                className="absolute left-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
              >
                <ChevronLeft size={24} />
              </button>

              <img
                src={imageUrls[currentImageIndex]}
                alt={product.name}
                className="max-w-[90vw] max-h-[80vh] object-contain"
              />

              <button
                onClick={handleNextImage}
                className="absolute right-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Memoiza o componente para evitar re-renderizações desnecessárias
export default memo(ProductCard);
