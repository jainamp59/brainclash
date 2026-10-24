import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { LevelId, Player, RoomConfig, RoomState, GameStatus, RoundQuestion } from './src/types/game.js';
import { generateQuestionForLevel } from './src/levels/questionGenerators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = Number(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());

interface ClientConnection {
  ws: WebSocket;
  playerId: string;
  roomCode?: string;
  lastActive: number;
}

interface ServerRoom {
  state: RoomState;
  clients: Map<string, WebSocket>;
  roundTimerInterval?: NodeJS.Timeout;
  transitionTimeout?: NodeJS.Timeout;
}

const rooms = new Map<string, ServerRoom>();
const connections = new Map<WebSocket, ClientConnection>();

// Generate 4-letter uppercase room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

function broadcastToRoom(room: ServerRoom, type: string, payload: any) {
  const message = JSON.stringify({ type, payload });
  room.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

function broadcastRoomState(room: ServerRoom) {
  broadcastToRoom(room, 'S2C_ROOM_STATE', room.state);
}

function startRoundTimer(room: ServerRoom) {
  if (room.roundTimerInterval) {
    clearInterval(room.roundTimerInterval);
  }

  room.state.timerSeconds = room.state.config.roundDuration;
  broadcastRoomState(room);

  room.roundTimerInterval = setInterval(() => {
    room.state.timerSeconds -= 1;

    broadcastToRoom(room, 'S2C_TICK', { timerSeconds: room.state.timerSeconds });

    // Check if time expired or all answered
    const allAnswered = room.state.players.every((p) => p.hasAnswered);

    if (room.state.timerSeconds <= 0 || allAnswered) {
      clearInterval(room.roundTimerInterval);
      room.roundTimerInterval = undefined;
      finishMiniRound(room);
    }
  }, 1000);
}

function finishMiniRound(room: ServerRoom) {
  room.state.status = 'ROUND_SUMMARY';

  // Compute round winners and points
  const roundResults = room.state.players.map((p) => {
    return {
      playerId: p.id,
      username: p.username,
      points: p.roundScore,
      isCorrect: p.lastAnswerCorrect || false
    };
  });

  room.state.roundWinners = roundResults;
  broadcastRoomState(room);

  // 4 second summary view, then advance
  room.transitionTimeout = setTimeout(() => {
    advanceToNextRoundOrLevel(room);
  }, 4000);
}

function advanceToNextRoundOrLevel(room: ServerRoom) {
  // Reset per-round player flags
  room.state.players.forEach((p) => {
    p.hasAnswered = false;
    p.roundScore = 0;
    p.lastAnswerCorrect = undefined;
    p.activeEffects = {};
  });

  if (room.state.currentRound < room.state.totalRoundsPerLevel) {
    // Next mini-round in same level
    room.state.currentRound += 1;
    const currentLevelId = room.state.config.levels[room.state.currentLevelIndex];
    room.state.currentQuestion = generateQuestionForLevel(currentLevelId, room.state.currentRound);
    room.state.status = 'PLAYING';
    startRoundTimer(room);
  } else {
    // Check if more levels in playlist
    if (room.state.currentLevelIndex + 1 < room.state.config.levels.length) {
      room.state.currentLevelIndex += 1;
      room.state.currentRound = 1;
      const nextLevelId = room.state.config.levels[room.state.currentLevelIndex];
      room.state.currentQuestion = generateQuestionForLevel(nextLevelId, 1);
      room.state.status = 'PLAYING';
      startRoundTimer(room);
    } else {
      // Game Over! Match Over
      room.state.status = 'MATCH_OVER';
      // Sort players by final score
      room.state.players.sort((a, b) => b.score - a.score);
      broadcastRoomState(room);
    }
  }
}

// WebSocket message handling
wss.on('connection', (ws: WebSocket) => {
  const client: ClientConnection = {
    ws,
    playerId: 'usr_' + Math.random().toString(36).substring(2, 9),
    lastActive: Date.now()
  };
  connections.set(ws, client);

  ws.on('message', (raw: string) => {
    try {
      const { type, payload } = JSON.parse(raw);
      client.lastActive = Date.now();

      switch (type) {
        case 'C2S_JOIN_ROOM': {
          let roomCode = (payload.roomCode || '').toUpperCase().trim();
          let isNew = false;

          if (!roomCode || roomCode === 'NEW') {
            roomCode = generateRoomCode();
            isNew = true;
          }

          let room = rooms.get(roomCode);
          if (!room) {
            const defaultLevels: LevelId[] = ['memory', 'logic', 'focus', 'speed', 'creativity', 'deduction', 'boss'];
            room = {
              state: {
                roomCode,
                hostId: client.playerId,
                players: [],
                config: {
                  maxPlayers: 5,
                  levels: defaultLevels,
                  roundDuration: 15,
                  powerUpsEnabled: true,
                  difficulty: 'normal'
                },
                status: 'LOBBY',
                currentLevelIndex: 0,
                currentRound: 1,
                timerSeconds: 15,
                totalRoundsPerLevel: 3
              },
              clients: new Map()
            };
            rooms.set(roomCode, room);
          }

          // Check if room is full or in progress
          if (room.state.players.length >= room.state.config.maxPlayers && !room.state.players.some((p) => p.id === client.playerId)) {
            ws.send(JSON.stringify({ type: 'S2C_ERROR', payload: { message: 'Room is full! Max 5 players.' } }));
            return;
          }

          client.roomCode = roomCode;
          room.clients.set(client.playerId, ws);

          // Add or update player
          let player = room.state.players.find((p) => p.id === client.playerId);
          if (!player) {
            player = {
              id: client.playerId,
              username: payload.username || 'Brainiac',
              avatarId: payload.avatarId || 'cyber-fox',
              score: 0,
              roundScore: 0,
              isReady: false,
              isHost: room.state.players.length === 0,
              combo: 0,
              powerUps: { freeze: 1, double: 1, hint: 1 },
              hasAnswered: false,
              activeEffects: {}
            };
            room.state.players.push(player);
          } else {
            player.username = payload.username || player.username;
            player.avatarId = payload.avatarId || player.avatarId;
          }

          broadcastRoomState(room);
          break;
        }

        case 'C2S_SET_READY': {
          if (!client.roomCode) return;
          const room = rooms.get(client.roomCode);
          if (!room) return;

          const player = room.state.players.find((p) => p.id === client.playerId);
          if (player) {
            player.isReady = Boolean(payload.isReady);
            broadcastRoomState(room);
          }
          break;
        }

        case 'C2S_UPDATE_CONFIG': {
          if (!client.roomCode) return;
          const room = rooms.get(client.roomCode);
          if (!room || room.state.hostId !== client.playerId) return;

          room.state.config = {
            ...room.state.config,
            ...payload.config
          };
          broadcastRoomState(room);
          break;
        }

        case 'C2S_START_GAME': {
          if (!client.roomCode) return;
          const room = rooms.get(client.roomCode);
          if (!room || room.state.hostId !== client.playerId) return;

          room.state.status = 'COUNTDOWN';
          room.state.currentLevelIndex = 0;
          room.state.currentRound = 1;
          room.state.players.forEach((p) => {
            p.score = 0;
            p.roundScore = 0;
            p.combo = 0;
            p.hasAnswered = false;
            p.powerUps = { freeze: 1, double: 1, hint: 1 };
            p.activeEffects = {};
          });

          broadcastRoomState(room);

          // 3-second countdown before round 1 begins
          setTimeout(() => {
            const firstLevel = room.state.config.levels[0] || 'memory';
            room.state.currentQuestion = generateQuestionForLevel(firstLevel, 1);
            room.state.status = 'PLAYING';
            startRoundTimer(room);
          }, 3000);
          break;
        }

        case 'C2S_SUBMIT_ANSWER': {
          if (!client.roomCode) return;
          const room = rooms.get(client.roomCode);
          if (!room || room.state.status !== 'PLAYING') return;

          const player = room.state.players.find((p) => p.id === client.playerId);
          if (!player || player.hasAnswered) return;

          const isCorrect = Boolean(payload.isCorrect);
          player.hasAnswered = true;
          player.lastAnswerCorrect = isCorrect;

          if (isCorrect) {
            player.combo += 1;
            const remaining = room.state.timerSeconds;
            const total = room.state.config.roundDuration;
            const speedBonus = Math.round((remaining / total) * 150);
            const comboMultiplier = Math.min(2.0, 1 + player.combo * 0.15);
            const doubleMultiplier = player.activeEffects.hasDouble ? 2 : 1;
            const isBoss = room.state.currentQuestion?.data?.isBoss ? 2 : 1;

            const earned = Math.round((100 + speedBonus) * comboMultiplier * doubleMultiplier * isBoss);
            player.roundScore = earned;
            player.score += earned;
          } else {
            player.combo = 0;
            player.roundScore = 0;
          }

          broadcastRoomState(room);

          // If all active players answered, finish immediately!
          const allDone = room.state.players.every((p) => p.hasAnswered);
          if (allDone && room.roundTimerInterval) {
            clearInterval(room.roundTimerInterval);
            room.roundTimerInterval = undefined;
            finishMiniRound(room);
          }
          break;
        }

        case 'C2S_USE_POWERUP': {
          if (!client.roomCode) return;
          const room = rooms.get(client.roomCode);
          if (!room || room.state.status !== 'PLAYING') return;

          const player = room.state.players.find((p) => p.id === client.playerId);
          if (!player) return;

          const pType: 'freeze' | 'double' | 'hint' = payload.powerUp;
          if ((player.powerUps[pType] || 0) <= 0) return;

          player.powerUps[pType] -= 1;

          if (pType === 'freeze') {
            // Freezes other players for 3 seconds
            room.state.players.forEach((other) => {
              if (other.id !== player.id) {
                other.activeEffects.isFrozen = true;
                setTimeout(() => {
                  other.activeEffects.isFrozen = false;
                  broadcastRoomState(room);
                }, 3000);
              }
            });
          } else if (pType === 'double') {
            player.activeEffects.hasDouble = true;
          }

          broadcastToRoom(room, 'S2C_POWERUP_EFFECT', {
            senderId: player.id,
            senderName: player.username,
            powerUp: pType
          });
          broadcastRoomState(room);
          break;
        }

        case 'C2S_SEND_REACTION': {
          if (!client.roomCode) return;
          const room = rooms.get(client.roomCode);
          if (!room) return;

          broadcastToRoom(room, 'S2C_REACTION', {
            id: 'rx_' + Math.random().toString(36).substring(2, 9),
            playerId: client.playerId,
            emoji: payload.emoji,
            x: Math.random() * 80 + 10,
            y: Math.random() * 40 + 30
          });
          break;
        }

        case 'C2S_RESTART_MATCH': {
          if (!client.roomCode) return;
          const room = rooms.get(client.roomCode);
          if (!room || room.state.hostId !== client.playerId) return;

          room.state.status = 'LOBBY';
          room.state.currentLevelIndex = 0;
          room.state.currentRound = 1;
          room.state.players.forEach((p) => {
            p.score = 0;
            p.roundScore = 0;
            p.isReady = false;
            p.hasAnswered = false;
            p.combo = 0;
            p.powerUps = { freeze: 1, double: 1, hint: 1 };
            p.activeEffects = {};
          });
          broadcastRoomState(room);
          break;
        }
      }
    } catch (err) {
      console.error('WS Error:', err);
    }
  });

  ws.on('close', () => {
    if (client.roomCode) {
      const room = rooms.get(client.roomCode);
      if (room) {
        room.clients.delete(client.playerId);
        room.state.players = room.state.players.filter((p) => p.id !== client.playerId);

        // If host left, assign new host if players remain
        if (room.state.hostId === client.playerId && room.state.players.length > 0) {
          room.state.hostId = room.state.players[0].id;
          room.state.players[0].isHost = true;
        }

        // Clean up empty room
        if (room.state.players.length === 0) {
          if (room.roundTimerInterval) clearInterval(room.roundTimerInterval);
          if (room.transitionTimeout) clearTimeout(room.transitionTimeout);
          rooms.delete(client.roomCode);
        } else {
          broadcastRoomState(room);
        }
      }
    }
    connections.delete(ws);
  });
});

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'MindClash', activeRooms: rooms.size });
});

app.get('/api/daily-challenge', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  res.json({
    date: today,
    levelId: 'memory',
    targetScore: 850,
    rewardXp: 300,
    title: 'Daily Synapse Surge'
  });
});

// Vite dev server mounting or static build serving
async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 MindClash Game Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
