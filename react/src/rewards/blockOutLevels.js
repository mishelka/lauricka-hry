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
      case '2x2': return [[0, 0], [0, 1], [1, 0], [1, 1]];
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

function createLevel1Blocks() {
  const blocks = [
    { id: 'b_pink', color: 'pink', r: 0, c: 0, shape: '1x2' },
    { id: 'b_red', color: 'red', r: 1, c: 0, shape: '1x2' },
    { id: 'b_orange', color: 'orange', r: 2, c: 0, shape: '1x2' },
    { id: 'b_yellow', color: 'yellow', r: 3, c: 0, shape: '1x2' },
    { id: 'b_lime', color: 'lime', r: 4, c: 0, shape: '1x2' },
    { id: 'b_green', color: 'green', r: 5, c: 0, shape: '1x2' },
    { id: 'b_cyan', color: 'cyan', r: 6, c: 0, shape: '1x2' },
    { id: 'b_blue', color: 'blue', r: 7, c: 0, shape: '1x2' },
    { id: 'b_purple', color: 'purple', r: 8, c: 0, shape: '1x2' }
  ];

  for (let r = 0; r <= 8; r++) {
    for (let c = 2; c <= 5; c++) {
      const isWhite = (r + c) % 2 === 0;
      blocks.push({
        id: `b_${r}_${c}`,
        color: isWhite ? 'white' : 'black',
        r,
        c,
        shape: '1x1'
      });
    }
  }

  return blocks;
}

function createLevel2Blocks() {
  return [
    // Horný svetlomodrý L-tvar (cyan): (0, 1), (1, 0), (1, 1)
    {
      id: 'b_cyan_top',
      color: 'cyan',
      r: 0,
      c: 0,
      cells: [[0, 1], [1, 0], [1, 1]]
    },
    // Horný ružový vodorovný pás so šípkou (pink 1x2): (0, 3..4)
    {
      id: 'b_pink_top',
      color: 'pink',
      r: 0,
      c: 3,
      shape: '1x2',
      direction: 'horizontal'
    },
    // Horný červený L-tvar (red): (0, 5), (1, 5..6)
    {
      id: 'b_red_top',
      color: 'red',
      r: 0,
      c: 5,
      cells: [[0, 0], [1, 0], [1, 1]]
    },
    // Horný žltý vodorovný pás so šípkou (yellow 1x2): (1, 3..4)
    {
      id: 'b_yellow_top',
      color: 'yellow',
      r: 1,
      c: 3,
      shape: '1x2',
      direction: 'horizontal'
    },

    // Stredné bloky (riadky 3..4):
    // Zelený zvislý pás vľavo (green 2x1): (3..4, 0)
    {
      id: 'b_green_mid_left',
      color: 'green',
      r: 3,
      c: 0,
      shape: '2x1'
    },
    // Oranžový štvorec vľavo (orange 2x2): (3..4, 1..2)
    {
      id: 'b_orange_sq',
      color: 'orange',
      r: 3,
      c: 1,
      shape: '2x2'
    },
    // Modrá kocka v strede hore (blue 1x1): (3, 3)
    {
      id: 'b_blue_center',
      color: 'blue',
      r: 3,
      c: 3,
      shape: '1x1'
    },
    // Zelená kocka v strede dole (green 1x1): (4, 3)
    {
      id: 'b_green_center',
      color: 'green',
      r: 4,
      c: 3,
      shape: '1x1'
    },
    // Žltý štvorec vpravo (yellow 2x2): (3..4, 4..5)
    {
      id: 'b_yellow_sq',
      color: 'yellow',
      r: 3,
      c: 4,
      shape: '2x2'
    },
    // Modrý zvislý pás vpravo (blue 2x1): (3..4, 6)
    {
      id: 'b_blue_mid_right',
      color: 'blue',
      r: 3,
      c: 6,
      shape: '2x1'
    },

    // Spodné stredné bloky (riadky 5..6):
    // Modrý zvislý pás vľavo dole (blue 2x1): (5..6, 0)
    {
      id: 'b_blue_low_left',
      color: 'blue',
      r: 5,
      c: 0,
      shape: '2x1'
    },
    // Ružový/fialový zvislý pás vpravo dole (pink 2x1): (5..6, 6)
    {
      id: 'b_pink_low_right',
      color: 'pink',
      r: 5,
      c: 6,
      shape: '2x1'
    },

    // Dolné bloky (riadky 7..8):
    // Spodný svetlomodrý J-tvar (cyan): (7, 0..1), (8, 1)
    {
      id: 'b_cyan_bottom',
      color: 'cyan',
      r: 7,
      c: 0,
      cells: [[0, 0], [0, 1], [1, 1]]
    },
    // Spodný oranžový T-tvar so šípkou (orange T): (7, 2..4), (8, 3)
    {
      id: 'b_orange_t',
      color: 'orange',
      r: 7,
      c: 2,
      shape: 'T',
      direction: 'horizontal'
    },
    // Spodný zelený L-tvar (green): (7, 5..6), (8, 5)
    {
      id: 'b_green_bottom',
      color: 'green',
      r: 7,
      c: 5,
      cells: [[0, 0], [0, 1], [1, 0]]
    }
  ];
}

export const BLOCK_OUT_LEVELS = [
  {
    id: 1,
    name: 'Level 1 - Block Out Originál',
    width: 6,
    height: 9,
    doors: [
      { side: 'top', index: 2, color: 'white' },
      { side: 'bottom', index: 2, color: 'black' },
      { side: 'right', index: 0, color: 'yellow' },
      { side: 'right', index: 1, color: 'cyan' },
      { side: 'right', index: 2, color: 'lime' },
      { side: 'right', index: 3, color: 'blue' },
      { side: 'right', index: 4, color: 'pink' },
      { side: 'right', index: 5, color: 'purple' },
      { side: 'right', index: 6, color: 'red' },
      { side: 'right', index: 7, color: 'green' },
      { side: 'right', index: 8, color: 'orange' }
    ],
    blocks: createLevel1Blocks()
  },
  {
    id: 2,
    name: 'Level 2 - Farebné bludisko',
    width: 7,
    height: 9,
    doors: [
      { side: 'top', index: 2, span: 3, color: 'blue' },
      { side: 'bottom', index: 2, span: 3, color: 'green' },
      { side: 'left', index: 0, span: 2, color: 'pink' },
      { side: 'left', index: 3, span: 2, color: 'red' },
      { side: 'left', index: 7, span: 2, color: 'orange' },
      { side: 'right', index: 0, span: 2, color: 'yellow' },
      { side: 'right', index: 3, span: 2, color: 'cyan' },
      { side: 'right', index: 7, span: 2, color: 'orange' }
    ],
    walls: [
      { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 },
      { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 },
      { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }
    ],
    blocks: createLevel2Blocks()
  },
  {
    id: 3,
    name: 'Level 3 - Križovatka so zamrznutou kockou',
    width: 4,
    height: 4,
    walls: [
      { r: 0, c: 0 },
      { r: 3, c: 3 }
    ],
    doors: [
      { side: 'right', index: 1, color: 'green' },
      { side: 'bottom', index: 2, color: 'blue' },
      { side: 'top', index: 3, color: 'yellow' }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 1, c: 0, shape: '1x2', direction: 'horizontal' },
      { id: 'b2', color: 'blue', r: 0, c: 2, shape: '2x1', direction: 'vertical' },
      { id: 'b3', color: 'yellow', r: 2, c: 1, shape: '1x1', frozen: 1 }
    ]
  },
  {
    id: 4,
    name: 'Level 4 - Zvislá závora a zamrznutý blok',
    width: 4,
    height: 5,
    walls: [
      { r: 0, c: 0 },
      { r: 0, c: 1 }
    ],
    doors: [
      { side: 'left', index: 1, color: 'red' },
      { side: 'right', index: 3, color: 'green' },
      { side: 'top', index: 2, color: 'blue' }
    ],
    blocks: [
      { id: 'b1', color: 'blue', r: 1, c: 2, shape: '3x1', direction: 'vertical' },
      { id: 'b2', color: 'red', r: 1, c: 0, shape: '1x2', direction: 'horizontal' },
      { id: 'b3', color: 'green', r: 3, c: 0, shape: '1x2', frozen: 2 }
    ]
  },
  {
    id: 5,
    name: 'Level 5 - Premávka v labyrinte',
    width: 5,
    height: 5,
    walls: [
      { r: 0, c: 1 },
      { r: 4, c: 3 }
    ],
    doors: [
      { side: 'left', index: 1, color: 'green' },
      { side: 'bottom', index: 0, color: 'purple' },
      { side: 'right', index: 3, color: 'orange' },
      { side: 'top', index: 3, color: 'red' }
    ],
    blocks: [
      { id: 'b1', color: 'purple', r: 0, c: 0, shape: '2x1', direction: 'vertical' },
      { id: 'b2', color: 'green', r: 1, c: 1, shape: '1x3', direction: 'horizontal' },
      { id: 'b3', color: 'red', r: 2, c: 3, shape: '2x1', direction: 'vertical' },
      { id: 'b4', color: 'orange', r: 3, c: 1, shape: '1x2', direction: 'horizontal' }
    ]
  },
  {
    id: 6,
    name: 'Level 6 - L-tvar a rohové steny',
    width: 5,
    height: 5,
    walls: [
      { r: 4, c: 4 },
      { r: 4, c: 0 }
    ],
    doors: [
      { side: 'bottom', index: 1, color: 'yellow', span: 2 },
      { side: 'top', index: 3, color: 'blue' },
      { side: 'left', index: 2, color: 'red' },
      { side: 'right', index: 0, color: 'green' }
    ],
    blocks: [
      { id: 'b1', color: 'yellow', r: 1, c: 1, shape: 'L' },
      { id: 'b2', color: 'blue', r: 0, c: 3, shape: '3x1', direction: 'vertical' },
      { id: 'b3', color: 'red', r: 2, c: 0, shape: '1x1' },
      { id: 'b4', color: 'green', r: 0, c: 0, shape: '1x2', direction: 'horizontal' }
    ]
  },
  {
    id: 7,
    name: 'Level 7 - Dvojitý posuvník a stena',
    width: 5,
    height: 5,
    walls: [
      { r: 0, c: 0 },
      { r: 4, c: 0 }
    ],
    doors: [
      { side: 'left', index: 1, color: 'orange', span: 2 },
      { side: 'top', index: 3, color: 'purple' },
      { side: 'bottom', index: 4, color: 'blue' },
      { side: 'right', index: 3, color: 'red' }
    ],
    blocks: [
      { id: 'b1', color: 'orange', r: 1, c: 1, shape: '2x2' },
      { id: 'b2', color: 'purple', r: 2, c: 3, shape: '2x1', direction: 'vertical' },
      { id: 'b3', color: 'blue', r: 0, c: 4, shape: '3x1', direction: 'vertical' },
      { id: 'b4', color: 'red', r: 3, c: 1, shape: '1x2', direction: 'horizontal' }
    ]
  },
  {
    id: 8,
    name: 'Level 8 - T-kus a pevnostné steny',
    width: 5,
    height: 5,
    walls: [
      { r: 0, c: 4 },
      { r: 4, c: 4 }
    ],
    doors: [
      { side: 'top', index: 1, color: 'green', span: 3 },
      { side: 'left', index: 3, color: 'purple' },
      { side: 'bottom', index: 3, color: 'blue' },
      { side: 'right', index: 2, color: 'yellow' },
      { side: 'top', index: 0, color: 'red' }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 1, c: 1, shape: 'T' },
      { id: 'b2', color: 'purple', r: 3, c: 1, shape: '1x2', direction: 'horizontal' },
      { id: 'b3', color: 'blue', r: 2, c: 3, shape: '2x1', direction: 'vertical' },
      { id: 'b4', color: 'yellow', r: 2, c: 1, shape: '1x1' },
      { id: 'b5', color: 'red', r: 0, c: 0, shape: '2x1', direction: 'vertical' }
    ]
  },
  {
    id: 9,
    name: 'Level 9 - Majstrovská aréna so stenami',
    width: 6,
    height: 6,
    walls: [
      { r: 0, c: 0 },
      { r: 5, c: 0 },
      { r: 5, c: 5 }
    ],
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'right', index: 1, color: 'purple' },
      { side: 'bottom', index: 4, color: 'blue' },
      { side: 'left', index: 4, color: 'yellow' },
      { side: 'left', index: 2, color: 'green', span: 2 },
      { side: 'right', index: 3, color: 'orange' }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 2, c: 2, shape: '2x2' },
      { id: 'b2', color: 'red', r: 2, c: 1, shape: '2x1', direction: 'vertical' },
      { id: 'b3', color: 'blue', r: 1, c: 4, shape: '3x1', direction: 'vertical' },
      { id: 'b4', color: 'purple', r: 1, c: 2, shape: '1x2', direction: 'horizontal' },
      { id: 'b5', color: 'yellow', r: 4, c: 2, shape: '1x2', direction: 'horizontal' },
      { id: 'b6', color: 'orange', r: 3, c: 4, shape: '1x2', direction: 'horizontal' }
    ]
  },
  {
    id: 10,
    name: 'Level 10 - Dvojité L-tvary a stredová stena',
    width: 6,
    height: 6,
    walls: [
      { r: 0, c: 1 },
      { r: 5, c: 4 }
    ],
    doors: [
      { side: 'bottom', index: 1, color: 'yellow', span: 2 },
      { side: 'top', index: 3, color: 'purple', span: 2 },
      { side: 'top', index: 0, color: 'red' },
      { side: 'bottom', index: 5, color: 'blue' },
      { side: 'right', index: 0, color: 'green' }
    ],
    blocks: [
      { id: 'b1', color: 'yellow', r: 2, c: 1, shape: 'L' },
      { id: 'b2', color: 'purple', r: 2, c: 3, shape: 'L4' },
      { id: 'b3', color: 'red', r: 1, c: 0, shape: '3x1', direction: 'vertical' },
      { id: 'b4', color: 'blue', r: 2, c: 5, shape: '3x1', direction: 'vertical' },
      { id: 'b5', color: 'green', r: 0, c: 2, shape: '1x2', direction: 'horizontal' }
    ]
  },
  {
    id: 11,
    name: 'Level 11 - Pevnosť šampiónov',
    width: 6,
    height: 6,
    walls: [
      { r: 0, c: 0 },
      { r: 5, c: 0 },
      { r: 3, c: 0 }
    ],
    doors: [
      { side: 'left', index: 1, color: 'green', span: 2 },
      { side: 'top', index: 1, color: 'red' },
      { side: 'bottom', index: 4, color: 'blue' },
      { side: 'right', index: 0, color: 'yellow' },
      { side: 'top', index: 3, color: 'purple' },
      { side: 'right', index: 4, color: 'orange' }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 1, c: 2, shape: '2x2' },
      { id: 'b2', color: 'red', r: 2, c: 1, shape: '2x1', direction: 'vertical' },
      { id: 'b3', color: 'blue', r: 1, c: 4, shape: '3x1', direction: 'vertical' },
      { id: 'b4', color: 'yellow', r: 0, c: 1, shape: '1x2', direction: 'horizontal' },
      { id: 'b5', color: 'purple', r: 0, c: 3, shape: '1x1' },
      { id: 'b6', color: 'orange', r: 4, c: 2, shape: '1x2', direction: 'horizontal' }
    ]
  },
  {
    id: 12,
    name: 'Level 12 - Veľké finále Block Out',
    width: 6,
    height: 6,
    walls: [
      { r: 0, c: 0 },
      { r: 0, c: 5 },
      { r: 5, c: 0 },
      { r: 5, c: 5 }
    ],
    doors: [
      { side: 'top', index: 2, color: 'green', span: 2 },
      { side: 'right', index: 3, color: 'yellow' },
      { side: 'top', index: 1, color: 'red' },
      { side: 'left', index: 3, color: 'purple' },
      { side: 'bottom', index: 4, color: 'blue' },
      { side: 'left', index: 4, color: 'orange', span: 2 }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 1, c: 2, shape: '2x2' },
      { id: 'b2', color: 'yellow', r: 3, c: 2, shape: '1x2', direction: 'horizontal' },
      { id: 'b3', color: 'red', r: 1, c: 1, shape: '2x1', direction: 'vertical' },
      { id: 'b4', color: 'purple', r: 3, c: 1, shape: '1x1' },
      { id: 'b5', color: 'blue', r: 1, c: 4, shape: '2x1', direction: 'vertical' },
      { id: 'b6', color: 'orange', r: 4, c: 3, shape: '1x2', direction: 'horizontal' }
    ]
  }
];
