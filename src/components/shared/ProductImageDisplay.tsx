import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Loader2 } from 'lucide-react';
import { ImageGallery } from './ImageGallery';

interface ProductImageDisplayProps {
  images: string[];
  productName: string;
  priceRange?: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function ProductImageDisplay({
  images,
  productName,
  priceRange,
  isLoading = false,
  error = null,
  className = '',
}: ProductImageDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleImageClick = useCallback(() => {
    if (images.length > 0) {
      setIsGalleryOpen(true);
    }
  }, [images.length]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  // Keyboard navigation for the main image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrev(e as any);
      } else if (e.key === 'ArrowRight') {
        handleNext(e as any);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [handlePrev, handleNext, images.length]);

  if (isLoading) {
    return (
      <div className={`relative w-full aspect-[4/5] bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Carregando imagem...</p>
        </div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className={`relative w-full aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 p-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-sm font-medium">
            {error || 'Nenhuma imagem disponível'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`relative w-full aspect-[4/5] bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        aria-label={`Imagens do produto ${productName}`}
      >
        {/* Main image */}
        <img
          src={images[currentIndex]}
          alt={`${productName} - Vista ${currentIndex + 1}`}
          className={`w-full h-full object-contain transition-opacity duration-300 cursor-pointer ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleImageClick}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleImageClick();
            }
          }}
          loading="lazy"
          tabIndex={0}
        />

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 rounded w-full h-full" />
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className={`absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={handleNext}
              className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              aria-label="Próxima imagem"
            >
              <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ver imagem ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Zoom/Gallery button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleImageClick();
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 text-white bg-black/30 hover:bg-black/50 p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          aria-label="Abrir galeria de imagens"
        >
          <Maximize2 size={14} className="sm:w-4 sm:h-4" />
        </button>

        {/* Price tag */}
        {priceRange && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-purple-500 text-white px-2 py-1 sm:px-3 rounded-full shadow-lg">
            <span className="text-xs sm:text-sm font-medium">R$ {priceRange}</span>
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/50 text-white px-1.5 py-0.5 sm:px-2 rounded text-xs">
            {currentIndex + 1}/{images.length}
          </div>
        )}

        {/* Click instruction - Hidden on mobile */}
        {images.length > 0 && (
          <div className={`hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="bg-black/50 text-white px-3 py-1 rounded-lg text-xs">
              Clique para ampliar
            </div>
          </div>
        )}

        {/* Mobile tap instruction */}
        {images.length > 0 && (
          <div className="sm:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
              Toque para ampliar
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={images}
        productName={productName}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={currentIndex}
      />
    </>
  );
}
