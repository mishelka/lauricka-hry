import assert from 'node:assert/strict';
import test from 'node:test';
import { initializeLauraMathProgress, resetLauraTwosProgressOnce } from './lauraMathProgress.js';
import { NASOBENIE_DELENIE_FACTS } from '../data/nasobenieDelenieData.js';
import { isMastered } from './adaptiveRepetition.js';

test('recognizes Laura and common variants regardless of accents, casing and spaces', () => {
  for (const playerName of ['Laura', 'Lauricka', ' Laurička ', 'LAURINKA', 'Laurka', 'Lauri', 'Lauruška']) {
    assert.ok(initializeLauraMathProgress({ playerName, games: {} }), playerName);
  }
  for (const playerName of ['', 'Eva', 'Laurencia', 'Laura2', 'Nie som Laura', null]) {
    const state = { playerName, games: {} };
    const before = structuredClone(state);
    assert.equal(initializeLauraMathProgress(state), null);
    assert.deepEqual(state, before);
  }
});

test('marks only existing facts from known multiplication families and inverse division', () => {
  const next = initializeLauraMathProgress({ playerName: 'Laura', games: {} });
  const progress = next.games.adaptivneOpakovanie.adaptive;
  for (const fact of NASOBENIE_DELENIE_FACTS) {
    const factors = fact.op === 'multiply' ? [fact.a, fact.b] : [fact.b, fact.result];
    const expected = factors.some(value => [1, 2, 10].includes(value));
    assert.equal(isMastered(progress[fact.id]), expected, fact.text);
  }
  assert.ok(progress['multiply-1-3']);
  assert.ok(progress['multiply-3-10']);
  assert.ok(progress['divide-30-3']);
  assert.equal(progress['multiply-3-4'], undefined);
  assert.equal(progress['divide-12-3'], undefined);
});

test('preserves previous progress and profile data without mutating the original state', () => {
  const state = {
    playerName: 'Laura', smileys: ['existing'], oneTimeUnlocks: { previous: true },
    games: {
      yi: { bestStars: 4 },
      adaptivneOpakovanie: { bestStars: 5, adaptive: {
        'multiply-2-3': { correct: 7, wrong: 3, streak: 4 },
        'multiply-3-4': { correct: 1, wrong: 2, streak: 1 }
      } }
    }
  };
  const before = structuredClone(state);
  const next = initializeLauraMathProgress(state);
  assert.deepEqual(state, before);
  assert.deepEqual(next.games.adaptivneOpakovanie.adaptive['multiply-2-3'], before.games.adaptivneOpakovanie.adaptive['multiply-2-3']);
  assert.deepEqual(next.games.adaptivneOpakovanie.adaptive['multiply-3-4'], before.games.adaptivneOpakovanie.adaptive['multiply-3-4']);
  assert.equal(next.games.adaptivneOpakovanie.bestStars, 5);
  assert.deepEqual(next.games.yi, state.games.yi);
  assert.deepEqual(next.smileys, state.smileys);
  assert.equal(next.oneTimeUnlocks.previous, true);
});

test('runs once, survives reload and does not reapply after a deliberate progress reset', () => {
  const next = JSON.parse(JSON.stringify(initializeLauraMathProgress({ playerName: 'Laura', games: {} })));
  assert.equal(initializeLauraMathProgress(next), null);
  next.games.adaptivneOpakovanie.adaptive = {};
  assert.equal(initializeLauraMathProgress(next), null);
  assert.deepEqual(next.games.adaptivneOpakovanie.adaptive, {});
});

test('an ineligible profile does not consume the one-time initialization', () => {
  const state = { playerName: 'Eva', games: {} };
  assert.equal(initializeLauraMathProgress(state), null);
  state.playerName = 'Laura';
  assert.ok(initializeLauraMathProgress(state));
});

test('resets Laura’s twos, both multiplication orders and inverse division, without changing other progress', () => {
  const adaptive = Object.fromEntries(NASOBENIE_DELENIE_FACTS.map(fact => [fact.id, { correct: 4, wrong: 1, streak: 3 }]));
  const state = {
    playerName: 'Laura', smileys: ['nas_2_multiply', 'existing'],
    oneTimeUnlocks: { laura_math_1_2_10_v1: true },
    games: { yi: { bestStars: 5 }, adaptivneOpakovanie: { bestStars: 4, adaptive } }
  };
  const before = structuredClone(state);
  const next = resetLauraTwosProgressOnce(state);
  for (const fact of NASOBENIE_DELENIE_FACTS) {
    const factors = fact.op === 'multiply' ? [fact.a, fact.b] : [fact.b, fact.result];
    const stat = next.games.adaptivneOpakovanie.adaptive[fact.id];
    assert.deepEqual(stat, { correct: 4, wrong: 1, streak: factors.includes(2) ? 0 : 3 }, fact.text);
  }
  assert.deepEqual(state, before);
  assert.deepEqual(next.smileys, before.smileys);
  assert.deepEqual(next.games.yi, before.games.yi);
  assert.equal(next.games.adaptivneOpakovanie.bestStars, 4);
});

test('the correction applies only to the Laura login and does not consume other players’ migration', () => {
  for (const playerName of ['Laura', ' LAURA ']) assert.ok(resetLauraTwosProgressOnce({ playerName }));
  for (const playerName of ['Eva', 'Lauricka', 'Laura2', '', null]) {
    const state = { playerName, games: {} };
    assert.equal(resetLauraTwosProgressOnce(state), null);
    assert.deepEqual(state, { playerName, games: {} });
  }
});

test('reset runs once and does not clear subsequently earned knowledge after a reload', () => {
  const granted = initializeLauraMathProgress({ playerName: 'Laura', games: {} });
  const reset = resetLauraTwosProgressOnce(granted);
  assert.equal(reset.games.adaptivneOpakovanie.adaptive['multiply-2-3'].streak, 0);
  reset.games.adaptivneOpakovanie.adaptive['multiply-2-3'].streak = 1;
  const reloaded = JSON.parse(JSON.stringify(reset));
  assert.equal(initializeLauraMathProgress(reloaded), null);
  assert.equal(resetLauraTwosProgressOnce(reloaded), null);
  assert.equal(reloaded.games.adaptivneOpakovanie.adaptive['multiply-2-3'].streak, 1);
  assert.equal(reloaded.games.adaptivneOpakovanie.adaptive['multiply-1-3'].streak, 2);
  assert.equal(reloaded.games.adaptivneOpakovanie.adaptive['multiply-3-10'].streak, 2);
});
