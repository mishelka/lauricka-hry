import { VYBRANE_B_GROUPS, VYBRANE_B_CHYTAKY } from './vybraneBSlova';
import { VYBRANE_M_GROUPS, VYBRANE_M_CHYTAKY } from './vybraneMSlova';
import { VYBRANE_P_GROUPS, VYBRANE_P_CHYTAKY } from './vybranePSlova';
import { VYBRANE_R_GROUPS, VYBRANE_R_CHYTAKY } from './vybraneRSlova';
import { VYBRANE_S_GROUPS, VYBRANE_S_CHYTAKY } from './vybraneSSlova';
import { VYBRANE_V_GROUPS, VYBRANE_V_CHYTAKY } from './vybraneVSlova';
import { VYBRANE_Z_GROUPS, VYBRANE_Z_CHYTAKY } from './vybraneZSlova';
import { shuffleArray } from '../utils/gameUtils';

export const ALL_VYBRANE_CHYTAKY_BY_LETTER = {
  b: {
    letter: 'B',
    name: 'Vybrané slová po B',
    tasks: [...VYBRANE_B_GROUPS[5], ...VYBRANE_B_GROUPS[6]],
    chytakyList: VYBRANE_B_CHYTAKY
  },
  m: {
    letter: 'M',
    name: 'Vybrané slová po M',
    tasks: VYBRANE_M_GROUPS[6] || [],
    chytakyList: VYBRANE_M_CHYTAKY
  },
  p: {
    letter: 'P',
    name: 'Vybrané slová po P',
    tasks: VYBRANE_P_GROUPS[6] || [],
    chytakyList: VYBRANE_P_CHYTAKY
  },
  r: {
    letter: 'R',
    name: 'Vybrané slová po R',
    tasks: VYBRANE_R_GROUPS[6] || [],
    chytakyList: VYBRANE_R_CHYTAKY
  },
  s: {
    letter: 'S',
    name: 'Vybrané slová po S',
    tasks: VYBRANE_S_GROUPS[6] || [],
    chytakyList: VYBRANE_S_CHYTAKY
  },
  v: {
    letter: 'V',
    name: 'Vybrané slová po V',
    tasks: VYBRANE_V_GROUPS[6] || [],
    chytakyList: VYBRANE_V_CHYTAKY
  },
  z: {
    letter: 'Z',
    name: 'Vybrané slová po Z',
    tasks: VYBRANE_Z_GROUPS[6] || [],
    chytakyList: VYBRANE_Z_CHYTAKY
  }
};

export function getAchievedChytakyTasks(unlockedLetters = ['b']) {
  const letters = Array.isArray(unlockedLetters) && unlockedLetters.length > 0 ? unlockedLetters : ['b'];
  const tasks = [];
  letters.forEach(letterKey => {
    const key = String(letterKey).toLowerCase();
    const data = ALL_VYBRANE_CHYTAKY_BY_LETTER[key];
    if (data && Array.isArray(data.tasks)) {
      tasks.push(...data.tasks);
    }
  });
  // Fallback to B tasks if nothing found
  if (tasks.length === 0) {
    tasks.push(...ALL_VYBRANE_CHYTAKY_BY_LETTER.b.tasks);
  }
  return tasks;
}

export function getAlternatingOpakovanieTasks(unlockedLetters = ['b'], totalCount = 10) {
  const letters = Array.isArray(unlockedLetters) && unlockedLetters.length > 0
    ? unlockedLetters.map(l => String(l).toLowerCase())
    : ['b'];

  const validLetters = letters.filter(l => ALL_VYBRANE_CHYTAKY_BY_LETTER[l]?.tasks?.length > 0);
  const activeLetters = validLetters.length > 0 ? validLetters : ['b'];

  // Prepare a copy of tasks for each letter shuffled
  const letterPools = {};
  activeLetters.forEach(l => {
    const letterTasks = ALL_VYBRANE_CHYTAKY_BY_LETTER[l]?.tasks || [];
    letterPools[l] = shuffleArray(letterTasks);
  });

  // Build the alternating sequence of letters of length totalCount
  const letterSequence = [];
  while (letterSequence.length < totalCount) {
    const cycle = shuffleArray(activeLetters);
    // If more than 1 letter and the first letter of new cycle equals last letter of sequence, swap it
    if (activeLetters.length > 1 && letterSequence.length > 0 && cycle[0] === letterSequence[letterSequence.length - 1]) {
      if (cycle.length > 1) {
        const temp = cycle[0];
        cycle[0] = cycle[1];
        cycle[1] = temp;
      }
    }
    for (const l of cycle) {
      if (letterSequence.length < totalCount) {
        letterSequence.push(l);
      }
    }
  }

  // For each letter in the sequence, pick one task from its pool without repeating if possible
  const resultTasks = [];
  const usedIndices = {};
  activeLetters.forEach(l => {
    usedIndices[l] = 0;
  });

  for (const letter of letterSequence) {
    const pool = letterPools[letter];
    if (pool && pool.length > 0) {
      let idx = usedIndices[letter];
      if (idx >= pool.length) {
        letterPools[letter] = shuffleArray(ALL_VYBRANE_CHYTAKY_BY_LETTER[letter]?.tasks || []);
        idx = 0;
        usedIndices[letter] = 0;
      }
      resultTasks.push(letterPools[letter][idx]);
      usedIndices[letter] = idx + 1;
    }
  }

  return resultTasks;
}
