import React from 'react';
import { RoomState } from '../../src/types/game';
import { getAvatarById } from '../../src/utils/avatars';
import { Trophy, ArrowUp, ArrowDown, Minus, Sparkles } from 'lucide-react';

interface RoundSummaryModalProps {
  roomState: RoomState;
  currentUserId: string;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({ roomState, currentUserId }) => {
  const sortedPlayers = [...roomState.players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#131B2E] border border-violet-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="mb-6">
          <span className="text-[10px] uppercase font-black tracking-widest text-violet-400 block mb-1">
            ROUND SUMMARY · NEXT ROUND INCOMING...
          </span>
          <h2 className="text-2xl font-black text-white font-arcade">Live Standings</h2>
        </div>

        {/* Players Scoreboard */}
        <div className="space-y-2.5 mb-6">
          {sortedPlayers.map((player, index) => {
            const avatar = getAvatarById(player.avatarId);
            const isMe = player.id === currentUserId;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isMe
                    ? 'border-violet-500/60 bg-violet-950/40 shadow-lg shadow-violet-500/10'
                    : 'border-slate-800 bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm w-5 text-center text-slate-400">
                    #{index + 1}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-lg shadow-sm`}
                  >
                    {avatar.emoji}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{player.username}</span>
                      {isMe && <span className="text-xs text-violet-400 font-semibold">(You)</span>}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {player.lastAnswerCorrect ? (
                        <span className="text-emerald-400 font-medium">+ {player.roundScore} Pts</span>
                      ) : (
                        <span className="text-slate-500 font-medium">Missed</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-lg text-white tabular-nums">
                    {player.score}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">TOTAL PTS</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next mental challenge loads automatically...</span>
        </div>
      </div>
    </div>
  );
};
