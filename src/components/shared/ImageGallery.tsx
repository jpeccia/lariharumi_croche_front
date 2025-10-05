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
    <dialog
      ref={modalRef}
      className="fixed inset-0 bg-black/50 sm:bg-black/70 z-50 flex items-center justify-center p-4 border-0 outline-none"
      onClick={handleBackdropClick}
      open={isOpen}
      aria-label={`Galeria de imagens de ${productName}`}
    >
      {/* Modal container */}
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-[95vw] max-h-[95vh] sm:max-w-[600px] sm:max-h-[700px] lg:max-w-[700px] lg:max-h-[800px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 truncate">{productName}</h2>
            {images.length > 1 && (
              <p className="text-sm text-gray-600">{currentIndex + 1} de {images.length}</p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Fechar galeria"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image container */}
        <div className="relative flex-1 flex items-center justify-center bg-gray-100 p-4 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={24} />
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
          <div className="flex gap-2 p-4 bg-gray-50 border-t border-gray-200 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={`thumb-${image}-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-colors ${
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
        <div className="px-4 pb-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-600">
            Use as setas ← → para navegar ou clique nas miniaturas
          </p>
        </div>
      </div>
    </dialog>
  );
}
