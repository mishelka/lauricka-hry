import AnswerProgress from '../../atomic/AnswerProgress';
import { learningSounds } from '../../utils/learningSounds';
import { GameToolbar, GameStatus } from '../../atomic/GameLayout';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlternatingOpakovanieTasks } from '../../data/vybraneOpakovanieData';
import { VYBRANE_B_GROUPS } from '../../data/vybraneBSlova';
import { VYBRANE_M_GROUPS } from '../../data/vybraneMSlova';
import { VYBRANE_P_GROUPS } from '../../data/vybranePSlova';
import { VYBRANE_R_GROUPS } from '../../data/vybraneRSlova';
import { VYBRANE_S_GROUPS } from '../../data/vybraneSSlova';
import { VYBRANE_V_GROUPS } from '../../data/vybraneVSlova';
import { VYBRANE_Z_GROUPS } from '../../data/vybraneZSlova';
import { getStarCount, getVybraneOptionId, triggerFireworks } from '../../utils/gameUtils';
import { awardRandomSmiley, getBestStars, getLevelStars, incrementLevelPlays, updateBestStars } from '../../utils/player';
import useDevUnlock from '../../utils/useDevUnlock';
import { RestartIcon, LevelsMenuIcon, SmileyIcon, HelpIcon } from '../../atomic/Icons';
import { TopActionsContext } from '../../App';
import PlayerProfileModal from '../../atomic/PlayerProfileModal';
import IyChoiceButtons from '../../atomic/IyChoiceButtons';

const QUESTIONS_PER_ROUND = 10;
const MAX_STARS = 5;

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

function getUnlockedLettersList() {
  const letters = [];
  const bDone = getLevelStars('vybraneB', VYBRANE_B_GROUPS.length).filter(s => s === 5).length === VYBRANE_B_GROUPS.length;
  if (bDone) letters.push('b');

  const mDone = getLevelStars('vybraneM', VYBRANE_M_GROUPS.length).filter(s => s === 5).length === VYBRANE_M_GROUPS.length;
  if (mDone) letters.push('m');

  const pDone = getLevelStars('vybraneP', VYBRANE_P_GROUPS.length).filter(s => s === 5).length === VYBRANE_P_GROUPS.length;
  if (pDone) letters.push('p');

  const rDone = getLevelStars('vybraneR', VYBRANE_R_GROUPS.length).filter(s => s === 5).length === VYBRANE_R_GROUPS.length;
  if (rDone) letters.push('r');

  const sDone = getLevelStars('vybraneS', VYBRANE_S_GROUPS.length).filter(s => s === 5).length === VYBRANE_S_GROUPS.length;
  if (sDone) letters.push('s');

  const vDone = getLevelStars('vybraneV', VYBRANE_V_GROUPS.length).filter(s => s === 5).length === VYBRANE_V_GROUPS.length;
  if (vDone) letters.push('v');

  const zDone = getLevelStars('vybraneZ', VYBRANE_Z_GROUPS.length).filter(s => s === 5).length === VYBRANE_Z_GROUPS.length;
  if (zDone) letters.push('z');

  if (letters.length === 0) {
    return ['b'];
  }

  return letters;
}

export default function VybraneOpakovanieGame() {
  const navigate = useNavigate();
  const { setRightAction } = useContext(TopActionsContext);

  const [unlockedLetters, setUnlockedLetters] = useState(() => getUnlockedLettersList());
  const [bestStars, setBestStars] = useState(() => getBestStars('vybraneOpakovanie'));
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useDevUnlock({
    gameId: 'vybraneOpakovanie',
    levelCount: 1,
    onUnlock: () => {
      const allLetters = ['b', 'm', 'p', 'r', 's', 'v', 'z'];
      setUnlockedLetters(allLetters);
      setBestStars(MAX_STARS);
      startRound(allLetters);
    }
  });

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
  const [awardedSmileyData, setAwardedSmileyData] = useState(null);
  const fireworksRef = useRef(null);

  useEffect(() => {
    setRightAction(
      <button
        type="button"
        className="btn-top-action btn-profile-top"
        onClick={() => setShowProfileModal(true)}
        title="Zbierka smajlíkov"
        aria-label="Zbierka smajlíkov"
      >
        <SmileyIcon size={24} />
      </button>
    );
    return () => setRightAction(null);
  }, [setRightAction]);

  function startRound(customLetters) {
    const letters = customLetters && Array.isArray(customLetters) && customLetters.length > 0
      ? customLetters
      : getUnlockedLettersList();
    setUnlockedLetters(letters);
    const shuffled = getAlternatingOpakovanieTasks(letters, QUESTIONS_PER_ROUND);

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
    setAwardedSmileyData(null);
  }

  useEffect(() => {
    startRound();
  }, []);

  function resetQuestionState(nextIndex, nextOrder) {
    const question = nextOrder[nextIndex];
    setDisplayWord(question?.vypis ?? '?');
    setMistakesOnCurrent(0);
    setDisabledOptions(new Set());
    setFeedbackMap({});
    setActiveHint('');
  }

  function finishRound(finalMiss, wrongSet) {
    learningSounds.complete();
    const stars = getStarCount(finalMiss);
    const updatedBest = updateBestStars('vybraneOpakovanie', stars);
    setBestStars(updatedBest);
    incrementLevelPlays('vybraneOpakovanie', 0, 1);

    if (finalMiss === 0) {
      const award = awardRandomSmiley();
      setAwardedSmileyData(award);
    } else {
      setAwardedSmileyData(null);
    }
    setWrongItems(new Set(wrongSet));
    setResultVisible(true);
    triggerFireworks(fireworksRef.current);
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
          finishRound(miss, wrongItems);
          return;
        }
        setIndex(nextIndex);
        resetQuestionState(nextIndex, order);
      }, 1200);
      return;
    }

    learningSounds.incorrect();
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

  const currentTask = order[index];
  const isSentence = displayWord.length > 20 || displayWord.includes(' ');
  const earnedStars = resultVisible ? getStarCount(miss) : 0;
  const lettersNames = unlockedLetters.map(l => l.toUpperCase()).join(', ');

  return (
    <>
      <div ref={fireworksRef} className="fireworks-overlay" />

      <PlayerProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {!resultVisible ? (
        <div className="game-ui">
          <GameToolbar title="Opakovanie vybraných slov" onRestart={() => startRound()} />
          <GameStatus variant="words">
            <div className="current-level">
              {order.length > 0 ? `Otázka ${index + 1}/${order.length}` : 'Otázka 0/0'}
            </div>
            <div className="score-board">
              Správne: <span className="score-hit">{hit}</span> | Chyby: <span className="score-miss">{miss}</span>
              <AnswerProgress
                answered={index + (mistakesOnCurrent > 0 || Object.values(feedbackMap).includes('correct') ? 1 : 0)}
                total={order.length}
              />
            </div>

            <div
              className={`prompt ${isSentence ? 'prompt-sentence' : 'prompt-words'}`}
              style={
                isSentence
                  ? {
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
                    }
                  : {}
              }
            >
              {displayWord}
            </div>

            {activeHint && (
              <div
                className="hint-box"
                style={{
                  fontSize: '17px',
                  color: '#1a365d',
                  background: '#e2f1fc',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  marginBottom: '14px',
                  fontWeight: 'bold',
                  border: '1px solid #90cdf4'
                }}
              >
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
      ) : (
        <div className="result-box">
          <div className="result-stars">{renderStars(earnedStars)}</div>
          <h2>
            {earnedStars === 5
              ? 'Úžasné! Žiadna chyba! 🌟'
              : earnedStars >= 3
              ? 'Skvelá práca! 👏'
              : 'Pekný pokus, trénuj ďalej! 💪'}
          </h2>
          <p className="result-score">
            Správne na prvý pokus: <strong>{hit}</strong> z <strong>{order.length}</strong>
            {miss > 0 && ` (spolu chýb: ${miss})`}
          </p>

          {awardedSmileyData && (
            <div className="smiley-reward-banner">
              <div className="smiley-reward-avatar">{awardedSmileyData.smiley.emoji}</div>
              <div className="smiley-reward-content">
                <span className="smiley-reward-tag">
                  {awardedSmileyData.isNew ? '✨ Nový smajlík do zbierky!' : '🌟 Získaný smajlík!'}
                </span>
                <h3>{awardedSmileyData.smiley.name}</h3>
                <p>{awardedSmileyData.smiley.desc}</p>
                <span className="smiley-reward-count">
                  V zbierke máš už <strong>{awardedSmileyData.totalCollected}</strong> z{' '}
                  <strong>{awardedSmileyData.totalAvailable}</strong> smajlíkov!
                </span>
              </div>
            </div>
          )}

          {wrongItems.size > 0 && (
            <div className="mistakes-box">
              <h3>Slová na zopakovanie:</h3>
              <div className="mistakes-list">
                {Array.from(wrongItems).map((word, idx) => (
                  <span key={idx} className="mistake-badge">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="result-actions">
            <div className="result-actions-icons">
              <button
                type="button"
                className="btn-icon-action btn-icon-restart"
                onClick={startRound}
                title="Hrať znova"
                aria-label="Hrať znova"
              >
                <RestartIcon size={24} />
              </button>

              <button
                type="button"
                className="btn-icon-action btn-icon-reward"
                onClick={() => setShowProfileModal(true)}
                title="Pozrieť zbierku smajlíkov"
                aria-label="Pozrieť zbierku smajlíkov"
              >
                <SmileyIcon size={24} />
              </button>
            </div>

            <div className="result-actions-nav">
              <button type="button" className="btn-levels-menu" onClick={() => navigate('/')}>
                <LevelsMenuIcon size={20} />
                <span>Hlavné menu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
