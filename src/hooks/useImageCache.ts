import { useState, useEffect, useCallback } from 'react';
import { adminApi, getCategoryImage } from '../services/api';

interface ImageCache {
  [key: string]: string[];
}

interface UseImageCacheReturn {
  imageUrls: string[];
  isLoading: boolean;
  error: string | null;
}

// Cache global para imagens
const imageCache: ImageCache = {};

export function useImageCache(productId: number): UseImageCacheReturn {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `product-${productId}`;

  const fetchImages = useCallback(async () => {
    // Verifica cache global primeiro
    if (imageCache[cacheKey]) {
      setImageUrls(imageCache[cacheKey]);
      return;
    }

    // Verifica sessionStorage como fallback
    const cachedImages = sessionStorage.getItem(cacheKey);
    if (cachedImages) {
      const parsedImages = JSON.parse(cachedImages);
      imageCache[cacheKey] = parsedImages;
      setImageUrls(parsedImages);
      return;
    }

    // Se não há cache, faz a requisição
    setIsLoading(true);
    setError(null);

        try {
          const images = await adminApi.getProductImages(productId);
          
          // Armazena no cache global e sessionStorage
          imageCache[cacheKey] = images;
          sessionStorage.setItem(cacheKey, JSON.stringify(images));
          
          setImageUrls(images);
        } catch (err) {
      const errorMessage = 'Erro ao carregar imagens';
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [productId, cacheKey]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { imageUrls, isLoading, error };
}

// Hook para carregar imagens de categoria
export function useCategoryImageCache(categoryId: number): {
  imageUrl: string;
  isLoading: boolean;
  error: string | null;
} {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `category-${categoryId}`;

  const fetchImage = useCallback(async () => {
    // Verifica cache global primeiro
    if (imageCache[cacheKey]) {
      setImageUrl(imageCache[cacheKey][0]);
      return;
    }

    // Verifica sessionStorage como fallback
    const cachedImage = sessionStorage.getItem(cacheKey);
    if (cachedImage) {
      const parsedImage = JSON.parse(cachedImage);
      imageCache[cacheKey] = [parsedImage];
      setImageUrl(parsedImage);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const image = await getCategoryImage(categoryId);
      
      // Armazena no cache global e sessionStorage
      imageCache[cacheKey] = [image];
      sessionStorage.setItem(cacheKey, JSON.stringify(image));
      
      setImageUrl(image);
    } catch (err) {
      const errorMessage = 'Erro ao carregar imagem da categoria';
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, cacheKey]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return { imageUrl, isLoading, error };
}

// Função para pré-carregar imagens em lote
export async function preloadImages(productIds: number[]): Promise<void> {
  const uncachedIds = productIds.filter(id => {
    const cacheKey = `product-${id}`;
    return !imageCache[cacheKey] && !sessionStorage.getItem(cacheKey);
  });

  if (uncachedIds.length === 0) return;

  try {
    // Carrega imagens em paralelo (limitado a 5 por vez para não sobrecarregar)
    const batchSize = 5;
    for (let i = 0; i < uncachedIds.length; i += batchSize) {
      const batch = uncachedIds.slice(i, i + batchSize);
      await Promise.all(
            batch.map(async (id) => {
              try {
                const images = await adminApi.getProductImages(id);
                const cacheKey = `product-${id}`;
                imageCache[cacheKey] = images;
                sessionStorage.setItem(cacheKey, JSON.stringify(images));
              } catch (error) {
                console.error(`Erro ao pré-carregar imagens do produto ${id}:`, error);
              }
            })
      );
    }
  } catch (error) {
    console.error('Erro ao pré-carregar imagens:', error);
  }
}
