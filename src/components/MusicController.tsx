import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicControllerProps {
  onTimeUpdate?: (currentTime: number) => void;
  shouldPlay?: boolean;
}

export const MusicController: React.FC<MusicControllerProps> = ({
  onTimeUpdate,
  shouldPlay = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldPlay && !isPlaying) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy prevented immediate playback; will unlock on first user interaction
        });
    }
  }, [shouldPlay, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-2">
      <audio
        ref={audioRef}
        src="/audio/soundtrack.mp3"
        preload="auto"
        loop
        onTimeUpdate={(e) => {
          onTimeUpdate?.((e.target as HTMLAudioElement).currentTime);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Mini Music Capsule (div container with separate buttons) */}
      <div
        className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono transition-all duration-300 backdrop-blur-md border ${
          isPlaying
            ? 'bg-cyan-950/70 border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(0,247,255,0.4)]'
            : 'bg-black/60 border-white/20 text-slate-300 hover:text-white'
        }`}
      >
        <button
          type="button"
          onClick={togglePlay}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
        >
          <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Nhạc 20/10</span>
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className="ml-1 p-0.5 hover:text-cyan-300 transition-colors cursor-pointer"
          aria-label={isMuted ? 'Bật âm lượng' : 'Tắt âm lượng'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
