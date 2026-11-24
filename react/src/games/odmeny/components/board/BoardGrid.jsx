import WallCell from './WallCell';
import styles from './BoardGrid.module.scss';

export default function BoardGrid({ levelWidth, levelHeight, levelWalls, cellSize, gap, padding }) {
  return (
    <div className={styles.grid} style={{ padding: `${padding}px`, gap: `${gap}px`, gridTemplateColumns: `repeat(${levelWidth}, ${cellSize}px)`, gridTemplateRows: `repeat(${levelHeight}, ${cellSize}px)` }}>
      {Array.from({ length: levelHeight * levelWidth }).map((_, index) => {
        const r = Math.floor(index / levelWidth);
        const c = index % levelWidth;
        const isWall = levelWalls.some(w => w.r === r && w.c === c);
        return isWall
          ? <WallCell key={index} r={r} c={c} levelWidth={levelWidth} levelHeight={levelHeight} levelWalls={levelWalls} cellSize={cellSize} gap={gap} />
          : <div key={index} className={styles.cell} style={{ borderRadius: `${Math.max(6, Math.round(cellSize * 0.22))}px` }} />;
      })}
    </div>
  );
}