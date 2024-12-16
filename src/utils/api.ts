import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', // Lê o baseURL das variáveis de ambiente
  timeout: 10000, // Tempo limite de requisição
});

// Interceptor para adicionar o token no cabeçalho das requisições
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState(); // Obtém o token da Auth Store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro ao configurar a requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas com erro
api.interceptors.response.use(
  (response) => response, // Retorna diretamente se a resposta for bem-sucedida
  (error) => {
    const { logout } = useAuthStore.getState(); // Obtém a função logout da store

    if (error.response?.status === 401) {
      console.warn('Token expirado ou inválido. Fazendo logout...');
      logout(); // Desloga o usuário se o token for inválido
    }

    console.error('Erro na resposta da API:', error);
    return Promise.reject(error); // Propaga o erro para ser tratado localmente
  }
);

export default api;
