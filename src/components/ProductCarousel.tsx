import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminApi } from '../services/api'; // Certifique-se de importar a API correta

interface ProductCarouselProps {
  products: any[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productImages, setProductImages] = useState<Record<number, string>>({});

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Função para carregar a imagem do produto
  const fetchProductImage = async (productId: number) => {
    try {
      const image = await adminApi.getProductImage(productId);
      setProductImages((prevImages) => ({
        ...prevImages,
        [productId]: image, // Salva a URL da imagem para o produto correspondente
      }));
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
    }
  };

  // Carregar as imagens dos produtos assim que o componente for montado
  useEffect(() => {
    products.forEach((product) => {
      fetchProductImage(product.id);
    });
  }, [products]);

  return (
    <div className="relative">
      <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide py-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-none w-72 snap-center"
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={productImages[product.id] || '/default-image.jpg'} // Usa a URL da imagem ou uma imagem padrão
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-pink-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-pink-600">R$ {product.priceRange}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category?.name}</p>
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
