import React, { useState, useRef } from 'react';
import { RoundQuestion } from '../../types/game';
import { sounds } from '../../utils/sound';
import { Palette, Eraser } from 'lucide-react';

interface MiniGameProps {
  question: RoundQuestion;
  onSubmit: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const CreativityMiniGame: React.FC<MiniGameProps> = ({ question, onSubmit, disabled }) => {
  const { roundNumber, data } = question;

  // Round 1: Word Alchemy Anagrams
  if (roundNumber === 1) {
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
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400 block mb-2">
            🎨 COSMIC WORD ALCHEMY
          </span>
          <p className="text-xs text-slate-400 mb-3">{data.hint}</p>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex items-center justify-center gap-2">
            {data.scrambled.split('').map((char: string, i: number) => (
              <span
                key={i}
                className="w-11 h-12 rounded-xl bg-[#131B2E] border border-pink-500/40 text-pink-300 font-mono text-2xl font-black flex items-center justify-center shadow-md"
              >
                {char}
              </span>
            ))}
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
                className={`py-3.5 px-4 rounded-xl border text-sm font-bold font-mono transition-all ${
                  isSelected
                    ? opt === data.correctAnswer
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                      : 'border-rose-500 bg-rose-950/60 text-rose-300'
                    : 'border-slate-800 bg-[#131B2E] text-white hover:border-pink-500 hover:bg-slate-800'
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

  // Round 2: Concept Link
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
      <div className="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto w-full">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400 block mb-2">
            🎨 CREATIVE CONCEPT LINK
          </span>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <p className="text-lg font-bold text-white leading-relaxed">
              {data.prompt}
            </p>
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
                className={`p-4 rounded-xl border text-base font-bold transition-all ${
                  isSelected
                    ? opt === data.correctAnswer
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                      : 'border-rose-500 bg-rose-950/60 text-rose-300'
                    : 'border-slate-800 bg-[#131B2E] text-white hover:border-pink-500 hover:bg-slate-800'
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

  // Round 3: Interactive Doodle Master (Canvas + Keyword Guess)
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSelect = (opt: string) => {
    if (disabled || selectedOpt) return;
    setSelectedOpt(opt);

    const isCorrect = opt === data.correctAnswer;
    if (isCorrect) sounds.playSuccess();
    else sounds.playError();

    onSubmit(isCorrect);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto w-full">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-pink-400 block mb-1">
          🎨 DOODLE CANVAS & GUESS
        </span>
        <p className="text-xs text-slate-300">
          Target Prompt: <strong className="text-cyan-400">{data.prompt}</strong>
        </p>
      </div>

      {/* Drawing Pad */}
      <div className="relative bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={320}
          height={180}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair touch-none"
        />
        <button
          type="button"
          onClick={clearCanvas}
          title="Clear Sketch"
          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* Keyword Confirmation Buttons */}
      <div className="w-full">
        <span className="text-[11px] uppercase font-bold text-slate-400 block mb-2 text-center">
          Confirm the drawn item:
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          {data.options.map((opt: string) => {
            const isSelected = selectedOpt === opt;
            return (
              <button
                key={opt}
                type="button"
                disabled={disabled || Boolean(selectedOpt)}
                onClick={() => handleSelect(opt)}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                  isSelected
                    ? opt === data.correctAnswer
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                      : 'border-rose-500 bg-rose-950/60 text-rose-300'
                    : 'border-slate-800 bg-[#131B2E] text-white hover:border-pink-500 hover:bg-slate-800'
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
};
