import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className = '', children }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      {children}
    </div>
  );
}

interface SkeletonCardProps {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  className?: string;
}

export function SkeletonCard({ 
  showImage = true, 
  showTitle = true, 
  showDescription = true, 
  showActions = true,
  className = '' 
}: SkeletonCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {showImage && (
        <Skeleton className="w-full h-64" />
      )}
      <div className="p-6 space-y-4">
        {showTitle && (
          <Skeleton className="h-6 w-3/4" />
        )}
        {showDescription && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        {showActions && (
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        )}
      </div>
    </div>
  );
}

interface SkeletonListProps {
  items?: number;
  className?: string;
}

export function SkeletonList({ items = 3, className = '' }: SkeletonListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-20 h-8" />
        </div>
      ))}
    </div>
  );
}

interface SkeletonGridProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function SkeletonGrid({ columns = 3, rows = 2, className = '' }: SkeletonGridProps) {
  const totalItems = columns * rows;
  
  return (
    <div className={`grid gap-6 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

// Skeleton específico para produtos
export function SkeletonProductCard() {
  return (
    <SkeletonCard 
      showImage={true}
      showTitle={true}
      showDescription={true}
      showActions={true}
      className="hover:shadow-xl transition-shadow duration-300"
    />
  );
}

// Skeleton específico para categorias
export function SkeletonCategoryCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Skeleton className="w-full h-56" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

