import { VYBRANE_B_GROUPS, VYBRANE_B_CHYTAKY } from './vybraneBSlova';
import { VYBRANE_M_GROUPS, VYBRANE_M_CHYTAKY } from './vybraneMSlova';
import { VYBRANE_P_GROUPS, VYBRANE_P_CHYTAKY } from './vybranePSlova';
import { VYBRANE_R_GROUPS, VYBRANE_R_CHYTAKY } from './vybraneRSlova';
import { VYBRANE_S_GROUPS, VYBRANE_S_CHYTAKY } from './vybraneSSlova';
import { VYBRANE_V_GROUPS, VYBRANE_V_CHYTAKY } from './vybraneVSlova';
import { VYBRANE_Z_GROUPS, VYBRANE_Z_CHYTAKY } from './vybraneZSlova';

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
