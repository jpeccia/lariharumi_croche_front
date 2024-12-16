import React, { useState } from 'react';
import { adminApi } from '../../services/api';
import { Category } from '../../types/product';
import { Edit, Trash, Plus, Package } from 'lucide-react';

export function CategoryManagement() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
  });

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      alert('Falha ao carregar as categorias.');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const categoryData = {
        name: newCategory.name,
      };

      const response = await adminApi.createCategory(categoryData);
      console.log('Categoria criada com sucesso:', response);

      loadCategories();
      setIsCreating(false);
      setNewCategory({ name: '' });
    } catch (error) {
      console.error('Falha ao criar a categoria:', error);
      alert('Falha ao criar a categoria. Verifique os dados.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category); // Define a categoria a ser editada
    setNewCategory({ name: category.name });
    setIsCreating(true); // Exibe o formulário de edição
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
    };

    try {
      const response = await adminApi.updateCategory(editingCategory.id, categoryData);
      console.log('Categoria atualizada com sucesso:', response);

      loadCategories();
      setEditingCategory(null);
      setIsCreating(false);
      setNewCategory({ name: '' });
    } catch (error) {
      console.error('Falha ao atualizar a categoria:', error);
      alert('Falha ao atualizar a categoria. Verifique os dados.');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await adminApi.deleteCategory(categoryId);
      loadCategories(); // Recarrega a lista de categorias após a exclusão
    } catch (error) {
      console.error('Falha ao excluir a categoria:', error);
      alert('Falha ao excluir a categoria. Tente novamente.');
    }
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

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            {editingCategory ? 'Atualizar Categoria' : 'Criar Categoria'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <h3 className="font-medium text-purple-800">{category.name}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditCategory(category)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
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
