import { useMemo, useState } from 'react';
import { shuffleArray } from '../utils/gameUtils';
import { getBestStars, updateBestStars } from '../utils/player';

const BATCH_SIZE = 5;
const TOTAL_STARS = 5;

const IY_MODE = {
  targetChars: new Set(['i', 'í', 'y', 'ý', 'I', 'Í', 'Y', 'Ý']),
  options: ['i', 'í', 'y', 'ý']
};

const EA_MODE = {
  targetChars: new Set(['e', 'ä', 'E', 'Ä']),
  options: ['e', 'ä']
};

function getWordMode(word) {
  const lower = word.toLocaleLowerCase('sk');
  if (lower.includes('ä') || lower === 'desať') return EA_MODE;
  return IY_MODE;
}

function splitWord(word, targetChars) {
  return Array.from(word).map((ch, index) => {
    if (targetChars.has(ch)) {
      return { type: 'blank', correct: ch, index };
    }
    return { type: 'text', value: ch, index };
  });
}

function normalizeChoiceForCorrect(choice, correct) {
  if (!choice) return choice;
  if (correct === correct.toUpperCase()) {
    return choice.toLocaleUpperCase('sk');
  }
  return choice;
}

function starsFromProgress(done, total) {
  if (total <= 0) return 0;
  if (done >= total) return TOTAL_STARS;
  return Math.max(0, Math.min(TOTAL_STARS, Math.floor((done / total) * TOTAL_STARS)));
}

export default function WordFillGame({ title, gameId, sourceWords }) {
  const [words, setWords] = useState(() => shuffleArray(sourceWords));
  const [batchStart, setBatchStart] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [sessionStars, setSessionStars] = useState(0);
  const [bestStars, setBestStars] = useState(() => getBestStars(gameId));
  const [wrongWords, setWrongWords] = useState(new Set());

  const total = words.length;
  const doneCount = Math.min(batchStart + (submitted ? BATCH_SIZE : 0), total);
  const currentStars = starsFromProgress(doneCount, total);
  const batchWords = useMemo(
    () => words.slice(batchStart, batchStart + BATCH_SIZE),
    [batchStart, words]
  );

  const parsedBatch = useMemo(() => {
    return batchWords.map(word => {
      const mode = getWordMode(word);
      return {
        parts: splitWord(word, mode.targetChars),
        options: mode.options
      };
    });
  }, [batchWords]);

  const allFilled = parsedBatch.every((entry, wordIndex) => {
    const globalIndex = batchStart + wordIndex;
    const selected = answers[globalIndex] || [];
    const blankCount = entry.parts.filter(part => part.type === 'blank').length;
    if (blankCount === 0) return true;
    return selected.filter(Boolean).length >= blankCount;
  });

  const finished = submitted && doneCount >= total;

  function onSelect(globalWordIndex, blankIndex, value) {
    if (submitted) return;
    setAnswers(prev => {
      const next = { ...prev };
      const row = [...(next[globalWordIndex] || [])];
      row[blankIndex] = value;
      next[globalWordIndex] = row;
      return next;
    });
  }

  function collectBatchMistakes() {
    const nextWrong = new Set(wrongWords);

    parsedBatch.forEach((entry, wordIndex) => {
      const globalWordIndex = batchStart + wordIndex;
      const selected = answers[globalWordIndex] || [];
      let blankCounter = 0;
      let hasMistake = false;

      entry.parts.forEach(part => {
        if (part.type !== 'blank') return;
        const choice = selected[blankCounter] || '';
        blankCounter += 1;
        const normalizedChoice = normalizeChoiceForCorrect(choice, part.correct);
        if (normalizedChoice !== part.correct) hasMistake = true;
      });

      if (hasMistake) {
        nextWrong.add(words[globalWordIndex]);
      }
    });

    setWrongWords(nextWrong);
  }

  function confirmBatch() {
    if (!allFilled || submitted) return;
    collectBatchMistakes();
    setSubmitted(true);
    setSessionStars(currentStars);
    const nextBest = updateBestStars(gameId, currentStars);
    setBestStars(nextBest);
  }

  function nextBatch() {
    if (!submitted) return;
    setBatchStart(prev => prev + BATCH_SIZE);
    setSubmitted(false);
  }

  function restartGame() {
    setWords(shuffleArray(sourceWords));
    setBatchStart(0);
    setSubmitted(false);
    setAnswers({});
    setSessionStars(0);
    setWrongWords(new Set());
  }

  function renderWord(entry, globalWordIndex) {
    const parts = entry.parts;
    let blankCounter = 0;
    const selected = answers[globalWordIndex] || [];

    return parts.map((part, idx) => {
      if (part.type === 'text') {
        return <span key={`${globalWordIndex}-text-${idx}`}>{part.value}</span>;
      }

      const optionIndex = blankCounter;
      blankCounter += 1;
      const choice = selected[optionIndex] || '';

      if (!submitted) {
        return (
          <select
            key={`${globalWordIndex}-blank-${idx}`}
            className="dopln-select"
            value={choice}
            onChange={e => onSelect(globalWordIndex, optionIndex, e.target.value)}
            aria-label="Vyber pismeno"
          >
            <option value="">_</option>
            {entry.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }

      if (!choice) {
        return (
          <span key={`${globalWordIndex}-result-empty-${idx}`} className="letter-wrong-stack">
            <span className="letter-correct-top">{part.correct}</span>
            <span className="letter-wrong-bottom">_</span>
          </span>
        );
      }

      const normalizedChoice = normalizeChoiceForCorrect(choice, part.correct);

      if (normalizedChoice === part.correct) {
        return (
          <span key={`${globalWordIndex}-result-good-${idx}`} className="letter-correct">{normalizedChoice}</span>
        );
      }

      return (
        <span key={`${globalWordIndex}-result-bad-${idx}`} className="letter-wrong-stack">
          <span className="letter-correct-top">{part.correct}</span>
          <span className="letter-wrong-bottom">{normalizedChoice}</span>
        </span>
      );
    });
  }

  return (
    <div className="dopln-game">
      <h1>{title}</h1>
      <div className="score-board">
        Postup: <span className="score-hit">{doneCount}</span> / {total}
      </div>
      <div className="best-stars">Hviezdy: {'★'.repeat(currentStars)}{'☆'.repeat(TOTAL_STARS - currentStars)}</div>
      <div className="best-stars">Najlepšie: {'★'.repeat(bestStars)}{'☆'.repeat(TOTAL_STARS - bestStars)}</div>

      <div className="dopln-list">
        {parsedBatch.map((entry, wordIndex) => {
          const globalWordIndex = batchStart + wordIndex;
          return (
            <div className="dopln-word-row" key={`${batchStart}-${wordIndex}`}>
              <span className="dopln-word-index">{globalWordIndex + 1}.</span>
              <span className="dopln-word">{renderWord(entry, globalWordIndex)}</span>
            </div>
          );
        })}
      </div>

      <div className="result-actions">
        {!submitted && (
          <button className="btn-restart" disabled={!allFilled} onClick={confirmBatch}>
            Potvrdiť výber
          </button>
        )}

        {submitted && !finished && (
          <button className="btn-next-level" onClick={nextBatch}>
            Ďalších 5 slov
          </button>
        )}

        {finished && (
          <div className="result-box">
            <h2>Výborne, prešiel(a) si všetky slová.</h2>
            <div className="stars">
              {Array.from({ length: TOTAL_STARS }).map((_, idx) => (
                <span key={idx} className="star-gold">★</span>
              ))}
            </div>
            <div className="wrong-list">
              {wrongWords.size > 0
                ? `Precvič si: ${Array.from(wrongWords).join(', ')}`
                : 'Výborne, žiadne chyby!'}
            </div>
            <button className="btn-restart" onClick={restartGame}>Hrať znova</button>
          </div>
        )}
      </div>

      <p className="level-menu-help">Po potvrdení sú správne písmená zelené a nesprávne červené, pričom správne vidíš nad chybou.</p>
      <p className="level-menu-help">Hviezdu získaš po každej pätine celého zoznamu.</p>
      <div className="best-stars" aria-live="polite">Aktuálne získané hviezdy: {sessionStars}</div>
    </div>
  );
}