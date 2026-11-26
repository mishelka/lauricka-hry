import { COLOR_CONFIG, getOccupiedCells, isDoorLocked } from '../../levels';
import DoorArrow from './DoorArrow';
import styles from './Door.module.scss';

export default function Door({ door, blocks, dragInfo, levelWidth, levelHeight, cellSize, gap, padding, doorDepth }) {
  const conf = COLOR_CONFIG[door.color] || COLOR_CONFIG.red;
  const span = door.span || 1;
  const isLocked = isDoorLocked(door);
  const depth = isLocked ? Math.round(doorDepth * 1.4) : doorDepth;
  const doorWidth = door.side === 'top' || door.side === 'bottom' ? span * cellSize + (span - 1) * gap : depth;
  const doorHeight = door.side === 'left' || door.side === 'right' ? span * cellSize + (span - 1) * gap : depth;
  const isWhiteDoor = door.color === 'white';
  const doorStyle = {
    backgroundColor: isLocked ? '#bfe9f8' : conf.bg,
    borderColor: isLocked ? '#7fcfee' : isWhiteDoor ? '#334155' : conf.border,
    boxShadow: isLocked
      ? 'inset 0 0 6px 2px rgba(79, 179, 220, 0.85), inset 0 0 14px 5px rgba(79, 179, 220, 0.45), 0 2px 5px rgba(0, 0, 0, 0.15)'
      : isWhiteDoor ? '0 3px 8px rgba(0, 0, 0, 0.25)' : `0 0 10px ${conf.glow}`
  };

  if (door.side === 'top') Object.assign(doorStyle, { left: padding + door.index * (cellSize + gap), width: doorWidth, top: -depth, height: depth });
  else if (door.side === 'bottom') Object.assign(doorStyle, { left: padding + door.index * (cellSize + gap), width: doorWidth, bottom: -depth, height: depth });
  else if (door.side === 'left') Object.assign(doorStyle, { top: padding + door.index * (cellSize + gap), height: doorHeight, left: -depth, width: depth });
  else if (door.side === 'right') Object.assign(doorStyle, { top: padding + door.index * (cellSize + gap), height: doorHeight, right: -depth, width: depth });

  const isMatchingBlockAdjacent = !isLocked && blocks.some(b => {
    if (b.exiting || b.color !== door.color) return false;
    const effectiveBlock = dragInfo && dragInfo.blockId === b.id ? { ...b, r: dragInfo.currentR, c: dragInfo.currentC } : b;
    return getOccupiedCells(effectiveBlock).some(cell => {
      if (door.side === 'top') return cell.r === 0 && cell.c >= door.index && cell.c < door.index + span;
      if (door.side === 'bottom') return cell.r === levelHeight - 1 && cell.c >= door.index && cell.c < door.index + span;
      if (door.side === 'left') return cell.c === 0 && cell.r >= door.index && cell.r < door.index + span;
      if (door.side === 'right') return cell.c === levelWidth - 1 && cell.r >= door.index && cell.r < door.index + span;
      return false;
    });
  });

  const isAbsorbing = !isLocked && (blocks.some(b => {
    if (!b.exiting || b.exitSide !== door.side || b.color !== door.color) return false;
    return getOccupiedCells(b).some(cell => {
      if (door.side === 'top' || door.side === 'bottom') return cell.c >= door.index && cell.c < door.index + span;
      if (door.side === 'left' || door.side === 'right') return cell.r >= door.index && cell.r < door.index + span;
      return false;
    });
  }) || (dragInfo && dragInfo.isExiting && dragInfo.exitSide === door.side && (() => {
    const activeBlock = blocks.find(b => b.id === dragInfo.blockId);
    if (!activeBlock || activeBlock.color !== door.color) return false;
    return getOccupiedCells({ ...activeBlock, r: dragInfo.currentR, c: dragInfo.currentC }).some(cell => {
      if (door.side === 'top' || door.side === 'bottom') return cell.c >= door.index && cell.c < door.index + span;
      if (door.side === 'left' || door.side === 'right') return cell.r >= door.index && cell.r < door.index + span;
      return false;
    });
  })()));

  return (
    <div
      className={[styles.door, styles[door.side], isWhiteDoor && !isLocked && styles.white, isLocked && styles.locked, door.justUnlocked && styles.justUnlocked, isMatchingBlockAdjacent && styles.highlight, isAbsorbing && styles.absorbing].filter(Boolean).join(' ')}
      style={doorStyle}
      title={isLocked ? `Zamknutý východ (zostáva ${door.locked})` : undefined}
    >
      {isLocked ? (
        <span className={styles.lockCount} style={{ fontSize: `${Math.max(14, Math.round(doorDepth * 0.78))}px` }}>{door.locked}</span>
      ) : <DoorArrow side={door.side} color={door.color} size={Math.max(12, Math.round(cellSize * 0.4))} pulsing={isMatchingBlockAdjacent} />}
    </div>
  );
}