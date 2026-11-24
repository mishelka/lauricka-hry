import styles from './FrozenBlockSurface.module.scss';

export default function FrozenBlockSurface({ width, height, borderRadius }) {
  return (
    <div className={styles.surface} style={{ width: `${width}px`, height: `${height}px`, borderRadius: `${borderRadius}px` }}>
      <div className={styles.crystalGlow} />
      <div className={styles.facets} />
    </div>
  );
}