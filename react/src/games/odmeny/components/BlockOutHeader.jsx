import { BackIcon, LevelsMenuIcon, UndoIcon, RestartIcon, SoundOnIcon, SoundOffIcon } from '../../../atomic/Icons';
import styles from './BlockOutHeader.module.scss';

export default function BlockOutHeader({ title, onBack, backTitle, backIcon, onUndo, canUndo, onRestart, muted, onToggleMute }) {
  return (
    <div className={styles.header}>
      <button className={`${styles.button} ${styles.back}`} onClick={onBack} title={backTitle}>
        {backIcon === 'levels' ? <LevelsMenuIcon size={20} stroke="currentColor" /> : (backIcon || <BackIcon size={20} stroke="currentColor" />)}
      </button>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.actions}>
        {onUndo && <button className={`${styles.button} ${styles.undo}`} onClick={onUndo} disabled={!canUndo} title="Krok späť"><UndoIcon size={20} stroke="currentColor" /></button>}
        {onRestart && <button className={`${styles.button} ${styles.restart}`} onClick={onRestart} title="Reštartovať level"><RestartIcon size={20} stroke="currentColor" /></button>}
        <button className={`${styles.button} ${styles.sound}`} onClick={onToggleMute} title={muted ? 'Zapnúť zvuk' : 'Vypnúť zvuk'}>
          {muted ? <SoundOffIcon size={20} stroke="currentColor" /> : <SoundOnIcon size={20} stroke="currentColor" />}
        </button>
      </div>
    </div>
  );
}