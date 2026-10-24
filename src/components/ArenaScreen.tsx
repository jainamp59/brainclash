import React, { useEffect } from 'react';
import { RoomState, Player } from '../../src/types/game';
import { sounds } from '../../src/utils/sound';
import { getAvatarById } from '../../src/utils/avatars';
import { MemoryMiniGame } from './games/MemoryMiniGame';
import { LogicMiniGame } from './games/LogicMiniGame';
import { FocusMiniGame } from './games/FocusMiniGame';
import { SpeedMiniGame } from './games/SpeedMiniGame';
import { CreativityMiniGame } from './games/CreativityMiniGame';
import { DeductionMiniGame } from './games/DeductionMiniGame';
import { BossMiniGame } from './games/BossMiniGame';
import { Flame, Snowflake, Zap, Lightbulb, Users } from 'lucide-react';

interface ArenaScreenProps {
  roomState: RoomState;
  currentUserId: string;
  onSubmitAnswer: (isCorrect: boolean) => void;
  onUsePowerUp: (powerUp: 'freeze' | 'double' | 'hint') => void;
}

export const ArenaScreen: React.FC<ArenaScreenProps> = ({
  roomState,
  currentUserId,
  onSubmitAnswer,
  onUsePowerUp
}) => {
  const me = roomState.players.find((p) => p.id === currentUserId);
  const q = roomState.currentQuestion;
  const isFrozen = Boolean(me?.activeEffects?.isFrozen);
  const hasDouble = Boolean(me?.activeEffects?.hasDouble);

  // Keyboard shortcuts for power-ups (1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (me?.hasAnswered || isFrozen) return;
      if (e.key === '1' && (me?.powerUps.freeze || 0) > 0) {
        sounds.playPowerUp();
        onUsePowerUp('freeze');
      } else if (e.key === '2' && (me?.powerUps.double || 0) > 0) {
        sounds.playPowerUp();
        onUsePowerUp('double');
      } else if (e.key === '3' && (me?.powerUps.hint || 0) > 0) {
        sounds.playPowerUp();
        onUsePowerUp('hint');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [me, isFrozen]);

  if (!q) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="text-slate-400 font-mono text-sm">Preparing next mental arena...</span>
      </div>
    );
  }

  // Timer styling
  const totalDuration = roomState.config.roundDuration || 15;
  const timer = roomState.timerSeconds;
  const timerRatio = Math.max(0, Math.min(1, timer / totalDuration));
  const strokeDash = 2 * Math.PI * 22; // radius 22
  const strokeOffset = strokeDash * (1 - timerRatio);

  const timerColor =
    timer <= 3 ? 'text-rose-500 stroke-rose-500' : timer <= 6 ? 'text-amber-400 stroke-amber-400' : 'text-cyan-400 stroke-cyan-400';

  // Render proper mini game component
  const renderMiniGame = () => {
    const props = {
      question: q,
      onSubmit: onSubmitAnswer,
      disabled: me?.hasAnswered || isFrozen
    };

    switch (q.levelId) {
      case 'memory':
        return <MemoryMiniGame {...props} />;
      case 'logic':
        return <LogicMiniGame {...props} />;
      case 'focus':
        return <FocusMiniGame {...props} />;
      case 'speed':
        return <SpeedMiniGame {...props} />;
      case 'creativity':
        return <CreativityMiniGame {...props} />;
      case 'deduction':
        return <DeductionMiniGame {...props} />;
      case 'boss':
        return <BossMiniGame {...props} />;
      default:
        return <MemoryMiniGame {...props} />;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between max-w-5xl mx-auto px-4 py-3">
      {/* Frozen Screen Overlay if hit by freeze power-up */}
      {isFrozen && (
        <div className="absolute inset-0 z-40 bg-cyan-950/70 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
          <Snowflake className="w-16 h-16 text-cyan-300 animate-spin" />
          <h2 className="text-2xl font-black text-white font-arcade mt-3">FROZEN!</h2>
          <p className="text-xs text-cyan-200">A rival chilled your synapses for 3 seconds!</p>
        </div>
      )}

      {/* Top Perimeter HUD (Unobtrusive) */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#131B2E] border border-slate-800 shadow-xl mb-4">
        {/* Left: Level & Round Counter */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/40 flex items-center justify-center text-violet-300 font-extrabold text-sm font-arcade">
            {roomState.currentRound}/3
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white uppercase font-arcade tracking-wide">
                {q.title}
              </span>
              {hasDouble && (
                <span className="text-[10px] font-black uppercase text-amber-300 px-1.5 py-0.5 bg-amber-950/80 border border-amber-500/40 rounded">
                  2X ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{q.instructions}</p>
          </div>
        </div>

        {/* Center: Circular SVG Countdown Timer */}
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="transparent"
                className={`${timerColor} transition-all duration-1000`}
              />
            </svg>
            <span className={`absolute font-mono font-black text-sm tabular-nums ${timerColor}`}>
              {timer}
            </span>
          </div>
        </div>

        {/* Right: Score & Combo Multiplier */}
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-400">Your Score</div>
          <div className="text-xl font-black text-white font-mono tabular-nums">
            {me?.score || 0}
            {(me?.combo || 0) > 1 && (
              <span className="ml-1.5 text-xs text-amber-400 font-bold">
                {me?.combo}x 🔥
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center Arena Playfield (85% unobstructed area) */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
        {renderMiniGame()}

        {me?.hasAnswered && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Answer submitted! Waiting for other players...</span>
          </div>
        )}
      </div>

      {/* Bottom Perimeter: Rivals Status + Power-Up Dock */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        {/* Rivals Submission Strip */}
        {roomState.players.length > 1 && (
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Rivals Status:</span>
            </div>
            <div className="flex items-center gap-3">
              {roomState.players.map((p) => {
                const avatar = getAvatarById(p.avatarId);
                const isMe = p.id === currentUserId;
                return (
                  <div
                    key={p.id}
                    title={`${p.username}: ${p.hasAnswered ? 'Submitted' : 'Thinking'}`}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border transition-all ${
                      p.hasAnswered
                        ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    <span>{avatar.emoji}</span>
                    <span className="font-semibold truncate max-w-[80px]">
                      {isMe ? 'You' : p.username}
                    </span>
                    {p.hasAnswered ? (
                      <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Power-Up Dock (Freeze, 2x, Hint) */}
        {roomState.config.powerUpsEnabled && (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={me?.hasAnswered || (me?.powerUps.freeze || 0) <= 0 || isFrozen}
              onClick={() => {
                sounds.playPowerUp();
                onUsePowerUp('freeze');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40 disabled:opacity-40 disabled:hover:border-cyan-500/30 transition-all shadow-md"
            >
              <Snowflake className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold">Freeze Rivals</span>
              <span className="px-1.5 py-0.2 bg-cyan-900/80 rounded font-mono text-[10px] text-white">
                {me?.powerUps.freeze || 0}
              </span>
              <kbd className="hidden sm:inline text-[9px] bg-slate-800 px-1 py-0.5 rounded text-slate-400">1</kbd>
            </button>

            <button
              type="button"
              disabled={me?.hasAnswered || (me?.powerUps.double || 0) <= 0 || isFrozen || hasDouble}
              onClick={() => {
                sounds.playPowerUp();
                onUsePowerUp('double');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 hover:border-amber-400 hover:bg-amber-950/40 disabled:opacity-40 disabled:hover:border-amber-500/30 transition-all shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">2X Surge</span>
              <span className="px-1.5 py-0.2 bg-amber-900/80 rounded font-mono text-[10px] text-white">
                {me?.powerUps.double || 0}
              </span>
              <kbd className="hidden sm:inline text-[9px] bg-slate-800 px-1 py-0.5 rounded text-slate-400">2</kbd>
            </button>

            <button
              type="button"
              disabled={me?.hasAnswered || (me?.powerUps.hint || 0) <= 0 || isFrozen}
              onClick={() => {
                sounds.playPowerUp();
                onUsePowerUp('hint');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-violet-500/30 text-violet-300 hover:border-violet-400 hover:bg-violet-950/40 disabled:opacity-40 disabled:hover:border-violet-500/30 transition-all shadow-md"
            >
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold">Smart Hint</span>
              <span className="px-1.5 py-0.2 bg-violet-900/80 rounded font-mono text-[10px] text-white">
                {me?.powerUps.hint || 0}
              </span>
              <kbd className="hidden sm:inline text-[9px] bg-slate-800 px-1 py-0.5 rounded text-slate-400">3</kbd>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
