import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function ImageGallery({ 
  images, 
  productName, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      modalRef.current?.focus();
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // Só fecha se clicar diretamente no backdrop, não nos elementos filhos
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 sm:bg-black/70 z-[9999] flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria de imagens de ${productName}`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Modal container */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-full max-h-[96vh] sm:max-w-[600px] sm:max-h-[85vh] lg:max-w-[700px] lg:max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50 relative z-20 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{productName}</h2>
            {images.length > 1 && (
              <p className="text-xs sm:text-sm text-gray-600">{currentIndex + 1} de {images.length}</p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors relative z-20 flex-shrink-0 ml-2"
            aria-label="Fechar galeria"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image container */}
        <div className="relative flex-1 flex items-center justify-center bg-gray-100 p-2 sm:p-4 min-h-[250px] sm:min-h-[400px] lg:min-h-[500px] z-0 overflow-auto">
          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <img
            src={images[currentIndex]}
            alt={`${productName} - Imagem ${currentIndex + 1}`}
            className="max-w-full max-h-full w-auto h-auto object-contain select-none rounded-lg shadow-lg"
          />
        </div>

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 p-2 sm:p-4 bg-gray-50 border-t border-gray-200 overflow-x-auto relative z-20 flex-shrink-0">
            {images.map((image, index) => (
              <button
                key={`thumb-${image}-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md sm:rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentIndex
                    ? 'border-purple-500'
                    : 'border-transparent hover:border-gray-400'
                }`}
                aria-label={`Ver imagem ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="px-2 pb-2 sm:px-4 sm:pb-3 bg-gray-50 text-center relative z-20 flex-shrink-0">
          <p className="text-[10px] sm:text-xs text-gray-600">
            Use as setas ← → para navegar ou clique nas miniaturas
          </p>
        </div>
      </div>
    </div>
  );
}
