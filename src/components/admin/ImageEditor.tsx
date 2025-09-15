import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, RotateCw, RotateCcw, ZoomIn, ZoomOut, Crop, Move, Download, Upload } from 'lucide-react';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImage: File) => void;
  initialImage?: File | string;
  title?: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialImage,
  title = 'Editor de Imagem'
}) => {
  const { deviceInfo } = useMobileOptimization();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Carregar imagem inicial
  useEffect(() => {
    if (initialImage && isOpen) {
      loadImage(initialImage);
    }
  }, [initialImage, isOpen]);

  const loadImage = useCallback((imageSource: File | string) => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setScale(1);
      setRotation(0);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      
      // Definir área de crop inicial como a imagem inteira
      setCropArea({
        x: 0,
        y: 0,
        width: img.width,
        height: img.height
      });
    };
    
    if (imageSource instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(imageSource);
    } else {
      img.src = imageSource;
    }
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  }, [loadImage]);

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = image;
    
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplicar filtros
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    // Calcular dimensões da imagem
    const maxWidth = deviceInfo.isMobile ? 300 : 500;
    const maxHeight = deviceInfo.isMobile ? 300 : 500;
    
    let displayWidth = img.width * scale;
    let displayHeight = img.height * scale;
    
    if (displayWidth > maxWidth) {
      displayHeight = (maxWidth / displayWidth) * displayHeight;
      displayWidth = maxWidth;
    }
    
    if (displayHeight > maxHeight) {
      displayWidth = (maxHeight / displayHeight) * displayWidth;
      displayHeight = maxHeight;
    }

    // Centralizar imagem
    const x = (canvas.width - displayWidth) / 2;
    const y = (canvas.height - displayHeight) / 2;

    // Salvar contexto
    ctx.save();
    
    // Aplicar rotação
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Desenhar imagem
    ctx.drawImage(img, x, y, displayWidth, displayHeight);

    // Restaurar contexto
    ctx.restore();

    // Desenhar área de crop se estiver no modo crop
    if (isCropping && cropArea.width > 0 && cropArea.height > 0) {
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
      
      // Área escurecida fora do crop
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    }
  }, [image, scale, rotation, brightness, contrast, saturation, cropArea, isCropping, deviceInfo]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCropping) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  }, [isCropping]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCropping || !cropStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropArea({
      x: Math.min(cropStart.x, x),
      y: Math.min(cropStart.y, y),
      width: Math.abs(x - cropStart.x),
      height: Math.abs(y - cropStart.y)
    });
  }, [isCropping, cropStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const rotateImage = useCallback((direction: 'left' | 'right') => {
    setRotation(prev => direction === 'left' ? prev - 90 : prev + 90);
  }, []);

  const zoomImage = useCallback((direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.1 : prev * 0.9;
      return Math.max(0.1, Math.min(3, newScale));
    });
  }, []);

  const resetImage = useCallback(() => {
    setScale(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setIsCropping(false);
  }, []);

  const cropImage = useCallback(() => {
    if (!image || cropArea.width === 0 || cropArea.height === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Definir dimensões do canvas de crop
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    // Aplicar filtros
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    // Salvar contexto
    ctx.save();
    
    // Aplicar rotação
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Desenhar área cortada
    ctx.drawImage(
      image,
      cropArea.x / scale,
      cropArea.y / scale,
      cropArea.width / scale,
      cropArea.height / scale,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    // Restaurar contexto
    ctx.restore();

    // Converter para blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'edited-image.jpg', { type: 'image/jpeg' });
        onSave(file);
        onClose();
      }
    }, 'image/jpeg', 0.9);
  }, [image, cropArea, scale, rotation, brightness, contrast, saturation, onSave, onClose]);

  const saveImage = useCallback(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'edited-image.jpg', { type: 'image/jpeg' });
        onSave(file);
        onClose();
      }
    }, 'image/jpeg', 0.9);
  }, [image, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!image ? (
            <div className="text-center py-12">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Selecione uma imagem para editar</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Selecionar Imagem
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Canvas */}
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={deviceInfo.isMobile ? 300 : 500}
                  height={deviceInfo.isMobile ? 300 : 500}
                  className="border border-gray-300 rounded-lg cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                />
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transformações */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Transformações</h3>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => rotateImage('left')}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      onClick={() => rotateImage('right')}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <RotateCw size={20} />
                    </button>
                    <button
                      onClick={() => zoomImage('out')}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ZoomOut size={20} />
                    </button>
                    <button
                      onClick={() => zoomImage('in')}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ZoomIn size={20} />
                    </button>
                    <button
                      onClick={() => setIsCropping(!isCropping)}
                      className={`p-2 rounded-lg transition-colors ${
                        isCropping ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Crop size={20} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Zoom: {Math.round(scale * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Ajustes */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Ajustes</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Brilho: {brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Contraste: {contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Saturação: {saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={resetImage}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Resetar
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={isCropping ? cropImage : saveImage}
                    className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    {isCropping ? 'Cortar e Salvar' : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
