import React, { useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  RoomState,
  RoomConfig,
  LevelId,
  FloatingReaction
} from './types/game';
import { sounds } from './utils/sound';
import { TopBar } from './components/TopBar';
import { AuthScreen } from './components/AuthScreen';
import { HubScreen } from './components/HubScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { RoomConfigModal } from './components/RoomConfigModal';
import { ArenaScreen } from './components/ArenaScreen';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { VictoryScreen } from './components/VictoryScreen';
import { generateQuestionForLevel } from './levels/questionGenerators';

export default function App() {
  // ----------------------------------------------------
  // Persistent Profile
  // ----------------------------------------------------
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('mindclash_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ----------------------------------------------------
  // Multiplayer & Screen State
  // ----------------------------------------------------
  const [screen, setScreen] = useState<'HUB' | 'LOBBY' | 'ARENA' | 'VICTORY'>('HUB');
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [isSoloMode, setIsSoloMode] = useState(false);

  // WebSocket Ref
  const wsRef = useRef<WebSocket | null>(null);
  const soloTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveProfile = (newProfile: UserProfile) => {
    setUser(newProfile);
    localStorage.setItem('mindclash_profile', JSON.stringify(newProfile));
    setIsEditingProfile(false);
  };

  // ----------------------------------------------------
  // WebSocket Connection
  // ----------------------------------------------------
  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    let socket: WebSocket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        // Check if there was a ?room= URL parameter on first load
        const params = new URLSearchParams(window.location.search);
        const urlRoom = params.get('room');
        if (urlRoom) {
          joinRoom(urlRoom);
        }
      };

      socket.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);

          switch (type) {
            case 'S2C_ROOM_STATE': {
              const updatedRoom: RoomState = payload;
              setRoomState(updatedRoom);
              setIsSoloMode(false);

              if (updatedRoom.status === 'LOBBY' || updatedRoom.status === 'COUNTDOWN') {
                setScreen('LOBBY');
              } else if (updatedRoom.status === 'PLAYING' || updatedRoom.status === 'ROUND_SUMMARY') {
                setScreen('ARENA');
              } else if (updatedRoom.status === 'MATCH_OVER') {
                setScreen('VICTORY');
              }
              break;
            }

            case 'S2C_TICK': {
              setRoomState((prev) => (prev ? { ...prev, timerSeconds: payload.timerSeconds } : prev));
              if (payload.timerSeconds <= 3 && payload.timerSeconds > 0) {
                sounds.playUrgentTick();
              } else if (payload.timerSeconds > 0) {
                sounds.playTick();
              }
              break;
            }

            case 'S2C_REACTION': {
              const rx: FloatingReaction = payload;
              setFloatingReactions((prev) => [...prev, rx]);
              setTimeout(() => {
                setFloatingReactions((prev) => prev.filter((r) => r.id !== rx.id));
              }, 2500);
              break;
            }

            case 'S2C_POWERUP_EFFECT': {
              showToast(`${payload.senderName} activated power-up: ${payload.powerUp.toUpperCase()}!`);
              break;
            }

            case 'S2C_ERROR': {
              showToast(payload.message || 'Error occurred');
              sounds.playError();
              break;
            }
          }
        } catch (e) {
          console.error('Error handling WS message:', e);
        }
      };

      socket.onclose = () => {
        // Will be re-opened if user is active
      };
    } catch (e) {
      console.warn('WebSocket connection not ready or failed:', e);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  // ----------------------------------------------------
  // Multiplayer Actions
  // ----------------------------------------------------
  const joinRoom = (code: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      showToast('Connecting to party server...');
      return;
    }
    wsRef.current.send(
      JSON.stringify({
        type: 'C2S_JOIN_ROOM',
        payload: {
          roomCode: code,
          username: user?.username,
          avatarId: user?.avatarId
        }
      })
    );
  };

  const createRoom = () => {
    joinRoom('NEW');
  };

  const handleToggleReady = (ready: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'C2S_SET_READY',
          payload: { isReady: ready }
        })
      );
    }
  };

  const handleStartGame = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'C2S_START_GAME',
          payload: {}
        })
      );
    }
  };

  const handleUpdateConfig = (config: RoomConfig) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'C2S_UPDATE_CONFIG',
          payload: { config }
        })
      );
    }
  };

  const handleSubmitAnswer = (isCorrect: boolean) => {
    if (isSoloMode) {
      handleSoloSubmitAnswer(isCorrect);
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'C2S_SUBMIT_ANSWER',
          payload: { isCorrect }
        })
      );
    }
  };

  const handleUsePowerUp = (powerUp: 'freeze' | 'double' | 'hint') => {
    if (isSoloMode) {
      handleSoloUsePowerUp(powerUp);
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'C2S_USE_POWERUP',
          payload: { powerUp }
        })
      );
    }
  };

  const handleSendReaction = (emoji: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'C2S_SEND_REACTION',
          payload: { emoji }
        })
      );
    }
  };

  const handleRestartMatch = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'C2S_RESTART_MATCH',
          payload: {}
        })
      );
    }
  };

  const handleLeaveRoom = () => {
    if (soloTimerRef.current) clearInterval(soloTimerRef.current);
    setRoomState(null);
    setIsSoloMode(false);
    setScreen('HUB');
  };

  // ----------------------------------------------------
  // Solo Practice Engine (100% Offline / Standalone)
  // ----------------------------------------------------
  const handleStartSolo = (levelId: LevelId) => {
    if (!user) return;
    setIsSoloMode(true);

    const soloRoom: RoomState = {
      roomCode: 'SOLO',
      hostId: user.id,
      players: [
        {
          id: user.id,
          username: user.username,
          avatarId: user.avatarId,
          score: 0,
          roundScore: 0,
          isReady: true,
          isHost: true,
          combo: 0,
          powerUps: { freeze: 1, double: 1, hint: 1 },
          hasAnswered: false,
          activeEffects: {}
        }
      ],
      config: {
        maxPlayers: 1,
        levels: [levelId],
        roundDuration: 15,
        powerUpsEnabled: true,
        difficulty: 'normal'
      },
      status: 'PLAYING',
      currentLevelIndex: 0,
      currentRound: 1,
      timerSeconds: 15,
      totalRoundsPerLevel: 3,
      currentQuestion: generateQuestionForLevel(levelId, 1)
    };

    setRoomState(soloRoom);
    setScreen('ARENA');
    startSoloTimer(soloRoom);
  };

  const startSoloTimer = (currentRoom: RoomState) => {
    if (soloTimerRef.current) clearInterval(soloTimerRef.current);

    currentRoom.timerSeconds = currentRoom.config.roundDuration;

    soloTimerRef.current = setInterval(() => {
      setRoomState((prev) => {
        if (!prev) return null;
        const nextTime = prev.timerSeconds - 1;

        if (nextTime <= 3 && nextTime > 0) sounds.playUrgentTick();
        else if (nextTime > 0) sounds.playTick();

        if (nextTime <= 0) {
          if (soloTimerRef.current) clearInterval(soloTimerRef.current);
          handleSoloFinishRound(prev);
          return { ...prev, timerSeconds: 0 };
        }
        return { ...prev, timerSeconds: nextTime };
      });
    }, 1000);
  };

  const handleSoloSubmitAnswer = (isCorrect: boolean) => {
    if (!roomState) return;
    const player = roomState.players[0];
    if (player.hasAnswered) return;

    player.hasAnswered = true;
    player.lastAnswerCorrect = isCorrect;

    if (isCorrect) {
      player.combo += 1;
      const speedBonus = Math.round((roomState.timerSeconds / roomState.config.roundDuration) * 150);
      const comboMult = Math.min(2.0, 1 + player.combo * 0.15);
      const doubleMult = player.activeEffects.hasDouble ? 2 : 1;
      const isBoss = roomState.currentQuestion?.data?.isBoss ? 2 : 1;

      const earned = Math.round((100 + speedBonus) * comboMult * doubleMult * isBoss);
      player.roundScore = earned;
      player.score += earned;
    } else {
      player.combo = 0;
      player.roundScore = 0;
    }

    setRoomState({ ...roomState });

    // End round immediately on answer!
    if (soloTimerRef.current) clearInterval(soloTimerRef.current);
    setTimeout(() => {
      handleSoloFinishRound(roomState);
    }, 400);
  };

  const handleSoloUsePowerUp = (powerUp: 'freeze' | 'double' | 'hint') => {
    if (!roomState) return;
    const player = roomState.players[0];
    if ((player.powerUps[powerUp] || 0) <= 0) return;

    player.powerUps[powerUp] -= 1;
    if (powerUp === 'double') {
      player.activeEffects.hasDouble = true;
    }
    setRoomState({ ...roomState });
  };

  const handleSoloFinishRound = (currentRoom: RoomState) => {
    currentRoom.status = 'ROUND_SUMMARY';
    setRoomState({ ...currentRoom });

    setTimeout(() => {
      // Reset player round flags
      const player = currentRoom.players[0];
      player.hasAnswered = false;
      player.roundScore = 0;
      player.activeEffects = {};

      if (currentRoom.currentRound < currentRoom.totalRoundsPerLevel) {
        currentRoom.currentRound += 1;
        const lvl = currentRoom.config.levels[0];
        currentRoom.currentQuestion = generateQuestionForLevel(lvl, currentRoom.currentRound);
        currentRoom.status = 'PLAYING';
        setRoomState({ ...currentRoom });
        startSoloTimer(currentRoom);
      } else {
        // Solo match complete!
        currentRoom.status = 'MATCH_OVER';
        setRoomState({ ...currentRoom });
        setScreen('VICTORY');

        // Record personal best & medals
        const finalScore = player.score;
        let medal: 'bronze' | 'silver' | 'gold' | 'grandmaster' = 'bronze';
        if (finalScore >= 950) medal = 'grandmaster';
        else if (finalScore >= 750) medal = 'gold';
        else if (finalScore >= 500) medal = 'silver';

        if (user) {
          const lvl = currentRoom.config.levels[0];
          const best = user.soloPersonalBests?.[lvl]?.score || 0;
          const updatedPb = finalScore > best ? { score: finalScore, medal } : user.soloPersonalBests?.[lvl];

          const updatedUser: UserProfile = {
            ...user,
            gamesPlayed: user.gamesPlayed + 1,
            xp: user.xp + Math.round(finalScore * 0.5),
            level: Math.floor((user.xp + Math.round(finalScore * 0.5)) / 500) + 1,
            soloPersonalBests: {
              ...user.soloPersonalBests,
              [lvl]: updatedPb
            }
          };
          saveProfile(updatedUser);
        }
      }
    }, 3500);
  };

  // ----------------------------------------------------
  // Render Screen
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 border border-violet-500 text-violet-300 font-bold text-xs rounded-xl shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Floating Emojis Layer */}
      {floatingReactions.map((rx) => (
        <div
          key={rx.id}
          className="fixed pointer-events-none z-50 text-4xl animate-bounce transition-all duration-1000"
          style={{ left: `${rx.x}%`, top: `${rx.y}%` }}
        >
          {rx.emoji}
        </div>
      ))}

      {/* Top Bar Navigation */}
      <TopBar
        user={user}
        onOpenProfile={() => setIsEditingProfile(true)}
        roomCode={roomState?.roomCode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!user || isEditingProfile ? (
          <AuthScreen
            currentUser={user}
            onSaveProfile={saveProfile}
            onCancel={user ? () => setIsEditingProfile(false) : undefined}
          />
        ) : screen === 'HUB' ? (
          <HubScreen
            user={user}
            onJoinRoom={joinRoom}
            onCreateRoom={createRoom}
            onStartSolo={handleStartSolo}
            onOpenProfile={() => setIsEditingProfile(true)}
          />
        ) : screen === 'LOBBY' && roomState ? (
          <LobbyScreen
            roomState={roomState}
            currentUserId={user.id}
            onToggleReady={handleToggleReady}
            onStartGame={handleStartGame}
            onLeaveRoom={handleLeaveRoom}
            onSendReaction={handleSendReaction}
            onOpenSettings={() => setShowConfigModal(true)}
          />
        ) : screen === 'ARENA' && roomState ? (
          <>
            <ArenaScreen
              roomState={roomState}
              currentUserId={user.id}
              onSubmitAnswer={handleSubmitAnswer}
              onUsePowerUp={handleUsePowerUp}
            />
            {roomState.status === 'ROUND_SUMMARY' && (
              <RoundSummaryModal roomState={roomState} currentUserId={user.id} />
            )}
          </>
        ) : screen === 'VICTORY' && roomState ? (
          <VictoryScreen
            roomState={roomState}
            currentUserId={user.id}
            isHost={roomState.hostId === user.id}
            onRestartMatch={handleRestartMatch}
            onLeaveRoom={handleLeaveRoom}
          />
        ) : (
          <HubScreen
            user={user}
            onJoinRoom={joinRoom}
            onCreateRoom={createRoom}
            onStartSolo={handleStartSolo}
            onOpenProfile={() => setIsEditingProfile(true)}
          />
        )}
      </main>

      {/* Room Configuration Modal */}
      {showConfigModal && roomState && (
        <RoomConfigModal
          initialConfig={roomState.config}
          isHost={roomState.hostId === user?.id}
          onSave={handleUpdateConfig}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </div>
  );
}
