import React, { useState } from 'react';
import { UserProfile, LevelId } from '../types/game';
import { sounds } from '../utils/sound';
import { getAvatarById } from '../utils/avatars';
import {
  Users,
  Play,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Brain,
  Compass,
  Eye,
  Zap,
  Palette,
  Key,
  Skull,
  Settings
} from 'lucide-react';

interface HubScreenProps {
  user: UserProfile;
  onJoinRoom: (code: string) => void;
  onCreateRoom: () => void;
  onStartSolo: (levelId: LevelId) => void;
  onOpenProfile: () => void;
}

const LEVEL_TILES: { id: LevelId; title: string; subtitle: string; icon: any; color: string; border: string }[] = [
  { id: 'memory', title: 'Memory', subtitle: 'Pattern Echo & Matrix Recall', icon: Brain, color: 'text-violet-400 bg-violet-950/40', border: 'border-violet-500/30 hover:border-violet-500' },
  { id: 'logic', title: 'Logic', subtitle: 'Odd One Out & Sequence Cracker', icon: Compass, color: 'text-cyan-400 bg-cyan-950/40', border: 'border-cyan-500/30 hover:border-cyan-500' },
  { id: 'focus', title: 'Focus', subtitle: 'Spot Glitch & Stroop Laser', icon: Eye, color: 'text-emerald-400 bg-emerald-950/40', border: 'border-emerald-500/30 hover:border-emerald-500' },
  { id: 'speed', title: 'Speed', subtitle: 'Laser Buzzer & Lightning Math', icon: Zap, color: 'text-amber-400 bg-amber-950/40', border: 'border-amber-500/30 hover:border-amber-500' },
  { id: 'creativity', title: 'Creativity', subtitle: 'Anagrams & Concept Links', icon: Palette, color: 'text-pink-400 bg-pink-950/40', border: 'border-pink-500/30 hover:border-pink-500' },
  { id: 'deduction', title: 'Deduction', subtitle: 'Who is Bluffing? & Code Breaker', icon: Key, color: 'text-indigo-400 bg-indigo-950/40', border: 'border-indigo-500/30 hover:border-indigo-500' },
  { id: 'boss', title: 'Boss Gauntlet', subtitle: 'Fused Skills on 2x Points', icon: Skull, color: 'text-rose-400 bg-rose-950/40', border: 'border-rose-500/30 hover:border-rose-500' }
];

export const HubScreen: React.FC<HubScreenProps> = ({
  user,
  onJoinRoom,
  onCreateRoom,
  onStartSolo,
  onOpenProfile
}) => {
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const avatar = getAvatarById(user.avatarId);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = joinCode.trim().toUpperCase();
    if (!clean || clean.length < 3) {
      setJoinError('Enter a valid room code');
      sounds.playError();
      return;
    }
    sounds.playClick();
    onJoinRoom(clean);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-950/80 via-[#131B2E] to-slate-900 border border-violet-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-4xl shadow-xl border-2 border-white/20`}
            >
              {avatar.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-arcade">
                  Welcome, {user.username}!
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-md border border-violet-500/30">
                  Lv.{user.level}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Mascot: <span className="text-slate-200 font-semibold">{avatar.name}</span> · {avatar.trait}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold">{user.streak} Day Streak</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400 font-bold">{user.wins} Wins</span>
                <span aria-hidden="true">·</span>
                <span className="text-violet-300 font-bold">{user.xp} XP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                sounds.playClick();
                onCreateRoom();
              }}
              className="flex-1 md:flex-initial py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 font-arcade"
            >
              <Users className="w-4 h-4" />
              <span>CREATE CUSTOM ROOM</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenProfile();
              }}
              title="Edit Profile"
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Action Grid: Quick Join & Daily Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Join via Room Code */}
        <div className="md:col-span-1 bg-[#131B2E] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-arcade mb-1">Join Party Room</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your friends' 4-letter room code to jump straight into their lobby.
            </p>

            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setJoinError('');
                }}
                maxLength={4}
                placeholder="ROOM CODE (e.g. MIND)"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-center font-mono font-bold text-xl tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600"
              />
              {joinError && <p className="text-xs text-rose-400 font-medium">{joinError}</p>}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all shadow-md shadow-cyan-600/30 flex items-center justify-center gap-2"
              >
                <span>JOIN ROOM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Card 2: Daily Challenge */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#131B2E] to-violet-950/30 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                    Daily Mental Workout
                  </span>
                  <h3 className="text-lg font-bold text-white font-arcade">Daily Synapse Surge</h3>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400 px-3 py-1 bg-amber-950/60 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>+300 XP Bonus</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Complete today's featured challenge: <strong>Level 1 Memory Recall</strong>. Score at least 850 points
              to extend your streak and claim daily cosmetic unlocks!
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <div className="text-xs text-slate-400">
              Target: <span className="text-white font-mono font-bold">850 Pts</span> · Reward: <span className="text-cyan-400 font-bold">Gold Brain Badge</span>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onStartSolo('memory');
              }}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-md shadow-amber-500/20 font-arcade"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>PLAY DAILY TRIAL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Solo Practice Mode: 7 Mind Skills with Medal Tiers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white font-arcade">Solo Time-Attack Trials</h2>
            <p className="text-xs text-slate-400">
              Practice any mind skill alone to unlock Bronze, Silver, Gold, and Grandmaster medals
            </p>
          </div>
          <span className="text-xs text-slate-400">Offline Ready · Personal Bests</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEVEL_TILES.map((tile) => {
            const Icon = tile.icon;
            const pb = user.soloPersonalBests?.[tile.id] || { score: 0, medal: 'bronze' };
            const isBoss = tile.id === 'boss';

            return (
              <div
                key={tile.id}
                className={`bg-[#131B2E] border ${tile.border} rounded-2xl p-5 flex flex-col justify-between transition-all group hover:scale-[1.02] shadow-lg`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tile.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isBoss ? (
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 px-2 py-0.5 bg-rose-950/60 rounded border border-rose-500/40">
                        2x Points
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span className="capitalize font-bold text-white">{pb.medal}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white font-arcade group-hover:text-cyan-300 transition-colors">
                    {tile.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 mb-4 leading-normal">
                    {tile.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    PB: <span className="font-mono font-bold text-slate-200">{pb.score}</span>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onStartSolo(tile.id);
                    }}
                    className="py-1.5 px-3.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-white group-hover:bg-violet-600 group-hover:border-violet-500 transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Train</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
