import React, { useState } from 'react';
import { RoundQuestion } from '../../types/game';
import { sounds } from '../../utils/sound';
import { Key, ShieldAlert } from 'lucide-react';

interface MiniGameProps {
  question: RoundQuestion;
  onSubmit: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const DeductionMiniGame: React.FC<MiniGameProps> = ({ question, onSubmit, disabled }) => {
  const { roundNumber, data } = question;
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (disabled || selectedOpt) return;
    setSelectedOpt(opt);

    const isCorrect = opt === data.correctAnswer;
    if (isCorrect) sounds.playSuccess();
    else sounds.playError();

    onSubmit(isCorrect);
  };

  // Round 3: Code Breaker with clue list
  if (roundNumber === 3) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto w-full">
        <div className="text-center w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
            🔑 DEDUCTION CODE BREAKER
          </span>
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Cipher Clues:
            </span>
            {data.clues.map((clue: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>{clue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-2 text-center">
            Identify the secret 3-digit code:
          </span>
          <div className="grid grid-cols-2 gap-3">
            {data.options.map((opt: string) => {
              const isSelected = selectedOpt === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled || Boolean(selectedOpt)}
                  onClick={() => handleSelect(opt)}
                  className={`py-4 px-6 rounded-2xl border font-mono text-2xl font-black transition-all ${
                    isSelected
                      ? opt === data.correctAnswer
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-rose-500 bg-rose-950/60 text-rose-300'
                      : 'border-slate-800 bg-[#131B2E] text-white hover:border-indigo-500 hover:bg-slate-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Round 1 & 2: Bluff & Impostor Clue
  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto w-full">
      <div className="text-center w-full">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
          {question.title} · Round {roundNumber}
        </span>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          {data.prompt && (
            <p className="text-base sm:text-lg font-bold text-white mb-2">
              {data.prompt}
            </p>
          )}
          {data.categoryHint && (
            <p className="text-sm text-slate-300">
              Context Theme: <strong className="text-indigo-400">{data.categoryHint}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 w-full">
        {data.options.map((opt: string) => {
          const isSelected = selectedOpt === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled || Boolean(selectedOpt)}
              onClick={() => handleSelect(opt)}
              className={`w-full p-4 rounded-xl border text-sm sm:text-base font-semibold transition-all text-left flex items-center justify-between ${
                isSelected
                  ? opt === data.correctAnswer
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                    : 'border-rose-500 bg-rose-950/60 text-rose-300'
                  : 'border-slate-800 bg-[#131B2E] text-white hover:border-indigo-500 hover:bg-slate-800'
              }`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
