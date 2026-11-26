import { SoundEffects, sounds as blockOutSounds } from '../games/odmeny/soundEffects.js';

const STORAGE_KEY = 'laurickaSoundPreferencesV1';
const CHANGE_EVENT = 'lauricka-sound-change';

export const INCORRECT_SOUNDS = [
  { id: 'soft-tap', name: 'Jemné klopnutie', description: 'Dve krátke, mäkké klopnutia. Nenápadné upozornenie.' },
  { id: 'bubbles', name: 'Klesajúce bublinky', description: 'Tri zaoblené tóny smerom nadol. Hravý zvuk bez ostrého bzučania.' },
  { id: 'oops', name: 'Krátke „ups“', description: 'Jeden mäkký klesajúci tón, ktorý naznačí ďalší pokus.' }
];
export const COMPLETION_SOUNDS = [
  { id: 'stars', name: 'Hviezdičky', description: 'Krátke stúpajúce cinknutie na oslavu dokončenia.' },
  { id: 'fanfare', name: 'Víťazná melódia', description: 'Výraznejšia veselá melódia z piatich tónov.' },
  { id: 'chord', name: 'Pokojný akord', description: 'Jemný súzvuk s doznením. Pokojnejšia odmena za celý level.' }
];

function normalize(value) {
  return {
    muted: value?.muted === true,
    incorrect: INCORRECT_SOUNDS.some(sound => sound.id === value?.incorrect) ? value.incorrect : null,
    complete: COMPLETION_SOUNDS.some(sound => sound.id === value?.complete) ? value.complete : null
  };
}
function readPreferences() {
  try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { return normalize(null); }
}

let preferences = readPreferences();
const engine = new SoundEffects();

function applyMute() {
  for (const player of [engine, blockOutSounds]) {
    player.setMuted(preferences.muted);
    if (preferences.muted && player.ctx) {
      const context = player.ctx;
      player.ctx = null;
      if (context.state !== 'closed') context.close().catch(() => {});
    }
  }
}
applyMute();

export function getSoundPreferences() { return preferences; }
export function setSoundPreferences(patch) {
  preferences = normalize({ ...preferences, ...patch });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch { /* Keep the setting for this session. */ }
  applyMute();
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
export function subscribeSoundPreferences(listener) {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    preferences = readPreferences();
    applyMute();
  });
}

// The same note scores drive the live previews and exported listening samples.
export function scheduleFeedback(context, category, id, delay = 0) {
  const plans = {
    'soft-tap': [[220, 0, .11, 'triangle', .12, 150], [185, .13, .12, 'triangle', .09, 135]],
    bubbles: [[493.88, 0, .16, 'sine', .13], [392, .12, .16, 'sine', .12], [329.63, .24, .19, 'sine', .11]],
    oops: [[440, 0, .27, 'triangle', .1, 220]],
    stars: [[523.25, 0, .2, 'triangle', .12], [659.25, .1, .2, 'triangle', .12], [783.99, .2, .22, 'triangle', .12], [1046.5, .3, .36, 'sine', .13]],
    fanfare: [[392, 0, .17, 'triangle', .12], [523.25, .16, .18, 'triangle', .13], [659.25, .32, .18, 'triangle', .13], [783.99, .48, .18, 'triangle', .13], [1046.5, .66, .48, 'triangle', .14]],
    chord: [[523.25, 0, .95, 'sine', .09], [659.25, .05, .95, 'sine', .08], [783.99, .1, .95, 'sine', .08], [1046.5, .2, .85, 'sine', .055]]
  };
  const options = category === 'incorrect' ? INCORRECT_SOUNDS : COMPLETION_SOUNDS;
  if (!options.some(option => option.id === id)) return;
  for (const [frequency, offset, duration, type, volume, endFrequency] of plans[id]) {
    const start = context.currentTime + delay + offset;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(.001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + .008);
    gain.gain.exponentialRampToValueAtTime(.001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .01);
  }
}

export function previewFeedback(category, id, delay = 0) {
  try {
    engine.init();
    if (engine.ctx) scheduleFeedback(engine.ctx, category, id, delay);
  } catch { /* Audio is optional; unsupported browsers must remain playable. */ }
}
export function previewCorrect() {
  const muted = engine.isMuted();
  try { engine.setMuted(false); engine.playBlockOut(); }
  catch { /* Audio fallback. */ }
  finally { engine.setMuted(muted); }
}

export const learningSounds = {
  correct() { if (!preferences.muted) previewCorrect(); },
  incorrect() { if (!preferences.muted && preferences.incorrect) previewFeedback('incorrect', preferences.incorrect); },
  complete(delay = 0) { if (!preferences.muted && preferences.complete) previewFeedback('complete', preferences.complete, delay); }
};
