import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash } from 'lucide-react';
import { adminApi } from '../../services/api';
import { Product } from '../../types/product';
import { UploadProductImage } from './UploadProductImage'; // Importando o componente

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: '', // Inicialmente será uma URL ou caminho para o arquivo de imagem
    price: '',
    categoryId: 1,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Estado para controlar o modal

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Carrega as categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminApi.getCategories(); // Função para pegar categorias
        setCategories(response.data); // Atualiza as categorias no estado
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading(false); // Define o carregamento como falso após a requisição
      }
    };

    fetchCategories();
  }, []); // Esse efeito só vai rodar uma vez, quando o componente for montado

  useEffect(() => {
    if (editingProduct) {
      const loadProductImage = async () => {
        try {
          const imageUrl = await adminApi.getProductImage(editingProduct.id);
          setNewProduct((prevProduct) => ({
            ...prevProduct,
            image: imageUrl, // Atualiza a URL da imagem
          }));
        } catch (error) {
          console.error('Falha ao carregar a imagem do produto:', error);
        }
      };

      loadProductImage();
    }
  }, [editingProduct]);

  const loadProducts = async () => {
    try {
      const data = await adminApi.getProducts();
      console.log('Produtos carregados:', data);
      setProducts(data);
    } catch (error) {
      console.error('Falha ao carregar produtos:', error);
      alert('Falha ao carregar os produtos.');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      console.log('Categorias carregadas:', data);
      setCategories(data);
    } catch (error) {
      console.error('Falha ao carregar categorias:', error);
      alert('Falha ao carregar as categorias.');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Removendo o FormData, já que a imagem não é necessária
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', parseFloat(newProduct.price).toString());
    formData.append('categoryId', newProduct.categoryId.toString());
  
    try {
      const response = await adminApi.createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
        image: ''
      }); // Envia apenas os dados necessários
  
      console.log('Produto criado com sucesso:', response);
  
      loadProducts(); // Atualiza a lista de produtos
      setIsCreating(false); // Altera o estado de criação
      setNewProduct({
        name: '',
        description: '',
        image: '', // Resetando a imagem
        price: '',
        categoryId: 1,
      });
    } catch (error) {
      console.error('Falha ao criar o produto:', error);
      alert('Falha ao criar o produto. Verifique os dados.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      image: product.image || '', // Preservando a URL da imagem original
      price: product.priceRange ? product.priceRange.toString() : '',
      categoryId: product.categoryId,
    });
    setIsCreating(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProduct || !editingProduct.id) {
      console.error('Produto não selecionado ou id inválido');
      alert('Produto não selecionado ou id inválido');
      return;
    }

    const categoryIdToUpdate = newProduct.categoryId !== undefined ? newProduct.categoryId : editingProduct.categoryId;

    const productData = {
      name: newProduct.name,
      description: newProduct.description,
      image: newProduct.image,
      price: newProduct.price ? parseFloat(newProduct.price) : 0,
      categoryId: categoryIdToUpdate,
    };

    try {
      const response = await adminApi.updateProduct(editingProduct.id, productData);
      console.log('Produto atualizado com sucesso:', response);

      loadProducts();
      setEditingProduct(null);
      setIsCreating(false);
      setNewProduct({
        name: '',
        description: '',
        image: '',
        price: '',
        categoryId: categoryIdToUpdate,
      });
    } catch (error) {
      console.error('Falha ao atualizar o produto:', error);
      alert('Falha ao atualizar o produto. Verifique os dados.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await adminApi.deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Falha ao excluir o produto:', error);
      alert('Falha ao excluir o produto. Tente novamente.');
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setNewProduct({
      ...newProduct,
      image: imageUrl, // Atualizando a URL da imagem
    });
    setIsImageModalOpen(false); // Fechar o modal após a seleção da imagem
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-purple-800">Gerenciar Produtos</h2>
        </div>
        <button
          onClick={() => {
            setIsCreating(!isCreating);
            setEditingProduct(null);
          }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {(isCreating || editingProduct) && (
  <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">Nome</label>
      <input
        type="text"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Descrição</label>
      <input
        type="text"
        value={newProduct.description}
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        required
      />
    </div>

    {/* O campo de imagem será exibido apenas durante a edição */}
    {editingProduct && (
      <div>
        <label className="block text-sm font-medium text-gray-700">Imagem</label>
        <button
          type="button"
          onClick={() => setIsImageModalOpen(true)} // Abre o modal de imagem
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Selecionar Imagem
        </button>
        {newProduct.image && (
          <img
            src={newProduct.image}
            alt="Imagem do Produto"
            className="mt-2 w-32 h-32 object-cover"
          />
        )}
      </div>
    )}

    <div>
      <label className="block text-sm font-medium text-gray-700">Preço</label>
      <input
        type="number"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Categoria</label>
      <select
        value={newProduct.categoryId}
        onChange={(e) => setNewProduct({ ...newProduct, categoryId: parseInt(e.target.value) })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      >
        {loading ? (
          <option>Carregando...</option> // Exibe "Carregando..." enquanto as categorias são carregadas
        ) : (
          categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option>Nenhuma categoria encontrada</option> // Mensagem caso não haja categorias
          )
        )}
      </select>
    </div>

    <button
      type="submit"
      className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
    >
      {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
    </button>
  </form>
)}


      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
            <div className="flex items-center gap-4">
              <img
                src={product.image || 'placeholder.jpg'}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-sm w-96">
            <UploadProductImage
              productId={editingProduct ? editingProduct.id : newProduct.id}
              onImageUploaded={handleImageChange}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsImageModalOpen(false)} // Fecha o modal
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}