import React, { useState, useEffect, useRef } from 'react';
import { Package, Plus, Edit, Trash, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { adminApi } from '../../services/api';
import { Product } from '../../types/product';
import { UploadProductImage } from './UploadProductImage';
import { showProductSuccess, showError } from '../../utils/toast';
import { useDebounce } from 'use-debounce';
import { productSchema, ProductFormData } from '../../schemas/validationSchemas';
import { useAnalytics } from '../../services/analytics';
import { ImageEditor } from './ImageEditor';
import { useCategoriesCache } from '../../hooks/useApiCache';
import { ProductForm } from './ProductForm';

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

  const handleImageEdit = (file: File) => {
    setImageToEdit(file);
    setIsImageEditorOpen(true);
  };

  const handleImageEditorSave = async (editedImage: File) => {
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
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-full h-32 flex items-center justify-center">
      {imageUrls.length > 0 ? (
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
) : (
  <img
    src="/default-image.jpg" 
    alt={product.name}
    className="w-full h-full object-cover" 
  />
        )}

        {/* Image Editor Modal */}
        <ImageEditor
          isOpen={isImageEditorOpen}
          onClose={() => {
            setIsImageEditorOpen(false);
            setImageToEdit(null);
          }}
          onSave={handleImageEditorSave}
          initialImage={imageToEdit}
          title="Editor de Imagem do Produto"
        />
      </div>
    </div>
  );
}

interface ProductManagementProps {
  product?: Product;
  onDataChange?: () => void;
}

export function ProductManagement({ product, onDataChange }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    images: [] as string[],
    priceRange: '',
    categoryId: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  
  // Usar cache para categorias
  const { data: categories, refresh: refreshCategories } = useCategoriesCache();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState<string>('');
  const [isSectionVisible, setIsSectionVisible] = useState(true); // Novo estado para controlar a visibilidade da seção
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editFormRef = useRef<HTMLFormElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isSearching, setIsSearching] = useState(false);

  
  useEffect(() => {
    // Carregar produtos quando o componente monta
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await fetchProducts();
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  

  useEffect(() => {
    if (editingProduct) {
      const fetchImages = async () => {
        const images = await adminApi.getProductImages(editingProduct.ID);
        setNewProduct((prev) => ({ ...prev, images }));
      };
      fetchImages();
    }
  }, [editingProduct]);

  const [page, setPage] = useState(1);
  const limit = 12;
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    if (!debouncedSearchTerm) {
      fetchProducts();
    }
  }, [page]);
  
  useEffect(() => {
    // Carrega a primeira página quando a busca termina
    if (!debouncedSearchTerm) {
      setPage(1);
      setProducts([]);
      fetchProducts();
    }
  }, [debouncedSearchTerm]);
  const fetchProducts = async () => {
    if (isLoading) return;
  
    try {
      setIsLoading(true);
  
      const productsFetched = await adminApi.getProductsByPage(null, page, limit);
      const sorted = productsFetched.sort((a, b) => a.name.localeCompare(b.name));
  
      setProducts(prev => page === 1 ? sorted : [...prev, ...sorted]);
      setHasMore(productsFetched.length === limit);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setIsLoading(false);
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
  
  

  const handleCreateProduct = async (formData: any) => {
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
      fetchProducts();
      setIsFormOpen(false);
      resetForm();
      refreshCategories();
      onDataChange?.();
    } catch (error) {
      console.error('Falha ao criar o produto:', error);
      showError('Falha ao criar o produto.');
    } finally {
      setIsSubmitting(false);
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
    if (editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.ID) {
      showError('Produto não selecionado ou ID inválido');
      return;
    }
  
    try {
      const updatedProduct = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.priceRange,  
        categoryId: newProduct.categoryId,
      };
  
    
      // Atualiza os dados do produto sem a imagem
      await adminApi.updateProduct(editingProduct.ID, updatedProduct);
  
      // Se houver imagens, fazer o upload delas
      if (newProduct.images.length > 0) {
        const imageFiles = newProduct.images.map((imageUrl) => new File([imageUrl], "image.jpg"));
        await adminApi.uploadProductImages(imageFiles, editingProduct.ID);
      }
  
      fetchProducts();
      setEditingProduct(null);
      setIsCreating(false);
      resetForm();
      onDataChange?.(); // Atualizar estatísticas do dashboard
    } catch (error) {
      console.error('Falha ao atualizar o produto:', error);
      showError('Falha ao atualizar o produto.');
    }
  };
  
  const handleDeleteProduct = async (productId: number) => {
    try {
      await adminApi.deleteProduct(productId);
      fetchProducts();
      onDataChange?.(); // Atualizar estatísticas do dashboard
    } catch (error) {
      console.error('Falha ao excluir o produto:', error);
      showError('Falha ao excluir o produto.');
    }
  };

  const handleImageEdit = (file: File) => {
    setImageToEdit(file);
    setIsImageEditorOpen(true);
  };

  const handleImageEditorSave = async (editedImage: File) => {
    if (!editingProduct) return;
    
    try {
      // Upload da imagem editada
      await adminApi.uploadProductImages([editedImage], editingProduct.ID);
      showProductSuccess('imagem editada');
      fetchProducts();
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

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ref = loadMoreRef.current;
    if (!ref || isLoading || !hasMore) return;
  
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    }, { rootMargin: '200px' });
  
    observer.observe(ref);
  
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [isLoading, hasMore, page]);
  
  useEffect(() => {
    const search = async () => {
      if (!debouncedSearchTerm) {
        // saiu do modo de busca
        setIsSearching(false);
        setProducts([]); // limpa os resultados da busca
        setPage(1); // reseta paginação
        return;
      }
  
      try {
        setIsSearching(true);
        const result = await adminApi.searchProducts(debouncedSearchTerm, 0);
        setProducts(result);
        setHasMore(false); // desliga paginação enquanto busca
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };
  
    search();
  }, [debouncedSearchTerm]);
  
  

  
  
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
          {(isCreating || editingProduct) && (
            <form ref={editFormRef} onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  placeholder="Nome do produto"
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
          <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Buscar produto
        </label>
        <input
          type="text"
          id="search"
          placeholder="Digite o nome do produto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
              {products.map((product) => (
              <div
                key={product.ID}
                className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="flex items-center gap-6">
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
        <div ref={loadMoreRef} className="col-span-full flex justify-center mt-8">
          {isLoading && (
            <span className="text-purple-600 font-kawaii text-xl">Carregando mais peças...</span>
          )}
        </div>

          </div>

          {isImageModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-sm w-96">
                <UploadProductImage
                  productID={editingProduct ? editingProduct.ID : newProduct.ID}
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
        initialImage={imageToEdit}
        title="Editor de Imagem do Produto"
      />

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          categories={categories || []}
          onSubmit={handleCreateProduct}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}