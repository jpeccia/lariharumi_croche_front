import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  readonly images: string[];
  readonly productName: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly initialIndex?: number;
}

export function ImageGallery({ 
  images, 
  productName, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: Readonly<ImageGalleryProps>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handlers definidos primeiro para evitar uso antes da declaração
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

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
  }, [isOpen, onClose, handleNext, handlePrev]);

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
      className="fixed inset-0 bg-black/70 sm:bg-black/75 z-[9999] flex items-center justify-center overflow-hidden"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria de imagens de ${productName}`}
      tabIndex={-1}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        overscrollBehavior: 'contain'
      }}
    >
      {/* Modal container */}
      <div
        className="relative bg-white rounded-lg sm:rounded-xl shadow-2xl w-[96vw] h-[96vh] sm:w-[90vw] sm:h-[90vh] sm:max-w-[650px] sm:max-h-[85vh] lg:max-w-[750px] lg:max-h-[90vh] flex flex-col overflow-hidden m-auto"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50 relative z-30 flex-shrink-0">
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
            className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors relative z-30 flex-shrink-0 ml-2"
            aria-label="Fechar galeria"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image container - REMOVIDO overflow-auto que causava o problema */}
        <div className="relative flex-1 flex items-center justify-center bg-gray-100 p-2 sm:p-4 overflow-hidden">
          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 text-gray-600 hover:text-gray-800 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 text-gray-600 hover:text-gray-800 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Imagem centralizada e responsiva */}
          <img
            key={`image-${currentIndex}`}
            src={images[currentIndex]}
            alt={`${productName} - Imagem ${currentIndex + 1}`}
            className="max-w-full max-h-full w-auto h-auto object-contain select-none rounded-lg shadow-lg"
          />
        </div>

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 p-2 sm:p-4 bg-gray-50 border-t border-gray-200 overflow-x-auto relative z-30 flex-shrink-0">
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
        <div className="px-2 pb-2 sm:px-4 sm:pb-3 bg-gray-50 text-center relative z-30 flex-shrink-0">
          <p className="text-[10px] sm:text-xs text-gray-600">
            Use as setas ← → para navegar ou clique nas miniaturas
          </p>
        </div>
      </div>
    </div>
  );
}
