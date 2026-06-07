import { useState } from 'react';
import ResultScreen from './ResultScreen';
import { triggerFireworks } from '../utils/gameUtils';
import { getBestStars, updateBestStars } from '../utils/player';
import { AUDIO_TALES } from '../data/audioTales';

const TOTAL = 5;

function rnd(max) {
  return Math.floor(Math.random() * max);
}

function isOneDigit(n) {
  return n >= 0 && n <= 9;
}

function makeExample() {
  while (true) {
    const op = Math.random() < 0.5 ? '+' : '-';
    let a = rnd(100);
    let b = rnd(100);

    if (isOneDigit(a) && isOneDigit(b)) continue;

    if (op === '+') {
      const result = a + b;
      if (result > 99) continue;
      return { text: `${a} + ${b}`, result };
    }

    if (a < b) [a, b] = [b, a];
    return { text: `${a} - ${b}`, result: a - b };
  }
}

function makeExamples() {
  return Array.from({ length: TOTAL }, () => makeExample());
}

export default function RatanieGame() {
  const [bestStars, setBestStars] = useState(() => getBestStars('ratanie'));
  const [examples, setExamples] = useState(() => makeExamples());
  const [index, setIndex] = useState(0);
  const [hit, setHit] = useState(0);
  const [miss, setMiss] = useState(0);
  const [wrongItems, setWrongItems] = useState(new Set());
  const [inputValue, setInputValue] = useState('');
  const [mistakesOnCurrent, setMistakesOnCurrent] = useState(0);
  const [locked, setLocked] = useState(false);

  const finished = index >= examples.length;
  const current = !finished ? examples[index] : null;

  function restart() {
    setExamples(makeExamples());
    setIndex(0);
    setHit(0);
    setMiss(0);
    setWrongItems(new Set());
    setInputValue('');
    setMistakesOnCurrent(0);
    setLocked(false);
  }

  function nextQuestion() {
    setIndex(prev => prev + 1);
    setInputValue('');
    setMistakesOnCurrent(0);
    setLocked(false);
  }

  function pressDigit(d) {
    if (locked) return;
    setInputValue(prev => (prev.length >= 3 ? prev : d + prev));
  }

  function backspace() {
    if (locked) return;
    setInputValue(prev => prev.slice(1));
  }

  function submit() {
    if (locked || !current || inputValue === '') return;
    const value = Number(inputValue);

    if (value === current.result) {
      setLocked(true);
      if (mistakesOnCurrent === 0) setHit(prev => prev + 1);
      triggerFireworks(document.querySelector('.fireworks-overlay'));
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
    setInputValue('');
  }

  if (finished) {
    return (
      <ResultScreen
        miss={miss}
        wrongItems={Array.from(wrongItems)}
        onRestart={restart}
        onResult={stars => setBestStars(updateBestStars('ratanie', stars))}
        taleUrl={AUDIO_TALES.ratanie}
      />
    );
  }

  return (
    <>
      <div className="game-ui">
        <h1>Rátanie</h1>
        <div className="score-board">
          Správne: <span className="score-hit">{hit}</span> | Chyby: <span className="score-miss">{miss}</span>
        </div>
        <div className="best-stars">Najviac hviezd: {bestStars}/5 ★</div>
        <div className="progress">Príklad {index + 1}/{TOTAL}</div>
        <div className="prompt prompt-ratanie">{current.text} = ?</div>
        <div className="answer-display">
          <span className="cursor">_</span>
          <span>{inputValue || '\u00a0'}</span>
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
      <div className="fireworks-overlay" />
    </>
  );
}
