import React from 'react';
import { Loader2 } from 'lucide-react';

interface MobileOptimizedLoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export function MobileOptimizedLoading({ 
  size = 'medium', 
  text = 'Carregando...',
  className = ''
}: MobileOptimizedLoadingProps) {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 
        className={`animate-spin text-purple-500 ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      {text && (
        <p className={`text-purple-600 font-kawaii ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Componente específico para skeleton loading
export function SkeletonLoader({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded h-4 mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// Componente para loading de cards
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded h-48 mb-4"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 rounded h-4 w-3/4"></div>
          <div className="bg-gray-200 rounded h-4 w-1/2"></div>
          <div className="bg-gray-200 rounded h-4 w-2/3"></div>
        </div>
      </div>
    </div>
  );
}
