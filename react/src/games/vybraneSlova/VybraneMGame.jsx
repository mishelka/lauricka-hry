import { learningSounds } from '../../utils/learningSounds';
import { GameToolbar, GameStatus } from '../../atomic/GameLayout';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { VYBRANE_M_GROUPS, VYBRANE_M_RULES, VYBRANE_M_CHYTAKY } from '../../data/vybraneMSlova';
import { getStarCount, getVybraneOptionId, shuffleArray, triggerFireworks } from '../../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../../utils/player';
import useDevUnlock from '../../utils/useDevUnlock';
import BlockOutGame from '../odmeny/BlockOutGame';
import { isBlockOutLevelImplemented } from '../odmeny/blockOutLevels';
import { RestartIcon, NextLevelIcon, LevelsMenuIcon, GameIcon, HelpIcon } from '../../atomic/Icons';
import { TopActionsContext } from '../../App';
import IyChoiceButtons from '../../atomic/IyChoiceButtons';

const QUESTIONS_PER_LEVEL = 15;
const MAX_STARS = 5;
const REWARD_LEVEL_OFFSET = 9; // Prvý level po M odomyká Block Out Level 10 (index 9)

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

export default function VybraneMGame() {
  const { setRightAction } = useContext(TopActionsContext);
  const groups = useMemo(() => VYBRANE_M_GROUPS, []);
  const [levelStars, setLevelStars] = useState(() => getLevelStars('vybraneM', groups.length));
  useDevUnlock({ gameId: 'vybraneM', levelCount: groups.length, onUnlock: setLevelStars });
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
        title={showRules ? 'Skryť prehľad' : 'Prehľad vybraných slov po M'}
        aria-label="Prehľad vybraných slov po M"
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
    learningSounds.complete();
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
      learningSounds.correct();
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
    learningSounds.incorrect();
    setMistakesOnCurrent(prev => prev + 1);
    setMiss(prev => prev + 1);
    if (task.hint) setActiveHint(task.hint);
    setWrongItems(prev => {
      const next = new Set(prev);
      next.add(task.cele);
      return next;
    });
  }

  const renderRulesPanel = () => (
    <div className="rules-panel">
      <h3>
        <span>Prehľad vybraných slov po M</span>
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
        my, mykať, mýliť sa, myslieť, myš, mydlo, hmyz, šmýkať sa, šmyk, priesmyk, mýto, mys, Myjava, hmýriť sa
      </p>

      <h4 className="rules-section-rules">Pravidlá a význam:</h4>
      <ul className="rules-section-rules">
        {VYBRANE_M_RULES.map((rule, idx) => (
          <li key={idx}>
            <strong>{rule.word}:</strong> {rule.description}
          </li>
        ))}
      </ul>

      <h4 className="rules-section-chytaky">Pozor na chytáky (i / y):</h4>
      <ul className="rules-section-chytaky">
        {VYBRANE_M_CHYTAKY.map((chytak, idx) => (
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
    const blockOutRewardIndex = REWARD_LEVEL_OFFSET + playingRewardLevel;
    return (
      <div className="reward-game-view">
        <BlockOutGame
          rewardLevel={blockOutRewardIndex}
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
        <GameToolbar title="Vybrané slová po M" />
        <p className="level-menu-help">Vyber si úroveň a precvič si vybrané slová po M. Získaj 5★ na odomknutie ďalšej úrovne a odmeny.</p>

        {showRules && renderRulesPanel()}

        <div className="levels-grid">
          {groups.map((_, level) => {
            const best = levelStars[level] || 0;
            const unlocked = isLevelUnlocked(level);
            const rewardLevelIndex = REWARD_LEVEL_OFFSET + level;
            const isRewardImplemented = isBlockOutLevelImplemented(rewardLevelIndex);
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
                        ? `Hrať odmenu: Block Out - Level ${rewardLevelIndex + 1}`
                        : `Odmena (Block Out - Level ${rewardLevelIndex + 1}) zatiaľ nie je implementovaná`
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
    const rewardLevelIndex = selectedLevel !== null ? REWARD_LEVEL_OFFSET + selectedLevel : null;
    const isRewardImplemented = rewardLevelIndex !== null && isBlockOutLevelImplemented(rewardLevelIndex);
    return (
      <div className="result-box">
        <GameToolbar onBack={() => setSelectedLevel(null)} onRestart={() => startLevel(selectedLevel)} />
        <h2>Koniec hry!</h2>
        <div className="stars">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={idx} className={idx < stars ? 'star-gold' : 'star-grey'}>★</span>
          ))}
        </div>
        <div className="level-progress-message">
          {levelDone
            ? (hasNextLevel ? 'Level splnený na 5★! Odomkla sa ti odmena Block Out a ďalší level.' : 'Fantastické! Zvládla si všetky úrovne vybraných slov po M a odomkla si Vybrané slová po P! 🎉')
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
                    ? `Hrať odmenu: Block Out (${rewardLevelIndex + 1}. level)`
                    : `Odmena (Block Out - Level ${rewardLevelIndex + 1}) zatiaľ nie je implementovaná`
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
        <GameToolbar title="Vybrané slová po M" onBack={() => setSelectedLevel(null)} onRestart={() => startLevel(selectedLevel)} />
        <GameStatus variant="words">
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

        </GameStatus>
        <IyChoiceButtons
            className="button-grid-2x2 word-answer-grid"
          task={currentTask}
          onCheck={check}
          disabledOptions={disabledOptions}
          feedbackMap={feedbackMap}
        />
      </div>

      <div className="fireworks-overlay" ref={fireworksRef} />
    </>
  );
}
