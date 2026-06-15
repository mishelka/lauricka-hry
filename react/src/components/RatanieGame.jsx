import { useRef, useState } from 'react';
import { getStarCount, triggerFireworks } from '../utils/gameUtils';
import { getBestStars, getLevelStars, updateLevelBestStars } from '../utils/player';
import AudioTalePlayer from './AudioTalePlayer';
import { AUDIO_TALES } from '../data/audioTales';

const TOTAL = 5;
const MAX_STARS = 5;

const LEVELS = [
  { max: 20, mode: 'add' },
  { max: 20, mode: 'sub' },
  { max: 20, mode: 'mixed' },
  { max: 40, mode: 'mixed' },
  { max: 40, mode: 'mixed' },
  { max: 60, mode: 'mixed' },
  { max: 60, mode: 'mixed' },
  { max: 80, mode: 'mixed' },
  { max: 80, mode: 'mixed' },
  { max: 99, mode: 'mixed' }
];

function rnd(max) {
  return Math.floor(Math.random() * max);
}

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

function highestUnlockedLevel(starsByLevel) {
  let highest = 0;
  for (let i = 0; i < starsByLevel.length - 1; i++) {
    if (starsByLevel[i] === MAX_STARS) highest = i + 1;
    else break;
  }
  return highest;
}

function randomInRange(min, max) {
  return min + rnd(max - min + 1);
}

function makeExample(config) {
  const max = config.max;
  while (true) {
    const op = config.mode === 'mixed' ? (Math.random() < 0.5 ? '+' : '-') : (config.mode === 'add' ? '+' : '-');
    let a = randomInRange(1, max);
    let b = randomInRange(1, max);

    if (op === '+') {
      const result = a + b;
      if (result > 99) continue;
      return { a, b, op, text: `${a} + ${b}`, result };
    }

    if (a < b) [a, b] = [b, a];
    return { a, b, op, text: `${a} - ${b}`, result: a - b };
  }
}

function makeExamples(config) {
  return Array.from({ length: TOTAL }, () => makeExample(config));
}

export default function RatanieGame() {
  const [levelStars, setLevelStars] = useState(() => {
    const initial = getLevelStars('ratanie', LEVELS.length);
    const hasAnyLevelStars = initial.some(stars => stars > 0);

    if (!hasAnyLevelStars) {
      const legacyBest = getBestStars('ratanie');
      if (legacyBest > 0) {
        return updateLevelBestStars('ratanie', 0, legacyBest, LEVELS.length);
      }
    }

    return initial;
  });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [examples, setExamples] = useState([]);
  const [index, setIndex] = useState(0);
  const [hit, setHit] = useState(0);
  const [miss, setMiss] = useState(0);
  const [wrongItems, setWrongItems] = useState(new Set());
  const [answerDigits, setAnswerDigits] = useState(['', '']);
  const [activeDigit, setActiveDigit] = useState(0);
  const [mistakesOnCurrent, setMistakesOnCurrent] = useState(0);
  const [locked, setLocked] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const fireworksRef = useRef(null);

  const current = examples[index] || null;

  function isLevelUnlocked(level) {
    return level <= highestUnlockedLevel(levelStars);
  }

  function startLevel(level) {
    if (!isLevelUnlocked(level)) return;
    setSelectedLevel(level);
    setExamples(makeExamples(LEVELS[level]));
    setIndex(0);
    setHit(0);
    setMiss(0);
    setWrongItems(new Set());
    setAnswerDigits(['', '']);
    setActiveDigit(0);
    setMistakesOnCurrent(0);
    setLocked(false);
    setResultVisible(false);
  }

  function finishLevel(finalMiss, wrongSet) {
    const stars = getStarCount(finalMiss);
    const previous = levelStars[selectedLevel] || 0;
    const best = Math.max(previous, stars);
    const updated = updateLevelBestStars('ratanie', selectedLevel, best, LEVELS.length);
    setLevelStars(updated);
    setWrongItems(new Set(wrongSet));
    setResultVisible(true);
  }

  function nextQuestion() {
    const nextIndex = index + 1;
    if (nextIndex >= examples.length) {
      finishLevel(miss, wrongItems);
      return;
    }

    setIndex(nextIndex);
    setAnswerDigits(['', '']);
    setActiveDigit(0);
    setMistakesOnCurrent(0);
    setLocked(false);
  }

  function pressDigit(d) {
    if (locked) return;
    setAnswerDigits(prev => {
      const next = [...prev];
      next[activeDigit] = d;
      return next;
    });
    if (activeDigit < 1) setActiveDigit(activeDigit + 1);
  }

  function backspace() {
    if (locked) return;

    setAnswerDigits(prev => {
      const next = [...prev];
      if (next[activeDigit] !== '') {
        next[activeDigit] = '';
        return next;
      }

      if (activeDigit > 0) {
        const previousIndex = activeDigit - 1;
        next[previousIndex] = '';
        setActiveDigit(previousIndex);
      }

      return next;
    });
  }

  function submit() {
    if (locked || !current || resultVisible) return;

    const valueText = answerDigits.join('');
    if (valueText === '') return;

    const value = Number(valueText);

    if (value === current.result) {
      setLocked(true);
      if (mistakesOnCurrent === 0) setHit(prev => prev + 1);
      triggerFireworks(fireworksRef.current);
      setTimeout(nextQuestion, 1200);
      return;
    }

    setMistakesOnCurrent(prev => prev + 1);
    setMiss(prev => prev + 1);
    setWrongItems(prev => {
      const next = new Set(prev);
      next.add(`${current.text} = ${current.result}`);
      return next;
    });
    setAnswerDigits(['', '']);
    setActiveDigit(0);
  }

  const levelDone = selectedLevel !== null ? (levelStars[selectedLevel] || 0) === MAX_STARS : false;
  const hasNextLevel = selectedLevel !== null && selectedLevel < LEVELS.length - 1;

  if (selectedLevel === null) {
    return (
      <div>
        <h1>Rátanie: Levely 1-10</h1>
        <p className="level-menu-help">Na odomknutie ďalšieho levelu potrebuješ 5 hviezd v aktuálnom leveli.</p>
        <div className="levels-grid">
          {LEVELS.map((config, level) => {
            const best = levelStars[level] || 0;
            const levelTaleUrl = AUDIO_TALES.math[level] || AUDIO_TALES.math[0];
            const unlocked = isLevelUnlocked(level);
            const classes = ['level-btn'];

            if (best === MAX_STARS) classes.push('completed');
            if (!unlocked && best < MAX_STARS) classes.push('locked');

            return (
              <div key={level} className="level-row">
                <button
                  className={classes.join(' ')}
                  disabled={!unlocked}
                  onClick={() => startLevel(level)}
                >
                  {`Level ${level + 1}`}
                  <small>{`${config.mode === 'add' ? 'Sčítanie' : (config.mode === 'sub' ? 'Odčítanie' : 'Sčítanie a odčítanie')} • 1-${config.max}`}</small>
                  <small>{renderStars(best)}</small>
                  {!unlocked && <small>{`Najprv získaj 5★ v leveli ${level}`}</small>}
                </button>
                {best === MAX_STARS && (
                  <AudioTalePlayer
                    taleUrl={levelTaleUrl}
                    className="level-play-btn"
                    playLabel="▶"
                    pauseLabel="⏸"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (resultVisible) {
    const stars = getStarCount(miss);
    const levelTaleUrl = AUDIO_TALES.math[selectedLevel] || AUDIO_TALES.math[0];
    return (
      <div className="result-box">
        <h2>Koniec hry!</h2>
        <div className="stars">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={idx} className={idx < stars ? 'star-gold' : 'star-grey'}>★</span>
          ))}
        </div>
        <div className="level-progress-message">
          {levelDone
            ? (hasNextLevel ? 'Level splnený na 5★. Môžeš pokračovať ďalej.' : 'Výborne, dokončil(a) si všetky levely!')
            : `Získal(a) si ${stars}/5 ★. Pre ďalší level potrebuješ 5/5 ★.`}
        </div>
        <div className="wrong-list">
          {wrongItems.size > 0 ? `Precvič si: ${Array.from(wrongItems).join(', ')}` : 'Výborne, žiadne chyby!'}
        </div>
        <div className="result-actions">
          <button className="btn-restart" onClick={() => startLevel(selectedLevel)}>Opakovať level</button>
          {stars === 5 && <AudioTalePlayer taleUrl={levelTaleUrl} />}
          {hasNextLevel && levelDone && (
            <button className="btn-next-level" onClick={() => startLevel(selectedLevel + 1)}>Ďalší level</button>
          )}
          <button className="btn-secondary" onClick={() => setSelectedLevel(null)}>Menu levelov</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="game-ui">
        <h1>Rátanie</h1>
        <div className="current-level">{`Level ${selectedLevel + 1} • Najlepšie: ${levelStars[selectedLevel] || 0}/5 ★`}</div>
        <div className="score-board">
          Správne: <span className="score-hit">{hit}</span> | Chyby: <span className="score-miss">{miss}</span>
        </div>
        <div className="progress">Príklad {index + 1}/{TOTAL}</div>
        <div className="prompt prompt-ratanie">
          <div className="vertical-math">
            <div className="math-row">
              <span className="math-operator">&nbsp;</span>
              <div className="math-number">
                {String(current.a).padStart(2, ' ').split('').map((digit, i) => (
                  <span key={`top-${i}`} className="digit-box">{digit === ' ' ? '\u00a0' : digit}</span>
                ))}
              </div>
            </div>
            <div className="math-row">
              <span className="math-operator">{current.op}</span>
              <div className="math-number">
                {String(current.b).padStart(2, ' ').split('').map((digit, i) => (
                  <span key={`bottom-${i}`} className="digit-box">{digit === ' ' ? '\u00a0' : digit}</span>
                ))}
              </div>
            </div>
            <div className="math-line" />
            <div className="math-row">
              <span className="math-operator">&nbsp;</span>
              <div className="math-number math-answer">
                {answerDigits.map((digit, i) => (
                  <button
                    key={`answer-${i}`}
                    type="button"
                    className={`digit-input ${activeDigit === i ? 'active' : ''}`}
                    onClick={() => !locked && setActiveDigit(i)}
                  >
                    {digit || '\u00a0'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="keyboard-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} className="btn-key" onClick={() => pressDigit(String(n))}>{n}</button>
          ))}
          <button className="btn-key btn-util" onClick={backspace}>⌦</button>
          <button className="btn-key" onClick={() => pressDigit('0')}>0</button>
          <button className="btn-key btn-ok" onClick={submit}>OK</button>
        </div>
      </div>
      <div className="fireworks-overlay" ref={fireworksRef} />
    </>
  );
}
