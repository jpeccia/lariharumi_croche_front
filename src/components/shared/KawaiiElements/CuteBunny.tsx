import React from 'react';

export function CuteBunny() {
  return (
    <div className="relative w-16 h-16 group">
      {/* Bunny body */}
      <div className="absolute inset-0 bg-pink-100 rounded-full transform group-hover:scale-110 transition-transform">
        {/* Ears */}
        <div className="absolute -top-6 left-2 w-3 h-8 bg-pink-100 rounded-full transform -rotate-12"></div>
        <div className="absolute -top-6 right-2 w-3 h-8 bg-pink-100 rounded-full transform rotate-12"></div>
        {/* Face */}
        <div className="absolute top-1/3 left-1/4 w-1.5 h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-pink-300 rounded-full"></div>
      </div>
    </div>
  );
}