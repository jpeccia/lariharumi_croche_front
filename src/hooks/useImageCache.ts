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
 * Checks the in-memory module-level cache for previously fetched images.
 *
 * @param cacheKey - The key identifying the product's images in the cache.
 * @returns The cached images array if found, otherwise null.
 */
function getCachedImages(cacheKey: string): string[] | null {
  return imageCache[cacheKey] ?? null;
}

/**
 * Hook to retrieve and cache product images.
 * Prioritises images embedded in the API payload (initialImages), then the
 * in-memory module cache, and falls back to a dedicated image endpoint.
 * An AbortController cancels any in-flight fetch when the product changes.
 *
 * @param productId - The unique identifier of the product.
 * @param usePublicApi - Whether to fetch from the public endpoint.
 * @param initialImages - Raw image data returned by the products list endpoint.
 * @returns An object containing the product image URLs, loading state, and error.
 */
export function useImageCache(
  productId: number,
  usePublicApi: boolean = true,
  initialImages?: unknown
): UseImageCacheReturn {
  const cacheKey = `product-${productId}`;

  /**
   * Lazy initializer: resolves images synchronously on the first render so
   * the component never starts with an empty array when data is already available.
   * Execution order in Catalog: preloadImages() → setProducts() → React render →
   * useState(() => ...) — the cache is already populated at this point.
   */
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    if (initialImages) {
      const parsed = parseImageUrls(initialImages, env.VITE_API_BASE_URL);
      if (parsed.length > 0) {
        imageCache[cacheKey] = parsed;
        return parsed;
      }
    }
    const cached = getCachedImages(cacheKey);
    return cached && cached.length > 0 ? cached : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async (signal: AbortSignal) => {
    // 1. Prefer images embedded in the list payload — no extra request needed.
    if (initialImages) {
      const parsed = parseImageUrls(initialImages, env.VITE_API_BASE_URL);
      if (parsed.length > 0) {
        const cached = getCachedImages(cacheKey);
        const isCacheStale =
          !cached ||
          parsed.length !== cached.length ||
          parsed.some((url) => !cached.includes(url));
        if (isCacheStale) {
          imageCache[cacheKey] = parsed;
        }
        setImageUrls(parsed);
        return;
      }
    }

    // 2. Use in-memory cache when payload was empty.
    const cached = getCachedImages(cacheKey);
    if (cached && cached.length > 0) {
      setImageUrls(cached);
      return;
    }

    // 3. Fallback: fetch from the dedicated images endpoint.
    setIsLoading(true);
    setError(null);

    try {
      const images = usePublicApi
        ? await publicApi.getProductImages(productId)
        : await adminApi.getProductImages(productId);

      if (signal.aborted) return;

      imageCache[cacheKey] = images;
      setImageUrls(images);
    } catch (err) {
      if (signal.aborted) return;
      const errorMessage = 'Erro ao carregar imagens';
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [productId, cacheKey, usePublicApi, initialImages]);

  // Run fetch whenever productId or initialImages change. The AbortController
  // ensures in-flight requests are cancelled when the hook dependencies update.
  useEffect(() => {
    const controller = new AbortController();
    fetchImages(controller.signal);
    return () => controller.abort();
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
    const cached = getCachedImages(cacheKey);
    if (cached && cached.length > 0) {
      setImageUrl(cached[0]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const image = usePublicApi
        ? await publicApi.getCategoryImage(categoryId)
        : await getCategoryImage(categoryId);

      imageCache[cacheKey] = [image];
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
 * Preloads and caches product images from a list of products into the
 * in-memory module cache, so subsequent renders find the cache already
 * populated and skip the network fetch.
 *
 * @param products - The list of products containing image URLs.
 */
export function preloadImages(products: { ID: number; imageUrls?: string; images?: string }[]): void {
  products.forEach((product) => {
    const cacheKey = `product-${product.ID}`;
    const rawImages = product.imageUrls || product.images;
    if (!rawImages) return;

    const parsed = parseImageUrls(rawImages, env.VITE_API_BASE_URL);
    if (parsed.length === 0) return;

    const cached = getCachedImages(cacheKey);
    const isCacheStale =
      !cached ||
      parsed.length !== cached.length ||
      parsed.some((url) => !cached.includes(url));

    if (isCacheStale) {
      imageCache[cacheKey] = parsed;
    }
  });
}

/**
 * Invalidates the image cache for a specific product ID.
 * Clears the in-memory cache entry.
 *
 * @param productId - The unique identifier of the product.
 */
export function invalidateImageCache(productId: number): void {
  delete imageCache[`product-${productId}`];
}

/**
 * Invalidates the category image cache for a specific category ID.
 * Clears the in-memory cache entry.
 *
 * @param categoryId - The unique identifier of the category.
 */
export function invalidateCategoryCache(categoryId: number): void {
  delete imageCache[`category-${categoryId}`];
}
