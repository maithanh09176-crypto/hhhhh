import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, Mail, Play, Pause, X } from 'lucide-react';
import {
  generateFibonacciSphere,
  rotatePoint3D,
  project3DTo2D,
  applyVelocityDamping,
  ANH_THANH_WISHES,
  WishItem,
  Point3D,
} from '../utils/sphereMath';
import { StoryConfig } from '../utils/storyStateMachine';

interface FloatingText3DProps {
  config: StoryConfig;
  onBackToLetter: () => void;
  onRestart: () => void;
}

export const FloatingText3D: React.FC<FloatingText3DProps> = ({
  config,
  onBackToLetter,
  onRestart,
}) => {
  const [highlightedWishId, setHighlightedWishId] = useState<string | null>(null);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);

  // Rotation angles & momentum
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0.12, y: 0.2 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0.001, y: 0.003 });
  const isDraggingRef = useRef(false);
  const lastTouchRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasRenderedRef = useRef(false);

  // Responsive radius tailored for phone and desktop
  const [radius, setRadius] = useState<number>(140);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 480) {
        setRadius(Math.min(130, Math.floor(w * 0.34)));
      } else if (w < 768) {
        setRadius(Math.min(175, Math.floor(w * 0.28)));
      } else {
        setRadius(Math.min(235, Math.floor(Math.min(w, h) * 0.28)));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Adapt wishes list to inject recipient/sender name
  const wishesList = useMemo(() => {
    return ANH_THANH_WISHES.map((w) => {
      let text = w.text;
      let fullMessage = w.fullMessage || w.text;
      if (config.recipientName && config.recipientName !== 'em') {
        text = text.replace(/em/g, config.recipientName);
        fullMessage = fullMessage.replace(/em/g, config.recipientName);
      }
      if (config.senderName && config.senderName !== 'Anh Thành') {
        text = text.replace(/Anh Thành/g, config.senderName);
        fullMessage = fullMessage.replace(/Anh Thành/g, config.senderName);
      }
      return { ...w, text, fullMessage };
    });
  }, [config]);

  // Initial 3D positions on the Fibonacci sphere
  const basePoints: Point3D[] = useMemo(() => {
    return generateFibonacciSphere(wishesList.length, radius);
  }, [wishesList.length, radius]);

  // Projected 2D points for each wish
  const [projectedItems, setProjectedItems] = useState<
    Array<{
      wish: WishItem;
      x: number;
      y: number;
      scale: number;
      opacity: number;
      zIndex: number;
      blur: number;
    }>
  >([]);

  // Smooth 60FPS animation loop with damping and touch inertia
  useEffect(() => {
    let animId: number;

    const tick = () => {
      let isMoving = isDraggingRef.current || isAutoSpinning;

      if (!isDraggingRef.current) {
        if (isAutoSpinning) {
          rotationRef.current.y += 0.0025;
          rotationRef.current.x += 0.0006;
        } else {
          velocityRef.current.x = applyVelocityDamping(velocityRef.current.x, 0.94);
          velocityRef.current.y = applyVelocityDamping(velocityRef.current.y, 0.94);
          if (velocityRef.current.x !== 0 || velocityRef.current.y !== 0) {
            isMoving = true;
          }
          rotationRef.current.x += velocityRef.current.x;
          rotationRef.current.y += velocityRef.current.y;
        }
      }

      if (!isMoving && hasRenderedRef.current) {
        animId = requestAnimationFrame(tick);
        return;
      }
      hasRenderedRef.current = true;

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      const projected = basePoints.map((point, index) => {
        const rotated = rotatePoint3D(point, rotX, rotY);
        const proj = project3DTo2D(rotated, radius, 480);
        const blur = Math.max(0, (1 - proj.opacity) * 1.4);

        return {
          wish: wishesList[index],
          x: proj.x,
          y: proj.y,
          scale: proj.scale,
          opacity: proj.opacity,
          zIndex: proj.zIndex,
          blur,
        };
      });

      setProjectedItems(projected);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [basePoints, wishesList, radius, isAutoSpinning]);

  // Pointer / Touch Handlers for 3D Dragging
  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    lastTouchRef.current = { x: clientX, y: clientY };
    velocityRef.current = { x: 0, y: 0 };
    setIsAutoSpinning(false);
  }, []);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - lastTouchRef.current.x;
    const dy = clientY - lastTouchRef.current.y;
    lastTouchRef.current = { x: clientX, y: clientY };

    const factor = 0.007;
    const vx = -dy * factor;
    const vy = dx * factor;

    rotationRef.current.x += vx;
    rotationRef.current.y += vy;
    velocityRef.current = { x: vx, y: vy };
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleWishClick = (e: React.MouseEvent | React.TouchEvent, wish: WishItem) => {
    e.stopPropagation();
    setHighlightedWishId(wish.id);
    confetti({
      particleCount: 40,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#00f7ff', '#ff69b4', '#ffd700', '#7affb0', '#ffffff'],
    });
  };

  const activeHighlightedWish = wishesList.find((w) => w.id === highlightedWishId);

  // Elegant glowing color classes matching original palette
  const getColorClasses = (scheme: WishItem['colorScheme'], isHighlighted: boolean) => {
    if (isHighlighted) {
      return 'border-cyan-300 text-white bg-cyan-950/95 shadow-[0_0_35px_rgba(0,247,255,1)] scale-110';
    }
    switch (scheme) {
      case 'pink':
        return 'border-pink-400/50 text-pink-200 bg-[#0d1424]/90 shadow-[0_0_15px_rgba(255,105,180,0.35)]';
      case 'rose':
        return 'border-rose-400/50 text-rose-200 bg-[#0d1424]/90 shadow-[0_0_15px_rgba(244,63,94,0.35)]';
      case 'emerald':
        return 'border-emerald-400/50 text-emerald-200 bg-[#0d1424]/90 shadow-[0_0_15px_rgba(52,238,123,0.35)]';
      case 'gold':
        return 'border-amber-400/50 text-amber-200 bg-[#0d1424]/90 shadow-[0_0_15px_rgba(251,191,36,0.35)]';
      case 'cyan':
      default:
        return 'border-cyan-400/50 text-cyan-200 bg-[#0d1424]/90 shadow-[0_0_15px_rgba(0,247,255,0.35)]';
    }
  };

  return (
    <section
      className="relative w-full h-full flex flex-col items-center justify-between py-2 px-2 select-none overflow-hidden touch-none pointer-events-auto"
      onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={handlePointerUp}
      aria-label="Dải ngân hà 3D lời chúc từ Anh Thành"
    >
      {/* Subtle radial nebula backdrop */}
      <div className="absolute inset-0 bg-radial from-cyan-950/30 via-pink-950/10 to-transparent pointer-events-none" />

      {/* Header matching original aesthetic */}
      <div className="relative z-20 text-center pt-1 px-4 pointer-events-none">
        <h2 className="text-base sm:text-2xl font-bold tracking-wide text-glow-cyan">
          những lời chúc {config.senderName || 'Anh Thành'} gửi đến {config.recipientName || 'em'}
        </h2>
        <p className="text-[11px] sm:text-xs text-cyan-300/80 mt-0.5 font-mono">
          (chạm & vuốt để xoay ngân hà 3D • chạm vào câu chúc để mở ✨)
        </p>
      </div>

      {/* 3D Floating Celestial Words Stage */}
      <div className="relative flex-1 w-full flex items-center justify-center my-2">
        {/* Soft center ambient starlight glow */}
        <div
          className="absolute rounded-full bg-cyan-400/10 blur-3xl pointer-events-none animate-pulse"
          style={{
            width: `${radius * 1.8}px`,
            height: `${radius * 1.8}px`,
          }}
        />

        {/* 3D Projected Floating Wish Items */}
        <div className="relative w-0 h-0 flex items-center justify-center pointer-events-none">
          {projectedItems.map(({ wish, x, y, scale, opacity, zIndex, blur }) => {
            const isFront = opacity > 0.58;
            const isHighlighted = highlightedWishId === wish.id;
            return (
              <div
                key={wish.id}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${isHighlighted ? scale * 1.15 : scale})`,
                  opacity: isHighlighted ? 1 : opacity,
                  zIndex: isHighlighted ? 1500 : zIndex,
                  filter: !isHighlighted && blur > 0 ? `blur(${blur}px)` : undefined,
                }}
                className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer will-change-transform ${
                  isFront ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
                data-wish-id={wish.id}
                role="button"
                tabIndex={isFront ? 0 : -1}
                aria-label={`Lời chúc: ${wish.text}`}
                onClick={(e) => handleWishClick(e, wish)}
              >
                <div
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border backdrop-blur-md text-[11px] sm:text-xs md:text-sm font-medium tracking-wide flex items-center gap-1.5 sm:gap-2 whitespace-nowrap active:scale-95 transition-all duration-200 ${getColorClasses(
                    wish.colorScheme,
                    isHighlighted
                  )}`}
                >
                  <span className="text-xs sm:text-sm">{wish.emoji}</span>
                  <span className="font-normal">{wish.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Spotlight Toast if a wish is tapped */}
      {activeHighlightedWish && (
        <div
          className="relative z-30 mx-auto px-4 py-3 rounded-2xl bg-[#0c1222]/95 border border-cyan-400/70 text-center shadow-[0_0_30px_rgba(0,247,255,0.6)] backdrop-blur-md animate-fade-in max-w-sm mb-2 pointer-events-auto cursor-pointer"
          onClick={() => setHighlightedWishId(null)}
        >
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-pink-300 font-semibold">
              <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
              <span>{config.senderName || 'Anh Thành'} gửi {config.recipientName || 'em'}:</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHighlightedWishId(null);
              }}
              className="p-0.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-cyan-100 font-medium leading-relaxed text-left pt-0.5">
            &ldquo;{activeHighlightedWish.fullMessage || activeHighlightedWish.text}&rdquo;
          </p>
        </div>
      )}

      {/* Sleek Minimalist Controls matching original style */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2.5 pb-2 px-3 w-full max-w-md pointer-events-auto">
        {/* Back to letter button */}
        <button
          type="button"
          onClick={onBackToLetter}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,105,180,0.5)] transition-all cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Xem lại thư tình</span>
        </button>

        {/* Toggle auto rotation */}
        <button
          type="button"
          onClick={() => setIsAutoSpinning((prev) => !prev)}
          className="px-3.5 py-2 rounded-full bg-black/60 border border-white/20 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer font-mono"
          aria-label={isAutoSpinning ? 'Dừng xoay 3D' : 'Tự động xoay 3D'}
        >
          {isAutoSpinning ? (
            <>
              <Pause className="w-3 h-3 text-cyan-400" />
              <span>Dừng xoay</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-cyan-400" />
              <span>Tự xoay</span>
            </>
          )}
        </button>

        {/* Restart from beginning */}
        <button
          type="button"
          onClick={onRestart}
          className="px-3.5 py-2 rounded-full bg-black/60 border border-white/20 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer font-mono"
        >
          <RotateCcw className="w-3 h-3 text-slate-300" />
          <span>Từ đầu</span>
        </button>
      </div>
    </section>
  );
};
