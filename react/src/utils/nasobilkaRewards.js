import { NASOBILKA_SMILEYS } from '../data/smileysData';
import { NASOBILKA_OPS, NASOBILKA_TABLES, getTableFacts } from '../data/nasobenieDelenieData';
import { MASTERY_STREAK, isMastered } from './adaptiveRepetition';

export function getStreak(stat) {
  const streak = Number(stat?.streak);
  return Number.isFinite(streak) ? Math.max(0, Math.min(MASTERY_STREAK, Math.floor(streak))) : 0;
}

export function getFactState(stat) {
  if (isMastered(stat)) return 'mastered';
  if (getStreak(stat) > 0) return 'learning';
  return 'fresh';
}

export function isTableMastered(progress, table, op) {
  const facts = getTableFacts(table, op);
  return facts.length > 0 && facts.every(fact => isMastered(progress?.[fact.id]));
}

export function getEarnedNasobilkaRewards(progress) {
  return NASOBILKA_SMILEYS.filter(reward => isTableMastered(progress, reward.table, reward.op));
}

export function getNewNasobilkaRewards(previousProgress, nextProgress) {
  const previouslyEarned = new Set(getEarnedNasobilkaRewards(previousProgress).map(reward => reward.id));
  return getEarnedNasobilkaRewards(nextProgress).filter(reward => !previouslyEarned.has(reward.id));
}

export function getNasobilkaOverview(progress) {
  return NASOBILKA_TABLES.map(table => {
    const ops = NASOBILKA_OPS.map(({ op, label }) => {
      const facts = getTableFacts(table, op).map(fact => {
        const stat = progress?.[fact.id];
        return { ...fact, streak: getStreak(stat), state: getFactState(stat) };
      });
      const mastered = facts.filter(fact => fact.state === 'mastered').length;
      return {
        op,
        label,
        facts,
        mastered,
        total: facts.length,
        reward: NASOBILKA_SMILEYS.find(reward => reward.table === table && reward.op === op) || null
      };
    });
    const total = ops.reduce((sum, item) => sum + item.total, 0);
    const mastered = ops.reduce((sum, item) => sum + item.mastered, 0);
    return { table, ops, total, mastered };
  });
}
