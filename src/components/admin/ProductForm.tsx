import React, { useState, useRef } from 'react';
import { Package, Upload, Image as ImageIcon, X, Plus, Sparkles, Heart } from 'lucide-react';
import { Product } from '../../types/product';
import { EnhancedImageUpload } from './EnhancedImageUpload';
import { ImageEditor } from './ImageEditor';

interface Category {
  ID: number;
  name: string;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  priceRange: string;
  categoryId: number;
  images: File[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    priceRange: product?.priceRange || '',
    categoryId: product?.categoryId || categories[0]?.ID || 1,
    images: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (!formData.priceRange.trim()) {
      newErrors.priceRange = 'Preço é obrigatório';
    } else if (isNaN(Number(formData.priceRange)) || Number(formData.priceRange) <= 0) {
      newErrors.priceRange = 'Preço deve ser um número válido';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageEdit = (file: File) => {
    setImageToEdit(file);
    setIsImageEditorOpen(true);
  };

  const handleImageEditorSave = (editedImage: File) => {
    // Substituir a imagem editada na lista
    const updatedImages = formData.images.map(img => 
      img === imageToEdit ? editedImage : img
    );
    handleInputChange('images', updatedImages);
    setIsImageEditorOpen(false);
    setImageToEdit(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {product ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <p className="text-purple-100">
                  {product ? 'Atualize as informações do produto' : 'Adicione um novo produto ao catálogo'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Informações Básicas
                </h3>
                
                <div className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Produto *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.name 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 focus:border-purple-500'
                      }`}
                      placeholder="Ex: Amigurumi Cinnamoroll"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Descrição */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                        errors.description 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 focus:border-purple-500'
                      }`}
                      placeholder="Descreva o produto, materiais utilizados, tamanho, etc..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Preço */}
                  <div>
                    <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        id="priceRange"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.priceRange}
                        onChange={(e) => handleInputChange('priceRange', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.priceRange 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-200 focus:border-purple-500'
                        }`}
                        placeholder="0,00"
                      />
                    </div>
                    {errors.priceRange && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {errors.priceRange}
                      </p>
                    )}
                  </div>

                  {/* Categoria */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', Number(e.target.value))}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.categoryId 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 focus:border-purple-500'
                      }`}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.ID} value={category.ID}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {errors.categoryId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload de Imagens */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
                <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Imagens do Produto
                </h3>
                
                <EnhancedImageUpload
                  onImagesChange={(images) => handleInputChange('images', images)}
                  maxImages={5}
                />
              </div>

              {/* Dicas */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Dicas para Melhor Resultado
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✨ Use boa iluminação natural nas fotos</li>
                  <li>📸 Tire fotos de diferentes ângulos</li>
                  <li>🎨 Mostre detalhes e texturas do crochê</li>
                  <li>✂️ Use o editor para cortar e ajustar</li>
                  <li>💡 Seja específico na descrição</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>{product ? 'Atualizar Produto' : 'Criar Produto'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Image Editor Modal */}
        <ImageEditor
          isOpen={isImageEditorOpen}
          onClose={() => {
            setIsImageEditorOpen(false);
            setImageToEdit(null);
          }}
          onSave={handleImageEditorSave}
          initialImage={imageToEdit}
          title="Editar Imagem do Produto"
        />
      </div>
    </div>
  );
};
