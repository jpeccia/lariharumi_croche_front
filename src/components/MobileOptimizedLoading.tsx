import React from 'react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

interface MobileOptimizedLoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export const MobileOptimizedLoading: React.FC<MobileOptimizedLoadingProps> = ({
  size = 'medium',
  text = 'Carregando...',
  className = '',
}) => {
  const { deviceInfo, getAnimationConfig } = useMobileOptimization();
  const { enableAnimations, animationDuration } = getAnimationConfig();

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

  const getTextSize = () => {
    if (deviceInfo.isMobile) {
      return 'text-sm';
    }
    return 'text-base';
  };

  const spinnerStyle = enableAnimations
    ? {
        animationDuration: `${animationDuration}ms`,
      }
    : {};

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div
        className={`${getSizeClasses()} border-4 border-purple-200 border-t-purple-600 rounded-full ${
          enableAnimations ? 'animate-spin' : ''
        }`}
        style={spinnerStyle}
        role="status"
        aria-label="Carregando"
      >
        <span className="sr-only">{text}</span>
      </div>
      
      {text && (
        <p className={`text-purple-600 font-kawaii ${getTextSize()} text-center`}>
          {text}
        </p>
      )}
      
      {/* Indicador de progresso para dispositivos móveis */}
      {deviceInfo.isMobile && (
        <div className="w-32 h-1 bg-purple-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-purple-600 rounded-full ${
              enableAnimations ? 'animate-pulse' : ''
            }`}
            style={spinnerStyle}
          />
        </div>
      )}
    </div>
  );
};

// Componente de skeleton para cards de produto
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      {/* Container da imagem */}
      <div className="relative w-full aspect-[4/5] bg-gray-200">
        <div className="absolute top-3 left-3 bg-gray-300 h-5 w-12 rounded-full"></div>
        <div className="absolute top-3 right-3 bg-gray-300 h-6 w-6 rounded-full"></div>
      </div>
      
      {/* Conteúdo do card */}
      <div className="p-4">
        <div className="mb-3">
          <div className="h-5 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        </div>
        
        <div className="h-8 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};
