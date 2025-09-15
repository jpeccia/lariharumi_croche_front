import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Edit3, Trash2, Eye } from 'lucide-react';
import { ImageEditor } from './ImageEditor';

interface EnhancedImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  className?: string;
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  onImagesChange,
  maxImages = 5,
  className = ''
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    const newImages = [...images, ...imageFiles];
    setImages(newImages);
    
    // Criar previews
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    onImagesChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  const editImage = (index: number) => {
    setEditingImageIndex(index);
    setIsImageEditorOpen(true);
  };

  const handleImageEditorSave = (editedImage: File) => {
    if (editingImageIndex === null) return;

    const newImages = [...images];
    newImages[editingImageIndex] = editedImage;
    setImages(newImages);

    // Atualizar preview
    const newPreviews = [...previews];
    newPreviews[editingImageIndex] = URL.createObjectURL(editedImage);
    setPreviews(newPreviews);

    onImagesChange(newImages);
    setIsImageEditorOpen(false);
    setEditingImageIndex(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Imagens do Produto
        </label>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} imagens
        </span>
      </div>

      {/* Upload Area */}
      <div
        onClick={openFileDialog}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Clique para adicionar imagens ou arraste e solte aqui
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG, JPEG até 10MB cada
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={previews[index]}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay com ações */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={() => editImage(index)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-purple-50 transition-colors"
                    title="Editar imagem"
                  >
                    <Edit3 size={16} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => removeImage(index)}
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
      )}

      {/* Dicas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <ImageIcon size={16} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Dicas para melhores fotos:</p>
            <ul className="space-y-1 text-xs">
              <li>• Use boa iluminação natural</li>
              <li>• Tire fotos de diferentes ângulos</li>
              <li>• Mostre detalhes e texturas</li>
              <li>• Use o editor para cortar e ajustar</li>
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
