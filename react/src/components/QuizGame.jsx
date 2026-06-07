import { useMemo, useRef, useState } from 'react';
import ResultScreen from './ResultScreen';
import { shuffleArray, triggerFireworks } from '../utils/gameUtils';

export default function QuizGame({
  title,
  tasks,
  options,
  getPrompt,
  getCorrectOption,
  getWrongLabel,
  onCorrectReveal,
  onRestartGame,
  onResult,
  bestStars,
  promptClassName = ''
}) {
  const [order, setOrder] = useState(() => shuffleArray(tasks));
  const [index, setIndex] = useState(0);
  const [hit, setHit] = useState(0);
  const [miss, setMiss] = useState(0);
  const [wrongItems, setWrongItems] = useState(new Set());
  const [blocked, setBlocked] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [disabledOptions, setDisabledOptions] = useState(new Set());
  const [mistakesOnCurrent, setMistakesOnCurrent] = useState(0);
  const [promptOverride, setPromptOverride] = useState(null);
  const fireworksRef = useRef(null);

  const isFinished = index >= order.length;
  const currentTask = !isFinished ? order[index] : null;
  const prompt = currentTask ? (promptOverride ?? getPrompt(currentTask)) : '';

  const wrongItemsArray = useMemo(() => Array.from(wrongItems), [wrongItems]);

  function restart() {
    if (onRestartGame) {
      onRestartGame();
      return;
    }

    setOrder(shuffleArray(tasks));
    setIndex(0);
    setHit(0);
    setMiss(0);
    setWrongItems(new Set());
    setBlocked(false);
    setFeedbackMap({});
    setDisabledOptions(new Set());
    setMistakesOnCurrent(0);
    setPromptOverride(null);
  }

  function gotoNextTask() {
    setIndex(prev => prev + 1);
    setFeedbackMap({});
    setDisabledOptions(new Set());
    setMistakesOnCurrent(0);
    setPromptOverride(null);
    setBlocked(false);
  }

  function check(optionId) {
    if (blocked || !currentTask) return;

    setBlocked(true);
    const isCorrect = optionId === getCorrectOption(currentTask);
    if (isCorrect) {
      setFeedbackMap(prev => ({ ...prev, [optionId]: 'correct' }));
      if (mistakesOnCurrent === 0) {
        setHit(prev => prev + 1);
      }
      setDisabledOptions(new Set(options.map(option => option.id)));
      triggerFireworks(fireworksRef.current);

      if (onCorrectReveal) {
        setTimeout(() => {
          setPromptOverride(onCorrectReveal(currentTask));
        }, 500);
      }

      setTimeout(gotoNextTask, 2500);
      return;
    }

    setMistakesOnCurrent(prev => prev + 1);
    setMiss(prev => prev + 1);
    setFeedbackMap(prev => ({ ...prev, [optionId]: 'wrong' }));
    setDisabledOptions(prev => {
      const next = new Set(prev);
      next.add(optionId);
      return next;
    });
    setWrongItems(prev => {
      const next = new Set(prev);
      next.add(getWrongLabel(currentTask));
      return next;
    });
    setBlocked(false);
  }

  if (isFinished) {
    return <ResultScreen miss={miss} wrongItems={wrongItemsArray} onRestart={restart} onResult={onResult} />;
  }

  return (
    <>
      <div className="game-ui">
        <h1>{title}</h1>
        <div className="score-board">
          Správne: <span className="score-hit">{hit}</span> | Chyby: <span className="score-miss">{miss}</span>
        </div>
        {typeof bestStars === 'number' && <div className="best-stars">Najviac hviezd: {bestStars}/5 ★</div>}

        <div className={`prompt ${promptClassName}`.trim()}>{prompt}</div>

        <div className="button-container">
          {options.map(option => {
            const marker = feedbackMap[option.id];
            const icon = marker === 'correct' ? '✅' : '❌';

            return (
              <button
                key={option.id}
                className={option.className}
                onClick={() => check(option.id)}
                disabled={blocked || disabledOptions.has(option.id)}
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
