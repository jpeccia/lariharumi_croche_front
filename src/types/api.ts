// Tipos para a nova estrutura de API do backend Go

// Estrutura de resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    cached: boolean;
    cacheExpiry?: string;
    requestTime: number;
  };
}

// Estrutura de resposta de upload assíncrono
export interface UploadResponse {
  uploadId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  files: UploadFileStatus[];
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  progress: number; // 0-100
  message?: string;
  errors?: UploadError[];
}

// Status individual de cada arquivo no upload
export interface UploadFileStatus {
  filename: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  url?: string;
  error?: string;
  size: number;
  uploadedAt?: string;
}

// Erro específico de upload
export interface UploadError {
  filename: string;
  code: string;
  message: string;
  retryable: boolean;
}

// Progresso de upload em tempo real
export interface UploadProgress {
  uploadId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  files: UploadFileStatus[];
  estimatedTimeRemaining?: number; // em segundos
  speed?: number; // bytes por segundo
}

// Resposta de busca paginada
export interface SearchResponse<T> extends PaginatedResponse<T> {
  query: string;
  filters?: Record<string, any>;
  searchTime: number;
}

// Resposta de cache
export interface CacheResponse<T> {
  data: T;
  cached: boolean;
  cacheKey: string;
  expiresAt: string;
  hitCount: number;
}

// Erro estruturado da API
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
  retryable: boolean;
}

// Configurações de paginação
export interface PaginationConfig {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Configurações de upload
export interface UploadConfig {
  maxFileSize: number; // em bytes
  allowedTypes: string[];
  maxFiles: number;
  parallelUploads: number;
  retryAttempts: number;
  retryDelay: number; // em ms
}
