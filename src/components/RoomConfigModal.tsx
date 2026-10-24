import React, { useState } from 'react';
import { RoomConfig, LevelId } from '../types/game';
import { sounds } from '../utils/sound';
import { X, Check, Users, Clock, Zap, Flame, Brain, Eye, Compass, Palette, Key, Skull } from 'lucide-react';

interface RoomConfigModalProps {
  initialConfig?: RoomConfig;
  onSave: (config: RoomConfig) => void;
  onClose: () => void;
  isHost: boolean;
}

const LEVEL_METADATA: { id: LevelId; name: string; desc: string; icon: any; color: string }[] = [
  { id: 'memory', name: 'Memory', desc: 'Pattern echo & matrix recall', icon: Brain, color: 'text-violet-400' },
  { id: 'logic', name: 'Logic', desc: 'Odd one out & sequence cracks', icon: Compass, color: 'text-cyan-400' },
  { id: 'focus', name: 'Focus', desc: 'Spot glitch & Stroop laser clash', icon: Eye, color: 'text-emerald-400' },
  { id: 'speed', name: 'Speed', desc: 'Laser buzzer & rapid math duels', icon: Zap, color: 'text-amber-400' },
  { id: 'creativity', name: 'Creativity', desc: 'Anagram alchemy & prompt sketch', icon: Palette, color: 'text-pink-400' },
  { id: 'deduction', name: 'Deduction', desc: 'Truth vs bluff & impostor clue', icon: Key, color: 'text-indigo-400' },
  { id: 'boss', name: 'Boss Gauntlet', desc: 'Fused skills on 2x tempo and score', icon: Skull, color: 'text-rose-400' }
];

export const RoomConfigModal: React.FC<RoomConfigModalProps> = ({ initialConfig, onSave, onClose, isHost }) => {
  const [maxPlayers, setMaxPlayers] = useState(initialConfig?.maxPlayers || 5);
  const [levels, setLevels] = useState<LevelId[]>(
    initialConfig?.levels || ['memory', 'logic', 'focus', 'speed', 'creativity', 'deduction', 'boss']
  );
  const [roundDuration, setRoundDuration] = useState(initialConfig?.roundDuration || 15);
  const [powerUpsEnabled, setPowerUpsEnabled] = useState(initialConfig?.powerUpsEnabled ?? true);
  const [difficulty, setDifficulty] = useState<'normal' | 'hard'>(initialConfig?.difficulty || 'normal');

  const toggleLevel = (id: LevelId) => {
    if (!isHost) return;
    sounds.playClick();
    if (levels.includes(id)) {
      if (levels.length === 1) return; // Keep at least 1 level
      setLevels(levels.filter((l) => l !== id));
    } else {
      setLevels([...levels, id]);
    }
  };

  const handleSave = () => {
    sounds.playClick();
    onSave({
      maxPlayers,
      levels,
      roundDuration,
      powerUpsEnabled,
      difficulty
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-[#131B2E] border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white font-arcade">Custom Room Settings</h2>
            <p className="text-xs text-slate-400">Configure players, levels playlist, and timer</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Max Players */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Max Players (2 to 5)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={!isHost}
                  onClick={() => {
                    setMaxPlayers(n);
                    sounds.playClick();
                  }}
                  className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                    maxPlayers === n
                      ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 neon-glow-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {n} Players
                </button>
              ))}
            </div>
          </div>

          {/* Level Selection Playlist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Brain className="w-4 h-4 text-violet-400" />
                <span>Level Playlist ({levels.length} Selected)</span>
              </label>
              {isHost && (
                <button
                  type="button"
                  onClick={() => {
                    setLevels(['memory', 'logic', 'focus', 'speed', 'creativity', 'deduction', 'boss']);
                    sounds.playClick();
                  }}
                  className="text-[11px] text-violet-400 hover:underline"
                >
                  Select All
                </button>
              )}
            </div>

            <div className="space-y-2">
              {LEVEL_METADATA.map((lvl) => {
                const isSelected = levels.includes(lvl.id);
                const Icon = lvl.icon;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    disabled={!isHost}
                    onClick={() => toggleLevel(lvl.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-violet-500/80 bg-violet-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${lvl.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{lvl.name}</div>
                        <div className="text-xs text-slate-400">{lvl.desc}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'border-violet-500 bg-violet-600 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Round Timer */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Mini-Round Duration</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 25].map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={!isHost}
                  onClick={() => {
                    setRoundDuration(s);
                    sounds.playClick();
                  }}
                  className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                    roundDuration === s
                      ? 'border-amber-500 bg-amber-950/50 text-amber-300 neon-glow-amber'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {s}s Fast
                </button>
              ))}
            </div>
          </div>

          {/* Power-ups & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!isHost}
              onClick={() => {
                setPowerUpsEnabled(!powerUpsEnabled);
                sounds.playClick();
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                powerUpsEnabled
                  ? 'border-violet-500 bg-violet-950/40 text-white'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              <div className="text-xs uppercase font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Power-Ups</span>
              </div>
              <div className="text-sm font-bold text-white">
                {powerUpsEnabled ? 'Enabled (Freeze, 2x, Hint)' : 'Disabled'}
              </div>
            </button>

            <button
              type="button"
              disabled={!isHost}
              onClick={() => {
                setDifficulty(difficulty === 'normal' ? 'hard' : 'normal');
                sounds.playClick();
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                difficulty === 'hard'
                  ? 'border-rose-500 bg-rose-950/40 text-rose-300'
                  : 'border-slate-800 bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs uppercase font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Difficulty</span>
              </div>
              <div className="text-sm font-bold text-white uppercase">{difficulty}</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          {isHost && (
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-md shadow-violet-600/30"
            >
              Apply Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
