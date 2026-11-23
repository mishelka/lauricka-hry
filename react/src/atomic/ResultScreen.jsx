import { getStarCount } from '../utils/gameUtils';
import { useEffect } from 'react';
import AudioTalePlayer from './AudioTalePlayer';
import { RestartIcon, HeadphonesIcon, PauseIcon } from './Icons';

export default function ResultScreen({ miss, wrongItems, onRestart, onResult, taleUrl }) {
  const stars = getStarCount(miss);

  useEffect(() => {
    if (onResult) onResult(stars);
  }, [onResult, stars]);

  return (
    <div className="result-box">
      <h2>Koniec hry!</h2>
      <div className="stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < stars ? 'star-gold' : 'star-grey'}>
            ★
          </span>
        ))}
      </div>
      <div className="wrong-list">
        {wrongItems.length > 0 ? `Precvič si: ${wrongItems.join(', ')}` : 'Výborne, žiadne chyby!'}
      </div>
      <div className="result-actions">
        <div className="result-actions-icons">
          <button
            type="button"
            className="btn-icon-action btn-icon-restart"
            onClick={onRestart}
            title="Nová hra"
          >
            <RestartIcon size={26} />
          </button>
          {stars === 5 && (
            <AudioTalePlayer
              taleUrl={taleUrl}
              className="btn-icon-action btn-icon-reward"
              playLabel={<HeadphonesIcon size={26} />}
              pauseLabel={<PauseIcon size={26} />}
              title="Prehrať rozprávku"
            />
          )}
        </div>
      </div>
    </div>
  );
}
