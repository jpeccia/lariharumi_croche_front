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
