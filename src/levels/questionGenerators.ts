import { LevelId, RoundQuestion } from '../types/game';

// Helper for shuffling
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ----------------------------------------------------
// 1. MEMORY LEVEL
// ----------------------------------------------------
export function generateMemoryRound(roundNumber: number): RoundQuestion {
  if (roundNumber === 1) {
    // Pattern Echo: 3x3 grid, sequence of 4 steps (or 5 on hard)
    const steps = [
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9)
    ];
    return {
      levelId: 'memory',
      roundNumber: 1,
      title: 'Pattern Echo',
      instructions: 'Watch the sequence light up, then repeat it exactly!',
      data: {
        gridSize: 3,
        sequence: steps,
        displaySpeedMs: 650
      }
    };
  } else if (roundNumber === 2) {
    // Color Recall: 6 colors shown, then one is masked or asked
    const allColors = [
      { name: 'Electric Violet', hex: '#8B5CF6' },
      { name: 'Neon Cyan', hex: '#06B6D4' },
      { name: 'Solar Amber', hex: '#F59E0B' },
      { name: 'Hot Coral', hex: '#F43F5E' },
      { name: 'Laser Emerald', hex: '#10B981' },
      { name: 'Plasma Pink', hex: '#EC4899' }
    ];
    const picked = shuffle(allColors).slice(0, 5);
    const targetIdx = Math.floor(Math.random() * picked.length);
    const target = picked[targetIdx];

    // Options for what color was at position targetIdx + 1
    const distractors = allColors.filter(c => c.name !== target.name);
    const options = shuffle([target.name, distractors[0].name, distractors[1].name, distractors[2].name]);

    return {
      levelId: 'memory',
      roundNumber: 2,
      title: 'Color Matrix Recall',
      instructions: 'Memorize the color order before they flip face-down!',
      data: {
        cards: picked,
        memorizeTimeMs: 3500,
        questionText: `Which color was at position #${targetIdx + 1}?`,
        correctAnswer: target.name,
        options
      }
    };
  } else {
    // Dual Memory Matrix: 4x4 grid (16 tiles), 5 target positions
    const positions: number[] = [];
    while (positions.length < 5) {
      const p = Math.floor(Math.random() * 16);
      if (!positions.includes(p)) positions.push(p);
    }
    return {
      levelId: 'memory',
      roundNumber: 3,
      title: 'Synapse Matrix',
      instructions: 'Memorize all 5 glowing nodes, then tap all 5 from memory!',
      data: {
        gridSize: 4,
        targetPositions: positions,
        displayTimeMs: 2500
      }
    };
  }
}

// ----------------------------------------------------
// 2. LOGIC LEVEL
// ----------------------------------------------------
export function generateLogicRound(roundNumber: number): RoundQuestion {
  if (roundNumber === 1) {
    // Odd one out
    const oddSets = [
      {
        question: 'Which number is NOT a prime number?',
        options: ['17', '23', '27', '31'],
        answer: '27',
        hint: '27 is divisible by 3 and 9'
      },
      {
        question: 'Which geometric shape has an odd number of vertices?',
        options: ['Square', 'Hexagon', 'Pentagon', 'Octagon'],
        answer: 'Pentagon',
        hint: 'A pentagon has 5 corners'
      },
      {
        question: 'Which element is NOT in the same physical state at room temperature?',
        options: ['Iron', 'Copper', 'Mercury', 'Gold'],
        answer: 'Mercury',
        hint: 'Mercury is a liquid metal at room temperature'
      },
      {
        question: 'Which unit measures electrical resistance?',
        options: ['Watt', 'Ampere', 'Ohm', 'Volt'],
        answer: 'Ohm',
        hint: 'Named after Georg Simon Ohm'
      }
    ];
    const picked = oddSets[Math.floor(Math.random() * oddSets.length)];
    return {
      levelId: 'logic',
      roundNumber: 1,
      title: 'Odd One Out',
      instructions: 'Quickly spot the option that breaks the rule!',
      data: {
        prompt: picked.question,
        options: shuffle(picked.options),
        correctAnswer: picked.answer,
        hint: picked.hint
      }
    };
  } else if (roundNumber === 2) {
    // Sequence Cracker
    const sequences = [
      {
        seq: '2, 6, 18, 54, ...',
        options: ['108', '162', '148', '172'],
        answer: '162',
        explanation: 'Each step multiplies by 3 (54 × 3 = 162)'
      },
      {
        seq: '1, 4, 9, 16, 25, ...',
        options: ['30', '34', '36', '49'],
        answer: '36',
        explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6² = 36'
      },
      {
        seq: '5, 11, 23, 47, ...',
        options: ['91', '94', '95', '89'],
        answer: '95',
        explanation: 'Pattern is ×2 + 1 (47 × 2 + 1 = 95)'
      },
      {
        seq: '80, 40, 20, 10, ...',
        options: ['5', '2.5', '0', '1'],
        answer: '5',
        explanation: 'Divide by 2 each step'
      }
    ];
    const picked = sequences[Math.floor(Math.random() * sequences.length)];
    return {
      levelId: 'logic',
      roundNumber: 2,
      title: 'Sequence Cracker',
      instructions: 'What comes next in the mathematical sequence?',
      data: {
        sequence: picked.seq,
        options: shuffle(picked.options),
        correctAnswer: picked.answer,
        explanation: picked.explanation
      }
    };
  } else {
    // Fast Riddle
    const riddles = [
      {
        riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
        options: ['Echo', 'Cloud', 'Whistle', 'Shadow'],
        answer: 'Echo'
      },
      {
        riddle: 'What has keys but opens no locks, space but no room, and allows you to enter but never leave?',
        options: ['A Piano', 'A Keyboard', 'A Map', 'A Hotel'],
        answer: 'A Keyboard'
      },
      {
        riddle: 'The more you take, the more you leave behind. What are they?',
        options: ['Footsteps', 'Memories', 'Breaths', 'Pennies'],
        answer: 'Footsteps'
      },
      {
        riddle: 'What gets wetter the more it dries?',
        options: ['A Sponge', 'A Towel', 'Rain', 'Ice'],
        answer: 'A Towel'
      }
    ];
    const picked = riddles[Math.floor(Math.random() * riddles.length)];
    return {
      levelId: 'logic',
      roundNumber: 3,
      title: 'Mind Twister Riddle',
      instructions: 'Think outside the box and solve the riddle!',
      data: {
        riddle: picked.riddle,
        options: shuffle(picked.options),
        correctAnswer: picked.answer
      }
    };
  }
}

// ----------------------------------------------------
// 3. FOCUS LEVEL
// ----------------------------------------------------
export function generateFocusRound(roundNumber: number): RoundQuestion {
  if (roundNumber === 1) {
    // Spot the glitch: A grid of 12 similar emojis, 1 is slightly different
    const glyphSets = [
      { normal: '🟣', glitch: '🟪', label: 'Circle vs Square' },
      { normal: '⭐', glitch: '🌟', label: 'Star with sparkles' },
      { normal: '🍋', glitch: '🍌', label: 'Fruit discrepancy' },
      { normal: '⚡', glitch: '💥', label: 'Energy burst' }
    ];
    const set = glyphSets[Math.floor(Math.random() * glyphSets.length)];
    const glitchIndex = Math.floor(Math.random() * 12);
    const items = Array.from({ length: 12 }, (_, i) => (i === glitchIndex ? set.glitch : set.normal));

    return {
      levelId: 'focus',
      roundNumber: 1,
      title: 'Spot the Glitch',
      instructions: 'Quick! Tap the one symbol that does NOT match the others!',
      data: {
        items,
        glitchIndex,
        normalSymbol: set.normal,
        glitchSymbol: set.glitch
      }
    };
  } else if (roundNumber === 2) {
    // Hidden Glyph Search: target emoji in a bustling grid of 20 items
    const pool = ['🚀', '🍕', '🎮', '💎', '🔥', '🏆', '🎧', '🎸', '🌈', '⚡', '🛸', '🎯', '🥑', '🍩', '🦊', '🐱'];
    const target = pool[Math.floor(Math.random() * pool.length)];
    const rest = pool.filter(p => p !== target);

    // Create 20 items where target appears exactly once
    const targetIdx = Math.floor(Math.random() * 20);
    const items = Array.from({ length: 20 }, (_, i) => {
      if (i === targetIdx) return target;
      return rest[Math.floor(Math.random() * rest.length)];
    });

    return {
      levelId: 'focus',
      roundNumber: 2,
      title: 'Hidden Icon Hunt',
      instructions: `Find and tap the target icon as fast as possible!`,
      data: {
        targetIcon: target,
        items,
        targetIndex: targetIdx
      }
    };
  } else {
    // Stroop Laser Challenge: Color of the word vs word itself
    const colorDefinitions = [
      { word: 'RED', inkName: 'Cyan', inkHex: '#06B6D4' },
      { word: 'BLUE', inkName: 'Amber', inkHex: '#F59E0B' },
      { word: 'GREEN', inkName: 'Violet', inkHex: '#8B5CF6' },
      { word: 'YELLOW', inkName: 'Rose', inkHex: '#F43F5E' },
      { word: 'PURPLE', inkName: 'Emerald', inkHex: '#10B981' }
    ];
    const picked = colorDefinitions[Math.floor(Math.random() * colorDefinitions.length)];
    const options = shuffle(['Cyan', 'Amber', 'Violet', 'Rose', 'Emerald']);

    return {
      levelId: 'focus',
      roundNumber: 3,
      title: 'Stroop Laser Clash',
      instructions: 'Tap the INK COLOR of the word, NOT what it spells!',
      data: {
        wordText: picked.word,
        inkColorHex: picked.inkHex,
        correctAnswer: picked.inkName,
        options
      }
    };
  }
}

// ----------------------------------------------------
// 4. SPEED LEVEL
// ----------------------------------------------------
export function generateSpeedRound(roundNumber: number): RoundQuestion {
  if (roundNumber === 1) {
    // Reflex Laser Buzzer
    const waitDelayMs = 1800 + Math.floor(Math.random() * 2200);
    return {
      levelId: 'speed',
      roundNumber: 1,
      title: 'Reflex Laser Tap',
      instructions: 'Wait for the screen to turn GREEN, then tap the buzzer instantly!',
      data: {
        waitDelayMs
      }
    };
  } else if (roundNumber === 2) {
    // Quick Math Duel
    const a = Math.floor(Math.random() * 20) + 12;
    const b = Math.floor(Math.random() * 18) + 8;
    const op = Math.random() > 0.4 ? '+' : '-';
    const answer = op === '+' ? a + b : a - b;

    const options = shuffle([
      String(answer),
      String(answer + 2),
      String(answer - 3),
      String(answer + 10)
    ]);

    return {
      levelId: 'speed',
      roundNumber: 2,
      title: 'Lightning Math',
      instructions: 'Calculate rapidly before the timer drains!',
      data: {
        problem: `${a} ${op} ${b} = ?`,
        options,
        correctAnswer: String(answer)
      }
    };
  } else {
    // Number Rush: 6 random numbers to tap in ascending order
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const n = Math.floor(Math.random() * 50) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }
    const sorted = [...numbers].sort((a, b) => a - b);

    return {
      levelId: 'speed',
      roundNumber: 3,
      title: 'Number Rush Tap',
      instructions: 'Tap the 6 numbers in ASCENDING numerical order (lowest to highest)!',
      data: {
        numbers: shuffle(numbers),
        correctOrder: sorted
      }
    };
  }
}

// ----------------------------------------------------
// 5. CREATIVITY LEVEL
// ----------------------------------------------------
export function generateCreativityRound(roundNumber: number): RoundQuestion {
  if (roundNumber === 1) {
    // Word Anagram Alchemy
    const anagrams = [
      { word: 'GALAXY', scrambled: 'XYAAGL', hint: 'A system of millions of stars' },
      { word: 'PLANET', scrambled: 'LNETAP', hint: 'Celestial body in orbit' },
      { word: 'ENERGY', scrambled: 'GRENEY', hint: 'The capacity for doing work' },
      { word: 'SPARK', scrambled: 'RAKS P', hint: 'A small fiery particle' }
    ];
    const picked = anagrams[Math.floor(Math.random() * anagrams.length)];
    const options = shuffle([
      picked.word,
      shuffle(picked.word.split('')).join(''),
      picked.word.slice(1) + picked.word[0],
      'COSMOS'
    ]);

    return {
      levelId: 'creativity',
      roundNumber: 1,
      title: 'Word Alchemy',
      instructions: 'Unscramble the cosmic word from the scrambled letters!',
      data: {
        scrambled: picked.scrambled,
        hint: picked.hint,
        correctAnswer: picked.word,
        options: Array.from(new Set(options))
      }
    };
  } else if (roundNumber === 2) {
    // Quick Doodle Recognition / Concept Link
    const associations = [
      {
        prompt: 'Which word connects: 🌊 Ocean · ⚓ Anchor · 🗺️ Treasure?',
        options: ['Pirate', 'Submarine', 'Astronaut', 'Jungle'],
        answer: 'Pirate'
      },
      {
        prompt: 'Which word connects: 🎻 Violin · 🎷 Saxophone · 🥁 Drums?',
        options: ['Orchestra', 'Library', 'Galaxy', 'Bakery'],
        answer: 'Orchestra'
      },
      {
        prompt: 'Which word connects: 🎨 Canvas · 🖌️ Brush · 🖼️ Gallery?',
        options: ['Painter', 'Architect', 'Pilot', 'Chef'],
        answer: 'Painter'
      }
    ];
    const picked = associations[Math.floor(Math.random() * associations.length)];
    return {
      levelId: 'creativity',
      roundNumber: 2,
      title: 'Concept Link',
      instructions: 'Find the creative link connecting all three items!',
      data: {
        prompt: picked.prompt,
        options: shuffle(picked.options),
        correctAnswer: picked.answer
      }
    };
  } else {
    // Doodle Canvas Guess
    const doodles = [
      { name: 'Rocket', prompt: 'Draw a rocket shooting into outer space!', keywords: ['Rocket', 'Spaceship', 'Satellite', 'Comet'] },
      { name: 'Pizza', prompt: 'Draw a delicious triangular slice of pizza!', keywords: ['Pizza', 'Pie', 'Cheese', 'Sandwich'] },
      { name: 'Crown', prompt: 'Draw a shining royal golden crown!', keywords: ['Crown', 'Tiara', 'Hat', 'Ring'] }
    ];
    const picked = doodles[Math.floor(Math.random() * doodles.length)];
    return {
      levelId: 'creativity',
      roundNumber: 3,
      title: 'Doodle Master',
      instructions: 'A quick creative draw & identify round!',
      data: {
        targetWord: picked.name,
        prompt: picked.prompt,
        options: shuffle(picked.keywords),
        correctAnswer: picked.name
      }
    };
  }
}

// ----------------------------------------------------
// 6. DEDUCTION LEVEL
// ----------------------------------------------------
export function generateDeductionRound(roundNumber: number): RoundQuestion {
  if (roundNumber === 1) {
    // Two truths and a lie / Spot the Bluff
    const bluffSets = [
      {
        prompt: 'Two of these facts are TRUE. Spot the BLUFF (Fake fact)!',
        options: [
          'Honey never spoils even after 3,000 years (True)',
          'Octopuses have three hearts and blue blood (True)',
          'Bananas grow on trees with woody trunks (Bluff)'
        ],
        answer: 'Bananas grow on trees with woody trunks (Bluff)',
        explanation: 'Bananas are giant herbs, not woody trees!'
      },
      {
        prompt: 'Spot the BLUFF among these scientific facts!',
        options: [
          'Sharks existed before trees (True)',
          'Lightning strikes Earth 100 times every second (True)',
          'Sound travels faster in air than in solid steel (Bluff)'
        ],
        answer: 'Sound travels faster in air than in solid steel (Bluff)',
        explanation: 'Sound travels ~15 times faster in steel than in air!'
      }
    ];
    const picked = bluffSets[Math.floor(Math.random() * bluffSets.length)];
    return {
      levelId: 'deduction',
      roundNumber: 1,
      title: 'Who is Bluffing?',
      instructions: 'Deduce which statement is the fabricated lie!',
      data: {
        prompt: picked.prompt,
        options: shuffle(picked.options),
        correctAnswer: picked.answer,
        explanation: picked.explanation
      }
    };
  } else if (roundNumber === 2) {
    // Impostor Word Clue
    const impostorSets = [
      {
        clues: ['Gravity', 'Orbit', 'Satellite', 'Chlorophyll'],
        impostor: 'Chlorophyll',
        category: 'Space & Physics'
      },
      {
        clues: ['Sonnet', 'Haiku', 'Limerick', 'Photosynthesis'],
        impostor: 'Photosynthesis',
        category: 'Poetry Forms'
      },
      {
        clues: ['Espresso', 'Cappuccino', 'Latte', 'Trombone'],
        impostor: 'Trombone',
        category: 'Coffee Drinks'
      }
    ];
    const picked = impostorSets[Math.floor(Math.random() * impostorSets.length)];
    return {
      levelId: 'deduction',
      roundNumber: 2,
      title: 'Impostor Clue',
      instructions: 'Which clue does NOT belong with the others?',
      data: {
        categoryHint: picked.category,
        options: shuffle(picked.clues),
        correctAnswer: picked.impostor
      }
    };
  } else {
    // 3-Digit Code Breaker
    const secret = [
      Math.floor(Math.random() * 9) + 1,
      Math.floor(Math.random() * 9) + 1,
      Math.floor(Math.random() * 9) + 1
    ].join('');

    return {
      levelId: 'deduction',
      roundNumber: 3,
      title: 'Code Breaker',
      instructions: 'Crack the 3-digit secret code using clue hints!',
      data: {
        secretCode: secret,
        clues: [
          `The sum of all three digits is ${secret.split('').reduce((a, b) => a + Number(b), 0)}`,
          `The first digit is ${Number(secret[0]) % 2 === 0 ? 'EVEN' : 'ODD'}`,
          `The last digit is ${Number(secret[2]) > 5 ? 'greater than 5' : '5 or less'}`
        ],
        options: shuffle([
          secret,
          String(Number(secret) + 11),
          String(Math.abs(Number(secret) - 20)),
          '734'
        ]),
        correctAnswer: secret
      }
    };
  }
}

// ----------------------------------------------------
// 7. BOSS LEVEL (The Synapse Gauntlet)
// ----------------------------------------------------
export function generateBossRound(roundNumber: number): RoundQuestion {
  if (roundNumber === 1) {
    // Turbo Simon (5 steps)
    const seq = [
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9)
    ];
    return {
      levelId: 'boss',
      roundNumber: 1,
      title: 'Boss Round 1: Turbo Recall',
      instructions: '2X POINTS! Rapid 5-step sequence on turbo speed!',
      data: {
        gridSize: 3,
        sequence: seq,
        displaySpeedMs: 450,
        isBoss: true
      }
    };
  } else if (roundNumber === 2) {
    // High-pressure Math + Logic
    const a = Math.floor(Math.random() * 12) + 6;
    const b = Math.floor(Math.random() * 12) + 4;
    const c = Math.floor(Math.random() * 20) + 10;
    const answer = a * b - c;
    const options = shuffle([
      String(answer),
      String(answer + 4),
      String(answer - 6),
      String(answer + 12)
    ]);
    return {
      levelId: 'boss',
      roundNumber: 2,
      title: 'Boss Round 2: Turbo Calculation',
      instructions: '2X POINTS! Multi-step arithmetic under boss pressure!',
      data: {
        problem: `(${a} × ${b}) - ${c} = ?`,
        options,
        correctAnswer: String(answer),
        isBoss: true
      }
    };
  } else {
    // Boss Sudden Death Reflex Match
    return {
      levelId: 'boss',
      roundNumber: 3,
      title: 'Boss Sudden Death: Reflex Overdrive',
      instructions: '2X POINTS! Final reflex clash—fastest buzzer takes the championship!',
      data: {
        waitDelayMs: 1500 + Math.floor(Math.random() * 2000),
        isBoss: true
      }
    };
  }
}

// Master dispatch function
export function generateQuestionForLevel(levelId: LevelId, roundNumber: number): RoundQuestion {
  switch (levelId) {
    case 'memory':
      return generateMemoryRound(roundNumber);
    case 'logic':
      return generateLogicRound(roundNumber);
    case 'focus':
      return generateFocusRound(roundNumber);
    case 'speed':
      return generateSpeedRound(roundNumber);
    case 'creativity':
      return generateCreativityRound(roundNumber);
    case 'deduction':
      return generateDeductionRound(roundNumber);
    case 'boss':
      return generateBossRound(roundNumber);
    default:
      return generateMemoryRound(roundNumber);
  }
}
