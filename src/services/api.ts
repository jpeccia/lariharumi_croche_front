import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const adminApi = {
  createProduct: async (productData: { name: string; description: string; image: string; price: number; categoryId: number }) => {
    const dataToSend = {
      name: productData.name,
      description: productData.description,
      image: productData.image,
      price: productData.price,
      categoryId: productData.categoryId, // Envia diretamente o ID da categoria
    };

    const response = await api.post('/products', dataToSend); // Envia os dados para criar o produto
    return response.data; // Retorna o produto criado
  },
  createCategory: async (categoryData: { name: string }) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data; // Retorna a lista de categorias
  },
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data; // Retorna todos os produtos
  },
  updateProduct: async (productId: number, data: any) => {
    const response = await api.put(`/products/${productId}`, data);
    return response.data; // Retorna o produto atualizado
  },
    // Função para atualizar uma categoria existente
  updateCategory: async (categoryId: number, categoryData: { name: string }) => {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },
  deleteProduct: async (productId: number) => {
    await api.delete(`/products/${productId}`);
  },
  deleteCategory: async (categoryId: number) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
};


export default api;