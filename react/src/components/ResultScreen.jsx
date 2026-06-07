import { getStarCount } from '../utils/gameUtils';

export default function ResultScreen({ miss, wrongItems, onRestart }) {
  const stars = getStarCount(miss);

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
