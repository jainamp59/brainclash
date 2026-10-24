export interface AvatarDefinition {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  glowColor: string;
  textColor: string;
  trait: string;
}

export const AVATARS: AvatarDefinition[] = [
  {
    id: 'cyber-fox',
    name: 'Cyber Fox',
    emoji: '🦊',
    gradient: 'from-amber-500 to-rose-500',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    textColor: 'text-amber-400',
    trait: 'Nimble & Quick'
  },
  {
    id: 'neon-cat',
    name: 'Neon Cat',
    emoji: '🐱',
    gradient: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    textColor: 'text-cyan-400',
    trait: 'Sharp Reflexes'
  },
  {
    id: 'robo-brain',
    name: 'Synapse Bot',
    emoji: '🧠',
    gradient: 'from-purple-500 to-indigo-600',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    textColor: 'text-purple-400',
    trait: 'Pure Logic'
  },
  {
    id: 'cosmic-owl',
    name: 'Cosmic Owl',
    emoji: '🦉',
    gradient: 'from-violet-600 to-fuchsia-600',
    glowColor: 'rgba(192, 38, 211, 0.4)',
    textColor: 'text-fuchsia-400',
    trait: 'Total Recall'
  },
  {
    id: 'turbo-panda',
    name: 'Turbo Panda',
    emoji: '🐼',
    gradient: 'from-emerald-400 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    textColor: 'text-emerald-400',
    trait: 'Zen Precision'
  },
  {
    id: 'volt-rabbit',
    name: 'Volt Rabbit',
    emoji: '⚡',
    gradient: 'from-yellow-400 to-amber-600',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    textColor: 'text-yellow-400',
    trait: 'Light Speed'
  },
  {
    id: 'pixel-octopus',
    name: 'Octo Matrix',
    emoji: '🐙',
    gradient: 'from-pink-500 to-rose-600',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    textColor: 'text-rose-400',
    trait: 'Multitasker'
  },
  {
    id: 'solar-lion',
    name: 'Solar Lion',
    emoji: '🦁',
    gradient: 'from-orange-500 to-amber-600',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    textColor: 'text-orange-400',
    trait: 'Fearless Focus'
  },
  {
    id: 'matrix-frog',
    name: 'Matrix Frog',
    emoji: '🐸',
    gradient: 'from-lime-400 to-emerald-600',
    glowColor: 'rgba(132, 204, 22, 0.4)',
    textColor: 'text-lime-400',
    trait: 'Pattern Leaper'
  },
  {
    id: 'aurora-unicorn',
    name: 'Aurora Unicorn',
    emoji: '🦄',
    gradient: 'from-teal-400 to-indigo-600',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    textColor: 'text-teal-300',
    trait: 'Wild Vision'
  },
  {
    id: 'shadow-raccoon',
    name: 'Shadow Raccoon',
    emoji: '🦝',
    gradient: 'from-slate-600 to-slate-900',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    textColor: 'text-slate-300',
    trait: 'Master Detective'
  },
  {
    id: 'stellar-alien',
    name: 'Nova Alien',
    emoji: '👽',
    gradient: 'from-cyan-500 to-emerald-500',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    textColor: 'text-cyan-300',
    trait: 'Alien Intellect'
  }
];

export function getAvatarById(id: string): AvatarDefinition {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}
