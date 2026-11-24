import styles from './WallCell.module.scss';

export default function WallCell({ r, c, levelWidth, levelHeight, levelWalls, cellSize, gap }) {
  const hasTop = levelWalls.some(w => w.r === r - 1 && w.c === c);
  const hasBottom = levelWalls.some(w => w.r === r + 1 && w.c === c);
  const hasLeft = levelWalls.some(w => w.r === r && w.c === c - 1);
  const hasRight = levelWalls.some(w => w.r === r && w.c === c + 1);
  const hasBottomRight = levelWalls.some(w => w.r === r + 1 && w.c === c + 1);
  const wallRadius = Math.max(8, Math.round(cellSize * 0.24));
  const isTopEdge = r === 0;
  const isBottomEdge = r === levelHeight - 1;
  const isLeftEdge = c === 0;
  const isRightEdge = c === levelWidth - 1;

  return (
    <div
      className={styles.wall}
      style={{
        borderTopLeftRadius: !hasTop && !hasLeft && !isTopEdge && !isLeftEdge ? `${wallRadius}px` : '0px',
        borderTopRightRadius: !hasTop && !hasRight && !isTopEdge && !isRightEdge ? `${wallRadius}px` : '0px',
        borderBottomLeftRadius: !hasBottom && !hasLeft && !isBottomEdge && !isLeftEdge ? `${wallRadius}px` : '0px',
        borderBottomRightRadius: !hasBottom && !hasRight && !isBottomEdge && !isRightEdge ? `${wallRadius}px` : '0px'
      }}
      title="Stena"
    >
      {hasRight && <div className={`${styles.bridge} ${styles.bridgeH}`} style={{ top: 0, left: 'calc(100% - 1px)', width: gap + 2, height: cellSize }} />}
      {hasBottom && <div className={`${styles.bridge} ${styles.bridgeV}`} style={{ top: 'calc(100% - 1px)', left: 0, width: cellSize, height: gap + 2 }} />}
      {hasRight && hasBottom && hasBottomRight && <div className={`${styles.bridge} ${styles.bridgeC}`} style={{ top: 'calc(100% - 1px)', left: 'calc(100% - 1px)', width: gap + 2, height: gap + 2 }} />}
    </div>
  );
}