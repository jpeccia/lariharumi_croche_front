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
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden relative transition-all duration-500 hover:-translate-y-2 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container da imagem com proporção fixa e melhor exibição */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent absolute top-0 left-0"></div>
            </div>
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
              className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              style={{
                objectPosition: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
              }}
            />
            
            {/* Overlay com gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Indicadores de múltiplas imagens */}
            {imageUrls.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {imageUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'bg-white shadow-lg' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Botões de navegação melhorados */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm p-2 rounded-full shadow-lg z-20 transition-all duration-300 hover:scale-110 ${
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm p-2 rounded-full shadow-lg z-20 transition-all duration-300 hover:scale-110 ${
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {/* Botão de maximizar melhorado */}
            <button
              onClick={openModal}
              className={`absolute top-3 right-3 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm p-2 rounded-full shadow-lg z-20 transition-all duration-300 hover:scale-110 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <Maximize2 size={18} />
            </button>
            
            {/* Tag de preço melhorada */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full shadow-lg">
              <span className="text-sm font-bold">{product.priceRange}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl">📷</span>
              </div>
              <p className="text-sm font-medium">Sem imagem</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Conteúdo do card melhorado */}
      <div className="p-6 relative z-10">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>
        
        {/* Botão de ação suavizado */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.02] transform border border-purple-300/20"
        >
          <Instagram size={18} />
          <span className="text-sm">Encomendar no Instagram</span>
        </a>
      </div>

      {/* Modal melhorado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Header do modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.priceRange}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo do modal */}
            <div className="relative p-6">
              <div className="relative flex items-center justify-center min-h-[60vh]">
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10"
                    >
                      <ChevronRight size={24} />
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
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-purple-500 scale-125' 
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
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.02] transform border border-purple-300/20"
                >
                  <Instagram size={18} />
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
