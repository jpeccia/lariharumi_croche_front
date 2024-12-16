import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
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

export const reviewsApi = {
  getProductReviews: async (productId: number) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },
  addReview: async (productId: number, data: any) => {
    const response = await api.post(`/reviews/product/${productId}`, data);
    return response.data;
  },
};

export const adminApi = {
  getProducts: async () => {
    const response = await api.get('/admin/products');
    return response.data;
  },
  updateProduct: async (productId: number, data: any) => {
    const response = await api.put(`/admin/products/${productId}`, data);
    return response.data;
  },
  deleteProduct: async (productId: number) => {
    await api.delete(`/admin/products/${productId}`);
  },
};

export default api;