import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash } from 'lucide-react';
import { adminApi } from '../../services/api';
import { UploadCategoryImage } from './UploadCategoryImage';
import { showError } from '../../utils/toast';
import { categorySchema, CategoryFormData } from '../../schemas/validationSchemas';
import { useAnalytics } from '../../services/analytics';
import { ImageEditor } from './ImageEditor';
import { CategoryForm } from './CategoryForm';

interface Category {
  ID: number;
  name: string;
  description: string;
  image: string | null;
}

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const [categoryImageUrl, setCategoryImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchCategoryImage = async () => {
      try {
        const response = await adminApi.getCategoryImage(category.ID); 
        setCategoryImageUrl(response); 
      } catch (error) {
        console.error('Erro ao carregar imagem da categoria:', error);
      }
    };

    fetchCategoryImage();
  }, [category]);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
      <div className="flex items-center gap-4">
        <img
          src={categoryImageUrl || category.image || '/default-image.png'}
          alt={category.name}
          className="w-12 h-12 object-cover rounded-md"
        />
        <div>
          <p className="font-semibold text-lg">{category.name}</p>
          <p className="text-sm text-gray-600">{category.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-700"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

interface CategoryManagementProps {
  onDataChange?: () => void;
}

export function CategoryManagement({ onDataChange }: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Falha ao carregar categorias:', error);
      showError('Falha ao carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      const response = await adminApi.createCategory({
        name: formData.name,
      });

      console.log('Categoria criada com sucesso:', response);

      showCategorySuccess('criada');
      loadCategories();
      setIsFormOpen(false);
      setNewCategory({
        name: '',
        description: '',
        image: '',
      });
      onDataChange?.();
    } catch (error) {
      console.error('Falha ao criar a categoria:', error);
      showError('Falha ao criar a categoria. Verifique os dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      image: category.image || '',
    });
    setIsCreating(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory?.ID) {
      console.error('Categoria não selecionada ou id inválido');
      showError('Categoria não selecionada ou id inválido');
      return;
    }

    const categoryData = {
      name: newCategory.name,
      description: newCategory.description,
      image: newCategory.image,
    };

    try {
      const response = await adminApi.updateCategory(editingCategory.ID, categoryData);
      console.log('Categoria atualizada com sucesso:', response);

      loadCategories();
      setEditingCategory(null);
      setIsCreating(false);
      setNewCategory({
        name: '',
        description: '',
        image: '',
      });
      onDataChange?.(); // Atualizar estatísticas do dashboard
    } catch (error) {
      console.error('Falha ao atualizar a categoria:', error);
      showError('Falha ao atualizar a categoria. Verifique os dados.');
    }
    window.location.reload();
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await adminApi.deleteCategory(categoryId);
      loadCategories();
      onDataChange?.(); // Atualizar estatísticas do dashboard
    } catch (error) {
      console.error('Falha ao excluir a categoria:', error);
      showError('Falha ao excluir a categoria. Tente novamente.');
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setNewCategory({
      ...newCategory,
      image: imageUrl,
    });
    setIsImageModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-purple-800">Gerenciar Categorias</h2>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingCategory(null);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      {(isCreating || editingCategory) && (
        <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4 mb-6">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="category-name"
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
              aria-describedby="category-name-help"
            />
          </div>

          {editingCategory && (
            <div>
              <label htmlFor="category-image-btn" className="block text-sm font-medium text-gray-700">Imagem</label>
              <button
                id="category-image-btn"
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                aria-describedby="category-image-help"
              >
                Selecionar Imagem
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
          >
            {editingCategory ? 'Atualizar Categoria' : 'Criar Categoria'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.ID}
            category={category}
            onEdit={() => handleEditCategory(category)}
            onDelete={() => handleDeleteCategory(category.ID)}
          />
        ))}
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-sm w-96">
            <UploadCategoryImage
              categoryID={editingCategory ? editingCategory.ID : undefined}
              onImageUploaded={handleImageChange}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {isFormOpen && (
        <CategoryForm
          onSubmit={handleCreateCategory}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
