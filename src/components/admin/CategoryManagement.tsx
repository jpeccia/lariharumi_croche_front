// CategoryManagement.tsx
import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash } from 'lucide-react';
import { adminApi } from '../../services/api';
import { UploadCategoryImage } from './UploadCategoryImage'; // Componente para upload de imagem de categoria

interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '', // Inicialmente será uma URL ou caminho para o arquivo de imagem
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Estado para controlar o modal

  useEffect(() => {
    loadCategories();
  }, []);

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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await adminApi.createCategory({
        name: newCategory.name,
      });

      console.log('Categoria criada com sucesso:', response);

      loadCategories(); // Atualiza a lista de categorias
      setIsCreating(false); // Altera o estado de criação
      setNewCategory({
        name: '',
        description: '',
        image: '', // Resetando a imagem
      });
    } catch (error) {
      console.error('Falha ao criar a categoria:', error);
      alert('Falha ao criar a categoria. Verifique os dados.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      image: category.image || '', // Preservando a URL da imagem original
    });
    setIsCreating(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory || !editingCategory.id) {
      console.error('Categoria não selecionada ou id inválido');
      alert('Categoria não selecionada ou id inválido');
      return;
    }

    const categoryData = {
      name: newCategory.name,
      description: newCategory.description,
      image: newCategory.image,
    };

    try {
      const response = await adminApi.updateCategory(editingCategory.id, categoryData);
      console.log('Categoria atualizada com sucesso:', response);

      loadCategories();
      setEditingCategory(null);
      setIsCreating(false);
      setNewCategory({
        name: '',
        description: '',
        image: '',
      });
    } catch (error) {
      console.error('Falha ao atualizar a categoria:', error);
      alert('Falha ao atualizar a categoria. Verifique os dados.');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await adminApi.deleteCategory(categoryId);
      loadCategories();
    } catch (error) {
      console.error('Falha ao excluir a categoria:', error);
      alert('Falha ao excluir a categoria. Tente novamente.');
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setNewCategory({
      ...newCategory,
      image: imageUrl, // Atualizando a URL da imagem
    });
    setIsImageModalOpen(false); // Fechar o modal após a seleção da imagem
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
            setIsCreating(!isCreating);
            setEditingCategory(null);
          }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {(isCreating || editingCategory) && (
        <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          {/* O campo de imagem será exibido apenas durante a edição */}
          {editingCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagem</label>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)} // Abre o modal de imagem
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Selecionar Imagem
              </button>
              {newCategory.image && (
                <img
                  src={newCategory.image}
                  alt="Imagem da Categoria"
                  className="mt-2 w-32 h-32 object-cover"
                />
              )}
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
          <div key={category.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
            <div className="flex items-center gap-4">
              <img
                src={category.image || 'placeholder.jpg'}
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
                onClick={() => handleEditCategory(category)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
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
            <UploadCategoryImage
              categoryId={editingCategory ? editingCategory.id : newCategory.id}
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
