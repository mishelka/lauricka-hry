import BlockPiece from '../blocks/BlockPiece';
import BoardGrid from './BoardGrid';
import Door from '../doors/Door';
import styles from './GameBoard.module.scss';

export default function GameBoard({ level, levelWalls, doors, blocks, dragInfo, cellSize, gap, padding, doorDepth, onPointerDown }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.outer} style={{
        width: level.width * cellSize + (level.width - 1) * gap + padding * 2,
        height: level.height * cellSize + (level.height - 1) * gap + padding * 2,
        marginTop: doorDepth + 4,
        marginBottom: doorDepth + 4
      }}>
        {doors.map((door, index) => <Door key={door.id || index} door={door} blocks={blocks} dragInfo={dragInfo} levelWidth={level.width} levelHeight={level.height} cellSize={cellSize} gap={gap} padding={padding} doorDepth={doorDepth} />)}
        <BoardGrid levelWidth={level.width} levelHeight={level.height} levelWalls={levelWalls} cellSize={cellSize} gap={gap} padding={padding} />
        {blocks.map(block => <BlockPiece key={block.id} block={block} dragInfo={dragInfo} cellSize={cellSize} gap={gap} padding={padding} onPointerDown={onPointerDown} />)}
      </div>
    </div>
  );
}