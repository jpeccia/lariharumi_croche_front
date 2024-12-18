import React from 'react';

export function CuteCinnamoroll() {
  return (
    <div className="relative w-20 h-20 group">
      {/* Main head/body */}
      <div className="absolute inset-0 bg-white rounded-full transform group-hover:scale-110 transition-transform shadow-md">
        {/* Signature long rolled ears */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-14 bg-white rounded-full transform -rotate-12 origin-bottom shadow-sm">
          <div className="absolute inset-0 border-2 border-blue-100 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-100 rounded-full"></div>
        </div>
        <div className="absolute -top-10 -right-2 w-6 h-12 bg-white rounded-full transform rotate-45 origin-bottom shadow-sm">
          <div className="absolute inset-0 border-2 border-blue-100 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-100 rounded-full"></div>
        </div>
        
        {/* Eyes */}
        <div className="absolute top-[40%] left-[30%] w-2.5 h-3.5 bg-black rounded-full"></div>
        <div className="absolute top-[40%] right-[30%] w-2.5 h-3.5 bg-black rounded-full"></div>
        
        {/* Rosy cheeks */}
        <div className="absolute top-[55%] left-[20%] w-3 h-2 bg-pink-200 rounded-full opacity-80"></div>
        <div className="absolute top-[55%] right-[20%] w-3 h-2 bg-pink-200 rounded-full opacity-80"></div>
        
        {/* Smile */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-4 h-3 border-b-2 border-black rounded-full"></div>
      </div>
    </div>
  );
}