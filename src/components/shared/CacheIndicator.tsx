import React from 'react';
import { Clock, Zap, Database } from 'lucide-react';

interface CacheIndicatorProps {
  cached: boolean;
  requestTime?: number;
  cacheExpiry?: string;
  className?: string;
}

export function CacheIndicator({ 
  cached, 
  requestTime, 
  cacheExpiry,
  className = '' 
}: CacheIndicatorProps) {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getTimeUntilExpiry = (expiry: string) => {
    const now = new Date();
    const expiryDate = new Date(expiry);
    const diffMs = expiryDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expirado';
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (!cached) {
    return (
      <div className={`flex items-center space-x-1 text-gray-500 ${className}`}>
        <Database className="h-3 w-3" />
        <span className="text-xs">Live</span>
        {requestTime && (
          <span className="text-xs">({formatTime(requestTime)})</span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 text-green-600 ${className}`}>
      <Zap className="h-3 w-3" />
      <span className="text-xs">Cache</span>
      {requestTime && (
        <span className="text-xs">({formatTime(requestTime)})</span>
      )}
      {cacheExpiry && (
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="h-2 w-2" />
          <span>{getTimeUntilExpiry(cacheExpiry)}</span>
        </div>
      )}
    </div>
  );
}

interface CacheStatsProps {
  hitCount?: number;
  missCount?: number;
  hitRate?: number;
  className?: string;
}

export function CacheStats({ 
  hitCount = 0, 
  missCount = 0, 
  hitRate = 0,
  className = '' 
}: CacheStatsProps) {
  const totalRequests = hitCount + missCount;
  
  if (totalRequests === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">Cache Stats</h4>
        <span className="text-xs text-gray-500">
          {hitRate.toFixed(1)}% hit rate
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Hits: {hitCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Misses: {missCount}</span>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${hitRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
