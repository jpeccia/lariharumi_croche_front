import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Package, Plus, Edit, Trash, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { adminApi } from '../../services/api';
import { Product } from '../../types/product';
import { UploadProductImage } from './UploadProductImage';
import { showProductSuccess, showError } from '../../utils/toast';
import { useDebounce } from 'use-debounce';
import { ImageEditor } from './ImageEditor';
import { useCategoriesCache, invalidateProductsCache } from '../../hooks/useApiCache';
import { ProductForm } from './ProductForm';
import { PaginationConfig } from '../../types/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(({ product }: Readonly<ProductCardProps>) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | null>(null); 

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

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  }, [imageUrls.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  }, [imageUrls.length]);

  const handleImageEditorSave = useCallback(async (editedImage: File) => {
    try {
      // Upload da imagem editada
      await adminApi.uploadProductImages([editedImage], product.ID);
      // Recarregar imagens do produto
      const images = await adminApi.getProductImages(product.ID);
      setImageUrls(images);
      setIsImageEditorOpen(false);
      setImageToEdit(null);
    } catch (error) {
      console.error('Erro ao salvar imagem editada:', error);
    }
  }, [product.ID]);

  const imageContent = useMemo(() => {
    if (imageUrls.length > 0) {
      return (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
          >
            <ChevronLeft size={12} />
          </button>

          <img
            src={imageUrls[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-fill"  
          />

          <button
            onClick={handleNextImage}
            className="absolute right-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
          >
            <ChevronRight size={12} />
          </button>
        </>
      );
    } else {
      return (
        <img
          src="/default-image.jpg" 
          alt={product.name}
          className="w-full h-full object-cover" 
        />
      );
    }
  }, [imageUrls, currentImageIndex, product.name, handlePrevImage, handleNextImage]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-full h-32 flex items-center justify-center">
        {imageContent}

        {/* Image Editor Modal */}
        <ImageEditor
          isOpen={isImageEditorOpen}
          onClose={() => {
            setIsImageEditorOpen(false);
            setImageToEdit(null);
          }}
          onSave={handleImageEditorSave}
          initialImage={imageToEdit || undefined}
          title="Editor de Imagem do Produto"
        />
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

interface ProductManagementProps {
  product?: Product;
  onDataChange?: () => void;
}

export function ProductManagement({ onDataChange }: Readonly<ProductManagementProps>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    images: [] as string[],
    priceRange: '',
    categoryId: 1,
  });
  // Usar cache para categorias
  const { data: categories, refresh: refreshCategories } = useCategoriesCache();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editFormRef = useRef<HTMLFormElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  
  // Estados para paginação e busca
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  
  // Função fetchProducts otimizada
  const fetchProducts = useCallback(async (page: number = 1, searchQuery: string = '') => {
    try {
      setIsLoadingProducts(true);
  
      const config: PaginationConfig = {
        page: page,
        limit: 12,
        sortBy: 'name',
        sortOrder: 'asc'
      };
      
      let response;
      if (searchQuery.trim()) {
        // Usar busca se há termo de pesquisa
        response = await adminApi.searchProducts(searchQuery, config);
      } else {
        // Usar listagem normal
        response = await adminApi.getProductsByPage(null, config);
      }
      
      // Compatibilidade: verificar diferentes estruturas de resposta
      let productsFetched: Product[];
      
      if (response && typeof response === 'object' && 'data' in response) {
        // Nova estrutura com data
        const apiResponse = response as { data: Product[] };
        productsFetched = apiResponse.data;
      } else if (Array.isArray(response)) {
        // Array simples
        productsFetched = response;
      } else {
        console.error('Resposta da API:', response);
        throw new Error('Formato de resposta inválido da API');
      }
      
      // Filtrar produtos deletados (soft delete) - apenas se o campo existir
      const activeProducts = productsFetched.filter(product => 
        !product.isDeleted && !product.deletedAt
      );
  
      setProducts(activeProducts);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showError('Erro ao carregar produtos');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []); // Removida dependência de isLoadingProducts

  // Carregar produtos iniciais apenas uma vez
  useEffect(() => {
    fetchProducts(1, '');
  }, [fetchProducts]); // Adicionada dependência
  

  useEffect(() => {
    if (editingProduct) {
      const fetchImages = async () => {
        const images = await adminApi.getProductImages(editingProduct.ID);
        setNewProduct((prev) => ({ ...prev, images }));
      };
      fetchImages();
    }
  }, [editingProduct]);

  
  
  
  
  


  // Carregar produtos quando termo de busca muda
  useEffect(() => {
    fetchProducts(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchProducts]); // Adicionada dependência
  
  

  const handleCreateProduct = async (formData: { name: string; description: string; priceRange: string; categoryId: number; images?: File[] }) => {
    try {
      setIsSubmitting(true);
      
      const response = await adminApi.createProduct({
        name: formData.name,
        description: formData.description,
        price: formData.priceRange,
        categoryId: formData.categoryId,
      });

      // Upload das imagens se houver
      if (formData.images && formData.images.length > 0) {
        await adminApi.uploadProductImages(formData.images, response.ID);
      }

      showProductSuccess('criado');
      fetchProducts(currentPage, debouncedSearchTerm);
      setIsFormOpen(false);
      setEditingProduct(null);
      resetForm();
      refreshCategories();
      invalidateProductsCache(); // Invalidar cache de produtos e estatísticas
      onDataChange?.();
    } catch (error) {
      console.error('Falha ao criar o produto:', error);
      showError('Falha ao criar o produto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (formData: { name: string; description: string; priceRange: string; categoryId: number; images?: File[] }) => {
    if (!editingProduct?.ID) {
      showError('Produto não selecionado ou ID inválido');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await adminApi.updateProduct(editingProduct.ID, {
        name: formData.name,
        description: formData.description,
        price: formData.priceRange,
        categoryId: formData.categoryId,
      });

      showProductSuccess('atualizado');
      fetchProducts(currentPage, debouncedSearchTerm);
      setIsFormOpen(false);
      setEditingProduct(null);
      refreshCategories();
      invalidateProductsCache(); // Invalidar cache de produtos e estatísticas
      onDataChange?.();
    } catch (error) {
      console.error('Falha ao atualizar o produto:', error);
      showError('Falha ao atualizar o produto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  }, []);

  const handleDeleteProduct = useCallback(async (productId: number) => {
    try {
      await adminApi.deleteProduct(productId);
      fetchProducts(currentPage, debouncedSearchTerm);
      invalidateProductsCache(); // Invalidar cache de produtos e estatísticas
      onDataChange?.(); // Atualizar estatísticas do dashboard
    } catch (error) {
      console.error('Falha ao excluir o produto:', error);
      showError('Falha ao excluir o produto.');
    }
  }, [currentPage, debouncedSearchTerm, onDataChange, fetchProducts]);

  const handleImageEditorSave = async (editedImage: File) => {
    if (!editingProduct) return;
    
    try {
      // Upload da imagem editada
      await adminApi.uploadProductImages([editedImage], editingProduct.ID);
      showProductSuccess('imagem editada');
      fetchProducts(currentPage, debouncedSearchTerm);
    } catch (error) {
      console.error('Erro ao salvar imagem editada:', error);
      showError('Erro ao salvar imagem editada.');
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      images: [] as string[],
      priceRange: '',
      categoryId: 1,
    });
  };

  // Memoizar a lista de produtos para evitar re-renderizações desnecessárias
  const productsList = useMemo(() => {
    return products.map((product) => (
      <div
        key={product.ID}
        className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
      >
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 flex-shrink-0">
            <ProductCard product={product} />
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
    ));
  }, [products, handleEditProduct, handleDeleteProduct]);

  
  

  
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-purple-800">Gerenciar Produtos</h2>
          <button
            onClick={() => setIsSectionVisible(!isSectionVisible)}
            className="text-purple-600 hover:text-purple-800"
          >
            {isSectionVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingProduct(null);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {isSectionVisible && (
        <>
          {editingProduct && (
            <form ref={editFormRef} className="space-y-4 mb-6">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  id="product-name"
                  type="text"
                  placeholder="Nome do produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  id="product-description"
                  type="text"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              {editingProduct && (
                <div>
                  <label htmlFor="image-selector" className="block text-sm font-medium text-gray-700">Imagem</label>
                  <button
                    id="image-selector"
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Selecionar Imagem
                  </button>
                </div>
              )}

              <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Preço</label>
                <input
                  id="product-price"
                  type="number"
                  value={newProduct.priceRange}
                  onChange={(e) => setNewProduct({ ...newProduct, priceRange: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="product-category" className="block text-sm font-medium text-gray-700">Categoria</label>
                <select
                  id="product-category"
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  {(() => {
                    if (!categories) {
                      return <option>Carregando...</option>;
                    }
                    if (Array.isArray(categories) && categories.length > 0) {
                      return categories.map((category) => (
                        <option key={category.ID} value={category.ID}>
                          {category.name}
                        </option>
                      ));
                    }
                    return <option value="">Nenhuma categoria disponível</option>;
                  })()}
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
          <div className="mb-4">
        <label htmlFor="product-search" className="block text-sm font-medium text-gray-700 mb-1">
          Buscar produto
        </label>
        <input
          type="text"
          id="product-search"
          placeholder="Digite o nome do produto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
              {productsList}
        {isLoadingProducts && (
          <div className="col-span-full flex justify-center mt-8">
            <span className="text-purple-600 font-kawaii text-xl">Carregando produtos...</span>
          </div>
        )}

          </div>

          {isImageModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-sm w-96">
                <UploadProductImage
                  productID={editingProduct ? editingProduct.ID : 0}
                  onImagesUploaded={(uploadedImages) => {
                    setNewProduct((prev) => ({
                      ...prev,
                      images: [...prev.images, ...uploadedImages],
                    }));
                    setIsImageModalOpen(false);
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setIsImageModalOpen(false);
                      window.location.reload(); // Recarrega a página
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Image Editor Modal */}
      <ImageEditor
        isOpen={isImageEditorOpen}
        onClose={() => {
          setIsImageEditorOpen(false);
          setImageToEdit(null);
        }}
        onSave={handleImageEditorSave}
        initialImage={imageToEdit || undefined}
        title="Editor de Imagem do Produto"
      />

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct || undefined}
          categories={categories || []}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}