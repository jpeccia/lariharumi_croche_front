import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

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
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes or image changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      // Focus the modal for accessibility
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
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          handleRotate();
          break;
        case ' ':
          e.preventDefault();
          handleNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, scale, rotation]);

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
    resetImageTransform();
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetImageTransform();
  }, [images.length]);

  const resetImageTransform = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <dialog
      ref={modalRef}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-0 border-0 outline-none"
      onClick={onClose}
      open={isOpen}
      aria-label={`Galeria de imagens de ${productName}`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 sm:p-3"
        aria-label="Fechar galeria"
      >
        <X size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 sm:p-3 bg-black/30 hover:bg-black/50 rounded-full sm:left-4"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
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
          ref={imageRef}
          src={images[currentIndex]}
          alt={`${productName} - Imagem ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onDoubleClick={resetImageTransform}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              resetImageTransform();
            }
          }}
          draggable={false}
          tabIndex={0}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-black/50 rounded-lg p-1 sm:p-2">
        <button
          onClick={handleZoomOut}
          className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2"
          aria-label="Diminuir zoom"
          disabled={scale <= 0.5}
        >
          <ZoomOut size={16} className="sm:w-5 sm:h-5" />
        </button>
        
        <span className="text-white text-xs sm:text-sm px-1 sm:px-2 min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={handleZoomIn}
          className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2"
          aria-label="Aumentar zoom"
          disabled={scale >= 5}
        >
          <ZoomIn size={16} className="sm:w-5 sm:h-5" />
        </button>
        
        <button
          onClick={handleRotate}
          className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2"
          aria-label="Rotacionar imagem"
        >
          <RotateCw size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 max-w-[90vw] sm:max-w-[80vw] overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                resetImageTransform();
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
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white bg-black/50 rounded px-2 py-1 sm:px-3 text-xs sm:text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Instructions - Hidden on mobile */}
      <div className="hidden sm:block absolute top-16 left-4 text-white bg-black/50 rounded px-3 py-2 text-xs space-y-1">
        <div>🖱️ Clique duas vezes para resetar</div>
        <div>⌨️ Use as setas para navegar</div>
        <div>🔄 R para rotacionar</div>
        <div>🔍 + - para zoom</div>
      </div>

      {/* Mobile instructions */}
      <div className="sm:hidden absolute top-12 left-2 text-white bg-black/50 rounded px-2 py-1 text-xs">
        <div>Toque para ampliar • Deslize para navegar</div>
      </div>
    </dialog>
  );
}
