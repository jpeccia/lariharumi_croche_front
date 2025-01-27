import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/',
});

console.log(import.meta.env.VITE_API_URL);

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Ou de onde o token estiver armazenado
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminApi = {
  // Criar um produto
  createProduct: async (productData: { name: string; description: string; image: string; price: number; categoryId: number }) => {
    const dataToSend = {
      name: productData.name,
      description: productData.description,
      image: productData.image,
      price: productData.price,
      categoryId: productData.categoryId, // Envia diretamente o ID da categoria
    };
    
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.post('/products', dataToSend, { headers });
    return response.data; // Retorna o produto criado
  },

  // Criar uma categoria
  createCategory: async (categoryData: { name: string }) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.post('/categories', categoryData, { headers });
    return response.data;
  },

  // Obter todas as categorias
  getCategories: async () => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.get('/categories', { headers });
    return response.data; // Retorna a lista de categorias
  },

  // Obter todos os produtos
  getProducts: async () => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.get('/products', { headers });
    return response.data; // Retorna todos os produtos
  },

  // Atualizar um produto existente
  updateProduct: async (productId: number, data: any) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.put(`/products/${productId}`, data, { headers });
    return response.data; // Retorna o produto atualizado
  },

  // Atualizar uma categoria existente
  updateCategory: async (categoryId: number, categoryData: { name: string }) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.put(`/categories/${categoryId}`, categoryData, { headers });
    return response.data;
  },

// Função para fazer o upload de múltiplas imagens de um produto
uploadProductImages: async (
  files: File[],
  productId: number,
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('image', file)); // Envia os arquivos como 'image'

  const headers = getAuthHeaders(); // Cabeçalhos com token

  try {
    const response = await api.post(`/products/${productId}/upload-image`, formData, {
      headers, // Passando o cabeçalho com token
    });

    console.log('Resposta do servidor:', response);  // Exibe a resposta completa para verificar a estrutura
  } catch (error) {
    console.error('Erro ao enviar as imagens:', error);
    throw new Error('Falha ao fazer upload das imagens');
  }
},

// Função para fazer o upload de imagem de categoria
uploadCategoryImage: async (
  file: File,
  categoryId: number,
  onImageUploaded: (imageUrl: string) => void
) => {
  const formData = new FormData();
  formData.append('image', file); // A chave "image" deve corresponder ao nome do parâmetro do backend

  const headers = getAuthHeaders(); // Cabeçalhos com token

  try {
    const response = await api.post(`/categories/${categoryId}/upload-image`, formData, {
      headers, // Passando o cabeçalho com token
    });

    if (response.data && response.data.imageUrl) {
      onImageUploaded(response.data.imageUrl); // Chama a função com a URL da imagem
    } else {
      console.error('Resposta do servidor não contém a URL da imagem');
    }
  } catch (error) {
    console.error('Erro ao enviar a imagem:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
},
// Função para buscar todas as imagens de um produto
getProductImages: async (productId: number) => {
  try {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.get(`/products/${productId}/images`, {
      headers, // Passando o cabeçalho com token
    });

    if (response.data && response.data.imageUrls) {
      // Retorna as URLs das imagens
      return response.data.imageUrls.map((url: string) => import.meta.env.VITE_API_URL + {url}); // Concatena o domínio com a URL da imagem
    } else {
      console.error('Nenhuma imagem encontrada para este produto');
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar imagens do produto:', error);
    throw new Error('Falha ao buscar imagens do produto');
  }
},
  // Função para buscar a imagem de um produto
  getCategoryImage: async (categoryId: number) => {
    try {
      const headers = getAuthHeaders(); // Cabeçalhos com token
      const response = await api.get(`/categories/${categoryId}/image`, {
        responseType: 'blob', // Para garantir que a resposta seja tratada como um arquivo binário (imagem)
        headers, // Passando o cabeçalho com token
      });
      return URL.createObjectURL(response.data); // Retorna a URL da imagem (blobs)
    } catch (error) {
      console.error('Erro ao buscar imagem da categoria:', error);
      throw new Error('Falha ao buscar da categoria');
    }
  },  
  // Deletar um produto
  deleteProduct: async (productId: number) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    await api.delete(`/products/${productId}`, { headers });
  },
  deleteProductImage: async (productId: number, imageIndex: number) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    await api.delete(`/products/${productId}/images/${imageIndex}`, { headers });
  },  
  // Deletar uma categoria
  deleteCategory: async (categoryId: number) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.delete(`/categories/${categoryId}`, { headers });
    return response.data;
  },
};


export default api;
