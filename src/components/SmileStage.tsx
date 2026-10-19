import React from 'react';
import { LyricCue } from '../utils/storyStateMachine';

interface SmileStageProps {
  currentLyric: LyricCue | null;
}

export const SmileStage: React.FC<SmileStageProps> = ({ currentLyric }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none z-10 py-10 px-4">
      {/* Top Lyric Subtitle Bar */}
      <div className="h-14 flex items-center justify-center">
        {currentLyric && (
          <div className="px-5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-glow-cyan text-sm sm:text-lg font-medium transition-all duration-300 animate-pulse">
            🎵 &ldquo;{currentLyric.text}&rdquo;
          </div>
        )}
      </div>

      {/* Center: Waguri smiling loop in vinyl frame or soft floral frame */}
      <div className="relative flex items-center justify-center">
        {/* Glowing backdrop */}
        <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-pink-500/25 blur-3xl animate-pulse" />

        {/* Outer vinyl / flower rim */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-cyan-500/30 via-pink-400/40 to-yellow-300/30 border border-white/20 shadow-[0_0_35px_rgba(255,182,193,0.6)] flex items-center justify-center overflow-hidden">
          <video
            src="/assets/waguri-smile.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-full"
            aria-label="Hình ảnh nụ cười rạng rỡ"
          />
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-12" />
    </div>
  );
};
