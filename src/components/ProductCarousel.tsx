import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../data/products';

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="relative">
      <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide py-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-none w-72 snap-center"
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-purple-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-purple-800" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-purple-800" />
      </button>
    </div>
  );
}