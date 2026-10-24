# MindClash: Multiplayer Brain-Party Game

A vibrant, cheerful, multi-discipline party game where 2 to 5 players face off across 7 distinct cognitive dimensions—from memory grids and rapid logic to speed duels and deduction bluffing—featuring real-time room synchronization, power-ups, solo time-attack trials, and celebratory podium finishes.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following core design decisions have been established and aligned with your answers:
> - **Game Identity**: **MindClash**—punchy, energetic, non-stressful brain-party competition.
> - **Aesthetic Direction**: **Vibrant Neon Arcade**—deep midnight canvas (`#0B0F19`), neon electric violet (`#8B5CF6`), laser cyan (`#06B6D4`), solar amber (`#F59E0B`), high-contrast typography, and playful micro-animations.
> - **Solo Mode Architecture**: **Pure Solo Time-Attack** with Bronze, Silver, Gold, and Grandmaster medal tiers, personal best splits, and daily challenge streaks when playing solo.
> - **Multiplayer Engine**: Full-stack Node.js WebSocket room-based synchronization with server-authoritative timers, room codes, live emoji reactions, and smooth reconnection handling.
> - **Execution Roadmap**: In accordance with your request, we first deliver Steps 1 & 2 (Game Design Document + Screen Wireframes). Once you approve this plan, we proceed directly to Step 3 (Folder & State Architecture) and Step 4 (Multiplayer Lobby + Level 1 Memory Level), followed by progressive level expansion.

---

## 1. Overview & Core Concept

### What It Does
MindClash turns mental agility into a joyful multiplayer living-room party. Up to 5 friends join via custom room code or direct link. The game cycles through a customizable playlist of levels, each testing a fundamentally different cognitive skill across 3 rapid escalating mini-rounds:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE 7 MINDCLASH LEVELS                          │
├───────────────────┬────────────────────────────────────────────────────┤
│ 1. Memory         │ Pattern Echo & Color Matrix Recall                 │
│ 2. Logic          │ Fast Sequence Crack, Odd One Out & Visual Riddles  │
│ 3. Focus          │ Spot the Glitch, Hidden Glyphs & Distraction Dodge │
│ 4. Speed          │ Instant Math Duels & Reflex Flash Triggers         │
│ 5. Creativity     │ Quick Doodle Canvas & Guess / Word Alchemy         │
│ 6. Deduction      │ "Who is Bluffing?" Impostor Clue Mini-Game         │
│ 7. Boss Gauntlet  │ All skills fused at double tempo & 2x score surge  │
└───────────────────┴────────────────────────────────────────────────────┘
```

### Game Feel & Rules
- **Non-Stressful Pace**: Short, bite-sized 12–25s rounds with upbeat audio cues, forgiving comeback power-ups, and celebratory animations so anyone can win.
- **Fair Scoring Formula**: Points are calculated as `Base Points (100) + Speed Bonus (up to 150 based on remaining milliseconds) * Accuracy Multiplier`. Streak combos reward consecutive correct answers.
- **Dynamic Power-Ups**:
  - ❄️ **Time Freeze**: Temporarily slows down rival countdown clocks for 3 seconds.
  - ⚡ **Double Spark**: Multiplies your next mini-round points by 2x.
  - 💡 **Clarity Beacon**: Automatically eliminates 50% of incorrect options or reveals a subtle hint.
- **Solo Time-Attack**: When practicing offline or alone, players race against target par times to unlock shiny medals, earn XP, and build their daily streak.

---

## 2. Detailed Level Design & Round Mechanics

Every level features **3 escalating mini-rounds** with rising difficulty:

### Level 1: Memory (Pattern Echo & Matrix Recall)
- **Round 1 (Echo Lights)**: A 3x3 neon grid lights up a sequence of 4 tiles. Players repeat the sequence.
- **Round 2 (Color Swap)**: 6 colored cards flash for 3 seconds, flip face-down, and players must identify which two swapped positions.
- **Round 3 (Dual Memory Matrix)**: A 4x4 grid flashes 5 target symbols. After a 2-second blanking phase, players must tap only the activated cells.

### Level 2: Logic (Odd One Out & Sequence Cracker)
- **Round 1 (Odd One Out)**: 4 abstract geometric shapes are displayed; players identify which shape breaks the symmetry or rule (e.g., number of corners, color complement).
- **Round 2 (Number & Glyph Sequence)**: Quick logical progression (e.g., `3 -> 7 -> 15 -> 31 -> ?` or rotating directional clock hands).
- **Round 3 (Micro Riddle Duel)**: 1-sentence brain twister with 4 rapid button choices (e.g., "I speak without a mouth and hear without ears...").

### Level 3: Focus (Spot the Glitch & Distraction Dodge)
- **Round 1 (Spot the Glitch)**: Two side-by-side neon illustrations appear with 3 tiny differences. First player to tap the discrepancy scores highest.
- **Round 2 (Hidden Glyph Hunt)**: A crowded tapestry of vibrant icons; players have 10 seconds to locate the designated mystery icon.
- **Round 3 (Stroop Laser Challenge)**: Words like "RED" printed in blue ink flash across screen with floating animated distraction orbs. Players must match the ink color, not the word text.

### Level 4: Speed (Reflex Tap & Rapid Math)
- **Round 1 (Reflex Laser Tap)**: Screen waits on a random tension delay (1.5s–4s). The millisecond "TAP NOW!" flashes in cyan, players hit their buzzer.
- **Round 2 (Lightning Mental Math)**: Rapid arithmetic (`17 + 28 - 9 = ?`) with 4 answer choices.
- **Round 3 (Color Rush Tap)**: Players must tap 6 numbered bubbles in ascending numerical order as fast as humanly possible while they float on the canvas.

### Level 5: Creativity (Doodle Canvas & Word Guess)
- **Round 1 (Prompt Sketcher)**: One player (or solo prompt) gets a secret word (e.g., "Submarine", "Rocket") and 15 seconds on a lightweight SVG sketchpad.
- **Round 2 (Word Alchemy)**: Unscramble an anagram with letter tiles under time pressure.
- **Round 3 (Caption Clash)**: A quirky neon mascot scenario appears; players pick or vote for the wittiest answer.

### Level 6: Deduction (Who is Bluffing?)
- **Round 1 (Odd Fact / Bluff)**: 3 statements are given; players deduce which one is fabricated.
- **Round 2 (The Secret Word Impostor)**: In multiplayer, 4 players receive the word "Astronaut", while 1 player is the Impostor with "Alien". Players vote on who gave the suspicious clue.
- **Round 3 (Code Breaker)**: Mastermind-style deduction with 3 digit attempts (green = correct place, yellow = wrong place).

### Level 7: Boss Level (The Synapse Gauntlet)
- **Round 1 (Memory + Speed)**: 5-step rapid Simon-pattern on a 10-second turbo clock.
- **Round 2 (Logic + Focus)**: Multi-layered pattern search with vibrating neon distortions.
- **Round 3 (Double Point Sudden Death)**: Multi-tier question where speed and accuracy earn 200% points, triggering dramatic screen shake and particle bursts!

---

## 3. Screen List & UI Layout Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MINDCLASH SCREEN FLOW                           │
├───────────────┬────────────────────────────────────────────────────────┤
│ Screen 1:     │ Auth & Avatar Studio (Username, Avatar Selector, XP)   │
│ Screen 2:     │ Party Hub (Join Room, Create Custom Room, Solo Attack) │
│ Screen 3:     │ Custom Room Configurator (Host sets levels, timers)    │
│ Screen 4:     │ Multiplayer Match Lobby (Ready, Chat, Emoji Taunts)    │
│ Screen 5:     │ Active Game Arena (HUD, Mini-Game Canvas, Power-ups)   │
│ Screen 6:     │ Inter-Round Live Leaderboard & Standings               │
│ Screen 7:     │ Champion Victory Podium, Badges & Play Again           │
└───────────────┴────────────────────────────────────────────────────────┘
```

### Screen 1: Auth & Avatar Studio
- **Top Zone**: Minimalist brand mark `MindClash` in bold geometric display typography with vibrant purple-cyan glow.
- **Center Stage**:
  - Interactive Avatar Picker: 12 hand-crafted vector avatars (Cyber Fox, Neon Cat, Robo Brain, Cosmic Owl, Pixel Bear, Turbo Monkey, etc.).
  - Username input with instant real-time uniqueness validation.
  - Badge and level display for returning players stored in `localStorage`.
- **Primary CTA**: "Enter the Arena" button with subtle glow and sound click.

### Screen 2: Party Hub & Daily Challenge
- **Header**: Player badge, avatar pill, current win streak 🔥, and Web Audio sound toggle (`Mute / Unmute`).
- **3 Action Pillars**:
  1. **Quick Join**: Enter a 4-letter Room Code (e.g. `CLSH`).
  2. **Create Room**: Launch custom party with customizable rules.
  3. **Solo Time-Attack**: Select any unlocked skill level to chase personal bests and medal tiers.
- **Daily Challenge Banner**: Daily cognitive workout with bonus XP and streak tracker.

### Screen 3: Custom Room Configurator (Host Only)
- **Room Code & Link Copy**: 1-click invite link with native clipboard copy toast.
- **Room Controls**:
  - Max Players: Stepper (2 to 5 players).
  - Level Playlist: Multi-select toggles for each of the 7 levels (Memory, Logic, Focus, Speed, Creativity, Deduction, Boss).
  - Round Timer: Slider (10s, 15s, 20s, 25s per mini-round).
  - Power-Ups: Toggle on/off.
  - Difficulty: Normal or Hardcore.
- **Action**: "Open Lobby" button.

### Screen 4: Multiplayer Match Lobby
- **Room Banner**: Big room code display `ROOM: #K9X2`, share button, and connected player counter (e.g., `3/5 Players`).
- **Player Podium Cards**: Grid showing each connected player's avatar, name, host crown 👑, and "READY" badge with green neon illumination.
- **Interactive Quick Chat & Emoji Deck**: Fast reaction buttons (🎉, 🧠, ⚡, 🔥, 💀, 😜) that pop floating emojis over players' avatars in real-time.
- **Host Control**: "START GAME" button (enabled when at least 2 players are ready, or immediately in practice mode).

### Screen 5: Active Game Arena
- **Top Perimeter HUD (15% height)**:
  - Left: Level name & mini-round indicator (e.g. `LEVEL 1: MEMORY · ROUND 2/3`).
  - Center: Large high-visibility SVG circular/linear countdown timer with color shift (`Cyan -> Amber -> Pulse Red`).
  - Right: Player's current score (`tabular-nums`) and active combo streak.
- **Central Playfield (Unobstructed 85% area)**:
  - Clean responsive canvas/grid matching the current active mini-game.
  - Instant visual feedback: squash-and-stretch on click, green ripple on correct, gentle camera shake on mistake.
- **Bottom Power-Up Dock**:
  - Quick action buttons for unlocked power-ups (Freeze, 2x Points, Hint) with keyboard shortcuts (Keys 1, 2, 3).
- **Rival Mini-Ticker**: Minimalist live progress bar showing other players' current round completion percentage.

### Screen 6: Inter-Round Live Leaderboard
- Appears for 4 seconds between mini-rounds:
  - Ranked bar list showing position changes (`▲ +1`, `▼ -1`).
  - Animated score increments with sound chime.
  - Next round preview card showing which mind skill is incoming.

### Screen 7: Champion Victory Podium & Rewards
- **Trophy Podium**: Gold (1st), Silver (2nd), and Bronze (3rd) pedestals with particle confetti showers.
- **Performance Breakdown**: Most accurate player ("Brainiac"), fastest fingers ("Lightning Speed"), best bluffer ("Sneak King").
- **Badge Unlocks**: Experience points awarded, level-ups, and unlocked new avatar cosmetics.
- **Dual Actions**: "Play Again (Same Room)" and "Back to Hub".

---

## 4. Technical Architecture & Component Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MINDCLASH ARCHITECTURE                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   CLIENT (Vite + React 19 + Tailwind CSS + Web Audio Synth)            │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │ App.tsx (Root View Manager & WebSocket Context Provider)     │     │
│   └──────┬───────────────────────┬───────────────────────────────┘     │
│          │                       │                                     │
│   ┌──────▼────────┐       ┌──────▼────────┐      ┌───────────────┐     │
│   │  Auth & Hub   │       │  Lobby Room   │      │ Game Arena    │     │
│   │  - Profile    │       │  - Code Sync  │      │ - HUD & Timer │     │
│   │  - Avatar     │       │  - Ready State│      │ - 7 Skill UIs │     │
│   │  - Solo Play  │       │  - Emoji Chat │      │ - Power-Up Bar│     │
│   └───────────────┘       └───────────────┘      └───────┬───────┘     │
│                                                          │             │
│   ┌──────────────────────────────────────────────────────▼───────┐     │
│   │ Web Audio Sound Engine (Synthesized 8-bit & chime sounds)    │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                  │ (WebSocket Events)                  │
│                                  ▼                                     │
│   SERVER (Express + ws/Socket.io WebSocket Handler)                    │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │ server.ts: HTTP dev server + WebSocket room manager          │     │
│   ├──────────────────────────────────────────────────────────────┤     │
│   │ - Room registry: Map<roomId, RoomState>                      │     │
│   │ - Authoritative timer & level progression                    │     │
│   │ - Score aggregation & broadcast sync                         │     │
│   │ - Disconnect & reconnect grace period                        │     │
│   └──────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────┘
```

### State Management & Entities
- **Player**: `{ id, username, avatarId, score, isReady, isHost, combo, powerUps }`
- **Room**: `{ roomCode, hostId, players: Player[], config: RoomConfig, status: 'LOBBY'|'COUNTDOWN'|'PLAYING'|'ROUND_END'|'MATCH_END', currentLevelIndex, currentRound, timerSeconds }`
- **RoomConfig**: `{ maxPlayers: 2..5, levels: string[], roundDuration: number, powerUpsEnabled: boolean, difficulty: 'normal'|'hard' }`

### Procedural Web Audio Engine
No external audio files needed! All game sounds are synthesized directly using browser Web Audio API:
- `playTone(freq, duration, type)`: Snappy button clicks and navigation ticks.
- `playSuccess()`: Ascending major chord fanfare for correct answers.
- `playError()`: Gentle low buzz on incorrect attempts.
- `playPowerUp()`: Sweeping resonant frequency filter whoosh.
- `playVictory()`: Celebratory arpeggio sequence for podium celebration.

---

## 5. Implementation Sequence

- **Step 1 & 2 (This Turn)**: Game Design Document & Screen UI Wireframes documented and submitted for user approval.
- **Step 3 (Post-Approval)**: Clean directory setup, type definitions (`types.ts`), Web Audio synthesis engine (`sound.ts`), and server-side WebSocket room manager in `server.ts`.
- **Step 4 (Post-Approval)**: Complete implementation of Screen 1 (Auth/Avatar), Screen 2 (Party Hub), Screen 4 (Multiplayer Lobby with real-time sync, ready toggles, and emoji reactions), and **Level 1 (Memory Level)** with all 3 mini-rounds + Solo Practice mode.
- **Step 5**: Rollout of Levels 2 through 7 (Logic, Focus, Speed, Creativity, Deduction, Boss) with full mini-rounds.
- **Step 6**: Comprehensive verification, test suite run, and free deployment guide (Cloud Run / Vercel / Render).
