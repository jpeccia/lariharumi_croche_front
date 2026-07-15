import { useState, useEffect, useCallback } from 'react';
import { adminApi, publicApi, getCategoryImage, parseImageUrls } from '../services/api';
import { env } from '../env';

interface ImageCache {
  [key: string]: string[];
}

interface UseImageCacheReturn {
  imageUrls: string[];
  isLoading: boolean;
  error: string | null;
}

const imageCache: ImageCache = {};

/**
 * Checks in-memory cache and sessionStorage for cached images.
 * 
 * @param cacheKey - The key identifying the product's images in the cache.
 * @returns The cached images array if found, otherwise null.
 */
function getCachedImages(cacheKey: string): string[] | null {
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    imageCache[cacheKey] = parsed;
    return parsed;
  }
  return null;
}

/**
 * Hook to retrieve and cache product images.
 * Prefers cached images or parsed initial images to avoid network requests.
 * 
 * @param productId - The unique identifier of the product.
 * @param usePublicApi - Whether to fetch from the public endpoint.
 * @param initialImages - Initial image data to populate cache (optional).
 * @returns An object containing the product image URLs, loading state, and error.
 */
export function useImageCache(
  productId: number,
  usePublicApi: boolean = true,
  initialImages?: unknown
): UseImageCacheReturn {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `product-${productId}`;

  const fetchImages = useCallback(async () => {
    const cached = getCachedImages(cacheKey);
    if (cached) {
      if (initialImages) {
        const parsed = parseImageUrls(initialImages, env.VITE_API_BASE_URL);
        const isCacheStale = parsed.length !== cached.length || parsed.some(url => !cached.includes(url));
        if (isCacheStale) {
          imageCache[cacheKey] = parsed;
          sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
          setImageUrls(parsed);
          return;
        }
      }
      setImageUrls(cached);
      return;
    }

    if (initialImages) {
      const parsed = parseImageUrls(initialImages, env.VITE_API_BASE_URL);
      if (parsed.length > 0) {
        imageCache[cacheKey] = parsed;
        sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
        setImageUrls(parsed);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const images = usePublicApi
        ? await publicApi.getProductImages(productId)
        : await adminApi.getProductImages(productId);
      
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
  }, [productId, cacheKey, usePublicApi, initialImages]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { imageUrls, isLoading, error };
}

/**
 * Hook to retrieve and cache category images.
 * 
 * @param categoryId - The unique identifier of the category.
 * @param usePublicApi - Whether to fetch from the public endpoint.
 * @returns An object containing the category image URL, loading state, and error.
 */
export function useCategoryImageCache(
  categoryId: number,
  usePublicApi: boolean = true
): {
  imageUrl: string;
  isLoading: boolean;
  error: string | null;
} {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `category-${categoryId}`;

  const fetchImage = useCallback(async () => {
    if (imageCache[cacheKey]) {
      setImageUrl(imageCache[cacheKey][0]);
      return;
    }

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
      const image = usePublicApi 
        ? await publicApi.getCategoryImage(categoryId)
        : await getCategoryImage(categoryId);
      
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
  }, [categoryId, cacheKey, usePublicApi]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return { imageUrl, isLoading, error };
}

/**
 * Preloads and caches product images from a list of products.
 * Populates both the in-memory cache and sessionStorage to avoid future network requests.
 * 
 * @param products - The list of products containing image URLs.
 */
export function preloadImages(products: { ID: number; imageUrls?: string; images?: string }[]): void {
  products.forEach((product) => {
    const cacheKey = `product-${product.ID}`;
    const cached = getCachedImages(cacheKey);
    const rawImages = product.imageUrls || product.images;
    if (rawImages) {
      const parsed = parseImageUrls(rawImages, env.VITE_API_BASE_URL);
      if (parsed.length > 0) {
        const isCacheStale = !cached || parsed.length !== cached.length || parsed.some(url => !cached.includes(url));
        if (isCacheStale) {
          imageCache[cacheKey] = parsed;
          sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
        }
      }
    }
  });
}
