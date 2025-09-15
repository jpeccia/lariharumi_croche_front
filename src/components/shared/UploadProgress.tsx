import React from 'react';
import { UploadProgress, UploadFileStatus } from '../../types/api';
import { ProgressBar } from './InteractiveElements';

interface UploadProgressProps {
  progress: UploadProgress;
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function UploadProgressComponent({ 
  progress, 
  onCancel, 
  onRetry,
  className = '' 
}: UploadProgressProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'processing': return '⏳';
      case 'pending': return '⏸️';
      default: return '📁';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return '';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Upload em Progresso
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            progress.status === 'completed' ? 'bg-green-100 text-green-800' :
            progress.status === 'failed' ? 'bg-red-100 text-red-800' :
            progress.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {progress.status === 'completed' ? 'Concluído' :
             progress.status === 'failed' ? 'Falhou' :
             progress.status === 'processing' ? 'Processando' :
             'Pendente'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {progress.status === 'processing' && onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Cancelar
            </button>
          )}
          
          {progress.status === 'failed' && onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Tentar Novamente
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Progresso Geral: {progress.progress}%
          </span>
          <span className="text-sm text-gray-500">
            {progress.files.filter(f => f.status === 'completed').length} / {progress.files.length} arquivos
          </span>
        </div>
        <ProgressBar 
          progress={progress.progress} 
          className="h-2"
          color={progress.status === 'failed' ? 'red' : 'blue'}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">
            {progress.files.filter(f => f.status === 'completed').length}
          </div>
          <div className="text-sm text-green-700">Concluídos</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">
            {progress.files.filter(f => f.status === 'processing' || f.status === 'uploading').length}
          </div>
          <div className="text-sm text-blue-700">Processando</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-red-600">
            {progress.files.filter(f => f.status === 'failed').length}
          </div>
          <div className="text-sm text-red-700">Falharam</div>
        </div>
      </div>

      {/* Time Estimates */}
      {(progress.estimatedTimeRemaining || progress.speed) && (
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          {progress.estimatedTimeRemaining && (
            <span>
              ⏱️ Tempo restante: {formatTime(progress.estimatedTimeRemaining)}
            </span>
          )}
          {progress.speed && (
            <span>
              🚀 Velocidade: {formatFileSize(progress.speed)}/s
            </span>
          )}
        </div>
      )}

      {/* File List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Arquivos:</h4>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {progress.files.map((file, index) => (
            <FileProgressItem key={index} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FileProgressItemProps {
  file: UploadFileStatus;
}

function FileProgressItem({ file }: FileProgressItemProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <span className="text-sm">
          {file.status === 'completed' ? '✅' :
           file.status === 'failed' ? '❌' :
           file.status === 'processing' ? '⏳' :
           file.status === 'uploading' ? '📤' :
           '⏸️'}
        </span>
        <span className="text-sm text-gray-700 truncate">
          {file.filename}
        </span>
        <span className="text-xs text-gray-500">
          ({formatFileSize(file.size)})
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          file.status === 'completed' ? 'bg-green-100 text-green-700' :
          file.status === 'failed' ? 'bg-red-100 text-red-700' :
          file.status === 'processing' ? 'bg-blue-100 text-blue-700' :
          file.status === 'uploading' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {file.progress}%
        </span>
        
        {file.status === 'failed' && file.error && (
          <span className="text-xs text-red-600" title={file.error}>
            ⚠️
          </span>
        )}
      </div>
    </div>
  );
}
