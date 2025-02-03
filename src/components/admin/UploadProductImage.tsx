import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';

interface UploadProductImagesProps {
  productID: number;
  onImagesUploaded: (imageUrls: string[]) => void;  // Mudança para múltiplas URLs de imagens
}

export function UploadProductImage({ productID, onImagesUploaded }: UploadProductImagesProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Estado para imagens existentes

  // Função para carregar as imagens existentes ao montar o componente
  useEffect(() => {
    const fetchExistingImages = async () => {
      try {
        const images = await adminApi.getProductImages(productID);  // Supondo que exista uma função para buscar as imagens do produto
        setExistingImages(images);
      } catch (err) {
        setError('Falha ao carregar imagens existentes');
      }
    };

    fetchExistingImages();
  }, [productID]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
  
    if (files && files.length > 0) {
      try {
        setLoading(true);
        setError(null);
  
        // Convertendo o FileList para um array
        const fileArray = Array.from(files);
  
        // Enviando todas as imagens de uma vez para o backend
        const imageUrls = await adminApi.uploadProductImages(fileArray, productID);
  
        // Verificando se o backend retornou as URLs corretamente
        if (Array.isArray(imageUrls)) {
          // Atualizando as imagens existentes com as novas imagens
          const allImages = [...existingImages, ...imageUrls];
          setExistingImages(allImages);
  
          // Chamando o callback para notificar o componente pai
          onImagesUploaded(allImages);
        } else {
          throw new Error('Formato de resposta inválido');
        }
  
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
  };
  

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      setLoading(true);
      setError(null);
  
      // Encontra o índice da imagem na lista
      const imageIndex = existingImages.indexOf(imageUrl);
  
      if (imageIndex === -1) {
        throw new Error('Imagem não encontrada');
      }
  
      // Chamando a API para remover a imagem passando o índice
      await adminApi.deleteProductImage(productID, imageIndex);
  
      // Atualiza a lista de imagens, removendo a imagem excluída
      const updatedImages = existingImages.filter((image) => image !== imageUrl);
      setExistingImages(updatedImages);
  
      // Chama o callback para notificar o componente pai
      onImagesUploaded(updatedImages);
  
      setLoading(false);
    } catch (err) {
      setError('Falha ao remover a imagem');
      setLoading(false);
    }
  };
  

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} /> {/* Permite múltiplos arquivos */}
      
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>Imagens do produto</h3>
        {existingImages.length > 0 ? (
          <div>
            {existingImages.map((imageUrl, index) => (
              <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
                <img src={imageUrl} alt={`Imagem ${index}`} width="100" />
                <button onClick={() => handleRemoveImage(imageUrl)} style={{ display: 'block', marginTop: '5px' }}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma imagem disponível</p>
        )}
      </div>
    </div>
  );
}
