import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { env } from '../env';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Ou de onde o token estiver armazenado
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminApi = {
  // Criar um produto
  createProduct: async (productData: { name: string; description: string; price: number | string; categoryId: number | string }) => {
    const dataToSend = {
      name: productData.name,
      description: productData.description,
      price: productData.price,         // Converte para número
      categoryId: Number(productData.categoryId), // Converte para número
    };
  
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    };
  
    const response = await api.post('/products', dataToSend, { headers });
    toast.success("Produto criado com sucesso!")
    window.location.reload();
    return response.data;
  },

  // Criar uma categoria
  createCategory: async (categoryData: { name: string }) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.post('/categories', categoryData, { headers });
    toast.success("Categoria criada com sucesso!")
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
    const headers = getAuthHeaders();
    const response = await api.patch(`/products/${productId}`, data, { headers }); 
    toast.success("Produto atualizado com sucesso!")
    window.location.reload();
    return response.data;
  },
  

  // Atualizar uma categoria existente
  updateCategory: async (categoryId: number, categoryData: { name: string }) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.put(`/categories/${categoryId}`, categoryData, { headers });
    toast.success("Categoria atualizada com sucesso!")
    return response.data;
  },

// Função para fazer o upload de múltiplas imagens de um produto
uploadProductImages: async (files: File[], productId: number) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('image', file));

  const headers = getAuthHeaders(); // Cabeçalhos com token

  try {
    const response = await api.post(`/products/${productId}/upload-image`, formData, {
      headers,
    });
    toast.success("Imagem enviada com sucesso!")
    window.location.reload();
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
    toast.success("Imagem enviada com sucesso!");
    window.location.reload();
  } catch (error) {
    console.error('Erro ao enviar a imagem:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
},
// Função para buscar todas as imagens de um produto
getProductImages: async (productId: number) => {
  try {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.get(`/products/${productId}/images`, { headers });

    if (response.data && Array.isArray(response.data)) {
      const baseUrl = env.VITE_API_BASE_URL;
      const images = response.data.map((url: string) =>
        url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? url : "/" + url}`
      );

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
  // Função para buscar a imagem de um produto
  getCategoryImage: async (categoryId: number) => {
    if (!categoryId) {
      console.error("ID da categoria não definido");
      return "";
    }
  
    try {
      const headers = getAuthHeaders(); // Cabeçalhos com token
      const response = await api.get(`/categories/${categoryId}/image`, {
        headers,
      });
  
      // Retorna a URL da imagem fornecida pela API
      return response.data.imageUrl; // A resposta contém o campo imageUrl com a URL da imagem
    } catch (error) {
      console.error("Erro ao buscar imagem da categoria:", error);
      throw new Error("Falha ao buscar imagem da categoria");
    }
  },

  // Deletar um produto
  deleteProduct: async (productId: number) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    await api.delete(`/products/${productId}`, { headers });
    toast.success("Produto removido com sucesso!")
  },
  deleteProductImage: async (productId: number, imageIndex: number) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    await api.delete(`/products/${productId}/images/${imageIndex}`, { headers });
    toast.success("Imagem do produto removida com sucesso!")
    window.location.reload();
  },  
  // Deletar uma categoria
  deleteCategory: async (categoryId: number) => {
    const headers = getAuthHeaders(); // Cabeçalhos com token
    const response = await api.delete(`/categories/${categoryId}`, { headers });
    toast.success("Categoria removida com sucesso!")
    return response.data;
  },
};


export default api;
