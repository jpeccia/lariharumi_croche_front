import axios from 'axios';
import { env } from '../env';
import { showNetworkError, showServerError, showAuthError } from '../utils/toast';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
    return Promise.reject(new Error(error.message || 'Erro na requisição'));
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

  // Obter todos os produtos (com paginação)
  getProductsByPage: async (categoryId: number | null, page = 1, limit = 12) => {
    const url = categoryId
      ? `/products/category/${categoryId}?page=${page}&limit=${limit}`
      : `/products?page=${page}&limit=${limit}`;
  
    const response = await api.get(url);
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

  // Upload de imagens de produto
  uploadProductImages: async (files: File[], productId: number) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file)); 

    try {
      const response = await api.post(`/products/${productId}/upload-images`, formData);
      
      if (!response.data.paths || !Array.isArray(response.data.paths)) {
        throw new Error('O retorno do upload não é um array válido');
      }

      return response.data.paths;
    } catch (error) {
      console.error("Erro ao enviar as imagens:", error);
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
};

// Função para buscar todas as imagens de um produto
export const getProductImages = async (productId: number) => {
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
