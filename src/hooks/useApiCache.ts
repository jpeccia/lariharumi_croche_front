import { useState, useEffect, useCallback } from 'react';
import { publicApi, adminApi } from '../services/api';
import { PaginatedResponse, PaginationConfig } from '../types/api';
import { Product } from '../types/product';

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
      return cached.data;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Marcar como carregando no cache global
      globalCache.set(key, { data: cached?.data || null, timestamp: Date.now(), loading: true });
      
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
      try {
        const [categories, products] = await Promise.all([
          adminApi.getCategories(),
          adminApi.getProductsByPage(null, { page: 1, limit: 1000 }) // Aumentado limite para 1000
        ]);
        
        // Calcular totais corretamente
        let totalProducts = 0;
        let productsByCategory: Record<string, number> = {};
        
        if (Array.isArray(products)) {
          totalProducts = products.length;
          
          // Contar produtos por categoria
          products.forEach(product => {
            const categoryName = categories.find(cat => cat.ID === product.categoryId)?.name || 'Sem categoria';
            productsByCategory[categoryName] = (productsByCategory[categoryName] || 0) + 1;
          });
        }
        
        return {
          totalProducts,
          totalCategories: Array.isArray(categories) ? categories.length : 0,
          productsByCategory,
          recentActivity: []
        };
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        return {
          totalProducts: 0,
          totalCategories: 0,
          productsByCategory: {},
          recentActivity: []
        };
      }
    },
    { ttl: 2 * 60 * 1000, refetchOnMount: false } // Reduzido TTL para 2 minutos para atualizações mais frequentes
  );
}
