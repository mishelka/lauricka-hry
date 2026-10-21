import { useMemo, useRef, useState } from 'react';
import { VYBRANE_Z_GROUPS, VYBRANE_Z_RULES, VYBRANE_Z_CHYTAKY } from '../data/vybraneZSlova';
import { getStarCount, shuffleArray, triggerFireworks } from '../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../utils/player';
import BlockOutGame from '../rewards/BlockOutGame';
import { RestartIcon, NextLevelIcon, LevelsMenuIcon, GameIcon } from './Icons';

const QUESTIONS_PER_LEVEL = 15;
const MAX_STARS = 5;

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

export default function VybraneZGame() {
  const groups = useMemo(() => VYBRANE_Z_GROUPS, []);
  const [levelStars, setLevelStars] = useState(() => getLevelStars('vybraneZ', groups.length));
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
    const updated = updateLevelBestStars('vybraneZ', selectedLevel, best, groups.length);
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

    const nextMistakes = mistakesOnCurrent + 1;
    setMistakesOnCurrent(nextMistakes);

    if (nextMistakes === 1) {
      const nextMiss = miss + 1;
      const nextWrong = new Set(wrongItems);
      nextWrong.add(task.cele);
      setMiss(nextMiss);
      setWrongItems(nextWrong);
      if (task.hint) setActiveHint(task.hint);
    }
  }

  if (selectedLevel === null && playingRewardLevel === null) {
    return (
      <div className="levels-screen">
        <h1>Vybrané slová po Z</h1>
        <p className="level-menu-help">
          Vyber si level a doplň správne i/í alebo y/ý po písmene Z. Za každý splnený level na 5★ získaš odmenu v hre Block Out!
        </p>

        <div className="vybrane-rules-toggle">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowRules(prev => !prev)}
          >
            {showRules ? 'Skryť pravidlá a chytáky' : 'Zobraziť pravidlá a chytáky po Z 📖'}
          </button>
        </div>

        {showRules && (
          <div className="vybrane-rules-container">
            <div className="rules-section">
              <h2>Základné vybrané slová po Z</h2>
              <div className="rules-list">
                {VYBRANE_Z_RULES.map(rule => (
                  <div key={rule.word} className="rule-card">
                    <div className="rule-word">{rule.word}</div>
                    <div className="rule-desc">{rule.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rules-section">
              <h2>Pozor na chytáky a podobné slová</h2>
              <div className="chytaky-list">
                {VYBRANE_Z_CHYTAKY.map(chytak => (
                  <div key={chytak.pair} className="chytak-card">
                    <div className="chytak-pair">{chytak.pair}</div>
                    <div className="chytak-desc">{chytak.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="levels-grid">
          {groups.map((_, lvl) => {
            const unlocked = isLevelUnlocked(lvl);
            const stars = levelStars[lvl] || 0;
            return (
              <button
                key={lvl}
                className={`level-btn ${unlocked ? '' : 'level-btn-locked'}`}
                onClick={() => startLevel(lvl)}
                disabled={!unlocked}
              >
                <div className="level-btn-number">{`Level ${lvl + 1}`}</div>
                <div className="level-btn-stars">{unlocked ? renderStars(stars) : 'Zamknuté 🔒'}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (playingRewardLevel !== null) {
    const hasNextVybraneLevel = playingRewardLevel < groups.length - 1;
    return (
      <div className="reward-game-view">
        <BlockOutGame
          rewardLevel={playingRewardLevel}
          onBackToVybrane={() => setPlayingRewardLevel(null)}
          onNextVybraneLevel={hasNextVybraneLevel ? () => {
            const nextLvl = playingRewardLevel + 1;
            setPlayingRewardLevel(null);
            startLevel(nextLvl);
          } : undefined}
        />
      </div>
    );
  }

  if (resultVisible) {
    const stars = getStarCount(miss);
    const hasNextLevel = selectedLevel < groups.length - 1;
    const levelDone = stars === 5;

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
            ? (hasNextLevel ? 'Level splnený na 5★! Odomkla sa ti odmena Block Out a ďalší level.' : 'Fantastické! Zvládla si všetky úrovne vybraných slov po Z!')
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
        <h1>Vybrané slová po Z</h1>
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
