import React, { useMemo } from 'react';

interface StarrySkyProps {
  visible?: boolean;
}

export const StarrySky: React.FC<StarrySkyProps> = ({ visible = true }) => {
  // Generate pseudo-random stars using deterministic pseudo-random formula
  const stars = useMemo(() => {
    const list = [];
    // Pseudo-random linear congruential generator for reproducible natural distribution
    let seed = 42;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < 90; i++) {
      const left = rnd() * 100;
      const top = rnd() * 100;
      const size = 1 + rnd() * 2.2;
      const delay = rnd() * 4;
      const twinkleDuration = 2 + rnd() * 3;
      list.push({
        id: i,
        left: `${left.toFixed(2)}%`,
        top: `${top.toFixed(2)}%`,
        size: `${size.toFixed(1)}px`,
        delay: `${delay.toFixed(2)}s`,
        twinkleDuration: `${twinkleDuration.toFixed(2)}s`,
      });
    }
    return list;
  }, []);

  // Generate shooting stars
  const meteors = useMemo(() => {
    return [
      { id: 1, top: '15%', left: '85%', delay: '1s', period: '7.5s' },
      { id: 2, top: '28%', left: '92%', delay: '4.2s', period: '9.5s' },
      { id: 3, top: '8%', left: '72%', delay: '6.8s', period: '8.2s' },
      { id: 4, top: '42%', left: '80%', delay: '2.5s', period: '11s' },
    ];
  }, []);

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Subtle deep space nebula glow */}
      <div className="absolute inset-0 bg-radial from-slate-950/40 via-black to-black" />

      {/* Twinkling stars */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white shadow-[0_0_6px_1px_rgba(200,235,255,0.7)]"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animation: `tinyTwinkle ${star.twinkleDuration} ease-in-out ${star.delay} infinite alternate`,
          }}
        />
      ))}

      {/* Shooting meteors */}
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute h-[2px] w-28 pointer-events-none rounded-full"
          style={{
            top: meteor.top,
            left: meteor.left,
            background:
              'linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(180,230,255,0.85) 15%, rgba(120,190,255,0.3) 50%, transparent 100%)',
            boxShadow: '0 0 8px rgba(190,235,255,0.8)',
            transformOrigin: '0 50%',
            animation: `tinyMeteor ${meteor.period} linear ${meteor.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
};
