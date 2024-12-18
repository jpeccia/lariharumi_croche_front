import React from 'react';

export function StarWand() {
  return (
    <div className="relative w-16 h-16 group">
      {/* Star */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-300 transform rotate-45 group-hover:scale-110 transition-transform">
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute top-0 left-0 w-full h-full bg-yellow-300 transform -rotate-45"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-yellow-300 transform rotate-45"></div>
        </div>
      </div>
      {/* Wand handle */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-10 bg-pink-300 rounded-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-200 rounded-full"></div>
      </div>
    </div>
  );
}