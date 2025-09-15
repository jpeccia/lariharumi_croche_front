import { useState, useCallback } from 'react';
import { adminApi } from '../services/api';
import { Product } from '../types/product';
import { showProductLoadError } from '../utils/toast';
import { preloadImages } from './useImageCache';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const limit = 12;

  const fetchProducts = useCallback(async (categoryId: number | null, reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    try {
      setIsLoading(true);
      setError(null);

      const currentPage = reset ? 1 : page;
      const productsFetched = await adminApi.getProductsByPage(categoryId, currentPage, limit);
      const sorted = productsFetched.sort((a: Product, b: Product) => a.name.localeCompare(b.name));

      if (reset) {
        setProducts(sorted);
        setPage(2);
        setHasMore(productsFetched.length === limit);
        
        // Pré-carrega imagens dos produtos da primeira página
        const productIds = sorted.map((product: Product) => product.ID);
        preloadImages(productIds);
      } else {
        setProducts((prev) => [...prev, ...sorted]);
        setPage((prev) => prev + 1);
        setHasMore(productsFetched.length === limit);
        
        // Pré-carrega imagens dos novos produtos
        const productIds = sorted.map((product: Product) => product.ID);
        preloadImages(productIds);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError('Erro ao carregar produtos');
      showProductLoadError();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, limit]);

  const resetProducts = useCallback(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    products,
    isLoading,
    hasMore,
    error,
    fetchProducts,
    resetProducts
  };
}
