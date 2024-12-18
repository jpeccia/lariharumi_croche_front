
export function PokeBall() {
  return (
    <div className="relative w-14 h-14 group">
      <div className="absolute inset-0 bg-white rounded-full transform group-hover:scale-110 transition-transform shadow-md">
        {/* Red top half */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500 rounded-t-full"></div>
        {/* Center button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-gray-800 rounded-full z-10"></div>
        {/* Center line */}
        <div className="absolute top-[45%] left-0 right-0 h-[10%] bg-gray-800"></div>
      </div>
    </div>
  );
}