import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RoomState, UserProfile } from '../../src/types/game';
import { sounds } from '../../src/utils/sound';
import { getAvatarById } from '../../src/utils/avatars';
import { Trophy, Award, Flame, RotateCcw, Home, Sparkles } from 'lucide-react';

interface VictoryScreenProps {
  roomState: RoomState;
  currentUserId: string;
  isHost: boolean;
  onRestartMatch: () => void;
  onLeaveRoom: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  roomState,
  currentUserId,
  isHost,
  onRestartMatch,
  onLeaveRoom
}) => {
  const sorted = [...roomState.players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const isWinner = winner?.id === currentUserId;

  useEffect(() => {
    sounds.playVictory();

    // Fire confetti bursts!
    const end = Date.now() + 3000;
    const colors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-center">
      {/* Champion Announcement */}
      <div>
        <span className="text-xs uppercase font-black tracking-widest text-amber-400 block mb-2">
          MATCH FINALE · VICTORY CEREMONY
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-arcade">
          {isWinner ? '🎉 YOU ARE THE CHAMPION!' : `👑 ${winner?.username} WINS!`}
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          {roomState.config.levels.length} cognitive dimensions conquered across {roomState.players.length} players
        </p>
      </div>

      {/* 3-Tier Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 pt-6 pb-4">
        {/* 2nd Place */}
        {sorted[1] && (
          <div className="flex flex-col items-center flex-1 max-w-[160px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-2xl shadow-lg mb-2">
              {getAvatarById(sorted[1].avatarId).emoji}
            </div>
            <div className="text-sm font-bold text-white truncate w-full">{sorted[1].username}</div>
            <div className="font-mono text-xs text-slate-400 mb-2">{sorted[1].score} pts</div>
            <div className="w-full h-28 bg-slate-800 border-t-2 border-slate-400 rounded-t-2xl flex flex-col items-center justify-center p-2">
              <span className="text-2xl font-black text-slate-300 font-mono">2nd</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">SILVER</span>
            </div>
          </div>
        )}

        {/* 1st Place (Center, Tallest) */}
        {winner && (
          <div className="flex flex-col items-center flex-1 max-w-[190px]">
            <div className="relative mb-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                👑
              </div>
              <div
                className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${getAvatarById(winner.avatarId).gradient} flex items-center justify-center text-4xl shadow-2xl border-4 border-amber-400 neon-glow-amber`}
              >
                {getAvatarById(winner.avatarId).emoji}
              </div>
            </div>
            <div className="text-base font-extrabold text-white truncate w-full">{winner.username}</div>
            <div className="font-mono text-sm font-extrabold text-amber-400 mb-2">{winner.score} pts</div>
            <div className="w-full h-36 bg-gradient-to-b from-amber-950/80 to-slate-900 border-t-4 border-amber-400 rounded-t-3xl flex flex-col items-center justify-center p-2 shadow-2xl neon-glow-amber">
              <span className="text-3xl font-black text-amber-400 font-mono">1st</span>
              <span className="text-[11px] uppercase font-extrabold text-amber-300 tracking-wider">CHAMPION</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {sorted[2] && (
          <div className="flex flex-col items-center flex-1 max-w-[160px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-2xl shadow-lg mb-2">
              {getAvatarById(sorted[2].avatarId).emoji}
            </div>
            <div className="text-sm font-bold text-white truncate w-full">{sorted[2].username}</div>
            <div className="font-mono text-xs text-slate-400 mb-2">{sorted[2].score} pts</div>
            <div className="w-full h-20 bg-slate-800/80 border-t-2 border-amber-600 rounded-t-2xl flex flex-col items-center justify-center p-2">
              <span className="text-2xl font-black text-amber-500 font-mono">3rd</span>
              <span className="text-[10px] uppercase font-bold text-amber-600">BRONZE</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard List */}
      <div className="max-w-md mx-auto space-y-2 text-left">
        {sorted.map((p, idx) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-500 w-4">#{idx + 1}</span>
              <span className="text-lg">{getAvatarById(p.avatarId).emoji}</span>
              <span className="text-sm font-bold text-white">{p.username}</span>
            </div>
            <span className="font-mono font-black text-cyan-400 text-sm">{p.score} pts</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {isHost && (
          <button
            onClick={() => {
              sounds.playClick();
              onRestartMatch();
            }}
            className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:brightness-110 active:scale-95 text-white font-extrabold text-sm transition-all shadow-xl font-arcade flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN (SAME ROOM)</span>
          </button>
        )}

        <button
          onClick={() => {
            sounds.playClick();
            onLeaveRoom();
          }}
          className="w-full sm:w-auto min-w-[180px] py-3.5 px-6 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO HUB</span>
        </button>
      </div>
    </div>
  );
};
