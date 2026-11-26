import { NASOBENIE_DELENIE_FACTS } from '../data/nasobenieDelenieData.js';
import { MASTERY_STREAK } from './adaptiveRepetition.js';

const UNLOCK_ID = 'laura_math_1_2_10_v1';
const RESET_TWOS_ID = 'laura_math_2_reset_v1';
const KNOWN_TABLES = new Set([1, 2, 10]);
const LAURA_NAMES = new Set(['laura', 'laurka', 'lauricka', 'laurinka', 'lauri', 'laurusa', 'lauruska']);

function normalizeName(name) {
  return typeof name === 'string'
    ? name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    : '';
}

export function initializeLauraMathProgress(state) {
  const name = normalizeName(state.playerName);
  if (!LAURA_NAMES.has(name) || state.oneTimeUnlocks?.[UNLOCK_ID]) return null;

  const gameId = 'adaptivneOpakovanie';
  const record = state.games?.[gameId] || {};
  const progress = { ...record.adaptive };

  for (const fact of NASOBENIE_DELENIE_FACTS) {
    // Division is the inverse of the known multiplication fact.
    const known = fact.op === 'multiply'
      ? KNOWN_TABLES.has(fact.a) || KNOWN_TABLES.has(fact.b)
      : KNOWN_TABLES.has(fact.b) || KNOWN_TABLES.has(fact.result);
    if (!known) continue;
    const previous = progress[fact.id];
    progress[fact.id] = {
      correct: Math.max(MASTERY_STREAK, previous?.correct || 0),
      wrong: previous?.wrong || 0,
      streak: Math.max(MASTERY_STREAK, previous?.streak || 0)
    };
  }

  return {
    ...state,
    games: { ...state.games, [gameId]: { ...record, adaptive: progress } },
    oneTimeUnlocks: { ...state.oneTimeUnlocks, [UNLOCK_ID]: true }
  };
}

export function resetLauraTwosProgressOnce(state) {
  if (normalizeName(state.playerName) !== 'laura' || state.oneTimeUnlocks?.[RESET_TWOS_ID]) return null;

  const gameId = 'adaptivneOpakovanie';
  const record = state.games?.[gameId] || {};
  const progress = { ...record.adaptive };

  for (const fact of NASOBENIE_DELENIE_FACTS) {
    const belongsToTwos = fact.op === 'multiply'
      ? fact.a === 2 || fact.b === 2
      : fact.b === 2 || fact.result === 2;
    if (!belongsToTwos || !progress[fact.id]) continue;
    // Keep answer history and earned rewards; reset only the knowledge level.
    progress[fact.id] = { ...progress[fact.id], streak: 0 };
  }

  return {
    ...state,
    games: { ...state.games, [gameId]: { ...record, adaptive: progress } },
    oneTimeUnlocks: { ...state.oneTimeUnlocks, [RESET_TWOS_ID]: true }
  };
}
