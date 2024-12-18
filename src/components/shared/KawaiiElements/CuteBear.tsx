
export function CuteBear() {
  return (
    <div className="relative w-16 h-16 group">
      {/* Bear body */}
      <div className="absolute inset-0 bg-amber-100 rounded-full transform group-hover:scale-110 transition-transform">
        {/* Ears */}
        <div className="absolute -top-2 -left-1 w-5 h-5 bg-amber-100 rounded-full"></div>
        <div className="absolute -top-2 -right-1 w-5 h-5 bg-amber-100 rounded-full"></div>
        {/* Inner ears */}
        <div className="absolute -top-1 left-0 w-3 h-3 bg-amber-200 rounded-full"></div>
        <div className="absolute -top-1 right-0 w-3 h-3 bg-amber-200 rounded-full"></div>
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-800 rounded-full"></div>
        {/* Nose */}
        <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
}