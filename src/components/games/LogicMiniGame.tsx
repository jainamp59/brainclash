import React, { useState } from 'react';
import { RoundQuestion } from '../../types/game';
import { sounds } from '../../utils/sound';
import { HelpCircle } from 'lucide-react';

interface MiniGameProps {
  question: RoundQuestion;
  onSubmit: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const LogicMiniGame: React.FC<MiniGameProps> = ({ question, onSubmit, disabled }) => {
  const { roundNumber, data } = question;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (disabled || selectedOption) return;
    setSelectedOption(option);

    const isCorrect = option === data.correctAnswer;
    if (isCorrect) sounds.playSuccess();
    else sounds.playError();

    onSubmit(isCorrect);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto w-full">
      {/* Question Prompt */}
      <div className="text-center w-full">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-2">
          {question.title} · Round {roundNumber}
        </span>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          {data.sequence && (
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cyan-300 tracking-wider mb-2">
              {data.sequence}
            </div>
          )}
          {data.riddle && (
            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed italic">
              "{data.riddle}"
            </p>
          )}
          {data.prompt && (
            <p className="text-base sm:text-lg font-bold text-white">
              {data.prompt}
            </p>
          )}
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {data.options.map((option: string) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled || Boolean(selectedOption)}
              onClick={() => handleSelect(option)}
              className={`p-4 rounded-xl border text-sm sm:text-base font-bold transition-all text-left flex items-center justify-between ${
                isSelected
                  ? option === data.correctAnswer
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 neon-glow-cyan'
                    : 'border-rose-500 bg-rose-950/60 text-rose-300'
                  : 'border-slate-800 bg-[#131B2E] text-white hover:border-cyan-500 hover:bg-slate-800'
              }`}
            >
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {data.hint && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hint available</span>
        </div>
      )}
    </div>
  );
};
