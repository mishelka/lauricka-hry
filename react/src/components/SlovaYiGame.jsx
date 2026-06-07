import { useMemo, useRef, useState } from 'react';
import { SLOVA_YI_GROUPS, SLOVA_YI_TASKS } from '../data/tasks';
import { getStarCount, shuffleArray, triggerFireworks } from '../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../utils/player';

const MAX_STARS = 5;

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

export default function SlovaYiGame() {
  const groups = useMemo(() => (SLOVA_YI_GROUPS.length > 0 ? SLOVA_YI_GROUPS : [SLOVA_YI_TASKS]), []);
  const [levelStars, setLevelStars] = useState(() => getLevelStars('slovaYi', groups.length));
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [order, setOrder] = useState([]);
  const [index, setIndex] = useState(0);
  const [hit, setHit] = useState(0);
  const [miss, setMiss] = useState(0);
  const [wrongItems, setWrongItems] = useState(new Set());
  const [displayWord, setDisplayWord] = useState('?');
  const [resultVisible, setResultVisible] = useState(false);
  const [mistakesOnCurrent, setMistakesOnCurrent] = useState(0);
  const [disabledOptions, setDisabledOptions] = useState(new Set());
  const [feedbackMap, setFeedbackMap] = useState({});
  const fireworksRef = useRef(null);

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
    const shuffled = shuffleArray(groups[level]);
    setSelectedLevel(level);
    setOrder(shuffled);
    setIndex(0);
    setHit(0);
    setMiss(0);
    setWrongItems(new Set());
    setDisplayWord(shuffled[0]?.vypis ?? '?');
    setResultVisible(false);
    setMistakesOnCurrent(0);
    setDisabledOptions(new Set());
    setFeedbackMap({});
  }

  function resetQuestionState(nextIndex, nextOrder) {
    const question = nextOrder[nextIndex];
    setDisplayWord(question?.vypis ?? '?');
    setMistakesOnCurrent(0);
    setDisabledOptions(new Set());
    setFeedbackMap({});
  }

  function finishLevel(finalMiss, wrongSet) {
    const stars = getStarCount(finalMiss);
    const previous = levelStars[selectedLevel] || 0;
    const best = Math.max(previous, stars);
    const updated = updateLevelBestStars('slovaYi', selectedLevel, best, groups.length);
    setLevelStars(updated);
    setWrongItems(new Set(wrongSet));
    setResultVisible(true);
  }

  function check(optionId) {
    const task = order[index];
    if (!task || resultVisible || disabledOptions.has(optionId)) return;

    const answerGroup = optionId.startsWith('tvrde') ? 'tvrde' : 'makke';
    if (answerGroup === task.odpoved) {
      setFeedbackMap(prev => ({ ...prev, [optionId]: 'correct' }));
      setDisabledOptions(new Set(['makke', 'makke-dlhe', 'tvrde', 'tvrde-dlhe']));
      if (mistakesOnCurrent === 0) setHit(prev => prev + 1);
      setDisplayWord(task.cele);
      triggerFireworks(fireworksRef.current);

      setTimeout(() => {
        const nextIndex = index + 1;
        if (nextIndex >= order.length) {
          finishLevel(miss, wrongItems);
          return;
        }
        setIndex(nextIndex);
        resetQuestionState(nextIndex, order);
      }, 1200);
      return;
    }

    setFeedbackMap(prev => ({ ...prev, [optionId]: 'wrong' }));
    setDisabledOptions(prev => {
      const next = new Set(prev);
      next.add(optionId);
      return next;
    });
    setMistakesOnCurrent(prev => prev + 1);
    setMiss(prev => prev + 1);
    setWrongItems(prev => {
      const next = new Set(prev);
      next.add(task.cele);
      return next;
    });
  }

  const levelDone = selectedLevel !== null ? (levelStars[selectedLevel] || 0) === MAX_STARS : false;
  const hasNextLevel = selectedLevel !== null && selectedLevel < groups.length - 1;

  if (selectedLevel === null) {
    return (
      <div>
        <h1>Slová: Levely 1-8</h1>
        <p className="level-menu-help">Na odomknutie ďalšieho levelu potrebuješ 5 hviezd v aktuálnom leveli.</p>
        <div className="levels-grid">
          {groups.map((_, level) => {
            const best = levelStars[level] || 0;
            const unlocked = isLevelUnlocked(level);
            const classes = ['level-btn'];
            if (best === MAX_STARS) classes.push('completed');
            if (!unlocked && best < MAX_STARS) classes.push('locked');

            return (
              <button
                key={level}
                className={classes.join(' ')}
                disabled={!unlocked}
                onClick={() => startLevel(level)}
              >
                {`Level ${level + 1}`}
                <small>{renderStars(best)}</small>
                {!unlocked && <small>{`Najprv získaj 5★ v leveli ${level}`}</small>}
              </button>
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
            ? (hasNextLevel ? 'Level splnený na 5★. Môžeš pokračovať ďalej.' : 'Výborne, dokončil(a) si všetky levely!')
            : `Získal(a) si ${stars}/5 ★. Pre ďalší level potrebuješ 5/5 ★.`}
        </div>
        <div className="wrong-list">
          {wrongItems.size > 0 ? `Precvič si: ${Array.from(wrongItems).join(', ')}` : 'Výborne, žiadne chyby!'}
        </div>
        <div className="result-actions">
          <button className="btn-restart" onClick={() => startLevel(selectedLevel)}>Opakovať level</button>
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
        <h1>Doplň správne i/y:</h1>
        <div className="current-level">{`Level ${selectedLevel + 1} • Najlepšie: ${levelStars[selectedLevel] || 0}/5 ★`}</div>
        <div className="score-board">
          Správne: <span className="score-hit">{hit}</span> | Chyby: <span className="score-miss">{miss}</span>
        </div>
        <div className="prompt prompt-words">{displayWord}</div>
        <div className="button-grid-2x2">
          {[
            { id: 'makke', label: 'I', className: 'btn-sl-makke' },
            { id: 'makke-dlhe', label: 'Í', className: 'btn-sl-makke' },
            { id: 'tvrde', label: 'Y', className: 'btn-sl-tvrde' },
            { id: 'tvrde-dlhe', label: 'Ý', className: 'btn-sl-tvrde' }
          ].map(option => (
            <button
              key={option.id}
              className={option.className}
              onClick={() => check(option.id)}
              disabled={disabledOptions.has(option.id)}
            >
              {option.label}
              {feedbackMap[option.id] && (
                <span className="icon">{feedbackMap[option.id] === 'correct' ? '✅' : '❌'}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="fireworks-overlay" ref={fireworksRef} />
    </>
  );
}
