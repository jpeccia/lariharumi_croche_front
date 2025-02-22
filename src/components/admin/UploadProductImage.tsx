import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';

interface UploadProductImagesProps {
  productID: number;
  onImagesUploaded: (imageUrls: string[]) => void;  // Callback para notificar o componente pai
}

export function UploadProductImage({ productID, onImagesUploaded }: UploadProductImagesProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Carrega as imagens existentes ao montar o componente
  useEffect(() => {
    const fetchExistingImages = async () => {
      try {
        const images = await adminApi.getProductImages(productID);
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
  
        const fileArray = Array.from(files);
  
        // Adiciona as imagens temporariamente enquanto o upload é processado
        const newImageUrls = fileArray.map((file) => URL.createObjectURL(file));
        const allImages = [...existingImages, ...newImageUrls];
        setExistingImages(allImages);
        onImagesUploaded(allImages);  // Notifica o componente pai com as imagens atuais
  
        // Faz o upload real para o backend
        const uploadedImageUrls = await adminApi.uploadProductImages(fileArray, productID);
  
        // Verifica se o retorno é um array válido de URLs
        if (!Array.isArray(uploadedImageUrls)) {
          throw new Error('O retorno do upload não é um array válido');
        }
  
        // Atualiza as imagens com as URLs retornadas pelo backend
        const finalImages = [...existingImages, ...uploadedImageUrls];
        setExistingImages(finalImages);
        onImagesUploaded(finalImages);
  
      } catch (err) {
        setError(`Falha ao fazer upload das imagens: ${err.message || err}`);
        console.error('Erro no upload:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Nenhuma imagem foi selecionada');
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

      // Remove a imagem do backend
      await adminApi.deleteProductImage(productID, imageIndex);

      // Atualiza a lista de imagens existentes
      const updatedImages = existingImages.filter((image) => image !== imageUrl);
      setExistingImages(updatedImages);

      // Notifica o componente pai com a lista atualizada
      onImagesUploaded(updatedImages);
    } catch (err) {
      setError(`Falha ao remover a imagem: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={loading} // Desabilita o input durante o upload
      />
  
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
  
      <div>
        <h3>Imagens do produto</h3>
        {existingImages.length > 0 ? (
          <div
            style={{
              display: "flex",
              overflowX: "auto", // Ativa o scroll horizontal
              whiteSpace: "nowrap",
              gap: "10px", // Espaçamento entre imagens
              paddingBottom: "10px", // Evita que a rolagem fique muito colada
            }}
          >
            {existingImages.map((imageUrl, index) => (
              <div key={index} style={{ flexShrink: 0, textAlign: "center" }}>
                <img src={imageUrl} alt={`Imagem ${index}`} width="100" />
                <button
                  onClick={() => handleRemoveImage(imageUrl)}
                  disabled={loading} // Desabilita o botão durante o carregamento
                  style={{ display: "block", marginTop: "5px" }}
                >
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