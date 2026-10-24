import React, { useState } from 'react';
import { RoundQuestion } from '../../types/game';
import { sounds } from '../../utils/sound';

interface MiniGameProps {
  question: RoundQuestion;
  onSubmit: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const FocusMiniGame: React.FC<MiniGameProps> = ({ question, onSubmit, disabled }) => {
  const { roundNumber, data } = question;

  // Round 1: Spot the Glitch (12 items)
  if (roundNumber === 1) {
    const items: string[] = data.items || [];
    const glitchIndex = data.glitchIndex;
    const [clickedIdx, setClickedIdx] = useState<number | null>(null);

    const handleItemClick = (idx: number) => {
      if (disabled || clickedIdx !== null) return;
      setClickedIdx(idx);

      const isCorrect = idx === glitchIndex;
      if (isCorrect) sounds.playSuccess();
      else sounds.playError();

      onSubmit(isCorrect);
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            ⚡ SPOT THE DISCREPANCY!
          </span>
          <p className="text-sm text-slate-300">
            One of the 12 symbols below is subtly different from the others. Find it!
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
          {items.map((symbol, idx) => {
            const isSelected = clickedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || clickedIdx !== null}
                onClick={() => handleItemClick(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-3xl sm:text-4xl flex items-center justify-center border transition-all active:scale-95 ${
                  isSelected
                    ? idx === glitchIndex
                      ? 'border-emerald-500 bg-emerald-950/60 neon-glow-cyan'
                      : 'border-rose-500 bg-rose-950/60'
                    : 'border-slate-800 bg-[#131B2E] hover:border-emerald-500/50 hover:bg-slate-800'
                }`}
              >
                {symbol}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Round 2: Hidden Icon Hunt (20 items)
  if (roundNumber === 2) {
    const items: string[] = data.items || [];
    const target = data.targetIcon;
    const targetIdx = data.targetIndex;
    const [clickedIdx, setClickedIdx] = useState<number | null>(null);

    const handleHuntClick = (idx: number) => {
      if (disabled || clickedIdx !== null) return;
      setClickedIdx(idx);

      const isCorrect = idx === targetIdx;
      if (isCorrect) sounds.playSuccess();
      else sounds.playError();

      onSubmit(isCorrect);
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-5 max-w-xl mx-auto">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            🔍 HIDDEN ICON HUNT
          </span>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl mb-1">
            <span className="text-xs text-slate-400">Target to find:</span>
            <span className="text-2xl">{target}</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2.5 p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
          {items.map((icon, idx) => {
            const isSelected = clickedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || clickedIdx !== null}
                onClick={() => handleHuntClick(idx)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl text-2xl sm:text-3xl flex items-center justify-center border transition-all active:scale-95 ${
                  isSelected
                    ? idx === targetIdx
                      ? 'border-emerald-500 bg-emerald-950/60 neon-glow-cyan'
                      : 'border-rose-500 bg-rose-950/60'
                    : 'border-slate-800 bg-[#131B2E] hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                {icon}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Round 3: Stroop Laser Clash (Ink Color vs Word Text)
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

  const handleStroopSelect = (opt: string) => {
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
        <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block mb-2">
          ⚡ STROOP LASER TEST
        </span>
        <p className="text-xs text-slate-300 mb-4">
          Match the <strong className="text-white">INK COLOR</strong>, do NOT read the word!
        </p>

        {/* Word Card with Distorting Ink */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
          <span
            className="text-5xl sm:text-6xl font-black tracking-widest font-arcade drop-shadow-lg"
            style={{ color: data.inkColorHex }}
          >
            {data.wordText}
          </span>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {data.options.map((opt: string) => {
          const isSelected = selectedOpt === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled || Boolean(selectedOpt)}
              onClick={() => handleStroopSelect(opt)}
              className={`p-3.5 rounded-xl border text-sm font-bold transition-all ${
                isSelected
                  ? opt === data.correctAnswer
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                    : 'border-rose-500 bg-rose-950/60 text-rose-300'
                  : 'border-slate-800 bg-[#131B2E] text-white hover:border-violet-500 hover:bg-slate-800'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
