import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { VYBRANE_R_GROUPS, VYBRANE_R_RULES, VYBRANE_R_CHYTAKY } from '../data/vybraneRSlova';
import { getStarCount, getVybraneOptionId, getVybraneOptions, shuffleArray, triggerFireworks } from '../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../utils/player';
import useDevUnlock from '../utils/useDevUnlock';
import BlockOutGame from '../rewards/BlockOutGame';
import { isBlockOutLevelImplemented } from '../rewards/blockOutLevels';
import { RestartIcon, NextLevelIcon, LevelsMenuIcon, GameIcon, HelpIcon } from './Icons';
import { TopActionsContext } from '../App';

const QUESTIONS_PER_LEVEL = 15;
const MAX_STARS = 5;

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

export default function VybraneRGame() {
  const { setRightAction } = useContext(TopActionsContext);
  const groups = useMemo(() => VYBRANE_R_GROUPS, []);
  const [levelStars, setLevelStars] = useState(() => getLevelStars('vybraneR', groups.length));
  useDevUnlock({ gameId: 'vybraneR', levelCount: groups.length, onUnlock: setLevelStars });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [playingRewardLevel, setPlayingRewardLevel] = useState(null);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (selectedLevel !== null || playingRewardLevel !== null) {
      setRightAction(null);
      return;
    }
    setRightAction(
      <button
        type="button"
        className={`btn-top-action btn-help${showRules ? ' active' : ''}`}
        onClick={() => setShowRules(prev => !prev)}
        title={showRules ? 'Skryť prehľad' : 'Prehľad vybraných slov po R'}
        aria-label="Prehľad vybraných slov po R"
      >
        <HelpIcon size={24} />
      </button>
    );
    return () => setRightAction(null);
  }, [showRules, selectedLevel, playingRewardLevel, setRightAction]);
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
    setShowRules(false);
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
    const updated = updateLevelBestStars('vybraneR', selectedLevel, best, groups.length);
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

  const renderRulesPanel = () => (
    <div className="rules-panel">
      <h3>
        <span>Prehľad vybraných slov po R</span>
        <button
          type="button"
          className="btn-rules-close"
          onClick={() => setShowRules(false)}
          title="Zavrieť prehľad"
        >
          ✕ Zavrieť
        </button>
      </h3>
      <p className="rules-words-list">
        ryba, rybník, rybár, rýchly, rýchlosť, rýpať, rypák, ryť, rozryť, úkryt, koryto, korytnačka, rýdzi, ryha, bryndza, Torysa, rys, rysovať, ryšavý, rytier, rýľ, rým, kryť, pokrývka, strýko, stryná, prýštiť, trýzniť
      </p>

      <h4 className="rules-section-rules">Pravidlá a význam:</h4>
      <ul className="rules-section-rules">
        {VYBRANE_R_RULES.map((rule, idx) => (
          <li key={idx}>
            <strong>{rule.word}:</strong> {rule.description}
          </li>
        ))}
      </ul>

      <h4 className="rules-section-chytaky">Pozor na chytáky (i / y):</h4>
      <ul className="rules-section-chytaky">
        {VYBRANE_R_CHYTAKY.map((chytak, idx) => (
          <li key={idx}>
            <strong>{chytak.pair}:</strong> {chytak.desc}
          </li>
        ))}
      </ul>
    </div>
  );

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
        <h1>Vybrané slová po R</h1>
        <p className="level-menu-help">Vyber si úroveň a precvič si vybrané slová po R. Získaj 5★ na odomknutie ďalšej úrovne a odmeny.</p>

        {showRules && renderRulesPanel()}

        <div className="levels-grid">
          {groups.map((_, level) => {
            const best = levelStars[level] || 0;
            const unlocked = isLevelUnlocked(level);
            const isRewardImplemented = isBlockOutLevelImplemented(level);
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
                    className={`level-play-btn${!isRewardImplemented ? ' disabled' : ''}`}
                    onClick={() => isRewardImplemented && setPlayingRewardLevel(level)}
                    disabled={!isRewardImplemented}
                    title={
                      isRewardImplemented
                        ? `Hrať odmenu: Block Out - Level ${level + 1}`
                        : `Odmena (Block Out - Level ${level + 1}) zatiaľ nie je implementovaná`
                    }
                    style={{ background: isRewardImplemented ? '#2563eb' : '#94a3b8' }}
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
    const isRewardImplemented = selectedLevel !== null && isBlockOutLevelImplemented(selectedLevel);
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
            ? (hasNextLevel ? 'Level splnený na 5★! Odomkla sa ti odmena Block Out a ďalší level.' : 'Fantastické! Zvládla si všetky úrovne vybraných slov po R a odomkla si Vybrané slová po S! 🎉')
            : `Získala si ${stars}/5 ★. Na postup do ďalšieho levelu a odmenu potrebuješ 5/5 ★.`}
        </div>
        <div className="wrong-list">
          {wrongItems.size > 0 ? `Precvič si: ${Array.from(wrongItems).join(', ')}` : 'Výborne, žiadne chyby! Všetko správne! 🎉'}
        </div>
        <div className="result-actions">
          <div className="result-actions-icons">
            <button
              type="button"
              className="btn-icon-action btn-icon-restart"
              onClick={() => startLevel(selectedLevel)}
              title="Opakovať level"
            >
              <RestartIcon size={26} />
            </button>
            {stars === 5 && (
              <button
                type="button"
                className={`btn-icon-action btn-icon-reward${!isRewardImplemented ? ' disabled' : ''}`}
                onClick={() => isRewardImplemented && setPlayingRewardLevel(selectedLevel)}
                disabled={!isRewardImplemented}
                title={
                  isRewardImplemented
                    ? `Hrať odmenu: Block Out (${selectedLevel + 1}. level)`
                    : `Odmena (Block Out - Level ${selectedLevel + 1}) zatiaľ nie je implementovaná`
                }
              >
                <GameIcon size={26} />
              </button>
            )}
          </div>
          <div className="result-actions-nav">
            <button className="btn-secondary btn-levels-menu" onClick={() => setSelectedLevel(null)}>
              <LevelsMenuIcon />
              <span>Menu levelov</span>
            </button>
            {hasNextLevel && levelDone && (
              <button className="btn-next-level" onClick={() => startLevel(selectedLevel + 1)}>
                <NextLevelIcon />
                <span>Ďalší level</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentTask = order[index];
  const isSentence = displayWord.length > 20 || displayWord.includes(' ');

  return (
    <>
      <div className="game-ui">
        <h1>Vybrané slová po R</h1>
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
          {getVybraneOptions(currentTask).map(option => {
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
