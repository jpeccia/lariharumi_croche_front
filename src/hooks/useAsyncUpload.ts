import { useState, useCallback, useRef, useEffect } from 'react';
import { adminApi } from '../services/api';
import { UploadResponse, UploadProgress, UploadConfig, UploadFileStatus } from '../types/api';
import { showToast } from '../utils/toast';

interface UseAsyncUploadOptions {
  productId: number;
  config?: UploadConfig;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (response: UploadResponse) => void;
  onError?: (error: Error) => void;
}

interface UseAsyncUploadReturn {
  uploadFiles: (files: File[]) => Promise<void>;
  uploadProgress: UploadProgress | null;
  isUploading: boolean;
  uploadError: string | null;
  retryUpload: () => Promise<void>;
  cancelUpload: () => void;
  clearError: () => void;
}

export function useAsyncUpload({
  productId,
  config = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 10,
    parallelUploads: 3,
    retryAttempts: 3,
    retryDelay: 1000
  },
  onProgress,
  onComplete,
  onError
}: UseAsyncUploadOptions): UseAsyncUploadReturn {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const uploadIdRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const filesRef = useRef<File[]>([]);

  // Limpar intervalos ao desmontar
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Função para verificar progresso do upload
  const checkUploadProgress = useCallback(async (uploadId: string) => {
    try {
      const progress = await adminApi.getUploadProgress(productId, uploadId);
      setUploadProgress(progress);
      
      if (onProgress) {
        onProgress(progress);
      }

      // Se o upload foi concluído ou falhou, parar de verificar
      if (progress.status === 'completed' || progress.status === 'failed') {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        
        setIsUploading(false);
        
        if (progress.status === 'completed') {
          showToast('success', 'Upload concluído com sucesso!');
          if (onComplete) {
            onComplete({
              uploadId: progress.uploadId,
              status: progress.status,
              files: progress.files,
              totalFiles: progress.files.length,
              completedFiles: progress.files.filter(f => f.status === 'completed').length,
              failedFiles: progress.files.filter(f => f.status === 'failed').length,
              progress: progress.progress
            });
          }
        } else {
          const errorMessage = 'Upload falhou. Tente novamente.';
          setUploadError(errorMessage);
          showToast('error', errorMessage);
          if (onError) {
            onError(new Error(errorMessage));
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar progresso:', error);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsUploading(false);
      const errorMessage = 'Erro ao verificar progresso do upload';
      setUploadError(errorMessage);
      if (onError) {
        onError(error as Error);
      }
    }
  }, [productId, onProgress, onComplete, onError]);

  // Função principal de upload
  const uploadFiles = useCallback(async (files: File[]) => {
    if (isUploading) {
      showToast('warning', 'Upload já está em andamento');
      return;
    }

    // Validação de arquivos
    if (files.length === 0) {
      const errorMessage = 'Nenhum arquivo selecionado';
      setUploadError(errorMessage);
      showToast('error', errorMessage);
      return;
    }

    if (files.length > config.maxFiles) {
      const errorMessage = `Máximo de ${config.maxFiles} arquivos permitidos`;
      setUploadError(errorMessage);
      showToast('error', errorMessage);
      return;
    }

    // Validar cada arquivo
    for (const file of files) {
      if (file.size > config.maxFileSize) {
        const errorMessage = `Arquivo ${file.name} excede o tamanho máximo de ${config.maxFileSize / 1024 / 1024}MB`;
        setUploadError(errorMessage);
        showToast('error', errorMessage);
        return;
      }
      
      if (!config.allowedTypes.includes(file.type)) {
        const errorMessage = `Tipo de arquivo ${file.type} não é permitido`;
        setUploadError(errorMessage);
        showToast('error', errorMessage);
        return;
      }
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      filesRef.current = files;

      // Iniciar upload assíncrono
      const response: UploadResponse = await adminApi.uploadProductImagesParallel(files, productId, config);
      
      uploadIdRef.current = response.uploadId;
      setUploadProgress({
        uploadId: response.uploadId,
        status: response.status,
        progress: response.progress,
        files: response.files,
        estimatedTimeRemaining: undefined,
        speed: undefined
      });

      // Iniciar verificação de progresso
      if (response.status === 'processing') {
        progressIntervalRef.current = setInterval(() => {
          if (uploadIdRef.current) {
            checkUploadProgress(uploadIdRef.current);
          }
        }, 1000); // Verificar a cada segundo
      }

      showToast('info', 'Upload iniciado! Acompanhe o progresso...');

    } catch (error) {
      setIsUploading(false);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao iniciar upload';
      setUploadError(errorMessage);
      showToast('error', errorMessage);
      
      if (onError) {
        onError(error as Error);
      }
    }
  }, [isUploading, config, productId, checkUploadProgress, onError]);

  // Função para retry
  const retryUpload = useCallback(async () => {
    if (retryCountRef.current >= config.retryAttempts) {
      const errorMessage = 'Número máximo de tentativas excedido';
      setUploadError(errorMessage);
      showToast('error', errorMessage);
      return;
    }

    retryCountRef.current++;
    
    // Aguardar delay antes de tentar novamente
    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
    
    if (filesRef.current.length > 0) {
      await uploadFiles(filesRef.current);
    }
  }, [config.retryAttempts, config.retryDelay, uploadFiles]);

  // Função para cancelar upload
  const cancelUpload = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    setIsUploading(false);
    setUploadProgress(null);
    uploadIdRef.current = null;
    
    showToast('info', 'Upload cancelado');
  }, []);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    uploadFiles,
    uploadProgress,
    isUploading,
    uploadError,
    retryUpload,
    cancelUpload,
    clearError
  };
}
