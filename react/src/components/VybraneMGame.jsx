import { useMemo, useRef, useState } from 'react';
import { VYBRANE_M_GROUPS, VYBRANE_M_RULES, VYBRANE_M_CHYTAKY } from '../data/vybraneMSlova';
import { getStarCount, getVybraneOptionId, shuffleArray, triggerFireworks } from '../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../utils/player';
import BlockOutGame from '../rewards/BlockOutGame';
import { RestartIcon, NextLevelIcon, LevelsMenuIcon, GameIcon } from './Icons';

const QUESTIONS_PER_LEVEL = 15;
const MAX_STARS = 5;

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

export default function VybraneMGame() {
  const groups = useMemo(() => VYBRANE_M_GROUPS, []);
  const [levelStars, setLevelStars] = useState(() => getLevelStars('vybraneM', groups.length));
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [playingRewardLevel, setPlayingRewardLevel] = useState(null);
  const [showRules, setShowRules] = useState(false);
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
  const [activeHint, setActiveHint] = useState('');
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
    const pool = groups[level] || [];
    const shuffled = shuffleArray(pool).slice(0, Math.min(pool.length, QUESTIONS_PER_LEVEL));
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
    setActiveHint('');
  }

  function resetQuestionState(nextIndex, nextOrder) {
    const question = nextOrder[nextIndex];
    setDisplayWord(question?.vypis ?? '?');
    setMistakesOnCurrent(0);
    setDisabledOptions(new Set());
    setFeedbackMap({});
    setActiveHint('');
  }

  function finishLevel(finalMiss, wrongSet) {
    const stars = getStarCount(finalMiss);
    const previous = levelStars[selectedLevel] || 0;
    const best = Math.max(previous, stars);
    const updated = updateLevelBestStars('vybraneM', selectedLevel, best, groups.length);
    setLevelStars(updated);
    setWrongItems(new Set(wrongSet));
    setResultVisible(true);
  }

  function check(optionId) {
    const task = order[index];
    if (!task || resultVisible || disabledOptions.has(optionId)) return;

    const correctOptionId = getVybraneOptionId(task);
    if (optionId === correctOptionId) {
      setFeedbackMap(prev => ({ ...prev, [optionId]: 'correct' }));
      setDisabledOptions(new Set(['makke', 'makke-dlhe', 'tvrde', 'tvrde-dlhe']));
      if (mistakesOnCurrent === 0) setHit(prev => prev + 1);
      setDisplayWord(task.cele);
      if (task.hint) setActiveHint(task.hint);
      triggerFireworks(fireworksRef.current);

      setTimeout(() => {
        const nextIndex = index + 1;
        if (nextIndex >= order.length) {
          finishLevel(miss, wrongItems);
          return;
        }
        setIndex(nextIndex);
        resetQuestionState(nextIndex, order);
      }, 1300);
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
    if (task.hint) setActiveHint(task.hint);
    setWrongItems(prev => {
      const next = new Set(prev);
      next.add(task.cele);
      return next;
    });
  }

  const levelDone = selectedLevel !== null ? (levelStars[selectedLevel] || 0) === MAX_STARS : false;
  const hasNextLevel = selectedLevel !== null && selectedLevel < groups.length - 1;

  if (playingRewardLevel !== null) {
    const hasNextVybraneLevel = playingRewardLevel < groups.length - 1;
    return (
      <div className="reward-game-view">
        <BlockOutGame
          rewardLevel={playingRewardLevel}
          onBack={() => setPlayingRewardLevel(null)}
          onNextVybraneLevel={
            hasNextVybraneLevel
              ? () => {
                  const nextLvl = playingRewardLevel + 1;
                  setPlayingRewardLevel(null);
                  startLevel(nextLvl);
                }
              : null
          }
          hasNextVybraneLevel={hasNextVybraneLevel}
        />
      </div>
    );
  }

  if (selectedLevel === null) {
    return (
      <div>
        <h1>Vybrané slová po M</h1>
        <p className="level-menu-help">Vyber si úroveň a precvič si vybrané slová po M. Získaj 5★ na odomknutie ďalšej úrovne a odmeny.</p>

        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '18px', padding: '12px 18px', width: 'auto', borderRadius: '12px' }}
            onClick={() => setShowRules(prev => !prev)}
          >
            {showRules ? '🔼 Skryť prehľad a pravidlá' : '📖 Prehľad vybraných slov po M'}
          </button>
        </div>

        {showRules && (
          <div className="rules-container" style={{
            background: '#ffffff',
            border: '2px solid #b8d4e8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <h2 style={{ marginTop: 0, color: '#1f4e79', fontSize: '22px' }}>Vybrané slová po M:</h2>
            <p style={{ fontWeight: 'bold', fontSize: '16px', color: '#2b6cb0', lineHeight: 1.5 }}>
              my, mykať, mýliť sa, myslieť, myš, mydlo, hmyz, šmýkať sa, šmyk, priesmyk, mýto, mys, Myjava, hmýriť sa
            </p>

            <h3 style={{ color: '#1f4e79', fontSize: '18px', marginTop: '16px', marginBottom: '8px' }}>Pravidlá a význam:</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
              {VYBRANE_M_RULES.map((rule, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  <strong style={{ color: '#1a365d' }}>{rule.word}:</strong> {rule.description}
                </li>
              ))}
            </ul>

            <h3 style={{ color: '#c53030', fontSize: '18px', marginTop: '16px', marginBottom: '8px' }}>Pozor na chytáky (i / y):</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
              {VYBRANE_M_CHYTAKY.map((chytak, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  <strong style={{ color: '#9b2c2c' }}>{chytak.pair}:</strong> {chytak.desc}
                </li>
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
                  {!unlocked && <small>{`Najprv získaj 5★ v predchádzajúcom leveli`}</small>}
                </button>
                {best === MAX_STARS && (
                  <button
                    type="button"
                    className="level-play-btn"
                    onClick={() => setPlayingRewardLevel(level)}
                    title={`Hrať odmenu: Block Out - Level ${level + 1}`}
                    style={{ background: '#2563eb' }}
                  >
                    <GameIcon size={22} />
                  </button>
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
            ? (hasNextLevel ? 'Level splnený na 5★! Odomkla sa ti odmena Block Out a ďalší level.' : 'Fantastické! Zvládla si všetky úrovne vybraných slov po M!')
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

  const currentTask = order[index];
  const isSentence = displayWord.length > 20 || displayWord.includes(' ');

  return (
    <>
      <div className="game-ui">
        <h1>Vybrané slová po M</h1>
        <div className="current-level">
          {`Level ${selectedLevel + 1} • Úloha ${index + 1}/${order.length}`}
        </div>
        <div className="score-board">
          Správne: <span className="score-hit">{hit}</span> | Chyby: <span className="score-miss">{miss}</span>
        </div>

        <div className={`prompt ${isSentence ? 'prompt-sentence' : 'prompt-words'}`} style={isSentence ? {
          fontSize: '28px',
          letterSpacing: '1px',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #b8d4e8',
          margin: '16px 0'
        } : {}}>
          {displayWord}
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

        <div className="button-grid-2x2">
          {[
            { id: 'makke', label: 'I', className: 'btn-sl-makke' },
            { id: 'makke-dlhe', label: 'Í', className: 'btn-sl-makke' },
            { id: 'tvrde', label: 'Y', className: 'btn-sl-tvrde' },
            { id: 'tvrde-dlhe', label: 'Ý', className: 'btn-sl-tvrde' }
          ].map(option => {
            const marker = feedbackMap[option.id];
            const icon = marker === 'correct' ? '✅' : '❌';

            return (
              <button
                key={option.id}
                className={option.className}
                onClick={() => check(option.id)}
                disabled={disabledOptions.has(option.id)}
              >
                {option.label}
                {marker && <span className="icon">{icon}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fireworks-overlay" ref={fireworksRef} />
    </>
  );
}
