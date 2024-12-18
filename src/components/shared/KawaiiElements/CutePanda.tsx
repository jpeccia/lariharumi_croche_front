
export function CutePanda() {
  return (
    <div className="relative w-16 h-16 group">
      {/* Panda body */}
      <div className="absolute inset-0 bg-white rounded-full transform group-hover:scale-110 transition-transform">
        {/* Ears */}
        <div className="absolute -top-3 -left-1 w-4 h-4 bg-gray-800 rounded-full"></div>
        <div className="absolute -top-3 -right-1 w-4 h-4 bg-gray-800 rounded-full"></div>
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-800 rounded-full"></div>
        {/* Nose */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
}