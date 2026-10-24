import React, { useState, useEffect, useRef } from 'react';
import { RoundQuestion } from '../../types/game';
import { sounds } from '../../utils/sound';
import { Brain, CheckCircle, XCircle } from 'lucide-react';

interface MiniGameProps {
  question: RoundQuestion;
  onSubmit: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const MemoryMiniGame: React.FC<MiniGameProps> = ({ question, onSubmit, disabled }) => {
  const { roundNumber, data } = question;

  // ----------------------------------------------------
  // ROUND 1: PATTERN ECHO (Simon 3x3)
  // ----------------------------------------------------
  if (roundNumber === 1) {
    const sequence: number[] = data.sequence || [0, 1, 2, 3];
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
          sounds.playTick();
          setTimeout(() => setActiveTile(null), 350);
          step++;
        } else {
          clearInterval(timer);
          setIsPlayingBack(false);
          setActiveTile(null);
        }
      }, data.displaySpeedMs || 650);

      return () => clearInterval(timer);
    }, [question]);

    const handleTileClick = (index: number) => {
      if (isPlayingBack || disabled) return;

      sounds.playClick();
      setActiveTile(index);
      setTimeout(() => setActiveTile(null), 200);

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
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400 block mb-1">
            {isPlayingBack ? '👀 WATCH THE SEQUENCE' : '👉 REPEAT THE SEQUENCE!'}
          </span>
          <div className="text-xs text-slate-400 font-medium">
            Progress: {playerInput.length} / {sequence.length} Steps
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl">
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
                    ? 'bg-gradient-to-br from-violet-400 to-cyan-400 border-white shadow-xl neon-glow-cyan scale-105'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                } ${isPlayingBack ? 'cursor-default' : 'cursor-pointer'}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ROUND 2: COLOR MATRIX RECALL
  // ----------------------------------------------------
  if (roundNumber === 2) {
    const cards = data.cards || [];
    const [isMemorizing, setIsMemorizing] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
      setIsMemorizing(true);
      setSelectedOption(null);
      const timer = setTimeout(() => {
        setIsMemorizing(false);
      }, data.memorizeTimeMs || 3500);

      return () => clearTimeout(timer);
    }, [question]);

    const handleSelect = (option: string) => {
      if (disabled || selectedOption) return;
      setSelectedOption(option);

      const isCorrect = option === data.correctAnswer;
      if (isCorrect) sounds.playSuccess();
      else sounds.playError();

      onSubmit(isCorrect);
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-1">
            {isMemorizing ? '⏳ MEMORIZE COLOR POSITIONS!' : '❓ RECALL QUESTION'}
          </span>
          <h3 className="text-lg font-bold text-white">
            {isMemorizing ? 'Colors will hide in 3.5 seconds...' : data.questionText}
          </h3>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-5 gap-3 w-full">
          {cards.map((card: any, idx: number) => (
            <div
              key={idx}
              className={`h-28 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center p-2 text-center shadow-lg ${
                isMemorizing
                  ? 'border-white/40 scale-100'
                  : 'border-slate-800 bg-slate-900 scale-95'
              }`}
              style={{
                backgroundColor: isMemorizing ? card.hex : '#131B2E'
              }}
            >
              <span className="text-xs font-mono font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-full mb-1">
                #{idx + 1}
              </span>
              {isMemorizing && (
                <span className="text-[10px] font-extrabold text-white uppercase drop-shadow-md">
                  {card.name.split(' ')[0]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Options (shown once hidden) */}
        {!isMemorizing && (
          <div className="grid grid-cols-2 gap-3 w-full animate-fade-in">
            {data.options.map((opt: string) => {
              const isPicked = selectedOption === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled || Boolean(selectedOption)}
                  onClick={() => handleSelect(opt)}
                  className={`py-3.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                    isPicked
                      ? opt === data.correctAnswer
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-rose-500 bg-rose-950/60 text-rose-300'
                      : 'border-slate-700 bg-slate-900 text-white hover:border-violet-500 hover:bg-slate-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // ROUND 3: SYNAPSE MATRIX (4x4, 5 Target Nodes)
  // ----------------------------------------------------
  const targetPositions: number[] = data.targetPositions || [0, 5, 10, 15];
  const [phase, setPhase] = useState<'SHOWING' | 'RECALL'>('SHOWING');
  const [foundPositions, setFoundPositions] = useState<number[]>([]);
  const [failedPosition, setFailedPosition] = useState<number | null>(null);

  useEffect(() => {
    setPhase('SHOWING');
    setFoundPositions([]);
    setFailedPosition(null);

    const timer = setTimeout(() => {
      setPhase('RECALL');
    }, data.displayTimeMs || 2500);

    return () => clearTimeout(timer);
  }, [question]);

  const handleNodeClick = (idx: number) => {
    if (phase !== 'RECALL' || disabled || foundPositions.includes(idx)) return;

    if (targetPositions.includes(idx)) {
      sounds.playTick();
      const updated = [...foundPositions, idx];
      setFoundPositions(updated);

      if (updated.length === targetPositions.length) {
        sounds.playSuccess();
        onSubmit(true);
      }
    } else {
      sounds.playError();
      setFailedPosition(idx);
      onSubmit(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400 block mb-1">
          {phase === 'SHOWING' ? '⚡ MEMORIZE 5 GLOWING NODES' : '👉 TAP ALL 5 TARGET NODES!'}
        </span>
        <div className="text-xs text-slate-400 font-medium">
          Found: <span className="text-cyan-400 font-bold font-mono">{foundPositions.length}</span> / {targetPositions.length}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl">
        {Array.from({ length: 16 }).map((_, idx) => {
          const isTarget = targetPositions.includes(idx);
          const isFound = foundPositions.includes(idx);
          const isFailed = failedPosition === idx;

          let bg = 'bg-slate-800/80 border-slate-700';
          if (phase === 'SHOWING' && isTarget) {
            bg = 'bg-cyan-500 border-white shadow-lg neon-glow-cyan scale-105';
          } else if (phase === 'RECALL') {
            if (isFound) bg = 'bg-emerald-500 border-white shadow-md scale-95';
            else if (isFailed) bg = 'bg-rose-600 border-white shadow-md animate-shake';
            else bg = 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-700';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={phase !== 'RECALL' || disabled}
              onClick={() => handleNodeClick(idx)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border transition-all active:scale-95 ${bg} ${
                phase === 'RECALL' ? 'cursor-pointer' : 'cursor-default'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
