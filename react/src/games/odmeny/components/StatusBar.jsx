import { GameStatus } from '../../../atomic/GameLayout';
import styles from './StatusBar.module.scss';

export default function StatusBar({ moves, message }) {
  return <GameStatus variant="blockout">
    <span className={styles.movesBadge}>Ťahy: {moves}</span>
    <div className="blockout-status-message" aria-live="polite">{message || '\u00a0'}</div>
  </GameStatus>;
}
