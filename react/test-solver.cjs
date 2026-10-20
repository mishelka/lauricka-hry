// Solver and level validator for Block Out!
const COLOR_CONFIG = {
  red: 'red',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  purple: 'purple',
  orange: 'orange'
};

function getBlockCells(block) {
  if (block.cells && Array.isArray(block.cells)) {
    return block.cells;
  }
  if (block.shape) {
    switch (block.shape) {
      case '1x1': return [[0, 0]];
      case '1x2': return [[0, 0], [0, 1]];
      case '2x1': return [[0, 0], [1, 0]];
      case '1x3': return [[0, 0], [0, 1], [0, 2]];
      case '3x1': return [[0, 0], [1, 0], [2, 0]];
      case '2x2': return [[0, 0], [0, 1], [1, 0], [1, 1]];
      case 'L':
      case 'L1': return [[0, 0], [1, 0], [1, 1]];
      case 'L2': return [[0, 0], [0, 1], [1, 0]];
      case 'L3': return [[0, 0], [0, 1], [1, 1]];
      case 'L4': return [[0, 1], [1, 0], [1, 1]];
      case 'T': return [[0, 0], [0, 1], [0, 2], [1, 1]];
      default: return [[0, 0]];
    }
  }
  if (block.w && block.h) {
    const list = [];
    for (let dr = 0; dr < block.h; dr++) {
      for (let dc = 0; dc < block.w; dc++) {
        list.push([dr, dc]);
      }
    }
    return list;
  }
  return [[0, 0]];
}

function getOccupiedCells(block) {
  const cells = getBlockCells(block);
  return cells.map(([dr, dc]) => ({ r: block.r + dr, c: block.c + dc }));
}

function findDoorAt(doors, side, index) {
  return doors.find(d => {
    if (d.side !== side) return false;
    const span = d.span || 1;
    return index >= d.index && index < d.index + span;
  }) || null;
}

function getPossibleMoves(state, level) {
  const moves = [];
  const directions = [
    { dir: 'up', dr: -1, dc: 0 },
    { dir: 'down', dr: 1, dc: 0 },
    { dir: 'left', dr: 0, dc: -1 },
    { dir: 'right', dr: 0, dc: 1 }
  ];

  for (let i = 0; i < state.blocks.length; i++) {
    const block = state.blocks[i];
    const blockCells = getBlockCells(block);

    for (const { dir, dr, dc } of directions) {
      let curR = block.r;
      let curC = block.c;

      while (true) {
        const nextR = curR + dr;
        const nextC = curC + dc;
        const nextCells = blockCells.map(([rOff, cOff]) => ({
          r: nextR + rOff,
          c: nextC + cOff
        }));

        const exitingCells = nextCells.filter(
          c => c.r < 0 || c.r >= level.height || c.c < 0 || c.c >= level.width
        );

        if (exitingCells.length > 0) {
          // Check if valid exit
          let canExit = true;
          for (const cell of exitingCells) {
            let door = null;
            if (dr === -1 && cell.r === -1 && cell.c >= 0 && cell.c < level.width) {
              door = findDoorAt(level.doors, 'top', cell.c);
            } else if (dr === 1 && cell.r === level.height && cell.c >= 0 && cell.c < level.width) {
              door = findDoorAt(level.doors, 'bottom', cell.c);
            } else if (dc === -1 && cell.c === -1 && cell.r >= 0 && cell.r < level.height) {
              door = findDoorAt(level.doors, 'left', cell.r);
            } else if (dc === 1 && cell.c === level.width && cell.r >= 0 && cell.r < level.height) {
              door = findDoorAt(level.doors, 'right', cell.r);
            }

            if (!door || door.color !== block.color) {
              canExit = false;
              break;
            }
          }

          if (canExit) {
            // Block exits!
            const newBlocks = state.blocks.filter((_, idx) => idx !== i);
            moves.push({
              blockId: block.id,
              dir,
              action: 'exit',
              nextState: { blocks: newBlocks }
            });
          }
          break; // Stop sliding in this direction
        }

        // Check collision with other blocks
        const isOccupied = state.blocks.some((other, oIdx) => {
          if (oIdx === i) return false;
          const otherCells = getOccupiedCells(other);
          return nextCells.some(nc => otherCells.some(oc => oc.r === nc.r && oc.c === nc.c));
        });

        if (isOccupied) {
          break; // Hit another block
        }

        // Valid step forward
        curR = nextR;
        curC = nextC;

        const newBlocks = state.blocks.map((b, idx) =>
          idx === i ? { ...b, r: curR, c: curC } : b
        );
        moves.push({
          blockId: block.id,
          dir,
          action: 'move',
          nextState: { blocks: newBlocks }
        });
      }
    }
  }

  return moves;
}

function serializeState(state) {
  // Sort blocks by id for canonical representation
  const sorted = [...state.blocks].sort((a, b) => a.id.localeCompare(b.id));
  return sorted.map(b => `${b.id}:${b.r},${b.c}`).join('|');
}

function solveLevel(level) {
  const initialBlocks = level.blocks.map(b => ({ ...b }));
  const initialState = { blocks: initialBlocks };

  // BFS
  const queue = [{ state: initialState, path: [] }];
  const visited = new Set();
  visited.add(serializeState(initialState));

  while (queue.length > 0) {
    const { state, path } = queue.shift();

    if (state.blocks.length === 0) {
      return { winnable: true, steps: path.length, solution: path };
    }

    const moves = getPossibleMoves(state, level);
    for (const move of moves) {
      const key = serializeState(move.nextState);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          state: move.nextState,
          path: [...path, `${move.blockId} ${move.dir} (${move.action})`]
        });
      }
    }
  }

  return { winnable: false };
}

module.exports = {
  getBlockCells,
  getOccupiedCells,
  findDoorAt,
  solveLevel
};
