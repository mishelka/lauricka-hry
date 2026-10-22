import { useMemo, useRef, useState } from 'react';
import { getStarCount, shuffleArray, triggerFireworks } from '../utils/gameUtils';
import { getLevelStars, updateLevelBestStars } from '../utils/player';
import useDevUnlock from '../utils/useDevUnlock';
import AudioTalePlayer from './AudioTalePlayer';
import { AUDIO_TALES } from '../data/audioTales';
import { RestartIcon, NextLevelIcon, LevelsMenuIcon, HeadphonesIcon, PauseIcon } from './Icons';

const MAX_STARS = 5;

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

function chunkWords(words, size = 10) {
  if (!words || words.length === 0) return [];
  const chunks = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size));
  }
  return chunks;
}

function renderStars(stars) {
  return `${'★'.repeat(stars)}${'☆'.repeat(MAX_STARS - stars)}`;
}

export default function WordFillGame({ title, gameId, levelGroups, sourceWords }) {
  const groups = useMemo(() => {
    if (levelGroups && levelGroups.length > 0) return levelGroups;
    if (sourceWords && sourceWords.length > 0) return chunkWords(sourceWords, 10);
    return [];
  }, [levelGroups, sourceWords]);

  const [levelStars, setLevelStars] = useState(() => getLevelStars(gameId, groups.length));
  useDevUnlock({ gameId, levelCount: groups.length, onUnlock: setLevelStars });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [words, setWords] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [wrongWords, setWrongWords] = useState(new Set());
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

  function startLevel(levelIndex) {
    if (!isLevelUnlocked(levelIndex)) return;
    const levelWords = groups[levelIndex] || [];
    setSelectedLevel(levelIndex);
    setWords(shuffleArray(levelWords));
    setAnswers({});
    setSubmitted(false);
    setWrongWords(new Set());
  }

  function restartCurrentLevel() {
    if (selectedLevel === null) return;
    const levelWords = groups[selectedLevel] || [];
    setWords(shuffleArray(levelWords));
    setAnswers({});
    setSubmitted(false);
    setWrongWords(new Set());
  }

  const parsedWords = useMemo(() => {
    return words.map(word => {
      const mode = getWordMode(word);
      return {
        word,
        parts: splitWord(word, mode.targetChars),
        options: mode.options
      };
    });
  }, [words]);

  const allFilled = useMemo(() => {
    if (parsedWords.length === 0) return false;
    return parsedWords.every((entry, wordIndex) => {
      const selected = answers[wordIndex] || [];
      const blankCount = entry.parts.filter(part => part.type === 'blank').length;
      if (blankCount === 0) return true;
      return selected.filter(Boolean).length >= blankCount;
    });
  }, [parsedWords, answers]);

  const filledCount = useMemo(() => {
    return parsedWords.filter((entry, wordIndex) => {
      const selected = answers[wordIndex] || [];
      const blankCount = entry.parts.filter(part => part.type === 'blank').length;
      if (blankCount === 0) return true;
      return selected.filter(Boolean).length >= blankCount;
    }).length;
  }, [parsedWords, answers]);

  function onSelect(wordIndex, blankIndex, value) {
    if (submitted) return;
    setAnswers(prev => {
      const next = { ...prev };
      const row = [...(next[wordIndex] || [])];
      row[blankIndex] = value;
      next[wordIndex] = row;
      return next;
    });
  }

  function confirmLevel() {
    if (!allFilled || submitted) return;

    let mistakesCount = 0;
    const wrong = new Set();

    parsedWords.forEach((entry, wordIndex) => {
      const selected = answers[wordIndex] || [];
      let blankCounter = 0;
      let hasMistake = false;

      entry.parts.forEach(part => {
        if (part.type !== 'blank') return;
        const choice = selected[blankCounter] || '';
        blankCounter += 1;
        const normalizedChoice = normalizeChoiceForCorrect(choice, part.correct);
        if (normalizedChoice !== part.correct) {
          hasMistake = true;
          mistakesCount += 1;
        }
      });

      if (hasMistake) {
        wrong.add(entry.word);
      }
    });

    setWrongWords(wrong);
    setSubmitted(true);

    const stars = getStarCount(mistakesCount);
    const previous = levelStars[selectedLevel] || 0;
    const best = Math.max(previous, stars);
    const updated = updateLevelBestStars(gameId, selectedLevel, best, groups.length);
    setLevelStars(updated);

    if (stars === MAX_STARS) {
      triggerFireworks(fireworksRef.current);
    }
  }

  function renderWord(entry, wordIndex) {
    const parts = entry.parts;
    let blankCounter = 0;
    const selected = answers[wordIndex] || [];

    return parts.map((part, idx) => {
      if (part.type === 'text') {
        return <span key={`${wordIndex}-text-${idx}`}>{part.value}</span>;
      }

      const optionIndex = blankCounter;
      blankCounter += 1;
      const choice = selected[optionIndex] || '';

      if (!submitted) {
        const isUpper = part.correct === part.correct.toUpperCase() && part.correct !== part.correct.toLowerCase();
        const optionsList = isUpper
          ? entry.options.map(opt => opt.toLocaleUpperCase('sk'))
          : entry.options.map(opt => opt.toLocaleLowerCase('sk'));

        return (
          <select
            key={`${wordIndex}-blank-${idx}`}
            className="dopln-select"
            value={choice}
            onChange={e => onSelect(wordIndex, optionIndex, e.target.value)}
            aria-label="Vyber písmeno"
          >
            <option value="">_</option>
            {optionsList.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }

      if (!choice) {
        return (
          <span key={`${wordIndex}-result-empty-${idx}`} className="letter-wrong-stack">
            <span className="letter-correct-top">{part.correct}</span>
            <span className="letter-wrong-bottom">_</span>
          </span>
        );
      }

      const normalizedChoice = normalizeChoiceForCorrect(choice, part.correct);

      if (normalizedChoice === part.correct) {
        return (
          <span key={`${wordIndex}-result-good-${idx}`} className="letter-correct">{normalizedChoice}</span>
        );
      }

      return (
        <span key={`${wordIndex}-result-bad-${idx}`} className="letter-wrong-stack">
          <span className="letter-correct-top">{part.correct}</span>
          <span className="letter-wrong-bottom">{normalizedChoice}</span>
        </span>
      );
    });
  }

  const levelDone = selectedLevel !== null ? (levelStars[selectedLevel] || 0) === MAX_STARS : false;
  const hasNextLevel = selectedLevel !== null && selectedLevel < groups.length - 1;
  const taleUrl = AUDIO_TALES.slovaYiLevels[selectedLevel % AUDIO_TALES.slovaYiLevels.length] || AUDIO_TALES.yi;

  if (selectedLevel === null) {
    return (
      <div>
        <h1>{title}</h1>
        <p className="level-menu-help">
          Vyber si úroveň a doplň správne písmená do 10 slov. Získaj 5★ na odomknutie ďalšej úrovne.
        </p>

        <div className="levels-grid">
          {groups.map((_, level) => {
            const best = levelStars[level] || 0;
            const levelTaleUrl = AUDIO_TALES.slovaYiLevels[level % AUDIO_TALES.slovaYiLevels.length] || AUDIO_TALES.yi;
            const unlocked = isLevelUnlocked(level);
            const classes = ['level-btn'];
            if (best === MAX_STARS) classes.push('completed');
            if (!unlocked) classes.push('locked');

            return (
              <div key={level} className="level-item-wrapper">
                <button
                  type="button"
                  className={classes.join(' ')}
                  onClick={() => startLevel(level)}
                  disabled={!unlocked}
                >
                  <span className="level-number">{`Level ${level + 1}`}</span>
                  <span className="level-stars">{renderStars(best)}</span>
                  {!unlocked && <small>Najprv získaj 5★ v predchádzajúcom leveli</small>}
                </button>
                {best === MAX_STARS && (
                  <AudioTalePlayer
                    taleUrl={levelTaleUrl}
                    className="level-play-btn"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentStars = submitted ? getStarCount(wrongWords.size) : 0;

  return (
    <div className="dopln-game">
      <div ref={fireworksRef} className="fireworks-overlay" />
      <h1>{`${title} - Level ${selectedLevel + 1}`}</h1>

      {!submitted ? (
        <>
          <p className="level-menu-help">
            Doplň správne písmená do všetkých 10 slov a stlač <strong>Skontrolovať</strong>:
          </p>
          <div className="score-board">
            Doplnené: <span className="score-hit">{filledCount}</span> / {words.length}
          </div>
        </>
      ) : (
        <div className="result-box">
          <h2>Koniec levelu!</h2>
          <div className="stars">
            {Array.from({ length: MAX_STARS }).map((_, idx) => (
              <span key={idx} className={idx < currentStars ? 'star-gold' : 'star-grey'}>★</span>
            ))}
          </div>
          <div className="level-progress-message">
            {currentStars === MAX_STARS
              ? (hasNextLevel ? 'Level splnený na 5★! Môžeš pokračovať na ďalší.' : 'Fantastické! Zvládla si všetky levely!')
              : `Získala si ${currentStars}/5 ★. Na postup do ďalšieho levelu potrebuješ 5/5 ★.`}
          </div>
          <div className="wrong-list">
            {wrongWords.size > 0
              ? `Precvič si: ${Array.from(wrongWords).join(', ')}`
              : 'Výborne, žiadne chyby! Všetko správne! 🎉'}
          </div>
          <div className="result-actions">
            <div className="result-actions-icons">
              <button
                type="button"
                className="btn-icon-action btn-icon-restart"
                onClick={restartCurrentLevel}
                title="Opakovať level"
              >
                <RestartIcon size={26} />
              </button>
              {currentStars === MAX_STARS && (
                <AudioTalePlayer
                  taleUrl={taleUrl}
                  className="btn-icon-action btn-icon-reward"
                  playLabel={<HeadphonesIcon size={26} />}
                  pauseLabel={<PauseIcon size={26} />}
                  title="Prehrať rozprávku"
                />
              )}
            </div>
            <div className="result-actions-nav">
              <button className="btn-secondary btn-levels-menu" onClick={() => setSelectedLevel(null)}>
                <LevelsMenuIcon />
                <span>Menu levelov</span>
              </button>
              {hasNextLevel && (levelDone || currentStars === MAX_STARS) && (
                <button className="btn-next-level" onClick={() => startLevel(selectedLevel + 1)}>
                  <NextLevelIcon />
                  <span>Ďalší level</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="dopln-list" style={{ marginTop: '16px' }}>
        {parsedWords.map((entry, wordIndex) => (
          <div className="dopln-word-row" key={`${selectedLevel}-${wordIndex}`}>
            <span className="dopln-word-index">{wordIndex + 1}.</span>
            <span className="dopln-word">{renderWord(entry, wordIndex)}</span>
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="result-actions" style={{ marginTop: '20px' }}>
          <button className="btn-confirm" disabled={!allFilled} onClick={confirmLevel}>
            Skontrolovať
          </button>
          <button className="btn-secondary" onClick={() => setSelectedLevel(null)}>
            <LevelsMenuIcon />
            <span>Menu levelov</span>
          </button>
        </div>
      )}
    </div>
  );
}