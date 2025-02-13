import { Instagram, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'; // Adicionei o ícone Maximize2
import { Product } from '../../types/product';
import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';

interface ProductCardProps {
  product: Product;
  instagramUsername: string;
}

export function ProductCard({ product, instagramUsername }: ProductCardProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Estado para múltiplas imagens
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Índice da imagem atual
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a visibilidade do modal

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="relative w-full h-80 flex items-center justify-center">
      {imageUrls.length > 0 ? (
        <>
          {/* Swiper com navegação customizada */}
          <Swiper
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            className="w-full h-full"
          >
            {imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  onClick={openModal}
                  src={url}
                  alt={product.name}
                  className="w-full h-full object-fill cursor-pointer"
                />
              </SwiperSlide>
            ))}
          </Swiper>
  
          {/* Botões customizados para navegação */}
          <button
            className="swiper-button-prev-custom absolute left-2 z-10 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="swiper-button-next-custom absolute right-2 z-10 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
          >
            <ChevronRight size={24} />
          </button>
  
          {/* Botão para abrir o modal (fullscreen) */}
          <button
            onClick={openModal}
            className="absolute bottom-2 right-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
          >
            <Maximize2 size={20} />
          </button>
        </>
      ) : (
        <img
          src="/default-image.jpg"
          alt={product.name}
          className="w-full h-full object-cover"
        />
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
      {/* Botão de fechar com z-index maior */}
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 z-50 text-gray-600 hover:text-gray-800 bg-white p-1 rounded-full shadow"
      >
        <X size={24} />
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={handlePrevImage}
          className="absolute left-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
        >
          <ChevronLeft size={24} />
        </button>

        <img
          src={imageUrls[currentImageIndex]}
          alt={product.name}
          className="max-w-full max-h-[80vh] object-contain"
        />

        <button
          onClick={handleNextImage}
          className="absolute right-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}