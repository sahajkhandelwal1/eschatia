import { useMemo } from 'react';

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.8 + 0.4,
    duration: (Math.random() * 4 + 2).toFixed(2),
    delay: (Math.random() * 6).toFixed(2),
    minOpacity: (Math.random() * 0.15 + 0.05).toFixed(2),
    maxOpacity: (Math.random() * 0.5 + 0.5).toFixed(2),
  }));
}

export default function Starfield() {
  const stars = useMemo(() => generateStars(200), []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
            '--min-opacity': star.minOpacity,
            '--max-opacity': star.maxOpacity,
          }}
        />
      ))}
    </div>
  );
}
