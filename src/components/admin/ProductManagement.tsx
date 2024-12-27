import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash, X } from 'lucide-react'; // Adicionamos o ícone X para o botão de remover
import { adminApi } from '../../services/api';
import { Product } from '../../types/product';
import { UploadProductImage } from './UploadProductImage';

// Definindo o tipo para Category
interface Category {
  id: number;
  name: string;
}

interface ProductProps {
  product: Product;
}

export function ProductManagement({ product }: ProductProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    categoryId: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]); // Usando o tipo Category
  const [loading, setLoading] = useState<boolean>(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
    // Verifique se o produto está presente antes de tentar buscar imagens
    if (product?.id) {
      fetchProductImages();
    }
  }, [product]);

  const loadProducts = async () => {
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Falha ao carregar produtos:', error);
      alert('Falha ao carregar os produtos.');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      console.log('Categorias carregadas:', data); // Depuração
      setCategories(data); // Supondo que response.data seja a lista de categorias
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      alert('Falha ao carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImages = async () => {
    if (!product?.id) {
      console.error('Produto não encontrado para buscar imagens.');
      return;
    }

    try {
      const images = await adminApi.getProductImages(product.id);
      setImageUrls(images);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!product?.id) {
      console.error('Produto não encontrado para remover imagem.');
      return;
    }
  
    try {
      // Encontre o índice da imagem a ser removida
      const imageIndex = imageUrls.indexOf(imageUrl);
      if (imageIndex === -1) {
        console.error('Imagem não encontrada.');
        return;
      }
  
      // Faça a chamada para a API para remover a imagem
      await adminApi.deleteProductImage(product.id, imageIndex);
  
      // Atualize o estado para refletir a remoção
      setImageUrls(imageUrls.filter((url) => url !== imageUrl));
  
      // Se a imagem removida for a imagem principal, limpar o campo de imagem
      if (newProduct.image === imageUrl) {
        setNewProduct({ ...newProduct, image: '' });
      }
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      alert('Falha ao remover imagem.');
    }
  };
  

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminApi.createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
        image: newProduct.image,
      });
      loadProducts();
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Falha ao criar o produto:', error);
      alert('Falha ao criar o produto.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      image: product.image || '',
      price: product.priceRange ? product.priceRange.toString() : '',
      categoryId: product.categoryId,
    });
    setIsCreating(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.id) {
      alert('Produto não selecionado ou id inválido');
      return;
    }

    try {
      const response = await adminApi.updateProduct(editingProduct.id, {
        name: newProduct.name,
        description: newProduct.description,
        image: newProduct.image,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
      });
      loadProducts();
      setEditingProduct(null);
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Falha ao atualizar o produto:', error);
      alert('Falha ao atualizar o produto.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await adminApi.deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Falha ao excluir o produto:', error);
      alert('Falha ao excluir o produto.');
    }
  };

  const handleImageChange = (imageUrls: string[]) => {
    // Supondo que você queira pegar o primeiro item do array
    setNewProduct({ ...newProduct, image: imageUrls[0] });
    setIsImageModalOpen(false);
  };
  

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      image: '',
      price: '',
      categoryId: 1,
    });
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

          {editingProduct && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagem</label>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Selecionar Imagem
              </button>
              {newProduct.image && (
                <div className="mt-2 relative">
                  <img
                    src={newProduct.image}
                    alt="Imagem do Produto"
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(newProduct.image)}
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
                <option>Carregando...</option>
              ) : (
                Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">Nenhuma categoria disponível</option>
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
              onImagesUploaded={handleImageChange}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
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
