import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Send } from 'lucide-react';
import { StoryConfig } from '../utils/storyStateMachine';

interface CelebrationCardProps {
  config: StoryConfig;
  onRestart: () => void;
  onView3D: () => void;
}

export const CelebrationCard: React.FC<CelebrationCardProps> = ({
  config,
  onRestart,
  onView3D,
}) => {
  const [copied, setCopied] = useState(false);

  const confirmationMessage = `Em nhận được lời chúc 20/10 ngọt ngào của ${config.senderName || 'Anh Thành'} rồi nè! Cảm ơn anh rất nhiều, dù ở xa nhưng em vui và ấm lòng lắm! 🥰💖✨`;

  const handleCopyReply = async () => {
    try {
      await navigator.clipboard.writeText(confirmationMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleBurstFlowers = () => {
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ffb6c1', '#ffd700', '#00f7ff', '#7affb0', '#ffffff'],
      shapes: ['circle', 'square'],
    });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto my-2 sm:my-4 p-5 sm:p-8 rounded-3xl glass-panel border border-pink-400/40 shadow-[0_0_60px_rgba(255,105,180,0.35)] text-center animate-fade-in z-30 pointer-events-auto">
      {/* Wax seal & heart decorative icon */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 -mt-11 sm:-mt-14 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 border-4 border-[#0c1222] flex items-center justify-center text-2xl sm:text-3xl shadow-[0_0_25px_rgba(255,105,180,0.8)] animate-bounce">
        💌
      </div>

      {/* Title */}
      <h3 className="mt-3 text-xl sm:text-2xl font-bold text-pink-300 text-glow-pink">
        Gửi Trọn Yêu Thương Từ Phương Xa! 💌💖
      </h3>

      <p className="mt-1 text-cyan-200 text-xs sm:text-sm tracking-wider font-medium">
        Dù khoảng cách có xa xôi, trái tim {config.senderName || 'Anh Thành'} luôn ở thật gần {config.recipientName || 'em'}!
      </p>

      {/* Love Letter Parchment */}
      <div className="my-4 p-4 sm:p-6 rounded-2xl bg-black/60 border border-white/10 text-left relative overflow-hidden backdrop-blur-md shadow-inner">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />

        <p className="italic text-pink-200/90 text-sm sm:text-base mb-3 font-semibold">
          Gửi {config.recipientName || 'em'},
        </p>

        <p className="text-slate-100 text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line font-normal">
          {config.secretMessage}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs sm:text-sm text-cyan-300 font-medium">
          <span>Ngày 20 tháng 10 💐</span>
          <span className="font-semibold">— {config.senderName || 'Anh Thành'} ✨</span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {/* Copy reply button to send back to sender */}
          <button
            type="button"
            onClick={handleCopyReply}
            className="w-full sm:w-auto flex-1 px-4 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 shadow-[0_0_20px_rgba(255,105,180,0.6)] hover:shadow-[0_0_30px_rgba(255,105,180,0.9)] hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>{copied ? 'Đã copy lời nhắn!' : `Gửi lời nhắn cho ${config.senderName || 'Anh Thành'}`}</span>
          </button>

          {/* Burst more flowers */}
          <button
            type="button"
            onClick={handleBurstFlowers}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-full font-medium text-xs sm:text-sm text-white border border-pink-400/50 hover:bg-pink-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🌸 Gửi ngàn đóa hoa</span>
          </button>
        </div>

        {/* 3D Floating Wishes Button */}
        <button
          type="button"
          onClick={onView3D}
          className="w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm text-cyan-100 bg-gradient-to-r from-cyan-900/60 via-purple-900/60 to-pink-900/60 border border-cyan-400/60 shadow-[0_0_25px_rgba(0,247,255,0.45)] hover:shadow-[0_0_35px_rgba(0,247,255,0.7)] hover:border-cyan-300 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
          <span className="text-glow-cyan tracking-wide">✨ Khám phá Ngân hà 3D Lời chúc ✨</span>
        </button>
      </div>

      {/* Copy feedback toast note */}
      {copied && (
        <p className="mt-2.5 text-xs text-emerald-300 animate-fade-in font-medium">
          Đã copy lời nhắn — dán vào Zalo/Messenger gửi cho {config.senderName || 'Anh Thành'} nha!
        </p>
      )}

      {/* Footer Utility Actions: Only clean restart button */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center text-xs text-slate-400">
        <button
          type="button"
          onClick={onRestart}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xem lại</span>
        </button>
      </div>
    </div>
  );
};
