export function CuteCinnamoroll() {
    return (
      <div className="relative w-16 h-16 group">
        {/* Body */}
        <div className="absolute inset-0 bg-white rounded-full transform group-hover:scale-110 transition-transform">
          {/* Long ears */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-10 bg-white rounded-full transform -rotate-12 origin-bottom"></div>
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-4 h-8 bg-white rounded-full transform rotate-12 origin-bottom"></div>
          {/* Eyes */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-800 rounded-full"></div>
          {/* Pink cheeks */}
          <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-pink-200 rounded-full opacity-70"></div>
          <div className="absolute top-1/2 right-1/5 w-2 h-2 bg-pink-200 rounded-full opacity-70"></div>
        </div>
      </div>
    );
  }