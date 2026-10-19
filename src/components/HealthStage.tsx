import React from 'react';

export const HealthStage: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Green nature radial meadow aura */}
      <div className="absolute inset-0 bg-radial from-emerald-600/20 via-emerald-950/20 to-transparent" />

      {/* Floating leaves */}
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-emerald-400 opacity-70 animate-[tinyFloat_4s_ease-in-out_infinite]"
          style={{
            left: `${8 + ((i * 17) % 84)}%`,
            top: `${12 + ((i * 21) % 76)}%`,
            fontSize: `${18 + (i % 4) * 6}px`,
            animationDelay: `${(i * 0.4) % 4}s`,
            filter: 'drop-shadow(0 0 8px rgba(78, 238, 134, 0.7))',
            transform: `rotate(${i * 35}deg)`,
          }}
        >
          🍃
        </span>
      ))}
    </div>
  );
};
