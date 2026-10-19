import React from 'react';

interface CloverStageProps {
  interactive: boolean;
  onCollect: () => void;
}

export const CloverStage: React.FC<CloverStageProps> = ({
  interactive,
  onCollect,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
      {/* Ambient green nature glow */}
      <div className="absolute inset-0 bg-radial from-emerald-900/35 via-emerald-950/15 to-transparent pointer-events-none transition-opacity duration-1000" />

      {/* Floating Sparkles Field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-emerald-300 opacity-70 animate-pulse"
            style={{
              left: `${15 + ((i * 19) % 70)}%`,
              top: `${20 + ((i * 23) % 60)}%`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              boxShadow: '0 0 10px rgba(52,238,123,0.9)',
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing 4-leaf Clover Plant */}
      <div
        className={`relative flex flex-col items-center transition-all duration-700 ${
          interactive
            ? 'pointer-events-auto cursor-pointer scale-105 hover:scale-115 active:scale-95'
            : 'pointer-events-none'
        }`}
        onClick={interactive ? onCollect : undefined}
        role="button"
        tabIndex={interactive ? 0 : -1}
        aria-label="Ngọn cỏ 4 lá may mắn, bấm để nhận quà"
        onKeyDown={(e) => {
          if (interactive && (e.key === 'Enter' || e.key === ' ')) {
            onCollect();
          }
        }}
      >
        {/* Glow backdrop behind clover */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-emerald-500/25 blur-3xl animate-clover-breath" />

        {/* Clover SVG */}
        <div className="relative w-36 h-56 sm:w-52 sm:h-76 -translate-y-4 sm:-translate-y-6 drop-shadow-[0_0_20px_rgba(52,238,123,0.8)] animate-pulse-glow">
          <svg
            viewBox="0 0 240 400"
            className="w-full h-full overflow-visible"
            role="img"
            aria-label="Ngọn cỏ 4 lá may mắn"
          >
            <defs>
              <radialGradient id="cloverLeafGradient" cx="50%" cy="85%" r="95%">
                <stop offset="0%" stopColor="#1fcf5a" />
                <stop offset="55%" stopColor="#4fee86" />
                <stop offset="100%" stopColor="#a8ffc6" />
              </radialGradient>
              <g id="singleCloverLeaf">
                <path
                  d="M0 0 C -6 -8 -22 -14 -22 -28 C -22 -38 -8 -42 0 -32 C 8 -42 22 -38 22 -28 C 22 -14 6 -8 0 0 Z"
                  fill="url(#cloverLeafGradient)"
                  stroke="#c9ffdc"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 -3 L0 -30"
                  stroke="rgba(0, 90, 40, 0.45)"
                  strokeWidth="1.2"
                />
              </g>
            </defs>

            {/* Stem with gentle sway */}
            <g className="animate-clover-sway">
              {/* Curved Stem */}
              <path
                d="M121 90 C 158 168, 80 228, 116 298 C 142 348, 106 378, 126 396"
                fill="none"
                stroke="#33d96f"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M121 90 C 158 168, 80 228, 116 298 C 142 348, 106 378, 126 396"
                fill="none"
                stroke="#b7ffd0"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.75"
              />

              {/* 4 Clover Leaves (Rotated 45°, 135°, 225°, 315°) */}
              <g transform="translate(121 84) scale(1.85)">
                {/* Leaf 1 */}
                <g transform="rotate(0)">
                  <g className="animate-clover-leaf" style={{ animationDelay: '0s' }}>
                    <use href="#singleCloverLeaf" />
                  </g>
                </g>
                {/* Leaf 2 */}
                <g transform="rotate(90)">
                  <g className="animate-clover-leaf" style={{ animationDelay: '0.4s' }}>
                    <use href="#singleCloverLeaf" />
                  </g>
                </g>
                {/* Leaf 3 */}
                <g transform="rotate(180)">
                  <g className="animate-clover-leaf" style={{ animationDelay: '0.8s' }}>
                    <use href="#singleCloverLeaf" />
                  </g>
                </g>
                {/* Leaf 4 */}
                <g transform="rotate(270)">
                  <g className="animate-clover-leaf" style={{ animationDelay: '1.2s' }}>
                    <use href="#singleCloverLeaf" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Tap guide badge when waiting for user to receive it */}
        {interactive && (
          <div className="mt-2 px-4 py-1.5 rounded-full bg-emerald-950/85 border border-emerald-400/60 text-emerald-200 text-sm sm:text-base font-semibold shadow-[0_0_20px_rgba(52,238,123,0.6)] animate-bounce flex items-center gap-2">
            <span>✨ Chạm vào ngọn cỏ để nhận nha ✨</span>
          </div>
        )}
      </div>
    </div>
  );
};
