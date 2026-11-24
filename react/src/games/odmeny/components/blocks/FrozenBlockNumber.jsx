import { getBlockCells } from '../../levels';
import styles from './FrozenBlockNumber.module.scss';

export default function FrozenBlockNumber({ block, cellSize, gap = 0 }) {
  const count = block.frozen ?? block.freezeCount ?? block.count ?? 0;
  if (!count || count <= 0) return null;
  const cells = getBlockCells(block);
  const avgR = cells.reduce((sum, [r]) => sum + r, 0) / cells.length;
  const avgC = cells.reduce((sum, [_, c]) => sum + c, 0) / cells.length;
  const cx = avgC * (cellSize + gap) + cellSize / 2;
  const cy = avgR * (cellSize + gap) + cellSize / 2;
  const fontSize = Math.max(22, Math.round(cellSize * 0.58));

  return (
    <div
      className={styles.number}
      style={{ left: `${cx}px`, top: `${cy}px`, fontSize: `${fontSize}px` }}
    >
      {count}
    </div>
  );
}