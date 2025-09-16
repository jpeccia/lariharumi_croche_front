import React, { useState, useRef, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
  onError,
  loading = 'lazy',
  sizes,
  srcSet
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {isInView ? (
            <LoadingSpinner size="sm" color="purple" />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>
      )}

      {/* Imagem */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          sizes={sizes}
          srcSet={srcSet}
        />
      )}

      {/* Estado de erro */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs">📷</span>
            </div>
            <p className="text-xs">Erro ao carregar</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook para pré-carregar imagens
export function useImagePreloader() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve();
        return;
      }

      if (loadingImages.has(src)) {
        // Aguarda a imagem que já está carregando
        const checkLoaded = () => {
          if (loadedImages.has(src)) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      setLoadingImages(prev => new Set(prev).add(src));

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src));
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(src);
          return newSet;
        });
        resolve();
      };
      img.onerror = () => {
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(src);
          return newSet;
        });
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  };

  const preloadImages = async (srcs: string[]): Promise<void> => {
    const promises = srcs.map(src => preloadImage(src).catch(console.error));
    await Promise.all(promises);
  };

  return { preloadImage, preloadImages, loadedImages, loadingImages };
}

