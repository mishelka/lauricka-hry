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
  return getRecord(state, gameId).bestStars;
}

export function updateBestStars(gameId, stars) {
  const state = loadState();
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
  const rec = getRecord(state, gameId);
  const out = new Array(levelCount).fill(0).map((_, i) => clampStars(rec.levelStars[i]));
  rec.levelStars = out;
  saveState(state);
  return out;
}

export function updateLevelBestStars(gameId, levelIndex, stars, levelCount) {
  const state = loadState();
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
