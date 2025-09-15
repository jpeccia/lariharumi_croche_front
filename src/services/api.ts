import axios from 'axios';
import { env } from '../env';
import { showNetworkError, showServerError, showAuthError } from '../utils/toast';

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
