import React, { useEffect, useState } from 'react';
import { StoryPhase } from '../utils/storyStateMachine';

interface TinyRobotProps {
  phase: StoryPhase;
  showNudge: boolean;
  compact?: boolean;
  onAdvance?: () => void;
}

export const TinyRobot: React.FC<TinyRobotProps> = ({
  phase,
  showNudge,
  compact = false,
  onAdvance,
}) => {
  const isAsleep = phase === 'sleep';
  const isBlushing = phase === 'blush' || phase === 'accepted';
  const isLookingAround = phase === 'order';
  const isSmiling =
    phase === 'smile' ||
    phase === 'clover_intro' ||
    phase === 'clover_gift' ||
    phase === 'wishes_3d' ||
    phase === 'accepted';

  // Eye blinking state loop when awake
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isAsleep) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 3800 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, [isAsleep]);

  return (
    <div
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={onAdvance}
      role="button"
      tabIndex={0}
      aria-label="Chú robot Tiny, bấm để tiếp tục câu chuyện"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onAdvance?.();
        }
      }}
    >
      {/* Robot Face Container */}
      <div
        className={`relative flex items-center justify-center transition-all duration-700 ${
          compact
            ? 'scale-75 sm:scale-85 gap-10 sm:gap-16'
            : isBlushing
            ? 'scale-105 sm:scale-110 gap-14 sm:gap-24 md:gap-32'
            : 'scale-100 gap-14 sm:gap-24 md:gap-32'
        }`}
      >
        {/* Left Eye */}
        <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-[28px] sm:rounded-[36px] transition-transform duration-300 origin-center ${
              isLookingAround ? 'animate-[daoMatLienTuc_4s_ease-in-out_infinite]' : ''
            }`}
            style={{
              backgroundColor: isBlushing ? '#ff6ebb' : '#00f7ff',
              boxShadow: isBlushing
                ? '0 0 35px 10px rgba(255, 110, 187, 0.65), 0 0 65px 20px rgba(255, 110, 187, 0.4), inset 0 0 25px rgba(255, 255, 255, 0.9)'
                : '0 0 35px 10px rgba(0, 247, 255, 0.65), 0 0 65px 20px rgba(0, 247, 255, 0.4), inset 0 0 25px rgba(255, 255, 255, 0.9)',
              transform: isAsleep || isBlinking ? 'scaleY(0.04)' : isSmiling ? 'scaleY(0.35) translateY(-8px)' : 'scaleY(1)',
              borderRadius: isSmiling ? '9999px' : undefined,
            }}
          >
            {/* Curved smile inside eye when happy */}
            {isSmiling && !isAsleep && (
              <svg
                viewBox="0 0 160 70"
                className="absolute inset-0 w-full h-full p-2 opacity-90"
                aria-hidden="true"
              >
                <path
                  d="M 18 39 Q 80 59 142 39"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>

          {/* Left Blush Cheeks */}
          <div
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 font-bold tracking-widest text-pink-400 text-lg sm:text-2xl transition-opacity duration-700 pointer-events-none drop-shadow-[0_0_8px_rgba(255,105,180,0.8)] ${
              isBlushing ? 'opacity-100' : 'opacity-0'
            }`}
          >
            ////
          </div>
        </div>

        {/* Center Cute Mouth (:3) */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[78%] sm:top-[82%] transition-opacity duration-700 pointer-events-none z-10 ${
            isBlushing || isSmiling ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isBlushing ? (
            <svg
              viewBox="0 0 60 44"
              className="w-14 h-11 sm:w-16 sm:h-12 animate-chu-chu"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255, 110, 187, 0.9))' }}
            >
              <g transform="rotate(270 30 22)">
                <path
                  d="M 7 10 C 7 26 25 28 30 14 C 35 28 53 26 53 10"
                  fill="none"
                  stroke="#ff7ec4"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          ) : (
            <svg
              viewBox="0 0 112 68"
              className="w-14 h-9 sm:w-16 sm:h-10"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 247, 255, 0.8))' }}
            >
              <path
                d="M 16 18 Q 56 56 96 18"
                fill="none"
                stroke="#00f7ff"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* Right Eye */}
        <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-[28px] sm:rounded-[36px] transition-transform duration-300 origin-center ${
              isLookingAround ? 'animate-[daoMatLienTuc_4s_ease-in-out_infinite]' : ''
            }`}
            style={{
              backgroundColor: isBlushing ? '#ff6ebb' : '#00f7ff',
              boxShadow: isBlushing
                ? '0 0 35px 10px rgba(255, 110, 187, 0.65), 0 0 65px 20px rgba(255, 110, 187, 0.4), inset 0 0 25px rgba(255, 255, 255, 0.9)'
                : '0 0 35px 10px rgba(0, 247, 255, 0.65), 0 0 65px 20px rgba(0, 247, 255, 0.4), inset 0 0 25px rgba(255, 255, 255, 0.9)',
              transform: isAsleep || isBlinking ? 'scaleY(0.04)' : isSmiling ? 'scaleY(0.35) translateY(-8px)' : 'scaleY(1)',
              borderRadius: isSmiling ? '9999px' : undefined,
            }}
          >
            {/* Curved smile inside eye when happy */}
            {isSmiling && !isAsleep && (
              <svg
                viewBox="0 0 160 70"
                className="absolute inset-0 w-full h-full p-2 opacity-90"
                aria-hidden="true"
              >
                <path
                  d="M 18 39 Q 80 59 142 39"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>

          {/* Right Blush Cheeks */}
          <div
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 font-bold tracking-widest text-pink-400 text-lg sm:text-2xl transition-opacity duration-700 pointer-events-none drop-shadow-[0_0_8px_rgba(255,105,180,0.8)] ${
              isBlushing ? 'opacity-100' : 'opacity-0'
            }`}
          >
            ////
          </div>
        </div>
      </div>

      {/* Intro Nudge Prompt ("chạm để tiếp tục~") positioned in normal flow without overlapping */}
      {showNudge && (
        <div
          className="mt-8 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 text-xs sm:text-sm animate-bounce shadow-[0_0_15px_rgba(0,247,255,0.4)] pointer-events-none"
          role="status"
        >
          <span>chạm để tiếp tục~</span>
          <svg
            className="w-3.5 h-3.5 text-cyan-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
};
