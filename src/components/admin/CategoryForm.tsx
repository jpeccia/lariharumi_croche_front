import React, { useState } from 'react';
import { FolderOpen, Upload, Image as ImageIcon, X, Plus, Sparkles, Heart } from 'lucide-react';
import { UploadCategoryImage } from './UploadCategoryImage';

interface Category {
  ID: number;
  name: string;
  description: string;
  image: string;
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface CategoryFormData {
  name: string;
  image: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    image: category?.image || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da categoria é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
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
      console.error('Erro ao salvar categoria:', error);
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (imageUrl: string) => {
    handleInputChange('image', imageUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {category ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <p className="text-pink-100">
                  {category ? 'Atualize as informações da categoria' : 'Crie uma nova categoria para organizar produtos'}
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
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl border border-pink-100">
              <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Informações da Categoria
              </h3>
              
              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Categoria *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 focus:border-pink-500'
                    }`}
                    placeholder="Ex: Amigurumis, Acessórios, Decoração"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Upload de Imagem */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Imagem da Categoria
              </h3>
              
              <div className="space-y-4">
                <UploadCategoryImage
                  categoryID={category?.ID || 0}
                  onImageChange={handleImageChange}
                />
                
                {formData.image && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview da imagem:</p>
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-purple-200">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Dicas para Categorias
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>🏷️ Use nomes claros e descritivos</li>
                <li>🖼️ Escolha uma imagem representativa</li>
                <li>🎨 Mantenha consistência visual</li>
                <li>📂 Organize produtos de forma lógica</li>
                <li>✨ Nomes simples facilitam a navegação</li>
              </ul>
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
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>{category ? 'Atualizar Categoria' : 'Criar Categoria'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
