import { Instagram } from 'lucide-react';
import { Product } from '../../types/product';
import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';

interface ProductCardProps {
  product: Product;
  instagramUsername: string;
}

export function ProductCard({ product, instagramUsername }: ProductCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        const image = await adminApi.getProductImage(product.id);
        setImageUrl(image); // A URL da imagem será salva no estado
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
      }
    };

    fetchProductImage(); // Carrega a imagem quando o componente for montado
  }, [product.id]);

  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-full h-48"> {/* Ajuste do contêiner da imagem */}
        <img
          src={imageUrl || '/default-image.jpg'} // Caso a imagem não seja carregada, mostra uma imagem padrão
          alt={product.name}
          className="w-full h-full object-fill" // Usar 'object-fill' para a imagem preencher o contêiner sem bordas
        />
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
    </div>
  );
}
