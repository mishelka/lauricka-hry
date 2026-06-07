const STORAGE_KEY = 'laurickaPlayerV1';
const MAX_STARS = 5;

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
}

function migrateLegacyIfNeeded(state) {
  if (state.migratedLegacyV1) return;

  const yi = clampStars(localStorage.getItem('yiBestStarsV1'));
  const obojake = clampStars(localStorage.getItem('obojakeBestStarsV1'));

  if (yi > 0) {
    const rec = getRecord(state, 'yi');
    rec.bestStars = Math.max(rec.bestStars, yi);
  }

  if (obojake > 0) {
    const rec = getRecord(state, 'obojake');
    rec.bestStars = Math.max(rec.bestStars, obojake);
  }

  try {
    const slovaLegacyRaw = localStorage.getItem('slovaYiLevelStarsV1');
    if (slovaLegacyRaw) {
      mergeLevelStars(state, 'slovaYi', JSON.parse(slovaLegacyRaw), 8);
    }
  } catch {
    // Ignore malformed legacy values.
  }

  try {
    const slovaStateRaw = localStorage.getItem('slovaYiGameStateV1');
    if (slovaStateRaw) {
      const parsed = JSON.parse(slovaStateRaw);
      if (parsed && Array.isArray(parsed.levelStars)) {
        mergeLevelStars(state, 'slovaYi', parsed.levelStars, 8);
      }
    }
  } catch {
    // Ignore malformed legacy values.
  }

  state.migratedLegacyV1 = true;
  saveState(state);
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
