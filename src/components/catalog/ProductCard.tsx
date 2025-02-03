import { Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types/product';
import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';

interface ProductCardProps {
  product: Product;
  instagramUsername: string;
}

export function ProductCard({ product, instagramUsername }: ProductCardProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Estado para múltiplas imagens
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Índice da imagem atual

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const images = await adminApi.getProductImages(product.ID);
        setImageUrls(images); // Salva as URLs completas das imagens no estado
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

  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-full h-48 flex items-center justify-center">
      {imageUrls.length > 0 ? (
  <>
    {/* Botão para imagem anterior */}
    <button
      onClick={handlePrevImage}
      className="absolute left-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
    >
      <ChevronLeft size={24} />
    </button>

    {/* Imagem atual */}
    <img
      src={imageUrls[currentImageIndex]}
      alt={product.name}
      className="w-full h-full object-fill"  
    />

    {/* Botão para próxima imagem */}
    <button
      onClick={handleNextImage}
      className="absolute right-2 text-purple-600 hover:text-purple-800 bg-white p-1 rounded-full shadow"
    >
      <ChevronRight size={24} />
    </button>
  </>
) : (
  <img
    src="/default-image.jpg" // Imagem padrão se nenhuma estiver disponível
    alt={product.name}
    className="w-full h-full object-cover"  // Imagem padrão preenchendo o espaço
  />
)}

        <div className="absolute top-2 right-2 bg-pink-100 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-pink-600">R$ {product.price}</span>
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
    </div>
  );
}
