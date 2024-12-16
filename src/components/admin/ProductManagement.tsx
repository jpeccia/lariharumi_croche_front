import React from 'react';
import { Package, Plus, Edit, Trash } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Product } from '../../types/product';

export function ProductManagement() {
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-purple-800">Gerenciar Produtos</h2>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <h3 className="font-medium text-purple-800">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}