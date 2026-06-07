import { getStarCount } from '../utils/gameUtils';
import { useEffect } from 'react';

export default function ResultScreen({ miss, wrongItems, onRestart, onResult }) {
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
      <button className="btn-restart" onClick={onRestart}>Nová hra</button>
    </div>
  );
}
