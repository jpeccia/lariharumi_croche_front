
export function GameController() {
  return (
    <div className="relative w-16 h-16 group">
      <div className="absolute inset-0 bg-purple-400 rounded-xl transform group-hover:scale-110 transition-transform shadow-md">
        {/* D-pad */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-600 rounded-sm"></div>
        {/* Buttons */}
        <div className="absolute top-1/4 right-1/4 flex gap-1">
          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
        </div>
        {/* Start/Select */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-3 h-1 bg-purple-600 rounded-full"></div>
          <div className="w-3 h-1 bg-purple-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}