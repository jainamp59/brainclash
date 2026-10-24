import React, { useState } from 'react';
import { UserProfile } from '../types/game';
import { AVATARS, AvatarDefinition } from '../utils/avatars';
import { sounds } from '../utils/sound';
import { Sparkles, Trophy, Zap, Shield, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  currentUser: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ currentUser, onSaveProfile, onCancel }) => {
  const [username, setUsername] = useState(currentUser?.username || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState(currentUser?.avatarId || AVATARS[0].id);
  const [error, setError] = useState('');

  const selectedAvatar = AVATARS.find((a) => a.id === selectedAvatarId) || AVATARS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username');
      sounds.playError();
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 15) {
      setError('Username must be between 2 and 15 characters');
      sounds.playError();
      return;
    }

    sounds.playClick();

    const profile: UserProfile = {
      id: currentUser?.id || 'usr_' + Math.random().toString(36).substring(2, 9),
      username: trimmed,
      avatarId: selectedAvatarId,
      level: currentUser?.level || 1,
      xp: currentUser?.xp || 0,
      gamesPlayed: currentUser?.gamesPlayed || 0,
      wins: currentUser?.wins || 0,
      streak: currentUser?.streak || 1,
      lastPlayedDate: new Date().toISOString(),
      unlockedBadges: currentUser?.unlockedBadges || ['First Step'],
      soloPersonalBests: currentUser?.soloPersonalBests || {
        memory: { score: 0, medal: 'bronze' },
        logic: { score: 0, medal: 'bronze' },
        focus: { score: 0, medal: 'bronze' },
        speed: { score: 0, medal: 'bronze' },
        creativity: { score: 0, medal: 'bronze' },
        deduction: { score: 0, medal: 'bronze' },
        boss: { score: 0, medal: 'bronze' }
      }
    };

    onSaveProfile(profile);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-[#131B2E] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Neon accent glows */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-arcade">
              Player Identity
            </h1>
            <p className="text-sm text-slate-400">
              Pick your party handle and champion avatar to join the battle
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Your Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                maxLength={15}
                placeholder="e.g. BrainStormer"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-slate-500 text-lg"
              />
              {error && <p className="text-xs text-rose-400 mt-2 font-medium">{error}</p>}
            </div>

            {/* Avatar Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Select Your Mascot
                </label>
                <span className="text-xs text-slate-400 font-medium">
                  Selected: <span className="text-white font-bold">{selectedAvatar.name}</span> ·{' '}
                  <span className="text-violet-400">{selectedAvatar.trait}</span>
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {AVATARS.map((avatar: AvatarDefinition) => {
                  const isSelected = avatar.id === selectedAvatarId;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarId(avatar.id);
                        sounds.playClick();
                      }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-violet-500 bg-violet-950/40 neon-glow-violet scale-105'
                          : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-lg bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-xl mb-1.5 shadow-md`}
                      >
                        {avatar.emoji}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200 truncate w-full text-center">
                        {avatar.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Stats (if existing user) */}
            {currentUser && (
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Level</span>
                  <span className="text-base font-extrabold text-white font-mono">{currentUser.level}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Wins</span>
                  <span className="text-base font-extrabold text-cyan-400 font-mono">{currentUser.wins}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">{currentUser.streak} 🔥</span>
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <div className="flex items-center gap-3 pt-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-[2] py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white font-bold text-base hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 font-arcade"
              >
                <span>ENTER ARENA</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
