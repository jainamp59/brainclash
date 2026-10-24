import React, { useState, useEffect, useRef } from 'react';
import { RoundQuestion } from '../../types/game';
import { sounds } from '../../utils/sound';
import { Skull, Zap, Flame } from 'lucide-react';

interface MiniGameProps {
  question: RoundQuestion;
  onSubmit: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const BossMiniGame: React.FC<MiniGameProps> = ({ question, onSubmit, disabled }) => {
  const { roundNumber, data } = question;

  // Round 1: Turbo Simon (5 steps)
  if (roundNumber === 1) {
    const sequence: number[] = data.sequence || [0, 1, 2, 3, 4];
    const [playbackIndex, setPlaybackIndex] = useState<number>(-1);
    const [isPlayingBack, setIsPlayingBack] = useState(true);
    const [playerInput, setPlayerInput] = useState<number[]>([]);
    const [activeTile, setActiveTile] = useState<number | null>(null);

    useEffect(() => {
      setIsPlayingBack(true);
      setPlayerInput([]);
      let step = 0;

      const timer = setInterval(() => {
        if (step < sequence.length) {
          const tile = sequence[step];
          setActiveTile(tile);
          sounds.playUrgentTick();
          setTimeout(() => setActiveTile(null), 250);
          step++;
        } else {
          clearInterval(timer);
          setIsPlayingBack(false);
          setActiveTile(null);
        }
      }, data.displaySpeedMs || 450);

      return () => clearInterval(timer);
    }, [question]);

    const handleTileClick = (index: number) => {
      if (isPlayingBack || disabled) return;

      sounds.playClick();
      setActiveTile(index);
      setTimeout(() => setActiveTile(null), 150);

      const nextInput = [...playerInput, index];
      setPlayerInput(nextInput);

      const currentStep = nextInput.length - 1;
      if (sequence[currentStep] !== index) {
        sounds.playError();
        onSubmit(false);
        return;
      }

      if (nextInput.length === sequence.length) {
        sounds.playSuccess();
        onSubmit(true);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/60 border border-rose-500/50 rounded-full mb-2">
            <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-xs font-black uppercase tracking-wider text-rose-300">2X DOUBLE POINTS SURGE</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block">
            {isPlayingBack ? '👀 WATCH TURBO SEQUENCE' : '👉 REPEAT THE 5 STEPS!'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 border border-rose-500/40 rounded-3xl shadow-2xl neon-glow-violet">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isActive = activeTile === idx;
            return (
              <button
                key={idx}
                type="button"
                disabled={isPlayingBack || disabled}
                onClick={() => handleTileClick(idx)}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border transition-all active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-br from-rose-500 to-amber-500 border-white shadow-xl scale-105'
                    : 'bg-slate-800/80 border-slate-700 hover:border-rose-400 hover:bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Round 2: Boss Rapid Multi-Step Calculation
  if (roundNumber === 2) {
    const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

    const handleSelect = (opt: string) => {
      if (disabled || selectedOpt) return;
      setSelectedOpt(opt);

      const isCorrect = opt === data.correctAnswer;
      if (isCorrect) sounds.playSuccess();
      else sounds.playError();

      onSubmit(isCorrect);
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto w-full">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/60 border border-rose-500/50 rounded-full mb-2">
            <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-xs font-black uppercase tracking-wider text-rose-300">2X DOUBLE POINTS SURGE</span>
          </div>
          <div className="p-8 bg-slate-900 border border-rose-500/30 rounded-3xl shadow-2xl">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
              {data.problem}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {data.options.map((opt: string) => {
            const isSelected = selectedOpt === opt;
            return (
              <button
                key={opt}
                type="button"
                disabled={disabled || Boolean(selectedOpt)}
                onClick={() => handleSelect(opt)}
                className={`py-4 px-6 rounded-2xl border text-xl font-mono font-bold transition-all ${
                  isSelected
                    ? opt === data.correctAnswer
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                      : 'border-rose-500 bg-rose-950/60 text-rose-300'
                    : 'border-slate-800 bg-[#131B2E] text-white hover:border-rose-500 hover:bg-slate-800'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Round 3: Boss Sudden Death Reflex Match
  const [buzzerState, setBuzzerState] = useState<'WAITING' | 'READY' | 'CLICKED' | 'EARLY'>('WAITING');
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const readyTimeRef = useRef<number>(0);

  useEffect(() => {
    setBuzzerState('WAITING');
    setReactionMs(null);

    const timer = setTimeout(() => {
      setBuzzerState('READY');
      readyTimeRef.current = Date.now();
      sounds.playUrgentTick();
    }, data.waitDelayMs || 2000);

    return () => clearTimeout(timer);
  }, [question]);

  const handleBuzzer = () => {
    if (disabled || buzzerState === 'CLICKED' || buzzerState === 'EARLY') return;

    if (buzzerState === 'WAITING') {
      setBuzzerState('EARLY');
      sounds.playError();
      onSubmit(false);
    } else if (buzzerState === 'READY') {
      const ms = Date.now() - readyTimeRef.current;
      setReactionMs(ms);
      setBuzzerState('CLICKED');
      sounds.playSuccess();
      onSubmit(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto w-full">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/60 border border-rose-500/50 rounded-full mb-2">
          <Skull className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-black uppercase tracking-wider text-rose-300">
            SUDDEN DEATH CHAMPIONSHIP
          </span>
        </div>
        <p className="text-sm text-slate-300">
          {buzzerState === 'WAITING' && 'HOLD TENSION... WAIT FOR GREEN!'}
          {buzzerState === 'READY' && '💥 BUZZ NOW FOR THE WIN!'}
          {buzzerState === 'EARLY' && '❌ False start! Too early!'}
          {buzzerState === 'CLICKED' && `🏆 Flawless reflex: ${reactionMs}ms!`}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled || buzzerState === 'CLICKED' || buzzerState === 'EARLY'}
        onClick={handleBuzzer}
        className={`w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-2xl ${
          buzzerState === 'WAITING'
            ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse'
            : buzzerState === 'READY'
            ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 border-white text-slate-950 neon-glow-cyan scale-110'
            : buzzerState === 'EARLY'
            ? 'bg-slate-900 border-rose-600 text-rose-400'
            : 'bg-emerald-600 border-white text-white'
        }`}
      >
        <Zap className="w-16 h-16 mb-2 fill-current" />
        <span className="text-2xl font-black font-arcade">
          {buzzerState === 'WAITING' ? 'READY...' : buzzerState === 'READY' ? 'WINNER!' : 'DONE'}
        </span>
      </button>
    </div>
  );
};
