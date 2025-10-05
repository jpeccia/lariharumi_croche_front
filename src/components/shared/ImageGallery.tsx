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
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-0 border-0 outline-none"
      onClick={handleBackdropClick}
      open={isOpen}
      aria-label={`Galeria de imagens de ${productName}`}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 sm:p-3"
        aria-label="Fechar galeria"
      >
        <X size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 sm:p-3 bg-black/30 hover:bg-black/50 rounded-full sm:left-4"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 sm:p-3 bg-black/30 hover:bg-black/50 rounded-full sm:right-4"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Image container */}
      <div
        className="relative max-w-[95vw] max-h-[95vh] sm:max-w-[90vw] sm:max-h-[90vh] flex items-center justify-center p-2 sm:p-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        tabIndex={0}
        role="img"
      >
        <img
          src={images[currentIndex]}
          alt={`${productName} - Imagem ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none"
        />
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`thumb-${image}-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? 'border-white'
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

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 text-white bg-black/50 rounded px-3 py-1 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Simple instructions */}
      <div className="absolute top-4 right-16 text-white bg-black/50 rounded px-3 py-1 text-xs">
        ← → ou clique nas setas
      </div>
    </dialog>
  );
}
