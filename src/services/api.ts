import axios from 'axios';
import { env } from '../env';
import { showNetworkError, showServerError, showAuthError } from '../utils/toast';
import { useAuthStore } from '../store/authStore';
import { 
  PaginatedResponse, 
  UploadResponse, 
  UploadProgress, 
  SearchResponse,
  PaginationConfig,
  UploadConfig,
  ApiError 
} from '../types/api';
import { Product, Category } from '../types/product';

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

// API pública sem autenticação
const publicApiInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

// Interceptor para adicionar token de autenticação (apenas para API administrativa)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros (API administrativa)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = error.response?.data || {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Erro na requisição',
      timestamp: new Date().toISOString(),
      retryable: false
    };

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      showAuthError();
    } else if (error.response?.status >= 500) {
      showServerError();
    } else if (error.response?.status >= 400) {
      showServerError();
    } else if (!navigator.onLine) {
      showNetworkError();
    }
    
    return Promise.reject(new Error(apiError.message || 'Erro na requisição'));
  }
);

// Interceptor para tratamento de erros (API pública)
publicApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = error.response?.data || {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Erro na requisição',
      timestamp: new Date().toISOString(),
      retryable: false
    };

    if (error.response?.status >= 500) {
      showServerError();
    } else if (error.response?.status >= 400) {
      showServerError();
    } else if (!navigator.onLine) {
      showNetworkError();
    }
    
    return Promise.reject(new Error(apiError.message || 'Erro na requisição'));
  }
);

// Interface para resposta de login
interface LoginResponse {
  token: string;
  user?: {
    ID: number;
    email: string;
    name: string;
    role: string;
  };
}

// Funções de autenticação
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Funções públicas (sem autenticação)
export const publicApi = {
  // Buscar produtos com paginação (público)
  searchProducts: async (query: string, config: PaginationConfig = { page: 1, limit: 12 }): Promise<Product[] | SearchResponse<Product>> => {
    const params = new URLSearchParams({
      search: query,
      page: config.page.toString(),
      limit: config.limit.toString(),
    });

    if (config.sortBy) {
      params.append('sortBy', config.sortBy);
    }
    if (config.sortOrder) {
      params.append('sortOrder', config.sortOrder);
    }

    const response = await publicApiInstance.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  // Obter produtos por página (público)
  getProductsByPage: async (categoryId: number | null, config: PaginationConfig = { page: 1, limit: 12 }): Promise<Product[] | PaginatedResponse<Product>> => {
    const params = new URLSearchParams({
      page: config.page.toString(),
      limit: config.limit.toString(),
    });

    if (config.sortBy) {
      params.append('sortBy', config.sortBy);
    }
    if (config.sortOrder) {
      params.append('sortOrder', config.sortOrder);
    }

    const url = categoryId
      ? `/products/category/${categoryId}?${params.toString()}`
      : `/products?${params.toString()}`;
  
    const response = await publicApiInstance.get(url);
    return response.data;
  },

  // Obter todas as categorias (público)
  getCategories: async () => {
    const response = await publicApiInstance.get('/categories');
    return response.data;
  },
};

// Funções administrativas
export const adminApi = {
  // Criar um produto
  createProduct: async (productData: { name: string; description: string; price: number | string; categoryId: number | string }) => {
    const dataToSend = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      categoryId: Number(productData.categoryId),
    };
  
    const response = await api.post('/products', dataToSend);
    return response.data;
  },

  // Criar uma categoria
  createCategory: async (categoryData: { name: string }) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Obter todas as categorias
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Obter todos os produtos (com paginação melhorada)
  getProductsByPage: async (categoryId: number | null, config: PaginationConfig = { page: 1, limit: 12 }): Promise<Product[] | PaginatedResponse<Product>> => {
    const params = new URLSearchParams({
      page: config.page.toString(),
      limit: config.limit.toString(),
    });

    if (config.sortBy) {
      params.append('sortBy', config.sortBy);
    }
    if (config.sortOrder) {
      params.append('sortOrder', config.sortOrder);
    }

    const url = categoryId
      ? `/products/category/${categoryId}?${params.toString()}`
      : `/products?${params.toString()}`;
  
    const response = await api.get(url);
    return response.data;
  },

  // Buscar produtos com paginação
  searchProducts: async (query: string, config: PaginationConfig = { page: 1, limit: 12 }): Promise<SearchResponse<Product>> => {
    const params = new URLSearchParams({
      search: query,
      page: config.page.toString(),
      limit: config.limit.toString(),
    });

    if (config.sortBy) {
      params.append('sortBy', config.sortBy);
    }
    if (config.sortOrder) {
      params.append('sortOrder', config.sortOrder);
    }

    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  // Atualizar um produto existente
  updateProduct: async (productId: number, data: Record<string, unknown>) => {
    const response = await api.patch(`/products/${productId}`, data);
    return response.data;
  },

  // Atualizar uma categoria existente
  updateCategory: async (categoryId: number, categoryData: { name: string }) => {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  // Upload de imagens de produto (assíncrono)
  uploadProductImages: async (files: File[], productId: number, config?: UploadConfig): Promise<UploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file)); 

    try {
      const response = await api.post(`/products/${productId}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 segundos
      });
      
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar as imagens:", error);
      throw new Error("Falha ao fazer upload das imagens");
    }
  },

  // Verificar progresso do upload
  getUploadProgress: async (productId: number, uploadId: string): Promise<UploadProgress> => {
    try {
      const response = await api.get(`/products/${productId}/upload-progress/${uploadId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao verificar progresso do upload:", error);
      throw new Error("Falha ao verificar progresso do upload");
    }
  },

  // Upload de imagens em paralelo (nova funcionalidade)
  uploadProductImagesParallel: async (files: File[], productId: number, config: UploadConfig = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 10,
    parallelUploads: 3,
    retryAttempts: 3,
    retryDelay: 1000
  }): Promise<UploadResponse> => {
    // Validação de arquivos
    if (files.length > config.maxFiles) {
      throw new Error(`Máximo de ${config.maxFiles} arquivos permitidos`);
    }

    for (const file of files) {
      if (file.size > config.maxFileSize) {
        throw new Error(`Arquivo ${file.name} excede o tamanho máximo de ${config.maxFileSize / 1024 / 1024}MB`);
      }
      if (!config.allowedTypes.includes(file.type)) {
        throw new Error(`Tipo de arquivo ${file.type} não é permitido`);
      }
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file)); 

    try {
      const response = await api.post(`/products/${productId}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 segundos para uploads paralelos
      });
      
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar as imagens em paralelo:", error);
      throw new Error("Falha ao fazer upload das imagens");
    }
  },

  // Upload de imagem de categoria
  uploadCategoryImage: async (file: File, categoryId: number) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post(`/categories/${categoryId}/upload-image`, formData);

      if (response.data?.imageUrl) {
        return response.data.imageUrl;
      } else {
        console.error('Resposta do servidor não contém a URL da imagem');
        throw new Error('URL da imagem não encontrada');
      }
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      throw new Error('Falha ao fazer upload da imagem');
    }
  },

  // Deletar um produto
  deleteProduct: async (productId: number) => {
    await api.delete(`/products/${productId}`);
  },

  // Deletar imagem de produto
  deleteProductImage: async (productId: number, imageIndex: number) => {
    await api.delete(`/products/${productId}/images/${imageIndex}`);
  },

  // Deletar uma categoria
  deleteCategory: async (categoryId: number) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },

  // Obter imagens de um produto
  getProductImages: async (productId: number) => {
    try {
      const response = await api.get(`/products/${productId}/images`);

      if (response.data && Array.isArray(response.data)) {
        const baseUrl = env.VITE_API_BASE_URL;
        const images = response.data.map((url: string) => {
          if (url.startsWith("http")) return url;
          const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
          return `${baseUrl}${normalizedUrl}`;
        });

        return images;
      } else {
        console.error("Nenhuma imagem encontrada para este produto");
        return [];
      }
    } catch (error) {
      console.error("Erro ao buscar imagens do produto:", error);
      return [];
    }
  },
};


// Função para buscar a imagem de uma categoria
export const getCategoryImage = async (categoryId: number) => {
  if (!categoryId) {
    console.error("ID da categoria não definido");
    return "";
  }

  try {
    const response = await api.get(`/categories/${categoryId}/image`);

    // Retorna a URL da imagem fornecida pela API
    return response.data.imageUrl; // A resposta contém o campo imageUrl com a URL da imagem
  } catch (error) {
    console.error("Erro ao buscar imagem da categoria:", error);
    throw new Error("Falha ao buscar imagem da categoria");
  }
};


export default api;
