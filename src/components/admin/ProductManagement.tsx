import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '../../services/api';
import { Product } from '../../types/product';
import { UploadProductImage } from './UploadProductImage';
import { toast } from 'react-toastify';

interface Category {
  ID: number;
  name: string;
}

interface ProductProps {
  product: Product;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const images = await adminApi.getProductImages(product.ID);
        setImageUrls(images); 
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
      }
    };

    fetchProductImages();
  }, [product.ID]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-full h-32 flex items-center justify-center">
      {imageUrls.length > 0 ? (
  <>
    {/* Botão para imagem anterior */}
    <button
      onClick={handlePrevImage}
      className="absolute left-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
    >
      <ChevronLeft size={12} />
    </button>

    {/* Imagem atual */}
    <img
      src={imageUrls[currentImageIndex]}
      alt={product.name}
      className="w-full h-full object-fill"  
    />

    {/* Botão para próxima imagem */}
    <button
      onClick={handleNextImage}
      className="absolute right-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
    >
      <ChevronRight size={12} />
    </button>
  </>
) : (
  <img
    src="/default-image.jpg" 
    alt={product.name}
    className="w-full h-full object-cover" 
  />
)}
      </div>
    </div>
  );
}

export function ProductManagement({ product }: ProductProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    images: [] as string[], // Inicializando como um array de strings
    priceRange: '',
    categoryId: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]); // Usando o tipo Category
  const [loading, setLoading] = useState<boolean>(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState<string>('');

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [product]);

  useEffect(() => {
    if (editingProduct) {
      const fetchImages = async () => {
        const images = await adminApi.getProductImages(editingProduct.ID);
        setNewProduct((prev) => ({ ...prev, images }));
      };
      fetchImages();
    }
  }, [editingProduct]);

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
      setCategories(data); 
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      alert('Falha ao carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!product?.ID) return; 
  
    const fetchProductImage = async () => {
      try {
        const response = await adminApi.getProductImages(product.ID);
        setProductImageUrl(response);
      } catch (error) {
        console.error('Erro ao carregar imagem do produto:', error);
      }
    };
  
    fetchProductImage();
  }, [product?.ID]);
  

  const handleRemoveImage = async (imageUrl: string) => {
    if (!editingProduct?.ID) {
      console.error('Produto não encontrado para remover imagem.');
      return;
    }
  
    try {
      const imageIndex = newProduct.images.indexOf(imageUrl);
      if (imageIndex === -1) {
        console.error('Imagem não encontrada.');
        toast.error('Imagem não encontrada.');
        return;
      }
  
      await adminApi.deleteProductImage(editingProduct.ID, imageIndex);
  
      setNewProduct((prev) => ({
        ...prev,
        images: prev.images.filter((url) => url !== imageUrl),
      }));
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast.error('Falha ao remover imagem.');
    }
  };
  

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log(newProduct); // Adicione isto para depurar o valor de newProduct
    
    if (!newProduct.name || !newProduct.description || !newProduct.priceRange || !newProduct.categoryId ) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      const response = await adminApi.createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.priceRange,
        categoryId: newProduct.categoryId,
      });
  
      loadProducts();
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Falha ao criar o produto:', error);
      toast.error('Falha ao criar o produto.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      images: Array.isArray(product.images) ? product.images : [], // Garante que seja um array
      priceRange: product.priceRange,
      categoryId: product.categoryId,
    });
    setIsCreating(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.ID) {
      alert('Produto não selecionado ou ID inválido');
      return;
    }
  
    try {
      const updatedProduct = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.priceRange,  
        categoryId: newProduct.categoryId,
      };
  
      console.log("Dados para atualização:", updatedProduct);
    
      // Atualiza os dados do produto sem a imagem
      await adminApi.updateProduct(editingProduct.ID, updatedProduct);
  
      // Se houver imagens, fazer o upload delas
      if (newProduct.images.length > 0) {
        const imageFiles = newProduct.images.map((imageUrl) => new File([imageUrl], "image.jpg"));
        await adminApi.uploadProductImages(imageFiles, editingProduct.ID);
      }
  
      loadProducts(); // Recarrega a lista de produtos
      setEditingProduct(null);
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Falha ao atualizar o produto:', error);
      toast.error('Falha ao atualizar o produto.');
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

  const handleImageChange = async (files: FileList | null) => {
    if (!files) return;
  
    try {
      const uploadedImages = await adminApi.uploadProductImages(files, editingProduct?.ID || newProduct.ID);
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages], // URLs reais do servidor
      }));
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      toast.error('Falha ao fazer upload das imagens.');
    }
  };
  
  
  

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      images: [] as string[], // Inicializando como um array de strings
      priceRange: '',
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

              {newProduct.images?.length > 0 && (
            <div className="mt-2">
              {newProduct.images.map((image: string, index: number) => (
                <div key={index} className="relative inline-block mr-2">
                  <img src={image} alt={`Imagem ${index}`} className="w-32 h-32 rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              type="number"
              value={newProduct.priceRange}
              onChange={(e) => setNewProduct({ ...newProduct, priceRange: e.target.value })}
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
                    <option key={category.ID} value={category.ID}>
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


<div className="space-y-6">
  {products.map((product) => (
    <div
      key={product.ID}
      className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
    >
      <div className="flex items-center gap-6">
        {/* Container responsivo para a imagem */}
        <div className="w-32 h-32 flex-shrink-0">
          <ProductCard key={product.ID} product={product} />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-semibold text-gray-800">{product.name}</p>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleEditProduct(product)}
          className="text-blue-600 hover:text-blue-700 p-2 rounded-md transition duration-200 ease-in-out transform hover:scale-110"
        >
          <Edit className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleDeleteProduct(product.ID)}
          className="text-red-600 hover:text-red-700 p-2 rounded-md transition duration-200 ease-in-out transform hover:scale-110"
        >
          <Trash className="w-6 h-6" />
        </button>
      </div>
    </div>
  ))}
</div>




      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-sm w-96">
            <UploadProductImage
              productID={editingProduct ? editingProduct.ID : newProduct.ID}
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
