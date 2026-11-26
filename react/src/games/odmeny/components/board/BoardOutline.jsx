import styles from './BoardOutline.module.scss';
import { buildFloorOutlinePath } from './floorOutline';

const STROKE_WIDTH = 3;

export default function BoardOutline({ width, height, walls, cellSize, gap, padding }) {
  const radius = Math.max(10, Math.round(cellSize * 0.3));
  const svgWidth = width * cellSize + (width - 1) * gap + padding * 2 + STROKE_WIDTH * 2;
  const svgHeight = height * cellSize + (height - 1) * gap + padding * 2 + STROKE_WIDTH * 2;
  const path = buildFloorOutlinePath({
    width,
    height,
    walls,
    cellSize,
    gap,
    padding,
    strokeWidth: STROKE_WIDTH,
    radius
  });

  return (
    <svg className={styles.outline} viewBox={`0 0 ${svgWidth} ${svgHeight}`} aria-hidden="true">
      <path d={path} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={STROKE_WIDTH} fillRule="evenodd" />
    </svg>
  );
}