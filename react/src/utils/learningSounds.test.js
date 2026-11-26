import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

const saved = new Map();
globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
const parameter = () => ({ values: [], setValueAtTime(value, time) { this.values.push([value, time]); }, exponentialRampToValueAtTime(value, time) { this.values.push([value, time]); } });
class TestAudioContext {
  static notes = [];
  constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
  createOscillator() {
    const note = { frequency: parameter(), connect() {}, start(time) { this.startTime = time; }, stop(time) { this.stopTime = time; } };
    TestAudioContext.notes.push(note);
    return note;
  }
  createGain() { return { gain: parameter(), connect() {} }; }
  close() { this.state = 'closed'; return Promise.resolve(); }
  resume() { return Promise.resolve(); }
}
globalThis.window = new EventTarget();
window.AudioContext = TestAudioContext;
const { INCORRECT_SOUNDS, COMPLETION_SOUNDS, getSoundPreferences, learningSounds, previewCorrect, scheduleFeedback, setSoundPreferences, subscribeSoundPreferences } = await import('./learningSounds.js');
const { sounds: blockOutSounds } = await import('../games/odmeny/soundEffects.js');

beforeEach(() => {
  setSoundPreferences({ muted: false, incorrect: null, complete: null });
  TestAudioContext.notes = [];
});

test('correct feedback uses the exact Block Out portal sweep and four-note chime', () => {
  learningSounds.correct();
  assert.equal(TestAudioContext.notes.length, 5);
  assert.deepEqual(TestAudioContext.notes[0].frequency.values, [[180, 0], [560, .18]]);
  assert.deepEqual(TestAudioContext.notes.slice(1).map(note => note.frequency.values[0][0]), [440, 554.37, 659.25, 880]);
});

test('wrong and completion feedback remain silent until a proposal is selected', () => {
  learningSounds.incorrect(); learningSounds.complete();
  assert.equal(TestAudioContext.notes.length, 0);
  setSoundPreferences({ incorrect: 'soft-tap', complete: 'stars' });
  learningSounds.incorrect(); learningSounds.complete(.55);
  assert.equal(TestAudioContext.notes.length, 6);
  assert.equal(TestAudioContext.notes[2].startTime, .55);
});

test('mute persists, notifies the toggle and also mutes Block Out', () => {
  let changes = 0;
  const unsubscribe = subscribeSoundPreferences(() => changes++);
  setSoundPreferences({ muted: true });
  learningSounds.correct(); learningSounds.incorrect(); learningSounds.complete(); blockOutSounds.playBlockOut();
  assert.equal(TestAudioContext.notes.length, 0);
  assert.equal(changes, 1);
  assert.equal(JSON.parse(saved.get('laurickaSoundPreferencesV1')).muted, true);
  assert.equal(blockOutSounds.isMuted(), true);
  unsubscribe();
  setSoundPreferences({ muted: false });
  learningSounds.correct();
  assert.equal(changes, 1);
  assert.equal(TestAudioContext.notes.length, 5);
});

test('intentional previews work while muted without changing the saved preference', () => {
  setSoundPreferences({ muted: true });
  previewCorrect();
  assert.equal(TestAudioContext.notes.length, 5);
  assert.equal(getSoundPreferences().muted, true);
  learningSounds.correct();
  assert.equal(TestAudioContext.notes.length, 5);
});

test('all six proposals schedule bounded finite notes; invalid choices cannot play', () => {
  assert.equal(INCORRECT_SOUNDS.length, 3); assert.equal(COMPLETION_SOUNDS.length, 3);
  const context = new TestAudioContext();
  for (const option of INCORRECT_SOUNDS) scheduleFeedback(context, 'incorrect', option.id);
  for (const option of COMPLETION_SOUNDS) scheduleFeedback(context, 'complete', option.id);
  assert.equal(TestAudioContext.notes.length, 19);
  for (const note of TestAudioContext.notes) {
    assert.ok(note.stopTime > note.startTime && note.stopTime < 1.5);
    assert.ok(note.frequency.values.every(([frequency, time]) => Number.isFinite(frequency) && frequency > 0 && Number.isFinite(time)));
  }
  const count = TestAudioContext.notes.length;
  scheduleFeedback(context, 'incorrect', 'not-a-sound');
  setSoundPreferences({ incorrect: 'not-a-sound', complete: 'not-a-sound' });
  learningSounds.incorrect(); learningSounds.complete();
  assert.equal(TestAudioContext.notes.length, count);
  assert.equal(getSoundPreferences().incorrect, null);
});
