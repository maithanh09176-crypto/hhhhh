/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import {
  StoryPhase,
  StoryConfig,
  getStoryText,
  getNextPhase,
  findActiveLyricCue,
  parseCustomConfig,
  DEFAULT_CONFIG,
} from './utils/storyStateMachine';
import { StarrySky } from './components/StarrySky';
import { TinyRobot } from './components/TinyRobot';
import { HealthStage } from './components/HealthStage';
import { BeautyStage } from './components/BeautyStage';
import { SmileStage } from './components/SmileStage';
import { CloverStage } from './components/CloverStage';
import { FloatingText3D } from './components/FloatingText3D';
import { ProposalStage } from './components/ProposalStage';
import { CelebrationCard } from './components/CelebrationCard';
import { MusicController } from './components/MusicController';

export default function App() {
  const [phase, setPhase] = useState<StoryPhase>('sleep');
  const [config, setConfig] = useState<StoryConfig>(DEFAULT_CONFIG);
  const [audioTime, setAudioTime] = useState<number>(0);
  const [showNudge, setShowNudge] = useState<boolean>(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState<boolean>(false);
  const [pinkOverlay, setPinkOverlay] = useState<boolean>(false);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from URL search params (if custom params are passed)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialConfig = parseCustomConfig(window.location.search);
    setConfig(initialConfig);

    const skipTo = params.get('skipTo');
    const autostart = params.get('autostart');

    if (skipTo === 'question') {
      setPhase('question');
      setShouldPlayMusic(true);
    } else if (skipTo === '3d' || skipTo === 'wishes') {
      setPhase('wishes_3d');
      setShouldPlayMusic(true);
    } else if (skipTo === 'clover') {
      setPhase('clover_gift');
      setShouldPlayMusic(true);
    } else if (skipTo === 'accepted') {
      setPhase('accepted');
      setShouldPlayMusic(true);
    } else if (autostart === '1') {
      setPhase('wake');
      setShouldPlayMusic(true);
    }
  }, []);

  // Idle nudge scheduler for early steps
  const scheduleNudge = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setShowNudge(false);

    if (['sleep', 'wake', 'order'].includes(phase)) {
      idleTimerRef.current = setTimeout(() => {
        setShowNudge(true);
      }, 3000);
    }
  }, [phase]);

  useEffect(() => {
    scheduleNudge();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [scheduleNudge]);

  // Handle stage advances on tap
  const advance = useCallback(() => {
    if (
      phase === 'accepted' ||
      phase === 'question' ||
      phase === 'clover_gift' ||
      phase === 'wishes_3d'
    ) {
      return; // Handled specifically by interactive controls
    }

    setShouldPlayMusic(true);
    setShowNudge(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    setPhase((prev) => {
      const next = getNextPhase(prev);
      if (next === 'blush') {
        setPinkOverlay(true);
      }
      return next;
    });
  }, [phase]);

  // Auto-advance narrative timers for the wish sequences
  useEffect(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    const autoTransitions: Record<string, { next: StoryPhase; delay: number }> = {
      blush: { next: 'oct20', delay: 2800 },
      oct20: { next: 'want', delay: 2400 },
      want: { next: 'health', delay: 2400 },
      health: { next: 'beauty', delay: 3200 },
      beauty: { next: 'smile', delay: 3800 },
      smile: { next: 'clover_intro', delay: 4200 },
      clover_intro: { next: 'clover_gift', delay: 2500 },
    };

    if (autoTransitions[phase]) {
      const { next, delay } = autoTransitions[phase];
      autoAdvanceTimerRef.current = setTimeout(() => {
        setPhase(next);
      }, delay);
    }

    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [phase]);

  // Handle Clover collected by user tap -> proceeds directly to question stage!
  const handleCollectClover = () => {
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#34ee7b', '#a8ffc6', '#00f7ff', '#ffffff'],
    });
    setPhase('question');
  };

  // Handle Acceptance of Proposal
  const handleAcceptProposal = () => {
    setPhase('accepted');
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#ff69b4', '#ff1493', '#ffd700', '#00f7ff', '#ffffff'],
    });
  };

  const handleRestart = () => {
    setPhase('sleep');
    setPinkOverlay(false);
    setShowNudge(false);
  };

  const currentLyric = findActiveLyricCue(audioTime);
  const dialogueText = getStoryText(phase, config);

  const isInteractivePhase =
    phase === 'question' ||
    phase === 'accepted' ||
    phase === 'clover_gift' ||
    phase === 'wishes_3d';

  return (
    <main
      className="relative w-screen h-[100dvh] overflow-hidden flex flex-col justify-between items-center select-none bg-black text-white"
      onClick={!isInteractivePhase ? advance : undefined}
    >
      {/* Background Starry Sky */}
      <StarrySky visible={true} />

      {/* Atmospheric Overlays based on active wish */}
      {pinkOverlay && (
        <div
          className={`absolute inset-0 bg-pink-500/10 pointer-events-none transition-opacity duration-1000 ${
            phase === 'blush' || phase === 'accepted' ? 'opacity-100' : 'opacity-30'
          }`}
        />
      )}

      {/* Narrative Stages */}
      {phase === 'health' && <HealthStage />}
      {phase === 'beauty' && <BeautyStage />}
      {phase === 'smile' && <SmileStage currentLyric={currentLyric} />}
      {(phase === 'clover_intro' || phase === 'clover_gift') && (
        <CloverStage
          interactive={phase === 'clover_gift'}
          onCollect={handleCollectClover}
        />
      )}

      {/* Clean Top Header Bar: Only Date badge & Music Controller, no extra customization */}
      <header className="w-full max-w-5xl px-4 pt-4 sm:pt-6 flex justify-between items-center z-40 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs sm:text-sm tracking-widest text-cyan-300 uppercase opacity-90 font-mono font-medium">
            Ngày 20 tháng 10
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Music Controller */}
          <MusicController
            shouldPlay={shouldPlayMusic}
            onTimeUpdate={setAudioTime}
          />
        </div>
      </header>

      {/* Center Story / 3D Area */}
      <div className="w-full max-w-4xl px-2 sm:px-4 flex-1 flex flex-col items-center justify-center z-30 pointer-events-auto overflow-y-auto py-2">
        {/* 3D Floating Wishes Stage */}
        {phase === 'wishes_3d' && (
          <FloatingText3D
            config={config}
            onBackToLetter={() => setPhase('accepted')}
            onRestart={handleRestart}
          />
        )}

        {/* Tiny Robot Avatar */}
        {phase !== 'wishes_3d' && (
          <div className={phase === 'question' || phase === 'accepted' ? 'mb-2 sm:mb-3' : 'mb-6 sm:mb-8'}>
            <TinyRobot
              phase={phase}
              showNudge={showNudge}
              compact={phase === 'question' || phase === 'accepted'}
              onAdvance={advance}
            />
          </div>
        )}

        {/* Story Text Subtitles with typewriter glow */}
        {phase !== 'question' && phase !== 'accepted' && phase !== 'wishes_3d' && (
          <div className="text-center min-h-[64px] sm:min-h-[72px] flex items-center justify-center px-4">
            <h1
              key={phase}
              className={`text-xl sm:text-3xl md:text-4xl font-bold tracking-wide transition-all duration-500 animate-fade-in ${
                phase === 'blush'
                  ? 'text-glow-pink'
                  : phase === 'health'
                  ? 'text-glow-green'
                  : phase === 'beauty'
                  ? 'text-glow-gold'
                  : 'text-glow-cyan'
              }`}
            >
              {dialogueText}
            </h1>
          </div>
        )}

        {/* Climax: Proposal Stage ("Liệu em có thể...?") */}
        {phase === 'question' && (
          <ProposalStage
            config={config}
            onAccept={handleAcceptProposal}
          />
        )}

        {/* Climax Result: Acceptance Celebration Card from Anh Thành */}
        {phase === 'accepted' && (
          <CelebrationCard
            config={config}
            onRestart={handleRestart}
            onView3D={() => setPhase('wishes_3d')}
          />
        )}
      </div>

      {/* Bottom Footer Note: Strictly 'em' and 'Anh Thành' */}
      <footer className="w-full max-w-4xl px-3 sm:px-4 pb-2 sm:pb-4 text-center text-[11px] sm:text-xs text-slate-400 tracking-wider z-20 flex items-center justify-center gap-1.5 sm:gap-2 font-mono">
        <span>Từ Tiny với</span>
        <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
        <span>gửi tặng {config.recipientName || 'em'} từ {config.senderName || 'Anh Thành'}</span>
        {!isInteractivePhase && (
          <span className="hidden sm:inline text-slate-500">• (Chạm màn hình để xem tiếp)</span>
        )}
      </footer>
    </main>
  );
}
