// UploadProductImage.tsx
import React, { useState } from 'react';
import { adminApi } from '../../services/api';

interface UploadProductImageProps {
  productId: number;
  onImageUploaded: (imageUrl: string) => void;
}

export function UploadProductImage({ productId, onImageUploaded }: UploadProductImageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        setLoading(true);
        setError(null);

        // Passando os 3 parâmetros necessários
        await adminApi.uploadProductImage(file, productId, onImageUploaded);

        setLoading(false);
      } catch (err) {
        setError('Falha ao fazer upload da imagem');
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
