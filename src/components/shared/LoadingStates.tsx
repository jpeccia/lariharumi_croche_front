import React from 'react';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'purple' | 'pink' | 'blue';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'purple',
  text,
  className = '',
}) => {
  const { deviceInfo, getAnimationConfig } = useMobileOptimization();
  const { enableAnimations } = getAnimationConfig();

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-6 w-6';
      case 'large':
        return 'h-16 w-16';
      default:
        return 'h-12 w-12';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'pink':
        return 'border-pink-200 border-t-pink-600';
      case 'blue':
        return 'border-blue-200 border-t-blue-600';
      default:
        return 'border-purple-200 border-t-purple-600';
    }
  };

  const getTextSize = () => {
    if (deviceInfo.isMobile) {
      return 'text-sm';
    }
    return 'text-base';
  };

  const spinnerStyle = enableAnimations
    ? {
        animationDuration: '1s',
      }
    : {};

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div
        className={`${getSizeClasses()} border-4 ${getColorClasses()} rounded-full ${
          enableAnimations ? 'animate-spin' : ''
        }`}
        style={spinnerStyle}
        role="status"
        aria-label="Carregando"
      >
        <span className="sr-only">{text || 'Carregando...'}</span>
      </div>
      
      {text && (
        <p className={`text-gray-600 font-medium ${getTextSize()} text-center animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  className = '',
}) => {
  const { deviceInfo } = useMobileOptimization();
  
  const getLineWidth = (index: number) => {
    if (deviceInfo.isMobile) {
      return index === 0 ? 'w-3/4' : index === 1 ? 'w-1/2' : 'w-2/3';
    }
    return index === 0 ? 'w-4/5' : index === 1 ? 'w-3/5' : 'w-2/3';
  };

  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-200 rounded ${getLineWidth(index)}`}
          />
        ))}
      </div>
    </div>
  );
};

interface CardSkeletonProps {
  showImage?: boolean;
  showActions?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = true,
  showActions = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {showImage && (
        <div className="w-full h-80 bg-gray-200" />
      )}
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        {showActions && (
          <div className="h-10 bg-gray-200 rounded w-full mt-4" />
        )}
      </div>
    </div>
  );
};

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Carregando página...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <LoadingSpinner size="large" text={message} />
        <div className="mt-8">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
