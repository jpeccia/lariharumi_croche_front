import React, { useState } from 'react';
import { adminApi } from '../../services/api';

interface UploadCategoryImageProps {
  categoryId: number;
  onImageUploaded: (imageUrl: string) => void;
}

export function UploadCategoryImage({ categoryId, onImageUploaded }: UploadCategoryImageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        setLoading(true);
        setError(null);

        // Passando os 3 parâmetros necessários para o upload da imagem da categoria
        await adminApi.uploadCategoryImage(file, categoryId, onImageUploaded);

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
