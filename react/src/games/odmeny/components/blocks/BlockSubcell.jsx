import styles from './BlockSubcell.module.scss';

export default function BlockSubcell({ cells, dr, dc, cellIdx, cellSize, gap, cellRadius, isFrozen, bgConf }) {
  const hasTop = cells.some(([r, c]) => r === dr - 1 && c === dc);
  const hasBottom = cells.some(([r, c]) => r === dr + 1 && c === dc);
  const hasLeft = cells.some(([r, c]) => r === dr && c === dc - 1);
  const hasRight = cells.some(([r, c]) => r === dr && c === dc + 1);
  const subStyle = {
    top: dr * (cellSize + gap), left: dc * (cellSize + gap), width: cellSize, height: cellSize,
    backgroundColor: isFrozen ? '#cbd5e1' : bgConf.bg,
    borderColor: isFrozen ? '#94a3b8' : bgConf.border,
    borderTopLeftRadius: !hasTop && !hasLeft ? `${cellRadius}px` : '0px',
    borderTopRightRadius: !hasTop && !hasRight ? `${cellRadius}px` : '0px',
    borderBottomLeftRadius: !hasBottom && !hasLeft ? `${cellRadius}px` : '0px',
    borderBottomRightRadius: !hasBottom && !hasRight ? `${cellRadius}px` : '0px'
  };

  return (
    <div key={cellIdx} className={styles.subcellWrapper}>
      <div className={`${styles.subcell} ${isFrozen ? styles.frozen : ''}`} style={subStyle}>{isFrozen && <div className={styles.ice} />}</div>
      {hasRight && <div className={`${styles.bridge} ${styles.bridgeH} ${isFrozen ? styles.frozen : ''}`} style={{ top: dr * (cellSize + gap), left: dc * (cellSize + gap) + cellSize - 1, width: gap + 2, height: cellSize, backgroundColor: isFrozen ? '#cbd5e1' : bgConf.bg, borderTop: `2px solid ${isFrozen ? '#94a3b8' : bgConf.border}`, borderBottom: `2px solid ${isFrozen ? '#94a3b8' : bgConf.border}` }} />}
      {hasBottom && <div className={`${styles.bridge} ${styles.bridgeV} ${isFrozen ? styles.frozen : ''}`} style={{ top: dr * (cellSize + gap) + cellSize - 1, left: dc * (cellSize + gap), width: cellSize, height: gap + 2, backgroundColor: isFrozen ? '#cbd5e1' : bgConf.bg, borderLeft: `2px solid ${isFrozen ? '#94a3b8' : bgConf.border}`, borderRight: `2px solid ${isFrozen ? '#94a3b8' : bgConf.border}` }} />}
      {hasRight && hasBottom && cells.some(([r, c]) => r === dr + 1 && c === dc + 1) && <div className={`${styles.bridge} ${styles.bridgeC} ${isFrozen ? styles.frozen : ''}`} style={{ top: dr * (cellSize + gap) + cellSize - 1, left: dc * (cellSize + gap) + cellSize - 1, width: gap + 2, height: gap + 2, backgroundColor: isFrozen ? '#cbd5e1' : bgConf.bg }} />}
    </div>
  );
}