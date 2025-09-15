import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Category } from '../types/product';
import { showCategoryLoadError } from '../utils/toast';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/categories');
      const sortedCategories = response.data.sort((a: Category, b: Category) =>
        a.name.localeCompare(b.name)
      );
      
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setError('Erro ao carregar categorias');
      showCategoryLoadError();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories
  };
}
