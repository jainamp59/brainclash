import React from 'react';
import { Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { sounds } from '../utils/sound';
import { UserProfile } from '../types/game';
import { getAvatarById } from '../utils/avatars';

interface TopBarProps {
  user: UserProfile | null;
  onOpenProfile: () => void;
  roomCode?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onOpenProfile, roomCode }) => {
  const [isMuted, setIsMuted] = React.useState(sounds.isMuted());

  const handleToggleSound = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
    if (!next) sounds.playClick();
  };

  const avatar = user ? getAvatarById(user.avatarId) : null;

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold tracking-tight text-white font-arcade">
            MIND<span className="text-cyan-400">CLASH</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">
            Party
          </span>
        </div>
      </div>

      {/* Zone 2: Room Status / Mode */}
      <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-400 whitespace-nowrap shrink-0">
        {roomCode ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700/80 rounded-lg">
            <span className="text-slate-400">Room Code:</span>
            <span className="font-mono font-bold text-cyan-400 tracking-wider text-sm">{roomCode}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>7 Mind Skills</span>
            <span aria-hidden="true">·</span>
            <span>2 to 5 Players</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Sync</span>
          </div>
        )}
      </div>

      {/* Zone 3: Actions (Sound & Profile) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {user ? (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-colors"
          >
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${avatar?.gradient} flex items-center justify-center text-xs shadow-sm`}>
              {avatar?.emoji}
            </div>
            <span className="text-xs font-semibold text-white whitespace-nowrap">{user.username}</span>
            <span className="text-[11px] font-mono font-bold text-violet-400 px-1.5 py-0.5 bg-violet-950/60 rounded">
              Lv.{user.level}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        )}
      </div>
    </header>
  );
};
