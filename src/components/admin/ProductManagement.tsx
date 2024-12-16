import React, { useState } from 'react';
import { Package, Plus, Edit, Trash } from 'lucide-react';
import { adminApi } from '../../services/api';
import { Product } from '../../types/product';

export function ProductManagement() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    categoryId: 1, // Default category ID
  });
  const [categories, setCategories] = useState<any[]>([]);

  React.useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Falha ao carregar os produtos.');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      alert('Falha ao carregar as categorias.');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        image: newProduct.image,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
      };

      const response = await adminApi.createProduct(productData);
      console.log('Produto criado com sucesso:', response);

      loadProducts();
      setIsCreating(false);
      setNewProduct({
        name: '',
        description: '',
        image: '',
        price: '',
        categoryId: 1,
      });
    } catch (error) {
      console.error('Falha ao criar o produto:', error);
      alert('Falha ao criar o produto. Verifique os dados.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product); // Define o produto a ser editado
    setNewProduct({
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.priceRange ? product.priceRange.toString() : '', // Verifica se price existe
      categoryId: product.categoryId,
    });
    setIsCreating(true); // Exibe o formulário de edição
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!editingProduct || !editingProduct.id) {
      console.error('Produto não selecionado ou id inválido');
      alert('Produto não selecionado ou id inválido');
      return;
    }
  
    // Se o valor de newProduct.categoryId não foi alterado, mantém a categoria original
    const categoryIdToUpdate = newProduct.categoryId !== undefined ? newProduct.categoryId : editingProduct.categoryId;
  
    // Montando os dados do produto
    const productData = {
      name: newProduct.name,
      description: newProduct.description,
      image: newProduct.image,
      price: parseFloat(newProduct.price),
      categoryId: categoryIdToUpdate, // Garantir que sempre enviamos o categoryId
    };
  
    console.log('Atualizando produto com id:', editingProduct.id);
    console.log('Dados do produto:', productData);
  
    try {
      // Chamada para a API para atualizar o produto
      const response = await adminApi.updateProduct(editingProduct.id, productData);
      console.log('Produto atualizado com sucesso:', response);
  
      loadProducts(); // Recarrega a lista de produtos após a atualização
      setEditingProduct(null); // Limpa o produto sendo editado
      setIsCreating(false); // Fecha o formulário de edição
      setNewProduct({
        name: '',
        description: '',
        image: '',
        price: '',
        categoryId: categoryIdToUpdate, // Mantém a categoria original ou a nova após a atualização
      });
    } catch (error) {
      console.error('Falha ao atualizar o produto:', error);
      alert('Falha ao atualizar o produto. Verifique os dados.');
    }
  };
  
  
  
  
  
  

  const handleDeleteProduct = async (productId: number) => {
    try {
      await adminApi.deleteProduct(productId);
      loadProducts(); // Recarrega a lista de produtos após a exclusão
    } catch (error) {
      console.error('Falha ao excluir o produto:', error);
      alert('Falha ao excluir o produto. Tente novamente.');
    }
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Imagem</label>
            <input
              type="text"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

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
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <h3 className="font-medium text-purple-800">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
