import { getBlockCells } from '../../levels';
import styles from './BlockArrowOverlay.module.scss';

export default function BlockArrowOverlay({ block, width, height, cellSize, gap = 0 }) {
  const dir = block.direction || block.axis;
  if (!dir) return null;

  const cells = getBlockCells(block);
  const arrowPadding = Math.max(6, Math.round(cellSize * 0.18));
  const headSize = Math.max(7, Math.round(cellSize * 0.22));
  const strokeW = Math.max(3.5, Math.round(cellSize * 0.08));
  let targetRow = block.arrowRow;
  if (targetRow === undefined) {
    const rowCounts = {};
    for (const [r] of cells) rowCounts[r] = (rowCounts[r] || 0) + 1;
    let maxCount = -1;
    for (const [rStr, count] of Object.entries(rowCounts)) {
      const r = Number(rStr);
      if (count > maxCount) { maxCount = count; targetRow = r; }
    }
  }
  let targetCol = block.arrowCol;
  if (targetCol === undefined) {
    const colCounts = {};
    for (const [_, c] of cells) colCounts[c] = (colCounts[c] || 0) + 1;
    let maxCount = -1;
    for (const [cStr, count] of Object.entries(colCounts)) {
      const c = Number(cStr);
      if (count > maxCount) { maxCount = count; targetCol = c; }
    }
  }
  const rowCols = cells.filter(([r]) => r === targetRow).map(([_, c]) => c);
  const minC = rowCols.length > 0 ? Math.min(...rowCols) : 0;
  const maxC = rowCols.length > 0 ? Math.max(...rowCols) : 0;
  const cy = (targetRow || 0) * (cellSize + gap) + cellSize / 2;
  const xLeft = minC * (cellSize + gap) + arrowPadding;
  const xRight = maxC * (cellSize + gap) + cellSize - arrowPadding;
  const colRows = cells.filter(([_, c]) => c === targetCol).map(([r]) => r);
  const minR = colRows.length > 0 ? Math.min(...colRows) : 0;
  const maxR = colRows.length > 0 ? Math.max(...colRows) : 0;
  const cx = (targetCol || 0) * (cellSize + gap) + cellSize / 2;
  const yTop = minR * (cellSize + gap) + arrowPadding;
  const yBottom = maxR * (cellSize + gap) + cellSize - arrowPadding;
  const svgProps = { className: styles.arrow, width, height, viewBox: `0 0 ${width} ${height}` };
  const filterId = `arrow-glow-${block.id}`;
  const arrow = (children) => (
    <svg {...svgProps}>
      <defs><filter id={filterId} x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" /></filter></defs>
      <g filter={`url(#${filterId})`}>{children}</g>
    </svg>
  );

  if (dir === 'vertical' || dir === 'v' || dir === 'y') return arrow(<>
    <line x1={cx} y1={yTop + headSize * 0.6} x2={cx} y2={yBottom - headSize * 0.6} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
    <polygon points={`${cx},${yTop} ${cx - headSize},${yTop + headSize * 1.3} ${cx + headSize},${yTop + headSize * 1.3}`} fill="white" />
    <polygon points={`${cx},${yBottom} ${cx - headSize},${yBottom - headSize * 1.3} ${cx + headSize},${yBottom - headSize * 1.3}`} fill="white" />
  </>);
  if (dir === 'horizontal' || dir === 'h' || dir === 'x') return arrow(<>
    <line x1={xLeft + headSize * 0.6} y1={cy} x2={xRight - headSize * 0.6} y2={cy} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
    <polygon points={`${xLeft},${cy} ${xLeft + headSize * 1.3},${cy - headSize} ${xLeft + headSize * 1.3},${cy + headSize}`} fill="white" />
    <polygon points={`${xRight},${cy} ${xRight - headSize * 1.3},${cy - headSize} ${xRight - headSize * 1.3},${cy + headSize}`} fill="white" />
  </>);
  if (dir === 'up') return arrow(<>
    <line x1={cx} y1={yTop + headSize * 0.6} x2={cx} y2={yBottom} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
    <polygon points={`${cx},${yTop} ${cx - headSize},${yTop + headSize * 1.4} ${cx + headSize},${yTop + headSize * 1.4}`} fill="white" />
  </>);
  if (dir === 'down') return arrow(<>
    <line x1={cx} y1={yTop} x2={cx} y2={yBottom - headSize * 0.6} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
    <polygon points={`${cx},${yBottom} ${cx - headSize},${yBottom - headSize * 1.4} ${cx + headSize},${yBottom - headSize * 1.4}`} fill="white" />
  </>);
  if (dir === 'left') return arrow(<>
    <line x1={xLeft + headSize * 0.6} y1={cy} x2={xRight} y2={cy} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
    <polygon points={`${xLeft},${cy} ${xLeft + headSize * 1.4},${cy - headSize} ${xLeft + headSize * 1.4},${cy + headSize}`} fill="white" />
  </>);
  if (dir === 'right') return arrow(<>
    <line x1={xLeft} y1={cy} x2={xRight - headSize * 0.6} y2={cy} stroke="white" strokeWidth={strokeW} strokeLinecap="round" />
    <polygon points={`${xRight},${cy} ${xRight - headSize * 1.4},${cy - headSize} ${xRight - headSize * 1.4},${cy + headSize}`} fill="white" />
  </>);
  return null;
}