import level1 from './level1';
import level2 from './level2';
import level3 from './level3';
import level4 from './level4';
import level5 from './level5';
import level6 from './level6';
import level7 from './level7';
import level8 from './level8';
import level9 from './level9';

export { level1, level2, level3, level4, level5, level6, level7, level8, level9 };

export const BLOCK_OUT_LEVELS = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9
];

export function isBlockOutLevelImplemented(levelIndex) {
  return typeof levelIndex === 'number' && levelIndex >= 0 && levelIndex < BLOCK_OUT_LEVELS.length;
}

export const COLOR_CONFIG = {
  red: {
    id: 'red',
    name: 'Červená',
    bg: '#ef4444',
    border: '#b91c1c',
    glow: 'rgba(239, 68, 68, 0.4)',
    text: '#ffffff',
    label: '🔴'
  },
  blue: {
    id: 'blue',
    name: 'Tmavomodrá',
    bg: '#2563eb',
    border: '#1d4ed8',
    glow: 'rgba(37, 99, 235, 0.4)',
    text: '#ffffff',
    label: '🔵'
  },
  cyan: {
    id: 'cyan',
    name: 'Svetlomodrá',
    bg: '#0ea5e9',
    border: '#0284c7',
    glow: 'rgba(14, 165, 233, 0.4)',
    text: '#ffffff',
    label: '🌐'
  },
  green: {
    id: 'green',
    name: 'Tmavozelená',
    bg: '#16a34a',
    border: '#15803d',
    glow: 'rgba(22, 163, 74, 0.4)',
    text: '#ffffff',
    label: '🟢'
  },
  lime: {
    id: 'lime',
    name: 'Svetlozelená',
    bg: '#84cc16',
    border: '#4d7c0f',
    glow: 'rgba(132, 204, 22, 0.4)',
    text: '#ffffff',
    label: '🍏'
  },
  yellow: {
    id: 'yellow',
    name: 'Žltá',
    bg: '#eab308',
    border: '#a16207',
    glow: 'rgba(234, 179, 8, 0.4)',
    text: '#ffffff',
    label: '🟡'
  },
  purple: {
    id: 'purple',
    name: 'Fialová',
    bg: '#9333ea',
    border: '#7e22ce',
    glow: 'rgba(147, 51, 234, 0.4)',
    text: '#ffffff',
    label: '🟣'
  },
  pink: {
    id: 'pink',
    name: 'Ružová',
    bg: '#ec4899',
    border: '#db2777',
    glow: 'rgba(236, 72, 153, 0.4)',
    text: '#ffffff',
    label: '🌸'
  },
  orange: {
    id: 'orange',
    name: 'Oranžová',
    bg: '#f97316',
    border: '#c2410c',
    glow: 'rgba(249, 115, 22, 0.4)',
    text: '#ffffff',
    label: '🟠'
  },
  white: {
    id: 'white',
    name: 'Biela',
    bg: '#f8fafc',
    border: '#cbd5e1',
    glow: 'rgba(255, 255, 255, 0.65)',
    text: '#0f172a',
    label: '⚪'
  },
  black: {
    id: 'black',
    name: 'Čierna',
    bg: '#1e293b',
    border: '#020617',
    glow: 'rgba(30, 41, 59, 0.55)',
    text: '#ffffff',
    label: '⚫'
  }
};

/**
 * Returns relative cell coordinates [dr, dc] for a given block shape
 */
export function getBlockCells(block) {
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
      case '1x4': return [[0, 0], [0, 1], [0, 2], [0, 3]];
      case '4x1': return [[0, 0], [1, 0], [2, 0], [3, 0]];
      case '2x2': return [[0, 0], [0, 1], [1, 0], [1, 1]];
      case '3x3': return [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2]
      ];
      case 'L':
      case 'L1': return [[0, 0], [1, 0], [1, 1]]; // L pointing right-bottom
      case 'L2': return [[0, 0], [0, 1], [1, 0]]; // L pointing top-left
      case 'L3': return [[0, 0], [0, 1], [1, 1]]; // L pointing top-right
      case 'L4': return [[0, 1], [1, 0], [1, 1]]; // L pointing bottom-right
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

/**
 * Returns absolute grid coordinates for all cells of a block
 */
export function getOccupiedCells(block) {
  const cells = getBlockCells(block);
  return cells.map(([dr, dc]) => ({ r: block.r + dr, c: block.c + dc }));
}

/**
 * Returns bounding dimensions { rows, cols } of a block shape
 */
export function getBlockDimensions(block) {
  const cells = getBlockCells(block);
  let minR = Infinity, maxR = -Infinity;
  let minC = Infinity, maxC = -Infinity;
  for (const [dr, dc] of cells) {
    minR = Math.min(minR, dr);
    maxR = Math.max(maxR, dr);
    minC = Math.min(minC, dc);
    maxC = Math.max(maxC, dc);
  }
  return {
    rows: maxR - minR + 1,
    cols: maxC - minC + 1
  };
}

/**
 * Returns normalized wall coordinates { r, c } for a given level
 */
export function getLevelWalls(level) {
  if (!level || !level.walls || !Array.isArray(level.walls)) return [];
  return level.walls.map(w => {
    if (Array.isArray(w)) return { r: w[0], c: w[1] };
    return { r: w.r, c: w.c };
  });
}

/**
 * Checks if a movement direction is allowed for a given block based on its direction constraint
 */
export function isDirAllowedForBlock(block, dir) {
  if (!block) return false;
  if (isBlockFrozen(block)) return false;
  const d = block.direction || block.axis || block.allowedDir;
  if (!d || d === 'all' || d === 'any') return true;
  if (d === 'vertical' || d === 'v' || d === 'y') {
    return dir === 'up' || dir === 'down';
  }
  if (d === 'horizontal' || d === 'h' || d === 'x') {
    return dir === 'left' || dir === 'right';
  }
  if (Array.isArray(d)) {
    return d.includes(dir);
  }
  return d === dir;
}

/**
 * Checks if a block is currently frozen / locked by countdown number
 */
export function isBlockFrozen(block) {
  if (!block) return false;
  const count = block.frozen ?? block.freezeCount ?? block.count ?? 0;
  return Number(count) > 0;
}

/**
 * Checks if an exit / door is currently locked by countdown number
 */
export function isDoorLocked(door) {
  if (!door) return false;
  const count = door.locked ?? door.lockCount ?? door.freezeCount ?? door.count ?? 0;
  return Number(count) > 0;
}
