import { ALL_SMILEYS, SMILEYS_CATALOG, SMILEYS_MAP } from '../data/smileysData';

const STORAGE_KEY = 'laurickaPlayerV1';
const MAX_STARS = 5;

const LEGACY_BEST_STAR_KEYS = {
  yi: ['yiBestStarsV1', 'yiBestStars'],
  obojake: ['obojakeBestStarsV1', 'obojakeBestStars'],
  ratanie: ['ratanieBestStarsV1', 'ratanieBestStars']
};

const LEGACY_SLOVA_LEVEL_KEYS = ['slovaYiLevelStarsV1', 'slovaYiLevelStars'];
const LEGACY_SLOVA_STATE_KEYS = ['slovaYiGameStateV1', 'slovaYiGameState'];

function clampStars(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(MAX_STARS, Math.floor(n)));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { games: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { games: {} };
    if (!parsed.games || typeof parsed.games !== 'object') parsed.games = {};
    return parsed;
  } catch {
    return { games: {} };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeLevelStars(state, gameId, starsArray, levelCount) {
  const rec = getRecord(state, gameId);
  const levels = new Array(levelCount).fill(0).map((_, i) => clampStars(rec.levelStars[i]));
  let changed = false;

  for (let i = 0; i < levelCount; i++) {
    const incoming = clampStars(Array.isArray(starsArray) ? starsArray[i] : 0);
    if (incoming > levels[i]) {
      levels[i] = incoming;
      changed = true;
    }
  }

  if (changed) {
    rec.levelStars = levels;
    rec.bestStars = Math.max(rec.bestStars, levels.reduce((a, b) => Math.max(a, b), 0));
  }

  return changed;
}

function migrateLegacyIfNeeded(state) {
  let changed = false;

  Object.entries(LEGACY_BEST_STAR_KEYS).forEach(([gameId, keys]) => {
    keys.forEach(key => {
      const value = clampStars(localStorage.getItem(key));
      if (value <= 0) return;

      const rec = getRecord(state, gameId);
      if (value > rec.bestStars) {
        rec.bestStars = value;
        changed = true;
      }
    });
  });

  LEGACY_SLOVA_LEVEL_KEYS.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw && mergeLevelStars(state, 'slovaYi', JSON.parse(raw), 8)) {
        changed = true;
      }
    } catch {
      // Ignore malformed legacy values.
    }
  });

  LEGACY_SLOVA_STATE_KEYS.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.levelStars) && mergeLevelStars(state, 'slovaYi', parsed.levelStars, 8)) {
          changed = true;
        }
      }
    } catch {
      // Ignore malformed legacy values.
    }
  });

  const dtnlRec = getRecord(state, 'doplnovacky_dtnl');
  const oldDoplnovacky = getRecord(state, 'doplnovacky');
  if (oldDoplnovacky.bestStars > dtnlRec.bestStars) {
    dtnlRec.bestStars = oldDoplnovacky.bestStars;
    changed = true;
  }

  const oldNasobenie3 = state.games && state.games.nasobenie3;
  if (oldNasobenie3 && Array.isArray(oldNasobenie3.levelStars) && oldNasobenie3.levelStars.some(s => s > 0)) {
    if (mergeLevelStars(state, 'nasobenie5', oldNasobenie3.levelStars, 8)) {
      changed = true;
    }
  }

  const oldDelenie3 = state.games && state.games.delenie3;
  if (oldDelenie3 && Array.isArray(oldDelenie3.levelStars) && oldDelenie3.levelStars.some(s => s > 0)) {
    if (mergeLevelStars(state, 'delenie5', oldDelenie3.levelStars, 8)) {
      changed = true;
    }
  }

  const wasMigrated = Boolean(state.migratedLegacyV1);
  state.migratedLegacyV1 = true;
  if (changed || !wasMigrated) {
    saveState(state);
  }
}

function getRecord(state, gameId) {
  if (!state.games[gameId] || typeof state.games[gameId] !== 'object') {
    state.games[gameId] = { bestStars: 0, levelStars: [], levelPlays: [] };
  }
  const rec = state.games[gameId];
  if (!Array.isArray(rec.levelStars)) rec.levelStars = [];
  if (!Array.isArray(rec.levelPlays)) rec.levelPlays = [];
  if (!rec.savedStates || typeof rec.savedStates !== 'object' || Array.isArray(rec.savedStates)) {
    rec.savedStates = {};
  }
  rec.bestStars = clampStars(rec.bestStars);
  return rec;
}

export function getBestStars(gameId) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  return getRecord(state, gameId).bestStars;
}

export function updateBestStars(gameId, stars) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  const next = clampStars(stars);
  if (next > rec.bestStars) {
    rec.bestStars = next;
    saveState(state);
  }
  return rec.bestStars;
}

function normalizeAdaptiveProgress(progress) {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return null;

  const normalized = {};
  for (const [factId, stat] of Object.entries(progress)) {
    if (!factId || !stat || typeof stat !== 'object' || Array.isArray(stat)) return null;
    const { correct, wrong, streak } = stat;
    if (![correct, wrong, streak].every(value => Number.isInteger(value) && value >= 0)) return null;
    normalized[factId] = { correct, wrong, streak };
  }
  return normalized;
}

export function getAdaptiveProgress(gameId) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  return normalizeAdaptiveProgress(rec.adaptive) || {};
}

export function saveAdaptiveProgress(gameId, progress) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  rec.adaptive = normalizeAdaptiveProgress(progress) || {};
  saveState(state);
  return rec.adaptive;
}

export function resetAdaptiveProgress(gameId) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  rec.adaptive = {};
  saveState(state);
  return rec.adaptive;
}

export function getLevelStars(gameId, levelCount) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  const out = new Array(levelCount).fill(0).map((_, i) => clampStars(rec.levelStars[i]));
  rec.levelStars = out;
  saveState(state);
  return out;
}

export function updateLevelBestStars(gameId, levelIndex, stars, levelCount) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  const levels = new Array(levelCount).fill(0).map((_, i) => clampStars(rec.levelStars[i]));
  const idx = Number(levelIndex);
  if (Number.isInteger(idx) && idx >= 0 && idx < levelCount) {
    const next = clampStars(stars);
    if (next > levels[idx]) levels[idx] = next;
  }
  rec.levelStars = levels;
  rec.bestStars = Math.max(rec.bestStars, levels.reduce((a, b) => Math.max(a, b), 0));
  saveState(state);
  return levels;
}

export function unlockAllLevels(gameId, levelCount) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  const levels = new Array(levelCount).fill(MAX_STARS);
  rec.levelStars = levels;
  rec.bestStars = MAX_STARS;
  saveState(state);
  return levels;
}

export function unlockAllLevelsOnce(gameId, levelCount, unlockId) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  if (state.oneTimeUnlocks?.[unlockId]) return null;

  const rec = getRecord(state, gameId);
  const levels = new Array(levelCount).fill(MAX_STARS);
  rec.levelStars = levels;
  rec.bestStars = MAX_STARS;
  if (!state.oneTimeUnlocks || typeof state.oneTimeUnlocks !== 'object' || Array.isArray(state.oneTimeUnlocks)) {
    state.oneTimeUnlocks = {};
  }
  state.oneTimeUnlocks[unlockId] = true;
  saveState(state);
  return levels;
}

export function getLevelPlays(gameId, levelCount) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  const out = new Array(levelCount).fill(0).map((_, i) => Math.max(0, Math.floor(Number(rec.levelPlays[i]) || 0)));
  rec.levelPlays = out;
  saveState(state);
  return out;
}

export function incrementLevelPlays(gameId, levelIndex, levelCount) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, gameId);
  const plays = new Array(levelCount).fill(0).map((_, i) => Math.max(0, Math.floor(Number(rec.levelPlays[i]) || 0)));
  const idx = Number(levelIndex);
  if (Number.isInteger(idx) && idx >= 0 && idx < levelCount) {
    plays[idx] = (plays[idx] || 0) + 1;
  }
  rec.levelPlays = plays;
  saveState(state);
  return plays;
}

export function getBlockOutSavedState(levelIndex) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, 'blockOut');
  const saved = rec.savedStates ? rec.savedStates[levelIndex] : null;
  if (!saved || typeof saved !== 'object') return null;
  return saved;
}

export function saveBlockOutSavedState(levelIndex, levelState) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, 'blockOut');
  if (!rec.savedStates || typeof rec.savedStates !== 'object' || Array.isArray(rec.savedStates)) {
    rec.savedStates = {};
  }
  rec.savedStates[levelIndex] = levelState;
  saveState(state);
}

export function clearBlockOutSavedState(levelIndex) {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, 'blockOut');
  if (rec.savedStates && rec.savedStates[levelIndex]) {
    delete rec.savedStates[levelIndex];
    saveState(state);
  }
}

export function getBlockOutSavedStates() {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, 'blockOut');
  return rec.savedStates ? { ...rec.savedStates } : {};
}

export function clearAllBlockOutSavedStates() {
  const state = loadState();
  migrateLegacyIfNeeded(state);
  const rec = getRecord(state, 'blockOut');
  rec.savedStates = {};
  saveState(state);
}

export function getCollectedSmileyIds() {
  const state = loadState();
  if (!Array.isArray(state.smileys)) {
    return [];
  }
  return state.smileys.filter(id => Boolean(SMILEYS_MAP[id]));
}

export function awardRandomSmiley() {
  const state = loadState();
  if (!Array.isArray(state.smileys)) {
    state.smileys = [];
  }
  const collectedSet = new Set(state.smileys);
  const uncollected = SMILEYS_CATALOG.filter(s => !collectedSet.has(s.id));

  let awardedSmiley;
  let isNew = false;
  if (uncollected.length > 0) {
    const randomIndex = Math.floor(Math.random() * uncollected.length);
    awardedSmiley = uncollected[randomIndex];
    state.smileys.push(awardedSmiley.id);
    isNew = true;
    saveState(state);
  } else {
    const randomIndex = Math.floor(Math.random() * SMILEYS_CATALOG.length);
    awardedSmiley = SMILEYS_CATALOG[randomIndex];
    isNew = false;
  }

  return {
    smiley: awardedSmiley,
    isNew,
    totalCollected: new Set(state.smileys).size,
    totalAvailable: ALL_SMILEYS.length
  };
}

export function awardSmileyById(smileyId) {
  const smiley = SMILEYS_MAP[smileyId];
  if (!smiley) return null;

  const state = loadState();
  if (!Array.isArray(state.smileys)) {
    state.smileys = [];
  }
  const isNew = !state.smileys.includes(smileyId);
  if (isNew) {
    state.smileys.push(smileyId);
    saveState(state);
  }

  return {
    smiley,
    isNew,
    totalCollected: new Set(state.smileys).size,
    totalAvailable: ALL_SMILEYS.length
  };
}

export function getSmileyCollection() {
  const collectedIds = new Set(getCollectedSmileyIds());
  return ALL_SMILEYS.map(s => ({
    ...s,
    unlocked: collectedIds.has(s.id)
  }));
}

export function getPlayerStats() {
  const state = loadState();
  migrateLegacyIfNeeded(state);

  const gameRecords = state.games || {};
  let totalStars = 0;
  let totalPossibleStars = 0;
  let completed5StarLevels = 0;

  // Single star games
  const singleGames = ['yi', 'obojake', 'cudzie', 'vybraneOpakovanie', 'adaptivneOpakovanie'];
  singleGames.forEach(gid => {
    const rec = gameRecords[gid];
    const stars = rec ? clampStars(rec.bestStars) : 0;
    totalStars += stars;
    totalPossibleStars += 5;
    if (stars === 5) completed5StarLevels += 1;
  });

  // Multi-level games
  const multiGames = [
    { id: 'slovaYi', count: 8 },
    { id: 'doplnovacky_dtnl', count: 5 },
    { id: 'doplnovacky_b', count: 5 },
    { id: 'vybraneB', count: 9 },
    { id: 'vybraneM', count: 9 },
    { id: 'vybraneP', count: 9 },
    { id: 'vybraneR', count: 9 },
    { id: 'vybraneS', count: 9 },
    { id: 'vybraneV', count: 9 },
    { id: 'vybraneZ', count: 9 },
    { id: 'ratanie', count: 10 },
    { id: 'nasobenie5', count: 8 },
    { id: 'delenie5', count: 8 },
    { id: 'blockOut', count: 9 }
  ];

  multiGames.forEach(({ id, count }) => {
    const rec = gameRecords[id];
    const levels = Array.isArray(rec?.levelStars) ? rec.levelStars : [];
    totalPossibleStars += count * 5;
    for (let i = 0; i < count; i++) {
      const s = clampStars(levels[i]);
      totalStars += s;
      if (s === 5) completed5StarLevels += 1;
    }
  });

  const opakovanieRec = gameRecords.vybraneOpakovanie;
  const opakovanieStars = opakovanieRec ? clampStars(opakovanieRec.bestStars) : 0;
  const opakovaniePlays = opakovanieRec && Array.isArray(opakovanieRec.levelPlays) ? (opakovanieRec.levelPlays[0] || 0) : 0;

  const collectedSmileys = getCollectedSmileyIds();

  return {
    totalStars,
    totalPossibleStars,
    completed5StarLevels,
    opakovanieStars,
    opakovaniePlays,
    collectedSmileysCount: collectedSmileys.length,
    totalSmileysCount: ALL_SMILEYS.length
  };
}

export function getTotalStars() {
  return getPlayerStats().totalStars;
}

export function getPlayerName() {
  const state = loadState();
  return typeof state.playerName === 'string' ? state.playerName.trim() : '';
}

export function setPlayerName(name) {
  const state = loadState();
  const trimmed = typeof name === 'string' ? name.trim() : '';
  state.playerName = trimmed;
  saveState(state);
  return trimmed;
}
