import React, { useState } from 'react';
import { adminApi } from '../../services/api';
import { invalidateCategoryCache } from '../../hooks/useImageCache';

interface UploadCategoryImageProps {
  categoryID: number;
  onImageUploaded?: (imageUrl: string) => void;
  onImageChange?: (imageUrl: string) => void;
}

export function UploadCategoryImage({ categoryID, onImageUploaded, onImageChange }: UploadCategoryImageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        setLoading(true);
        setError(null);

        const imageUrl = await adminApi.uploadCategoryImage(file, categoryID);
        invalidateCategoryCache(categoryID);
        onImageUploaded?.(imageUrl);
        onImageChange?.(imageUrl);

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
