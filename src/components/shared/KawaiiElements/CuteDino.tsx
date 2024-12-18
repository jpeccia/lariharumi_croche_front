import React from 'react';

export function CuteDino() {
  return (
    <div className="relative w-20 h-20 group">
      {/* Body */}
      <div className="absolute inset-0 bg-green-400 rounded-2xl transform group-hover:scale-110 transition-transform">
        {/* Spikes */}
        <div className="absolute -top-2 left-1/4 w-2 h-3 bg-green-500 rounded-full transform -rotate-12"></div>
        <div className="absolute -top-3 left-1/2 w-2 h-4 bg-green-500 rounded-full"></div>
        <div className="absolute -top-2 right-1/4 w-2 h-3 bg-green-500 rounded-full transform rotate-12"></div>
        {/* Face */}
        <div className="absolute top-1/3 left-1/4 w-2 h-3 bg-black rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-3 bg-black rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-green-300 rounded-full">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-2 bg-green-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}