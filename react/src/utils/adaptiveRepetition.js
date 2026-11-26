export const MASTERY_STREAK = 3;

export function isMastered(stat) {
  return Number(stat?.streak) >= MASTERY_STREAK;
}

export function getFactWeight(stat) {
  const streak = Number.isFinite(Number(stat?.streak)) ? Math.max(0, Number(stat.streak)) : 0;
  const wrong = Number.isFinite(Number(stat?.wrong)) ? Math.max(0, Number(stat.wrong)) : 0;
  return (1 + wrong) / (2 ** streak);
}

export function pickAdaptiveRound(facts, progress, count) {
  const requestedCount = Number.isFinite(Number(count)) ? Math.max(0, Math.floor(Number(count))) : 0;
  if (!Array.isArray(facts) || requestedCount === 0) return [];

  const seenIds = new Set();
  const candidates = facts.filter(fact => {
    if (!fact || fact.id == null || seenIds.has(fact.id) || isMastered(progress?.[fact.id])) return false;
    seenIds.add(fact.id);
    return true;
  });
  const selected = [];

  while (selected.length < requestedCount && candidates.length > 0) {
    const weights = candidates.map(fact => getFactWeight(progress?.[fact.id]));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let target = Math.random() * totalWeight;
    let selectedIndex = candidates.length - 1;

    for (let i = 0; i < candidates.length; i++) {
      target -= weights[i];
      if (target < 0) {
        selectedIndex = i;
        break;
      }
    }

    selected.push(candidates.splice(selectedIndex, 1)[0]);
  }

  return selected;
}

export function applyAnswer(progress, factId, wasCorrectFirstTry) {
  const safeProgress = progress && typeof progress === 'object' && !Array.isArray(progress) ? progress : {};
  const previous = safeProgress[factId] && typeof safeProgress[factId] === 'object' ? safeProgress[factId] : {};
  const correct = Number.isFinite(Number(previous.correct)) ? Math.max(0, Math.floor(Number(previous.correct))) : 0;
  const wrong = Number.isFinite(Number(previous.wrong)) ? Math.max(0, Math.floor(Number(previous.wrong))) : 0;
  const streak = Number.isFinite(Number(previous.streak)) ? Math.max(0, Math.floor(Number(previous.streak))) : 0;

  return {
    ...safeProgress,
    [factId]: wasCorrectFirstTry
      ? { correct: correct + 1, wrong, streak: streak + 1 }
      : { correct, wrong: wrong + 1, streak: 0 }
  };
}

export function countMastered(facts, progress) {
  if (!Array.isArray(facts)) return 0;
  return facts.filter(fact => isMastered(progress?.[fact.id])).length;
}