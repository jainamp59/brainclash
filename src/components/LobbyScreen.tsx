import React, { useState } from 'react';
import { RoomState, Player } from '../types/game';
import { getAvatarById } from '../utils/avatars';
import { sounds } from '../utils/sound';
import {
  Users,
  Copy,
  Check,
  Crown,
  Settings,
  Sparkles,
  Play,
  ArrowLeft,
  Smile,
  ShieldAlert
} from 'lucide-react';

interface LobbyScreenProps {
  roomState: RoomState;
  currentUserId: string;
  onToggleReady: (ready: boolean) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onSendReaction: (emoji: string) => void;
  onOpenSettings: () => void;
}

const EMOJI_DECK = ['🎉', '🧠', '⚡', '🔥', '💀', '😜', '👏', '👑'];

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  roomState,
  currentUserId,
  onToggleReady,
  onStartGame,
  onLeaveRoom,
  onSendReaction,
  onOpenSettings
}) => {
  const [copied, setCopied] = useState(false);
  const me = roomState.players.find((p) => p.id === currentUserId);
  const isHost = roomState.hostId === currentUserId;
  const allReady = roomState.players.length > 0 && roomState.players.every((p) => p.isReady || p.isHost);
  const canStart = isHost && (allReady || roomState.players.length === 1);

  const handleCopyLink = () => {
    sounds.playClick();
    const url = `${window.location.origin}?room=${roomState.roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* Top Navigation & Leave */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onLeaveRoom();
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Hub</span>
        </button>

        <div className="flex items-center gap-3">
          {isHost && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSettings();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-violet-400" />
              <span>Room Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* Room Code Showcase */}
      <div className="text-center relative">
        <span className="text-xs uppercase font-extrabold tracking-widest text-violet-400 block mb-1">
          Multiplayer Party Room
        </span>
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#131B2E] border border-violet-500/40 shadow-xl neon-glow-violet">
          <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-widest">
            {roomState.roomCode}
          </span>
          <button
            onClick={handleCopyLink}
            title="Copy Invite Link"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-violet-400 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {copied ? 'Invite link copied to clipboard!' : 'Share this 4-letter code with friends to join'}
        </p>
      </div>

      {/* Playlist & Settings Summary Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <span className="px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-800">
          Max: <strong className="text-white">{roomState.config.maxPlayers} Players</strong>
        </span>
        <span className="px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-800">
          Levels: <strong className="text-cyan-400">{roomState.config.levels.length} Selected</strong>
        </span>
        <span className="px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-800">
          Timer: <strong className="text-amber-400">{roomState.config.roundDuration}s / Round</strong>
        </span>
        <span className="px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-800">
          Power-Ups: <strong className="text-violet-400">{roomState.config.powerUpsEnabled ? 'ON' : 'OFF'}</strong>
        </span>
      </div>

      {/* Connected Players Podiums */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white font-arcade flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Players in Room ({roomState.players.length}/{roomState.config.maxPlayers})</span>
          </h2>
          <span className="text-xs text-slate-400">
            {roomState.players.filter((p) => p.isReady).length} of {roomState.players.length} Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {roomState.players.map((player: Player) => {
            const avatar = getAvatarById(player.avatarId);
            const isMe = player.id === currentUserId;

            return (
              <div
                key={player.id}
                className={`relative bg-[#131B2E] border rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all ${
                  player.isReady || player.isHost
                    ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800'
                }`}
              >
                {/* Host Crown */}
                {player.isHost && (
                  <div
                    title="Party Host"
                    className="absolute -top-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md"
                  >
                    <Crown className="w-3 h-3 fill-slate-950" />
                    <span>HOST</span>
                  </div>
                )}

                {/* Avatar Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-3xl mb-3 shadow-md border-2 border-white/20 mt-1`}
                >
                  {avatar.emoji}
                </div>

                {/* Name */}
                <div className="w-full">
                  <div className="text-sm font-bold text-white truncate">
                    {player.username} {isMe && <span className="text-xs text-violet-400">(You)</span>}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{avatar.name}</div>
                </div>

                {/* Ready Status Chip */}
                <div className="mt-4 w-full">
                  {player.isHost ? (
                    <span className="inline-block w-full py-1 text-[11px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 rounded-lg">
                      Party Leader
                    </span>
                  ) : player.isReady ? (
                    <span className="inline-block w-full py-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                      Ready!
                    </span>
                  ) : (
                    <span className="inline-block w-full py-1 text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 rounded-lg">
                      Waiting...
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty Slot Placeholders */}
          {Array.from({ length: Math.max(0, roomState.config.maxPlayers - roomState.players.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-600 min-h-[180px]"
            >
              <Users className="w-8 h-8 stroke-1 mb-2 opacity-40" />
              <span className="text-xs font-medium">Open Slot</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reaction Deck */}
      <div className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Smile className="w-4 h-4 text-amber-400" />
          <span>Quick Taunts & Reactions:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {EMOJI_DECK.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                sounds.playClick();
                onSendReaction(emoji);
              }}
              className="text-xl p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:scale-125 hover:border-violet-500 active:scale-95 transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {!isHost && (
          <button
            onClick={() => {
              sounds.playClick();
              onToggleReady(!me?.isReady);
            }}
            className={`w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-xl font-bold text-sm transition-all shadow-lg font-arcade ${
              me?.isReady
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white neon-glow-cyan'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {me?.isReady ? "READY! (CLICK TO CANCEL)" : "I'M READY!"}
          </button>
        )}

        {isHost && (
          <button
            disabled={!canStart}
            onClick={() => {
              sounds.playClick();
              onStartGame();
            }}
            className={`w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-2 shadow-xl font-arcade ${
              canStart
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:brightness-110 active:scale-95 neon-glow-violet cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>START MATCH</span>
          </button>
        )}
      </div>

      {isHost && !canStart && (
        <p className="text-center text-xs text-amber-400 font-medium">
          Waiting for all players to tap "I'M READY!" before match can begin.
        </p>
      )}
    </div>
  );
};
