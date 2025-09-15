import { useState, useEffect, useCallback } from 'react';
import { publicApi, adminApi } from '../services/api';
import { PaginatedResponse, PaginationConfig } from '../types/api';
import { Product, Category } from '../types/product';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  loading: boolean;
}

interface UseApiCacheOptions {
  ttl?: number; // Time to live em milissegundos
  refetchOnMount?: boolean;
}

// Cache global para evitar múltiplas requisições
const globalCache = new Map<string, CacheEntry<any>>();

export function useApiCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseApiCacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000, refetchOnMount = false } = options; // 5 minutos por padrão
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isExpired = useCallback((timestamp: number) => {
    return Date.now() - timestamp > ttl;
  }, [ttl]);

  const fetchData = useCallback(async (force = false) => {
    const cached = globalCache.get(key);
    
    // Se temos dados em cache e não estão expirados, usar cache
    if (cached && !isExpired(cached.timestamp) && !force) {
      setData(cached.data);
      setLoading(false);
      setError(null);
      return cached.data;
    }

    // Se já está carregando, não fazer nova requisição
    if (cached?.loading) {
      setLoading(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Marcar como carregando no cache global
      globalCache.set(key, { data: null, timestamp: Date.now(), loading: true });
      
      const result = await fetcher();
      
      // Salvar no cache
      globalCache.set(key, { 
        data: result, 
        timestamp: Date.now(), 
        loading: false 
      });
      
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setLoading(false);
      
      // Remover entrada de loading do cache em caso de erro
      globalCache.delete(key);
      throw error;
    }
  }, [key, fetcher, isExpired]);

  useEffect(() => {
    fetchData(refetchOnMount);
  }, [fetchData, refetchOnMount]);

  const invalidate = useCallback(() => {
    globalCache.delete(key);
    fetchData(true);
  }, [key, fetchData]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate
  };
}

// Hooks específicos para dados comuns
export function useCategoriesCache() {
  return useApiCache(
    'categories',
    () => publicApi.getCategories(),
    { ttl: 10 * 60 * 1000 } // 10 minutos para categorias
  );
}

export function useProductsCache(page = 1, limit = 10, categoryId: number | null = null, config?: PaginationConfig) {
  const key = `products-${page}-${limit}-${categoryId || 'all'}`;
  
  return useApiCache<Product[] | PaginatedResponse<Product>>(
    key,
    () => publicApi.getProductsByPage(categoryId, config || { page, limit }),
    { ttl: 2 * 60 * 1000 } // 2 minutos para produtos
  );
}

// Hook específico para busca de produtos
export function useProductsSearchCache(query: string, page = 1, limit = 10, config?: PaginationConfig) {
  const key = `products-search-${query}-${page}-${limit}`;
  
  return useApiCache(
    key,
    () => publicApi.searchProducts(query, config || { page, limit }),
    { ttl: 1 * 60 * 1000 } // 1 minuto para busca (mais dinâmico)
  );
}

export function useStatsCache() {
  return useApiCache(
    'stats',
    async () => {
      const [categories, products] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getProductsByPage(null, 1, 100)
      ]);
      
      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        recentActivity: []
      };
    },
    { ttl: 5 * 60 * 1000 } // 5 minutos para estatísticas
  );
}
