import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADAPTIVNE_OPAKOVANIE_RULES, NASOBENIE_DELENIE_FACTS } from '../../data/nasobenieDelenieData';
import { applyAnswer, countMastered, pickAdaptiveRound } from '../../utils/adaptiveRepetition';
import { getNewNasobilkaRewards } from '../../utils/nasobilkaRewards';
import { getStarCount, triggerFireworks } from '../../utils/gameUtils';
import {
  awardSmileyById,
  getAdaptiveProgress,
  getBestStars,
  resetAdaptiveProgress,
  saveAdaptiveProgress,
  updateBestStars
} from '../../utils/player';
import { HelpIcon, SmileyIcon } from '../../atomic/Icons';
import PlayerProfileModal from '../../atomic/PlayerProfileModal';
import { TopActionsContext } from '../../App';

const GAME_ID = 'adaptivneOpakovanie';
const QUESTIONS_PER_ROUND = 10;
const MAX_STARS = 5;

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

export default function AdaptivneOpakovanieGame() {
  const { setRightAction } = useContext(TopActionsContext);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => getAdaptiveProgress(GAME_ID));
  const [examples, setExamples] = useState(() =>
    pickAdaptiveRound(NASOBENIE_DELENIE_FACTS, getAdaptiveProgress(GAME_ID), QUESTIONS_PER_ROUND)
  );
  const [index, setIndex] = useState(0);
  const [hit, setHit] = useState(0);
  const [miss, setMiss] = useState(0);
  const [inputDigits, setInputDigits] = useState('');
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState(null);
  const [mistakesOnCurrent, setMistakesOnCurrent] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [roundStars, setRoundStars] = useState(null);
  const [pendingRewards, setPendingRewards] = useState([]);
  const [pendingNext, setPendingNext] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const fireworksRef = useRef(null);

  const current = examples[index] || null;
  const masteredCount = countMastered(NASOBENIE_DELENIE_FACTS, progress);
  const allMastered = masteredCount === NASOBENIE_DELENIE_FACTS.length;

  useEffect(() => {
    setRightAction(
      <button
        type="button"
        className={`btn-top-action btn-help${showRules ? ' active' : ''}`}
        onClick={() => setShowRules(prev => !prev)}
        title={showRules ? 'Skryť pravidlá' : 'Pravidlá adaptívneho opakovania'}
        aria-label="Pravidlá adaptívneho opakovania"
      >
        <HelpIcon size={24} />
      </button>
    );
    return () => setRightAction(null);
  }, [showRules, setRightAction]);

  function startRound(nextProgress = progress) {
    setExamples(pickAdaptiveRound(NASOBENIE_DELENIE_FACTS, nextProgress, QUESTIONS_PER_ROUND));
    setIndex(0);
    setHit(0);
    setMiss(0);
    setInputDigits('');
    setStatus('idle');
    setFeedback(null);
    setMistakesOnCurrent(0);
    setResultVisible(false);
    setRoundStars(null);
    setPendingRewards([]);
    setPendingNext(null);
  }

  function startOver() {
    const emptyProgress = resetAdaptiveProgress(GAME_ID);
    setProgress(emptyProgress);
    startRound(emptyProgress);
  }

  function recordAnswer(wasCorrectFirstTry) {
    const nextProgress = applyAnswer(progress, current.id, wasCorrectFirstTry);
    setProgress(nextProgress);
    saveAdaptiveProgress(GAME_ID, nextProgress);

    if (!wasCorrectFirstTry) return [];
    return getNewNasobilkaRewards(progress, nextProgress)
      .map(reward => awardSmileyById(reward.id))
      .filter(Boolean);
  }

  function continueAfterReward() {
    const next = pendingNext;
    setPendingRewards([]);
    setPendingNext(null);
    if (next) nextQuestion(next.index, next.miss);
  }

  function finishRound(finalMiss) {
    const stars = getStarCount(finalMiss);
    updateBestStars(GAME_ID, stars);
    setRoundStars(stars);
    setResultVisible(true);
  }

  function nextQuestion(nextIndex, currentMiss) {
    if (nextIndex >= examples.length) {
      finishRound(currentMiss);
      return;
    }
    setIndex(nextIndex);
    setInputDigits('');
    setStatus('idle');
    setFeedback(null);
    setMistakesOnCurrent(0);
  }

  function pressDigit(digit) {
    if (status === 'correct' || resultVisible) return;
    setInputDigits(previous => (previous.length >= 3 ? previous : previous + digit));
  }

  function backspace() {
    if (status === 'correct' || resultVisible) return;
    setInputDigits(previous => previous.slice(0, -1));
  }

  function submitAnswer() {
    if (status === 'correct' || resultVisible || !current || inputDigits === '') return;

    if (Number(inputDigits) === current.result) {
      setStatus('correct');
      setFeedback({ type: 'correct', text: 'Správne' });
      const isFirstAttempt = mistakesOnCurrent === 0;
      let earnedRewards = [];
      if (isFirstAttempt) {
        setHit(previous => previous + 1);
        earnedRewards = recordAnswer(true);
      }
      triggerFireworks(fireworksRef.current);
      setTimeout(() => {
        if (earnedRewards.length > 0) {
          setPendingRewards(earnedRewards);
          setPendingNext({ index: index + 1, miss });
          return;
        }
        nextQuestion(index + 1, miss);
      }, 1200);
      return;
    }

    setStatus('wrong');
    setMiss(previous => previous + 1);
    setMistakesOnCurrent(previous => previous + 1);
    recordAnswer(false);
    setFeedback({ type: 'wrong', text: current.hint || `${current.text} = ${current.result}` });

    setTimeout(() => {
      setStatus('idle');
      setInputDigits('');
    }, 1000);
  }

  useEffect(() => {
    if (resultVisible || !current || showProfileModal) return;

    function handleKeyDown(event) {
      if (pendingRewards.length > 0) {
        if (event.key === 'Enter') {
          event.preventDefault();
          continueAfterReward();
        }
        return;
      }
      if (event.key >= '0' && event.key <= '9') {
        event.preventDefault();
        pressDigit(event.key);
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        backspace();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        submitAnswer();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const profileModal = (
    <PlayerProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} initialTab="nasobilka" />
  );

  const nasobilkaButton = (
    <button
      type="button"
      className="btn-icon-action btn-icon-reward"
      onClick={() => setShowProfileModal(true)}
      title="Prehľad násobilky a smajlíkov"
      aria-label="Prehľad násobilky a smajlíkov"
    >
      <SmileyIcon size={24} />
    </button>
  );

  if ((resultVisible || examples.length === 0) && allMastered) {
    const stars = roundStars ?? getBestStars(GAME_ID);
    return (
      <div className="result-box">
        {profileModal}
        <h2>Gratulujem! Zvládla si všetky príklady! 🎉</h2>
        <div className="stars">{renderStars(stars)}</div>
        <div className="level-progress-message">
          Zvládnuté: {masteredCount} z {NASOBENIE_DELENIE_FACTS.length}. Môžeš začať odznova a precvičiť si ich znovu.
          Smajlíky, ktoré si získala, ti ostanú v zbierke.
        </div>
        <div className="result-actions">
          <div className="result-actions-icons">{nasobilkaButton}</div>
          <div className="result-actions-nav">
            <button className="btn-secondary" onClick={startOver}>Začať odznova</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>Hlavné menu</button>
          </div>
        </div>
      </div>
    );
  }

  if (resultVisible) {
    return (
      <div className="result-box">
        {profileModal}
        <h2>Koniec kola!</h2>
        <div className="stars">{renderStars(roundStars || 0)}</div>
        <div className="level-progress-message">
          Správne na prvý pokus: {hit} z {examples.length}. Zvládnuté: {masteredCount} z {NASOBENIE_DELENIE_FACTS.length}.
        </div>
        <div className="result-actions">
          <div className="result-actions-icons">{nasobilkaButton}</div>
          <div className="result-actions-nav">
            <button className="btn-secondary" onClick={() => startRound()}>Hrať znova</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>Hlavné menu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div ref={fireworksRef} className="fireworks-container" />
      {profileModal}

      {pendingRewards.length > 0 && (
        <div className="reward-overlay-backdrop" role="dialog" aria-modal="true" aria-label="Nový smajlík">
          <div className="reward-overlay-card">
            <h2>Zvládla si celú násobilku! 🎉</h2>
            {pendingRewards.map(reward => (
              <div key={reward.smiley.id} className="smiley-reward-banner">
                <div className="smiley-reward-avatar">{reward.smiley.emoji}</div>
                <div className="smiley-reward-content">
                  <span className="smiley-reward-tag">
                    {reward.isNew ? '✨ Nový smajlík do zbierky!' : '🌟 Získaný smajlík!'}
                  </span>
                  <h3>{reward.smiley.name}</h3>
                  <p>{reward.smiley.desc}</p>
                  <span className="smiley-reward-count">
                    V zbierke máš už <strong>{reward.totalCollected}</strong> z <strong>{reward.totalAvailable}</strong> smajlíkov!
                  </span>
                </div>
              </div>
            ))}
            <div className="result-actions-nav reward-overlay-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(true)}>
                Pozrieť násobilku
              </button>
              <button type="button" className="btn-confirm" onClick={continueAfterReward} autoFocus>
                Pokračovať
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>Adaptívne opakovanie</h1>
      <div className="level-progress-message">Nekonečný mód</div>

      {showRules && (
        <div className="rules-panel">
          <h3>
            <span>Adaptívne opakovanie</span>
            <button type="button" className="btn-rules-close" onClick={() => setShowRules(false)} title="Zavrieť pravidlá">
              ✕ Zavrieť
            </button>
          </h3>
          <ul>
            {ADAPTIVNE_OPAKOVANIE_RULES.map((rule, ruleIndex) => <li key={ruleIndex}>{rule}</li>)}
          </ul>
        </div>
      )}

      {current && (
        <div className="card">
          <div className="math-horizontal-container">
            <div className="math-expr-text">{current.text} =</div>
            <div className={`math-input-box ${status}`}>
              {inputDigits === '' ? <span className="math-cursor">|</span> : inputDigits}
            </div>
          </div>

          <div className={`math-feedback ${feedback ? feedback.type : ''}`} aria-live="polite">
            {feedback?.type === 'correct' && <span>✅ {feedback.text}</span>}
            {feedback?.type === 'wrong' && <span>💡 {feedback.text}</span>}
          </div>

          <div className="keypad">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(digit => (
              <button
                key={digit}
                type="button"
                className="keypad-btn"
                onClick={() => pressDigit(String(digit))}
                disabled={status === 'correct'}
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              className="keypad-btn keypad-backspace"
              onClick={backspace}
              disabled={status === 'correct' || inputDigits === ''}
              title="Zmazať"
            >
              ⌫
            </button>
            <button
              type="button"
              className="keypad-btn"
              onClick={() => pressDigit('0')}
              disabled={status === 'correct'}
            >
              0
            </button>
            <button
              type="button"
              className="keypad-btn keypad-enter"
              onClick={submitAnswer}
              disabled={status === 'correct' || inputDigits === ''}
              title="Potvrdiť"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}