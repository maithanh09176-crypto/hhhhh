import React, { useState, useRef } from 'react';
import { calculateEscapePosition, StoryConfig } from '../utils/storyStateMachine';

interface ProposalStageProps {
  config: StoryConfig;
  onAccept: () => void;
}

export const ProposalStage: React.FC<ProposalStageProps> = ({ config, onAccept }) => {
  const [fuelPercent, setFuelPercent] = useState(80);
  const [refusePosition, setRefusePosition] = useState<{ x: number; y: number } | null>(null);
  const [refuseAttempts, setRefuseAttempts] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dodge function when hovering or touching refuse button
  const handleDodgeRefuse = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPos = calculateEscapePosition(120, 48, rect.width, rect.height);
    setRefusePosition(newPos);
    setRefuseAttempts((prev) => prev + 1);
  };

  const handleFuelClick = () => {
    if (fuelPercent < 100) {
      setFuelPercent(100);
    }
    onAccept();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-400/30 shadow-[0_0_50px_rgba(0,247,255,0.25)] text-center my-4 min-h-[300px] transition-all duration-500 pointer-events-auto"
    >
      {/* Radiant Glow Behind Header */}
      <div className="absolute top-6 w-3/4 h-24 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Intro question header */}
      <p className="text-cyan-300 uppercase tracking-widest text-xs sm:text-sm font-semibold mb-3 opacity-90 font-mono">
        TINY CÓ ĐIỀU MUỐN HỎI NÈ...
      </p>

      {/* Main question */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed text-glow-cyan">
        Liệu {config.recipientName || 'em'} có thể...
        <br />
        <span className="text-pink-300 text-glow-pink">
          {config.questionText || 'cho Anh Thành cơ hội được chăm sóc, quan tâm em mỗi ngày dù ở xa không?'}
        </span>
      </h2>

      {/* Interactive Button Arena */}
      <div className="relative w-full h-24 sm:h-28 flex items-center justify-center gap-5 sm:gap-6">
        {/* Agree / Fuel Button */}
        <button
          type="button"
          onClick={handleFuelClick}
          onMouseEnter={() => setFuelPercent(100)}
          className="relative group overflow-hidden px-7 py-3 sm:px-9 sm:py-3.5 rounded-full font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:shadow-[0_0_35px_rgba(255,215,0,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 z-10 cursor-pointer"
          aria-label="Đồng ý lời chúc từ Anh Thành"
        >
          {/* Animated liquid sheen */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            aria-hidden="true"
          />

          {/* Liquid fuel indicator */}
          <span className="px-2 py-0.5 rounded-full bg-slate-950/15 text-slate-900 text-xs sm:text-sm font-mono tracking-wider font-extrabold">
            {fuelPercent}%
          </span>

          <span className="tracking-wide">Đồng ý luôn! 🥰</span>
        </button>

        {/* Playful Dodge / Refuse Button */}
        <button
          type="button"
          onMouseEnter={handleDodgeRefuse}
          onTouchStart={handleDodgeRefuse}
          onClick={handleDodgeRefuse}
          style={
            refusePosition
              ? {
                  position: 'absolute',
                  left: `${refusePosition.x}px`,
                  top: `${refusePosition.y}px`,
                  transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: 20,
                }
              : undefined
          }
          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-slate-400 border border-slate-700 hover:border-pink-500/50 bg-slate-900/70 backdrop-blur-sm text-xs sm:text-sm font-medium cursor-pointer transition-colors duration-200 whitespace-nowrap"
          aria-label="Hông bé ơi"
        >
          {refuseAttempts > 0 ? 'Hụt rùi nè 😝' : 'Hông bé ơi 😜'}
        </button>
      </div>

      {/* Playful hint text if tried dodging */}
      {refuseAttempts > 0 && (
        <p className="text-xs text-pink-300/90 animate-fade-in mt-1 font-medium">
          (Nút &ldquo;Hông&rdquo; chạy trốn mất rồi, cậu chỉ có thể chọn Đồng ý thuii! 🤭)
        </p>
      )}
    </div>
  );
};
