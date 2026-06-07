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

  const wasMigrated = Boolean(state.migratedLegacyV1);
  state.migratedLegacyV1 = true;
  if (changed || !wasMigrated) {
    saveState(state);
  }
}

function getRecord(state, gameId) {
  if (!state.games[gameId] || typeof state.games[gameId] !== 'object') {
    state.games[gameId] = { bestStars: 0, levelStars: [] };
  }
  const rec = state.games[gameId];
  if (!Array.isArray(rec.levelStars)) rec.levelStars = [];
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
