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
  promptClassName = ''
}) {
  const [order, setOrder] = useState(() => shuffleArray(tasks));
  const [index, setIndex] = useState(0);
  const [hit, setHit] = useState(0);
  const [miss, setMiss] = useState(0);
  const [wrongItems, setWrongItems] = useState(new Set());
  const [blocked, setBlocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [promptOverride, setPromptOverride] = useState(null);
  const fireworksRef = useRef(null);

  const isFinished = index >= order.length;
  const currentTask = !isFinished ? order[index] : null;
  const prompt = currentTask ? (promptOverride ?? getPrompt(currentTask)) : '';

  const wrongItemsArray = useMemo(() => Array.from(wrongItems), [wrongItems]);

  function restart() {
    setOrder(shuffleArray(tasks));
    setIndex(0);
    setHit(0);
    setMiss(0);
    setWrongItems(new Set());
    setBlocked(false);
    setFeedback(null);
    setPromptOverride(null);
  }

  function gotoNextTask() {
    setIndex(prev => prev + 1);
    setFeedback(null);
    setPromptOverride(null);
    setBlocked(false);
  }

  function check(optionId) {
    if (blocked || !currentTask) return;

    setBlocked(true);
    const isCorrect = optionId === getCorrectOption(currentTask);
    setFeedback({ optionId, isCorrect });

    if (isCorrect) {
      setHit(prev => prev + 1);
      triggerFireworks(fireworksRef.current);

      if (onCorrectReveal) {
        setTimeout(() => {
          setPromptOverride(onCorrectReveal(currentTask));
        }, 500);
      }

      setTimeout(gotoNextTask, 2500);
      return;
    }

    setMiss(prev => prev + 1);
    setWrongItems(prev => {
      const next = new Set(prev);
      next.add(getWrongLabel(currentTask));
      return next;
    });
    setTimeout(gotoNextTask, 1000);
  }

  if (isFinished) {
    return <ResultScreen miss={miss} wrongItems={wrongItemsArray} onRestart={restart} />;
  }

  return (
    <>
      <div className="game-ui">
        <h1>{title}</h1>
        <div className="score-board">
          Správne: <span className="score-hit">{hit}</span> | Chyby: <span className="score-miss">{miss}</span>
        </div>

        <div className={`prompt ${promptClassName}`.trim()}>{prompt}</div>

        <div className="button-container">
          {options.map(option => {
            const showIcon = feedback?.optionId === option.id;
            const icon = feedback?.isCorrect ? '✅' : '❌';

            return (
              <button
                key={option.id}
                className={option.className}
                onClick={() => check(option.id)}
                disabled={blocked}
              >
                {option.label}
                {showIcon && <span className="icon">{icon}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fireworks-overlay" ref={fireworksRef} />
    </>
  );
}
