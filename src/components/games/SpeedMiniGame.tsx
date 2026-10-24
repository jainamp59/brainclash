import React, { useState, useEffect, useRef } from 'react';
import { RoundQuestion } from '../../types/game';
import { sounds } from '../../utils/sound';
import { Zap } from 'lucide-react';

interface MiniGameProps {
  question: RoundQuestion;
  onSubmit: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const SpeedMiniGame: React.FC<MiniGameProps> = ({ question, onSubmit, disabled }) => {
  const { roundNumber, data } = question;

  // Round 1: Reflex Laser Buzzer
  if (roundNumber === 1) {
    const [buzzerState, setBuzzerState] = useState<'WAITING' | 'READY' | 'CLICKED' | 'EARLY'>('WAITING');
    const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
    const readyTimestampRef = useRef<number>(0);

    useEffect(() => {
      setBuzzerState('WAITING');
      setReactionTimeMs(null);

      const timer = setTimeout(() => {
        setBuzzerState('READY');
        readyTimestampRef.current = Date.now();
        sounds.playUrgentTick();
      }, data.waitDelayMs || 2200);

      return () => clearTimeout(timer);
    }, [question]);

    const handleBuzzerClick = () => {
      if (disabled || buzzerState === 'CLICKED' || buzzerState === 'EARLY') return;

      if (buzzerState === 'WAITING') {
        // Tapped too early!
        setBuzzerState('EARLY');
        sounds.playError();
        onSubmit(false);
      } else if (buzzerState === 'READY') {
        const ms = Date.now() - readyTimestampRef.current;
        setReactionTimeMs(ms);
        setBuzzerState('CLICKED');
        sounds.playSuccess();
        onSubmit(true);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto w-full">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
            ⚡ REFLEX LASER CLASH
          </span>
          <p className="text-sm text-slate-300">
            {buzzerState === 'WAITING' && 'Steady... wait for GREEN!'}
            {buzzerState === 'READY' && '💥 TAP NOW! TAP NOW!'}
            {buzzerState === 'EARLY' && '❌ False start! Tapped too early!'}
            {buzzerState === 'CLICKED' && `🔥 Speed: ${reactionTimeMs}ms!`}
          </p>
        </div>

        <button
          type="button"
          disabled={disabled || buzzerState === 'CLICKED' || buzzerState === 'EARLY'}
          onClick={handleBuzzerClick}
          className={`w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-2xl ${
            buzzerState === 'WAITING'
              ? 'bg-rose-950/40 border-rose-600/60 text-rose-300 animate-pulse'
              : buzzerState === 'READY'
              ? 'bg-emerald-500 border-white text-slate-950 neon-glow-cyan scale-105'
              : buzzerState === 'EARLY'
              ? 'bg-slate-900 border-rose-600 text-rose-400'
              : 'bg-emerald-600 border-white text-white'
          }`}
        >
          <Zap className="w-16 h-16 mb-2 fill-current" />
          <span className="text-2xl font-black font-arcade">
            {buzzerState === 'WAITING' ? 'WAIT...' : buzzerState === 'READY' ? 'BUZZ!' : 'LOCKED'}
          </span>
          {reactionTimeMs !== null && (
            <span className="font-mono text-sm font-bold mt-1 text-slate-950">{reactionTimeMs} ms</span>
          )}
        </button>
      </div>
    );
  }

  // Round 2: Lightning Math
  if (roundNumber === 2) {
    const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

    const handleMathSelect = (opt: string) => {
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
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            ⚡ RAPID MENTAL MATH
          </span>
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
            <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-wider">
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
                onClick={() => handleMathSelect(opt)}
                className={`py-4 px-6 rounded-2xl border text-xl font-mono font-bold transition-all ${
                  isSelected
                    ? opt === data.correctAnswer
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                      : 'border-rose-500 bg-rose-950/60 text-rose-300'
                    : 'border-slate-800 bg-[#131B2E] text-white hover:border-amber-500 hover:bg-slate-800'
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

  // Round 3: Ascending Number Rush (6 items)
  const numbers: number[] = data.numbers || [1, 2, 3, 4, 5, 6];
  const correctOrder: number[] = data.correctOrder || [1, 2, 3, 4, 5, 6];
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);

  const handleNumClick = (val: number, idx: number) => {
    if (disabled || tappedIndices.includes(idx)) return;

    const expectedNext = correctOrder[tappedIndices.length];
    if (val === expectedNext) {
      sounds.playTick();
      const next = [...tappedIndices, idx];
      setTappedIndices(next);

      if (next.length === correctOrder.length) {
        sounds.playSuccess();
        onSubmit(true);
      }
    } else {
      sounds.playError();
      onSubmit(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
          ⚡ NUMBER RUSH (LOWEST TO HIGHEST)
        </span>
        <div className="text-xs text-slate-400 font-medium">
          Tapped: <span className="font-mono font-bold text-white">{tappedIndices.length}</span> / {correctOrder.length}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3.5 p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
        {numbers.map((val, idx) => {
          const isTapped = tappedIndices.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || isTapped}
              onClick={() => handleNumClick(val, idx)}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl font-mono text-2xl sm:text-3xl font-black border transition-all active:scale-95 ${
                isTapped
                  ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400 opacity-40 scale-95'
                  : 'border-slate-700 bg-gradient-to-br from-[#131B2E] to-slate-800 text-white hover:border-amber-400 hover:scale-105'
              }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
};
