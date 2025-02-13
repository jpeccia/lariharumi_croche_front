import { Instagram, X, Maximize2 } from 'lucide-react';
import { Product } from '../../types/product';
import { useState, useEffect } from 'react';
import '@splidejs/react-splide/css';
import { adminApi } from '../../services/api';
import { Splide, SplideSlide } from '@splidejs/react-splide';

interface ProductCardProps {
  product: Product;
  instagramUsername: string;
}

export function ProductCard({ product, instagramUsername }: ProductCardProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-full h-80">
        {imageUrls.length > 0 ? (
          <Splide
            options={{
              type: 'loop',
              perPage: 1,
              pagination: true,
              arrows: true,
            }}
            className="h-full"
          >
            {imageUrls.map((url, index) => (
              <SplideSlide key={index} className="h-full">
                <img
                  onClick={openModal}
                  src={url}
                  alt={product.name}
                  className="w-full h-full object-fill cursor-pointer"
                />
              </SplideSlide>
            ))}
          </Splide>
        ) : (
          <img src="/default-image.jpg" alt={product.name} className="w-full h-full object-cover" />
        )}

        <div className="absolute top-2 right-2 bg-pink-100 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-pink-600">R$ {product.priceRange}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full transition-colors"
        >
          <Instagram size={18} />
          <span>Encomendar no Instagram</span>
        </a>
      </div>

      {/* Modal para visualizar a imagem em tamanho maior */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-50 text-gray-600 hover:text-gray-800 bg-white p-1 rounded-full shadow"
            >
              <X size={24} />
            </button>

            <Splide
              options={{
                type: 'loop',
                perPage: 1,
                pagination: true,
                arrows: true,
              }}
              className="max-w-full max-h-[80vh]"
            >
              {imageUrls.map((url, index) => (
                <SplideSlide key={index}>
                  <img src={url} alt={product.name} className="max-w-full max-h-[80vh] object-contain" />
                </SplideSlide>
              ))}
            </Splide>
          </div>
        </div>
      )}
    </div>
  );
}
