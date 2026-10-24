export type LevelId = 'memory' | 'logic' | 'focus' | 'speed' | 'creativity' | 'deduction' | 'boss';

export type GameStatus =
  | 'AUTH'
  | 'HUB'
  | 'LOBBY'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'ROUND_SUMMARY'
  | 'MATCH_OVER';

export interface PowerUpInventory {
  freeze: number;
  double: number;
  hint: number;
}

export interface Player {
  id: string;
  username: string;
  avatarId: string;
  score: number;
  roundScore: number;
  isReady: boolean;
  isHost: boolean;
  combo: number;
  powerUps: PowerUpInventory;
  hasAnswered: boolean;
  lastAnswerCorrect?: boolean;
  answerTimeMs?: number;
  activeEffects: {
    isFrozen?: boolean;
    hasDouble?: boolean;
  };
}

export interface RoomConfig {
  maxPlayers: number;
  levels: LevelId[];
  roundDuration: number; // in seconds
  powerUpsEnabled: boolean;
  difficulty: 'normal' | 'hard';
}

export interface RoundQuestion {
  levelId: LevelId;
  roundNumber: number; // 1, 2, or 3
  title: string;
  instructions: string;
  data: any; // specific mini-game question data
}

export interface RoomState {
  roomCode: string;
  hostId: string;
  players: Player[];
  config: RoomConfig;
  status: GameStatus;
  currentLevelIndex: number;
  currentRound: number;
  timerSeconds: number;
  totalRoundsPerLevel: number;
  currentQuestion?: RoundQuestion;
  roundWinners?: { playerId: string; username: string; points: number }[];
}

export interface FloatingReaction {
  id: string;
  playerId: string;
  emoji: string;
  x: number;
  y: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarId: string;
  level: number;
  xp: number;
  gamesPlayed: number;
  wins: number;
  streak: number;
  lastPlayedDate: string;
  unlockedBadges: string[];
  soloPersonalBests: Record<LevelId, { score: number; medal: 'bronze' | 'silver' | 'gold' | 'grandmaster' }>;
}
