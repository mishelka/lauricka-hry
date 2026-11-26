import { COLOR_CONFIG, getBlockCells, getBlockDimensions, isBlockFrozen } from '../../levels';
import BlockArrowOverlay from './BlockArrowOverlay';
import BlockSubcell from './BlockSubcell';
import FrozenBlockNumber from './FrozenBlockNumber';
import FrozenBlockSurface from './FrozenBlockSurface';
import { buildBlockOutlinePath } from './blockOutline';
import styles from './BlockPiece.module.scss';

export default function BlockPiece({ block, dragInfo, cellSize, gap, padding, onPointerDown }) {
  const conf = COLOR_CONFIG[block.color] || COLOR_CONFIG.red;
  const innerConf = block.innerColor ? (COLOR_CONFIG[block.innerColor] || COLOR_CONFIG.red) : null;
  const isDragging = dragInfo && dragInfo.blockId === block.id;
  const isFrozen = isBlockFrozen(block);
  const cells = getBlockCells(block);
  const dims = getBlockDimensions(block);
  const containerW = dims.cols * cellSize + (dims.cols - 1) * gap;
  const containerH = dims.rows * cellSize + (dims.rows - 1) * gap;
  const pieceStyle = { top: padding + block.r * (cellSize + gap), left: padding + block.c * (cellSize + gap), width: containerW, height: containerH };
  if (isDragging) pieceStyle.transform = `translate3d(${dragInfo.offsetX}px, ${dragInfo.offsetY}px, 0)`;
  const cellRadius = Math.max(8, Math.round(cellSize * 0.24));
  const isRectangular = cells.length === dims.rows * dims.cols;
  const bgConf = innerConf || conf;
  const hasTwoColorBorder = !isFrozen && (Boolean(innerConf) || Boolean(block.borderDestroying));
  const outerBorderColor = block.destroyingColor ? (COLOR_CONFIG[block.destroyingColor]?.bg || conf.bg) : conf.bg;
  const innerBorderThickness = Math.min(Math.round(cellSize / 2), Math.max(6, Math.round(Math.min(containerW, containerH) / 3.2)));
  const outlinePath = hasTwoColorBorder ? buildBlockOutlinePath({ cells, cellSize, gap, radius: cellRadius }) : '';
  const clipId = `clip-two-color-${block.id}`;
  const exitSide = block.exitSide ? block.exitSide[0].toUpperCase() + block.exitSide.slice(1) : '';
  const pieceClasses = [
    styles.piece,
    block.exiting && styles.exiting,
    block.exiting && styles[`exit${exitSide}`],
    isFrozen && styles.frozen,
    !isFrozen && block.justUnfrozen && styles.justUnfrozen,
    block.justRevealed && styles.justRevealed,
    isDragging && styles.dragging
  ].filter(Boolean).join(' ');

  return (
    <div className={pieceClasses} style={pieceStyle} onPointerDown={(e) => onPointerDown(block, e)}>
      {isFrozen && isRectangular && <FrozenBlockSurface width={containerW} height={containerH} borderRadius={cellRadius} />}
      <BlockArrowOverlay block={block} width={containerW} height={containerH} cellSize={cellSize} gap={gap} />
      <FrozenBlockNumber block={block} cellSize={cellSize} gap={gap} />
      {hasTwoColorBorder && (
        <svg
          className={`${styles.twoColorBorder} ${block.borderDestroying ? styles.destroying : ''}`}
          viewBox={`0 0 ${containerW} ${containerH}`}
          width={containerW}
          height={containerH}
        >
          <defs>
            <clipPath id={clipId}>
              <path d={outlinePath} />
            </clipPath>
          </defs>
          <path
            d={outlinePath}
            fill="none"
            stroke={outerBorderColor}
            strokeWidth={innerBorderThickness * 2}
            clipPath={`url(#${clipId})`}
          />
          <path
            d={outlinePath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            clipPath={`url(#${clipId})`}
          />
        </svg>
      )}
      {(!isFrozen || !isRectangular) && cells.map(([dr, dc], cellIdx) => (
        <BlockSubcell key={cellIdx} cells={cells} dr={dr} dc={dc} cellIdx={cellIdx} cellSize={cellSize} gap={gap} cellRadius={cellRadius} isFrozen={isFrozen} bgConf={bgConf} />
      ))}
    </div>
  );
}