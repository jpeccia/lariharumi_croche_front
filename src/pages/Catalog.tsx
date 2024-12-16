import { useState } from 'react';
import { categories, products } from '../data/products';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCard } from '../components/catalog/ProductCard';
import { MadeToOrderBanner } from '../components/shared/MadeToOrderBanner';

function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === categories.find(c => c.id === selectedCategory)?.name)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <MadeToOrderBanner />

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-purple-800 mb-8">Categorias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={setSelectedCategory}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-purple-800">
            {selectedCategory 
              ? `${categories.find(c => c.id === selectedCategory)?.name}`
              : 'Todas as Peças'
            }
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Ver todas as categorias
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              instagramUsername="lhkowara"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Catalog;