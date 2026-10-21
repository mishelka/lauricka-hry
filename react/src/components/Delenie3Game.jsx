import { useEffect, useMemo, useRef, useState } from 'react';
import { DELENIE_3_GROUPS, DELENIE_3_RULES } from '../data/delenie3Data';
import { getStarCount, shuffleArray, triggerFireworks } from '../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../utils/player';
import BlockOutGame from '../rewards/BlockOutGame';
import { RestartIcon, NextLevelIcon, LevelsMenuIcon, GameIcon } from './Icons';

const QUESTIONS_PER_LEVEL = 10;
const MAX_STARS = 5;

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

export default function Delenie3Game() {
  const groups = useMemo(() => DELENIE_3_GROUPS, []);
  const [levelStars, setLevelStars] = useState(() => getLevelStars('delenie3', groups.length));
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [playingRewardLevel, setPlayingRewardLevel] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [examples, setExamples] = useState([]);
  const [index, setIndex] = useState(0);
  const [hit, setHit] = useState(0);
  const [miss, setMiss] = useState(0);
  const [wrongItems, setWrongItems] = useState(new Set());
  const [inputDigits, setInputDigits] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [activeHint, setActiveHint] = useState('');
  const [mistakesOnCurrent, setMistakesOnCurrent] = useState(0);
  const [resultVisible, setResultVisible] = useState(false);
  const fireworksRef = useRef(null);

  const current = examples[index] || null;

  function highestUnlockedLevel(starsByLevel) {
    let highest = 0;
    for (let i = 0; i < starsByLevel.length - 1; i++) {
      if (starsByLevel[i] === MAX_STARS) highest = i + 1;
      else break;
    }
    return highest;
  }

  function isLevelUnlocked(level) {
    return level <= highestUnlockedLevel(levelStars);
  }

  function startLevel(level) {
    if (!isLevelUnlocked(level)) return;
    const pool = groups[level] || [];
    const shuffled = shuffleArray(pool).slice(0, Math.min(pool.length, QUESTIONS_PER_LEVEL));
    setSelectedLevel(level);
    setExamples(shuffled);
    setIndex(0);
    setHit(0);
    setMiss(0);
    setWrongItems(new Set());
    setInputDigits('');
    setStatus('idle');
    setActiveHint('');
    setMistakesOnCurrent(0);
    setResultVisible(false);
  }

  function finishLevel(finalMiss, wrongSet) {
    const stars = getStarCount(finalMiss);
    const previous = levelStars[selectedLevel] || 0;
    const best = Math.max(previous, stars);
    const updated = updateLevelBestStars('delenie3', selectedLevel, best, groups.length);
    setLevelStars(updated);
    setWrongItems(new Set(wrongSet));
    setResultVisible(true);
  }

  function nextQuestion(nextOrder, nextIndex, currentMiss, currentWrong) {
    if (nextIndex >= nextOrder.length) {
      finishLevel(currentMiss, currentWrong);
      return;
    }
    setIndex(nextIndex);
    setInputDigits('');
    setStatus('idle');
    setActiveHint('');
    setMistakesOnCurrent(0);
  }

  function pressDigit(d) {
    if (status === 'correct' || resultVisible) return;
    setInputDigits(prev => {
      if (prev.length >= 3) return prev;
      return prev + d;
    });
  }

  function backspace() {
    if (status === 'correct' || resultVisible) return;
    setInputDigits(prev => prev.slice(0, -1));
  }

  function submitAnswer() {
    if (status === 'correct' || resultVisible || !current) return;
    if (inputDigits === '') return;

    const value = Number(inputDigits);
    if (value === current.result) {
      setStatus('correct');
      if (current.hint) setActiveHint(current.hint);
      const isFirstAttempt = mistakesOnCurrent === 0;
      if (isFirstAttempt) setHit(prev => prev + 1);
      triggerFireworks(fireworksRef.current);

      setTimeout(() => {
        nextQuestion(examples, index + 1, miss, wrongItems);
      }, 1200);
      return;
    }

    setStatus('wrong');
    const newMiss = miss + 1;
    setMiss(newMiss);
    setMistakesOnCurrent(prev => prev + 1);
    if (current.hint) setActiveHint(current.hint);
    const nextWrong = new Set(wrongItems);
    nextWrong.add(`${current.text} = ${current.result}`);
    setWrongItems(nextWrong);

    setTimeout(() => {
      setStatus('idle');
      setInputDigits('');
    }, 1000);
  }

  // Keyboard navigation
  useEffect(() => {
    if (selectedLevel === null || resultVisible) return;

    function handleKeyDown(e) {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        pressDigit(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        submitAnswer();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (playingRewardLevel !== null) {
    return (
      <BlockOutGame
        rewardLevel={playingRewardLevel}
        onCloseReward={() => setPlayingRewardLevel(null)}
        onNextVybraneLevel={() => {
          setPlayingRewardLevel(null);
          if (selectedLevel !== null && selectedLevel < groups.length - 1) {
            startLevel(selectedLevel + 1);
          }
        }}
      />
    );
  }

  const levelDone = selectedLevel !== null ? (levelStars[selectedLevel] || 0) === MAX_STARS : false;
  const hasNextLevel = selectedLevel !== null && selectedLevel < groups.length - 1;

  if (selectedLevel === null) {
    return (
      <div>
        <h1>Delenie do 3</h1>
        <p className="level-menu-help">
          Na odomknutie ďalšieho levelu potrebuješ 5 hviezd v aktuálnom leveli.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            className="btn-toggle-rules"
            onClick={() => setShowRules(prev => !prev)}
          >
            {showRules ? '✕ Skryť pravidlá' : '📖 Pravidlá delenia'}
          </button>
        </div>

        {showRules && (
          <div className="rules-panel">
            <h3>Pravidlá delenia do 3</h3>
            <ul>
              {DELENIE_3_RULES.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="levels-grid">
          {groups.map((_, level) => {
            const best = levelStars[level] || 0;
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
                  <small>{renderStars(best)}</small>
                  {!unlocked && <small>{`Najprv získaj 5★ v leveli ${level}`}</small>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (resultVisible) {
    const stars = getStarCount(miss);
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
            ? (hasNextLevel ? 'Level splnený na 5★! Odomkla sa ti odmena Block Out a ďalší level.' : 'Fantastické! Zvládla si všetky úrovne delenia do 3!')
            : `Získala si ${stars}/5 ★. Na postup do ďalšieho levelu a odmenu potrebuješ 5/5 ★.`}
        </div>
        <div className="wrong-list">
          {wrongItems.size > 0 ? `Precvič si: ${Array.from(wrongItems).join(', ')}` : 'Výborne, žiadne chyby! Všetko správne! 🎉'}
        </div>
        <div className="result-actions">
          <button className="btn-restart" onClick={() => startLevel(selectedLevel)}>
            <RestartIcon />
            <span>Opakovať level</span>
          </button>
          {stars === 5 && (
            <button
              type="button"
              className="btn-reward-game"
              onClick={() => setPlayingRewardLevel(selectedLevel)}
            >
              <GameIcon />
              <span>{`Hrať odmenu: Block Out (${selectedLevel + 1}. level)`}</span>
            </button>
          )}
          {hasNextLevel && levelDone && (
            <button className="btn-next-level" onClick={() => startLevel(selectedLevel + 1)}>
              <NextLevelIcon />
              <span>Ďalší level</span>
            </button>
          )}
          <button className="btn-secondary" onClick={() => setSelectedLevel(null)}>
            <LevelsMenuIcon />
            <span>Menu levelov</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="game-ui">
        <h1>Delenie do 3</h1>
        <div className="current-level">
          {`Level ${selectedLevel + 1} • Úloha ${index + 1}/${examples.length}`}
        </div>
        <div className="score-board">
          Správne: <span className="score-hit">{hit}</span> | Chyby: <span className="score-miss">{miss}</span>
        </div>

        <div className="math-horizontal-container">
          <div className="math-expr-text">
            {current.text} =
          </div>
          <div className={`math-input-box ${status === 'correct' ? 'correct' : (status === 'wrong' ? 'wrong' : '')}`}>
            {inputDigits !== '' ? inputDigits : <span className="math-cursor">?</span>}
          </div>
        </div>

        {activeHint && (
          <div className="hint-box" style={{
            fontSize: '17px',
            color: '#1a365d',
            background: '#e2f1fc',
            padding: '10px 14px',
            borderRadius: '12px',
            marginBottom: '14px',
            fontWeight: 'bold',
            border: '1px solid #90cdf4'
          }}>
            💡 {activeHint}
          </div>
        )}

        <div className="keyboard-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} type="button" className="btn-key" onClick={() => pressDigit(String(n))}>
              {n}
            </button>
          ))}
          <button type="button" className="btn-key btn-util" onClick={backspace}>
            ⌦
          </button>
          <button key={0} type="button" className="btn-key" onClick={() => pressDigit('0')}>
            0
          </button>
          <button type="button" className="btn-key btn-ok" onClick={submitAnswer}>
            OK
          </button>
        </div>
      </div>
      <div className="fireworks-overlay" ref={fireworksRef} />
    </>
  );
}
