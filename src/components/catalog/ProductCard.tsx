import { Instagram, ChevronLeft, ChevronRight, X, Maximize2, Heart, Star } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
    <div 
      className="group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden relative transition-shadow duration-200 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container da imagem com proporção fixa e melhor exibição */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center text-gray-500 p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">📷</span>
              </div>
              <p className="text-sm font-medium">Erro ao carregar imagem</p>
            </div>
          </div>
        ) : imageUrls.length > 0 ? (
          <>
            <img
              loading="lazy"
              onClick={openModal}
              src={imageUrls[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain transition-opacity duration-200"
              style={{
                objectPosition: 'center',
                background: '#f8fafc'
              }}
            />
            
            {/* Indicadores de múltiplas imagens */}
            {imageUrls.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {imageUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Botões de navegação simplificados */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full z-20 transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full z-20 transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            
            {/* Botão de maximizar simplificado */}
            <button
              onClick={openModal}
              className={`absolute top-3 right-3 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full z-20 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Maximize2 size={16} />
            </button>
            
            {/* Tag de preço simplificada */}
            <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{product.priceRange}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-lg">📷</span>
              </div>
              <p className="text-xs">Sem imagem</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Conteúdo do card simplificado */}
      <div className="p-4 relative z-10">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>
        
        {/* Botão de ação simplificado */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <Instagram size={16} />
          <span className="text-sm">Encomendar no Instagram</span>
        </a>
      </div>

      {/* Modal simplificado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-lg">
            {/* Header do modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.priceRange}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo do modal */}
            <div className="relative p-6">
              <div className="relative flex items-center justify-center min-h-[60vh]">
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 bg-white p-2 rounded-full shadow-md transition-colors duration-200 z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 bg-white p-2 rounded-full shadow-md transition-colors duration-200 z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <img
                  src={imageUrls[currentImageIndex]}
                  alt={product.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              </div>
              
              {/* Indicadores de imagem no modal */}
              {imageUrls.length > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  {imageUrls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-purple-500' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Informações do produto no modal */}
              <div className="mt-6 text-center">
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <Instagram size={16} />
                  <span className="text-sm">Encomendar no Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Memoiza o componente para evitar re-renderizações desnecessárias
export default memo(ProductCard);
