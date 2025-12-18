import { memo, useMemo } from 'react';

/**
 * Generates stable random positions for floating heart animations.
 * Uses useMemo to prevent recalculating positions on every render.
 */
function FloatingHeartsComponent() {
  const hearts = useMemo(() => 
    [...Array(6)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
    })), 
  []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-heart"
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            opacity: 0.3
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

export const FloatingHearts = memo(FloatingHeartsComponent);
