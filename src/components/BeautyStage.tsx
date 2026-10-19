import React from 'react';

export const BeautyStage: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Woman silhouette backdrop matching original */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover sm:bg-contain bg-center opacity-40 transition-opacity duration-1000"
        style={{
          backgroundImage: 'url(/assets/woman_scene.webp)',
        }}
      />

      {/* Radiant pink and purple nebula aura */}
      <div className="absolute inset-0 bg-radial from-pink-500/20 via-purple-900/15 to-transparent" />

      {/* Floating flower sparkles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-pink-300 opacity-80 animate-pulse"
          style={{
            left: `${10 + ((i * 15) % 80)}%`,
            top: `${15 + ((i * 22) % 70)}%`,
            fontSize: `${16 + (i % 3) * 6}px`,
            filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.8))',
            animationDelay: `${(i * 0.3) % 3}s`,
          }}
        >
          {i % 2 === 0 ? '🌸' : '✨'}
        </span>
      ))}
    </div>
  );
};
