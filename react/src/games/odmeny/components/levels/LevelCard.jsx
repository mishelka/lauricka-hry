import styles from './LevelCard.module.scss';

export default function LevelCard({ level, index, stars, plays, saved, unlocked, maxLevelPlays, onSelect }) {
  const hasSavedProgress = Boolean(unlocked && saved && (saved.moves > 0 || (Array.isArray(saved.blocks) && saved.blocks.length < level.blocks.length)));

  return (
    <button
      className={[styles.card, !unlocked && styles.locked, hasSavedProgress && styles.hasSavedProgress].filter(Boolean).join(' ')}
      disabled={!unlocked}
      onClick={() => onSelect(index)}
      title={!unlocked ? `Level je zamknutý (odohrané ${plays}/${maxLevelPlays})` : (hasSavedProgress ? `Level ${level.id} - rozohraný (odohrané ${plays}/${maxLevelPlays})` : `Level ${level.id} (odohrané ${plays}/${maxLevelPlays})`)}
    >
      <div className={styles.number}>{level.id}</div>
      {unlocked ? <>
        <div className={styles.stars}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
        <div className={styles.plays}>{plays}/{maxLevelPlays}</div>
        {hasSavedProgress && <div className={styles.inProgress} title="Rozohraný level">▶ Rozohrané</div>}
      </> : <>
        <div className={styles.lockIcon}>🔒</div>
        <div className={`${styles.plays} ${styles.maxed}`}>{plays}/{maxLevelPlays}</div>
      </>}
    </button>
  );
}