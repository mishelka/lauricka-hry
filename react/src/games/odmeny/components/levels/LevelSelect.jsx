import LevelCard from './LevelCard';
import styles from './LevelSelect.module.scss';

export default function LevelSelect({ levels, levelStars, levelPlays, savedStates, isLevelUnlocked, onSelect, maxLevelPlays }) {
  return (
    <div className={styles.grid} data-scrollable>
      {levels.map((level, index) => {
        const unlocked = isLevelUnlocked(index);
        return <LevelCard key={level.id} level={level} index={index} stars={levelStars[index] || 0} plays={levelPlays[index] || 0} saved={savedStates[index]} unlocked={unlocked} maxLevelPlays={maxLevelPlays} onSelect={onSelect} />;
      })}
    </div>
  );
}