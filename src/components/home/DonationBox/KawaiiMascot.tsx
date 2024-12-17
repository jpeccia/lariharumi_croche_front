import React from 'react';

export function KawaiiMascot() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      {/* Cute yarn ball character */}
      <div className="absolute inset-0 bg-pink-200 rounded-full shadow-lg animate-bounce-slow">
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/4 w-2 h-3 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-3 bg-gray-800 rounded-full"></div>
        {/* Blushing cheeks */}
        <div className="absolute top-1/2 left-1/5 w-3 h-2 bg-pink-300 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 right-1/5 w-3 h-2 bg-pink-300 rounded-full opacity-60"></div>
        {/* Smile */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-6 h-3 border-b-2 border-gray-800 rounded-full"></div>
      </div>
      {/* Yarn string detail */}
      <div className="absolute -bottom-2 right-0 w-8 h-8 border-4 border-pink-300 rounded-full border-dashed animate-spin-slow"></div>
    </div>
  );
}