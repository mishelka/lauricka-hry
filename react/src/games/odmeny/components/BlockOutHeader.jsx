import { UndoIcon, RestartIcon } from '../../../atomic/Icons';
import { GameToolbar } from '../../../atomic/GameLayout';
import styles from './BlockOutHeader.module.scss';

export default function BlockOutHeader({ title, onBack, backTitle, onUndo, canUndo, onRestart }) {
  return <GameToolbar
    title={title}
    onBack={backTitle === 'Späť do menu' ? undefined : onBack}
    backTitle={backTitle}
    actions={<>
      {onUndo && <button type="button" className={`${styles.button} ${styles.undo}`} onClick={onUndo} disabled={!canUndo} title="Krok späť" aria-label="Krok späť"><UndoIcon /></button>}
      {onRestart && <button type="button" className={`${styles.button} ${styles.restart}`} onClick={onRestart} title="Reštartovať level" aria-label="Reštartovať level"><RestartIcon /></button>}
    </>}
  />;
}
