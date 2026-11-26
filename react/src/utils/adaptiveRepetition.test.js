import assert from 'node:assert/strict';
import test from 'node:test';
import { applyAnswer, countMastered, isMastered, pickAdaptiveRound } from './adaptiveRepetition.js';

const fact = { id: 'multiply-2-3' };

test('a fact is mastered after two correct first attempts', () => {
  const once = applyAnswer({}, fact.id, true);
  assert.equal(isMastered(once[fact.id]), false);
  const twice = applyAnswer(once, fact.id, true);
  assert.equal(isMastered(twice[fact.id]), true);
  assert.equal(countMastered([fact], twice), 1);
  assert.deepEqual(pickAdaptiveRound([fact], twice, 10), []);
});

test('mistakes preserve knowledge and the next correct answer completes mastery', () => {
  const once = applyAnswer({}, fact.id, true);
  const wrong = applyAnswer(applyAnswer(once, fact.id, false), fact.id, false);
  assert.deepEqual(wrong[fact.id], { correct: 1, wrong: 2, streak: 1 });
  assert.deepEqual(once[fact.id], { correct: 1, wrong: 0, streak: 1 });
  assert.equal(isMastered(wrong[fact.id]), false);
  assert.equal(isMastered(applyAnswer(wrong, fact.id, true)[fact.id]), true);
});

test('mistakes do not grant progress or lower mastered knowledge', () => {
  assert.deepEqual(applyAnswer({}, fact.id, false)[fact.id], { correct: 0, wrong: 1, streak: 0 });
  const mastered = { [fact.id]: { correct: 2, wrong: 0, streak: 2 } };
  const wrong = applyAnswer(mastered, fact.id, false);
  assert.equal(wrong[fact.id].streak, 2);
  assert.equal(isMastered(wrong[fact.id]), true);
});

test('saved progress at two or three correct answers already qualifies as mastered', () => {
  assert.equal(isMastered({ correct: 2, wrong: 0, streak: 2 }), true);
  assert.equal(isMastered({ correct: 3, wrong: 0, streak: 3 }), true);
});
