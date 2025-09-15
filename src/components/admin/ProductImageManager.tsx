import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, Image as ImageIcon, Upload, X } from 'lucide-react';
import { adminApi } from '../../services/api';
import { ImageEditor } from './ImageEditor';

interface ProductImageManagerProps {
  productId: number;
  onImagesChange?: (images: string[]) => void;
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  productId,
  onImagesChange
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, [productId]);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const imageUrls = await adminApi.getProductImages(productId);
      setImages(imageUrls);
      onImagesChange?.(imageUrls);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageEdit = (index: number) => {
    setEditingImageIndex(index);
    setIsImageEditorOpen(true);
  };

  const handleImageEditorSave = async (editedImage: File) => {
    if (editingImageIndex === null) return;

    try {
      // Upload da imagem editada
      await adminApi.uploadProductImages([editedImage], productId);
      
      // Recarregar imagens
      await loadImages();
      
      setIsImageEditorOpen(false);
      setEditingImageIndex(null);
    } catch (error) {
      console.error('Erro ao salvar imagem editada:', error);
    }
  };

  const handleImageDelete = async (index: number) => {
    try {
      await adminApi.deleteProductImage(productId, index);
      await loadImages();
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
    }
  };

  const handleAddImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      await adminApi.uploadProductImages(files, productId);
      await loadImages();
    } catch (error) {
      console.error('Erro ao adicionar imagens:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Imagens do Produto
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
        <ImageIcon className="h-5 w-5 mr-2" />
        Imagens do Produto ({images.length})
      </h3>

      {/* Upload de novas imagens */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adicionar Novas Imagens
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddImages}
            className="hidden"
            id="add-images"
          />
          <label
            htmlFor="add-images"
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer transition-colors"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Plus size={16} />
            )}
            <span>{isUploading ? 'Enviando...' : 'Adicionar Imagens'}</span>
          </label>
        </div>
      </div>

      {/* Grid de imagens */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay com ações */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={() => handleImageEdit(index)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-purple-50 transition-colors"
                    title="Editar imagem"
                  >
                    <Edit3 size={16} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => handleImageDelete(index)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    title="Remover imagem"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Badge de ordem */}
              <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Nenhuma imagem encontrada</p>
          <p className="text-sm">Adicione imagens para este produto</p>
        </div>
      )}

      {/* Dicas */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <ImageIcon size={16} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Dicas para gerenciar imagens:</p>
            <ul className="space-y-1 text-xs">
              <li>• Clique em "Editar" para cortar e ajustar imagens</li>
              <li>• Use "Remover" para deletar imagens indesejadas</li>
              <li>• Adicione múltiplas imagens para mostrar diferentes ângulos</li>
              <li>• A primeira imagem será a principal do produto</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Editor Modal */}
      <ImageEditor
        isOpen={isImageEditorOpen}
        onClose={() => {
          setIsImageEditorOpen(false);
          setEditingImageIndex(null);
        }}
        onSave={handleImageEditorSave}
        initialImage={editingImageIndex !== null ? images[editingImageIndex] : undefined}
        title="Editar Imagem do Produto"
      />
    </div>
  );
};
