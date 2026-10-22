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

function createLevel3Blocks() {
  return [
    // Horná časť (riadky 0..2)
    // Modrý zvislý pás vľavo (col 0): (0..2, 0)
    { id: 'b_top_blue', color: 'blue', r: 0, c: 0, shape: '3x1' },
    // Červený zvislý pás (col 1): (0..2, 1)
    { id: 'b_top_red_1', color: 'red', r: 0, c: 1, shape: '3x1' },
    // Zamrznutý zelený pás s odpočtom 1 (col 2): (0..2, 2)
    { id: 'b_top_ice_1', color: 'green', r: 0, c: 2, shape: '3x1', frozen: 1 },
    // Zamrznutý modrý pás s odpočtom 1 (col 3): (0..2, 3)
    { id: 'b_top_ice_2', color: 'blue', r: 0, c: 3, shape: '3x1', frozen: 1 },
    // Žltý zvislý pás (col 4): (0..2, 4)
    { id: 'b_top_yellow', color: 'yellow', r: 0, c: 4, shape: '3x1' },
    // Červený zvislý pás vpravo (col 5): (0..2, 5)
    { id: 'b_top_red_2', color: 'red', r: 0, c: 5, shape: '3x1' },

    // Dolná časť (riadky 6..8)
    // Žltý zvislý pás vľavo (col 0): (6..8, 0)
    { id: 'b_bot_yellow_1', color: 'yellow', r: 6, c: 0, shape: '3x1' },
    // Červený zvislý pás (col 1): (6..8, 1)
    { id: 'b_bot_red_1', color: 'red', r: 6, c: 1, shape: '3x1' },
    // Zamrznutý žltý pás s odpočtom 2 (col 2): (6..8, 2)
    { id: 'b_bot_ice_1', color: 'yellow', r: 6, c: 2, shape: '3x1', frozen: 2 },
    // Zamrznutý modrý pás s odpočtom 2 (col 3): (6..8, 3)
    { id: 'b_bot_ice_2', color: 'blue', r: 6, c: 3, shape: '3x1', frozen: 2 },
    // Červený zvislý pás (col 4): (6..8, 4)
    { id: 'b_bot_red_2', color: 'red', r: 6, c: 4, shape: '3x1' },
    // Žltý zvislý pás vpravo (col 5): (6..8, 5)
    { id: 'b_bot_yellow_2', color: 'yellow', r: 6, c: 5, shape: '3x1' }
  ];
}

function createLevel4Blocks() {
  return [
    // Riadok 0..1 (top row)
    // Horný-ľavý (col 0..1): vonkajšia ružová, vnútorná modrá
    { id: 'b_0_0', color: 'pink', innerColor: 'blue', r: 0, c: 0, shape: '2x2' },
    // Horný-pravý (col 4..5): vonkajšia červená, vnútorná žltá
    { id: 'b_0_4', color: 'red', innerColor: 'yellow', r: 0, c: 4, shape: '2x2' },

    // Riadok 2..3 (druhý riadok)
    // Ľavý (col 0..1): žltá
    { id: 'b_2_0', color: 'yellow', r: 2, c: 0, shape: '2x2' },
    // Stredný (col 2..3): vonkajšia modrá, vnútorná červená
    { id: 'b_2_2', color: 'blue', innerColor: 'red', r: 2, c: 2, shape: '2x2' },
    // Pravý (col 4..5): ružová
    { id: 'b_2_4', color: 'pink', r: 2, c: 4, shape: '2x2' },

    // Riadok 4..5 (tretí riadok)
    // Ľavý (col 0..1): červená
    { id: 'b_4_0', color: 'red', r: 4, c: 0, shape: '2x2' },
    // Stredný (col 2..3): zelená
    { id: 'b_4_2', color: 'green', r: 4, c: 2, shape: '2x2' },
    // Pravý (col 4..5): žltá
    { id: 'b_4_4', color: 'yellow', r: 4, c: 4, shape: '2x2' },

    // Riadok 6..7 (štvrtý riadok)
    // Dolný-ľavý (col 0..1): vonkajšia modrá, vnútorná ružová
    { id: 'b_6_0', color: 'blue', innerColor: 'pink', r: 6, c: 0, shape: '2x2' },
    // Dolný-pravý (col 4..5): vonkajšia zelená, vnútorná modrá
    { id: 'b_6_4', color: 'green', innerColor: 'blue', r: 6, c: 4, shape: '2x2' }
  ];
}

function createLevel5Blocks() {
  return [
    // Ľavý stĺpec (stĺpce 0..2, riadky 1..8)
    // Riadok 1: žltá (0..2)
    { id: 'b_l1_yellow', color: 'yellow', r: 1, c: 0, shape: '1x3' },
    // Riadok 2: zelená (0..2)
    { id: 'b_l2_green', color: 'green', r: 2, c: 0, shape: '1x3' },
    // Riadok 3: žltá (0..2)
    { id: 'b_l3_yellow', color: 'yellow', r: 3, c: 0, shape: '1x3' },
    // Riadok 4: tmavomodrá (0..2)
    { id: 'b_l4_blue', color: 'blue', r: 4, c: 0, shape: '1x3' },
    // Riadok 5: zamrznutý blok s odpočtom 8, skrytá žltá (0..2)
    { id: 'b_l5_ice8', color: 'yellow', r: 5, c: 0, shape: '1x3', frozen: 8 },
    // Riadok 6: červená (0..2)
    { id: 'b_l6_red', color: 'red', r: 6, c: 0, shape: '1x3' },
    // Riadok 7: žltá (0..2)
    { id: 'b_l7_yellow', color: 'yellow', r: 7, c: 0, shape: '1x3' },
    // Riadok 8: tmavomodrá (0..2)
    { id: 'b_l8_blue', color: 'blue', r: 8, c: 0, shape: '1x3' },

    // Pravý stĺpec (stĺpce 3..5, riadky 1..8)
    // Riadok 1: tmavomodrá (3..5)
    { id: 'b_r1_blue', color: 'blue', r: 1, c: 3, shape: '1x3' },
    // Riadok 2: zamrznutý blok s odpočtom 10, skrytá žltá (3..5)
    { id: 'b_r2_ice10', color: 'yellow', r: 2, c: 3, shape: '1x3', frozen: 10 },
    // Riadok 3: ružová (3..5)
    { id: 'b_r3_pink', color: 'pink', r: 3, c: 3, shape: '1x3' },
    // Riadok 4: žltá (3..5)
    { id: 'b_r4_yellow', color: 'yellow', r: 4, c: 3, shape: '1x3' },
    // Riadok 5: svetlomodrá (3..5)
    { id: 'b_r5_cyan', color: 'cyan', r: 5, c: 3, shape: '1x3' },
    // Riadok 6: žltá (3..5)
    { id: 'b_r6_yellow', color: 'yellow', r: 6, c: 3, shape: '1x3' },
    // Riadok 7: zamrznutý blok s odpočtom 6, skrytá tmavomodrá (3..5)
    { id: 'b_r7_ice6', color: 'blue', r: 7, c: 3, shape: '1x3', frozen: 6 },
    // Riadok 8: žltá (3..5)
    { id: 'b_r8_yellow', color: 'yellow', r: 8, c: 3, shape: '1x3' }
  ];
}

function createLevel6Blocks() {
  return [
    // Stĺpec 0 (riadky 6..7)
    { id: 'b_c0_r6_blue', color: 'blue', r: 6, c: 0, shape: '1x1' },
    { id: 'b_c0_r7_white', color: 'white', r: 7, c: 0, shape: '1x1' },

    // Stĺpec 1 (riadky 5..7)
    { id: 'b_c1_r5_blue', color: 'blue', r: 5, c: 1, shape: '1x1' },
    { id: 'b_c1_r6_white', color: 'white', r: 6, c: 1, shape: '1x1' },
    { id: 'b_c1_r7_blue', color: 'blue', r: 7, c: 1, shape: '1x1' },

    // Stĺpec 2 (riadky 4..7)
    { id: 'b_c2_r4_black', color: 'black', r: 4, c: 2, shape: '1x1' },
    { id: 'b_c2_r5_red', color: 'red', r: 5, c: 2, shape: '3x1' },

    // Stĺpec 3 (riadky 3..7)
    { id: 'b_c3_r3_black', color: 'black', r: 3, c: 3, shape: '1x1' },
    { id: 'b_c3_r4_yellow', color: 'yellow', r: 4, c: 3, shape: '1x1' },
    { id: 'b_c3_r5_black', color: 'black', r: 5, c: 3, shape: '1x1' },
    { id: 'b_c3_r6_white', color: 'white', r: 6, c: 3, shape: '1x1' },
    { id: 'b_c3_r7_black', color: 'black', r: 7, c: 3, shape: '1x1' },

    // Stĺpec 4 (riadky 2..7)
    { id: 'b_c4_r2_yellow_red', color: 'yellow', innerColor: 'red', r: 2, c: 4, shape: '3x1' },
    { id: 'b_c4_r5_white', color: 'white', r: 5, c: 4, shape: '1x1' },
    { id: 'b_c4_r6_black', color: 'black', r: 6, c: 4, shape: '1x1' },
    { id: 'b_c4_r7_white', color: 'white', r: 7, c: 4, shape: '1x1' },

    // Stĺpec 5 (riadky 0..7)
    { id: 'b_c5_r0_red', color: 'red', r: 0, c: 5, shape: '4x1' },
    { id: 'b_c5_r4_yellow', color: 'yellow', r: 4, c: 5, shape: '1x1' },
    { id: 'b_c5_r5_black', color: 'black', r: 5, c: 5, shape: '1x1' },
    { id: 'b_c5_r6_yellow', color: 'yellow', r: 6, c: 5, shape: '1x1' },
    { id: 'b_c5_r7_black', color: 'black', r: 7, c: 5, shape: '1x1' }
  ];
}

function createLevel7Blocks() {
  return [
    // Riadok 0: šachovnica 1x1 (žltá, modrá, žltá, modrá, žltá, modrá)
    { id: 'b_r0_c0_yellow', color: 'yellow', r: 0, c: 0, shape: '1x1' },
    { id: 'b_r0_c1_blue', color: 'blue', r: 0, c: 1, shape: '1x1' },
    { id: 'b_r0_c2_yellow', color: 'yellow', r: 0, c: 2, shape: '1x1' },
    { id: 'b_r0_c3_blue', color: 'blue', r: 0, c: 3, shape: '1x1' },
    { id: 'b_r0_c4_yellow', color: 'yellow', r: 0, c: 4, shape: '1x1' },
    { id: 'b_r0_c5_blue', color: 'blue', r: 0, c: 5, shape: '1x1' },

    // Riadok 1: šachovnica 1x1 (modrá, žltá, modrá, žltá, modrá, žltá)
    { id: 'b_r1_c0_blue', color: 'blue', r: 1, c: 0, shape: '1x1' },
    { id: 'b_r1_c1_yellow', color: 'yellow', r: 1, c: 1, shape: '1x1' },
    { id: 'b_r1_c2_blue', color: 'blue', r: 1, c: 2, shape: '1x1' },
    { id: 'b_r1_c3_yellow', color: 'yellow', r: 1, c: 3, shape: '1x1' },
    { id: 'b_r1_c4_blue', color: 'blue', r: 1, c: 4, shape: '1x1' },
    { id: 'b_r1_c5_yellow', color: 'yellow', r: 1, c: 5, shape: '1x1' },

    // Riadok 2: 3x zamrznuté 1x2 bloky s číslom 6 (žltá, červená, zelená)
    { id: 'b_r2_c0_f6_yellow', color: 'yellow', r: 2, c: 0, shape: '1x2', frozen: 6 },
    { id: 'b_r2_c2_f6_red', color: 'red', r: 2, c: 2, shape: '1x2', frozen: 6 },
    { id: 'b_r2_c4_f6_green', color: 'green', r: 2, c: 4, shape: '1x2', frozen: 6 },

    // Riadky 3..4:
    // c0: červený 2x1
    { id: 'b_r3_c0_red', color: 'red', r: 3, c: 0, shape: '2x1' },
    // c1: dvojfarebný 2x1 (vonkajšia modrá, vnútorná ružová)
    { id: 'b_r3_c1_blue_pink', color: 'blue', innerColor: 'pink', r: 3, c: 1, shape: '2x1' },
    // c2..3: dvojfarebný 2x2 (vonkajšia žltá, vnútorná zelená)
    { id: 'b_r3_c2_yellow_green', color: 'yellow', innerColor: 'green', r: 3, c: 2, shape: '2x2' },
    // c4: dvojfarebný 2x1 (vonkajšia ružová, vnútorná žltá)
    { id: 'b_r3_c4_pink_yellow', color: 'pink', innerColor: 'yellow', r: 3, c: 4, shape: '2x1' },
    // c5: modrý 2x1
    { id: 'b_r3_c5_blue', color: 'blue', r: 3, c: 5, shape: '2x1' },

    // Riadok 5: 2x zamrznuté 1x3 bloky s číslom 18 (zelená, červená)
    { id: 'b_r5_c0_f18_green', color: 'green', r: 5, c: 0, shape: '1x3', frozen: 18 },
    { id: 'b_r5_c3_f18_red', color: 'red', r: 5, c: 3, shape: '1x3', frozen: 18 },

    // Riadok 6: 2x zamrznuté dvojfarebné 1x3 bloky s číslom 19
    // vľavo: zvonka ružová, zvnútra žltá
    { id: 'b_r6_c0_f19_pink_yellow', color: 'pink', innerColor: 'yellow', r: 6, c: 0, shape: '1x3', frozen: 19 },
    // vpravo: zvonka žltá, zvnútra modrá
    { id: 'b_r6_c3_f19_yellow_blue', color: 'yellow', innerColor: 'blue', r: 6, c: 3, shape: '1x3', frozen: 19 },

    // Riadok 7: 2x 1x3 bloky (modrá, zelená)
    { id: 'b_r7_c0_blue', color: 'blue', r: 7, c: 0, shape: '1x3' },
    { id: 'b_r7_c3_green', color: 'green', r: 7, c: 3, shape: '1x3' }
  ];
}

function createLevel8Blocks() {
  return [
    // Riadok 0..1: 5x zvislých 2x1 blokov (ružová, svetlomodrá, ružová, svetlomodrá, ružová)
    { id: 'b_r0_c0_pink', color: 'pink', r: 0, c: 0, shape: '2x1' },
    { id: 'b_r0_c1_cyan', color: 'cyan', r: 0, c: 1, shape: '2x1' },
    { id: 'b_r0_c2_pink', color: 'pink', r: 0, c: 2, shape: '2x1' },
    { id: 'b_r0_c3_cyan', color: 'cyan', r: 0, c: 3, shape: '2x1' },
    { id: 'b_r0_c4_pink', color: 'pink', r: 0, c: 4, shape: '2x1' },

    // Riadok 2..3 (boky): 2x zamrznuté zvislé 2x1 bloky s číslom 7 (modrá)
    { id: 'b_r2_c0_f7_blue', color: 'blue', r: 2, c: 0, shape: '2x1', frozen: 7 },
    { id: 'b_r2_c4_f7_blue', color: 'blue', r: 2, c: 4, shape: '2x1', frozen: 7 },

    // Riadok 2 (stred): zamrznutý vodorovný 1x3 blok s číslom 14 (biela)
    { id: 'b_r2_c1_f14_white', color: 'white', r: 2, c: 1, shape: '1x3', frozen: 14 },

    // Riadky 3..5 (stred): veľký zamrznutý 3x3 dvojfarebný blok s číslom 11 (zvonku červená, zvnútra zelená)
    { id: 'b_r3_c1_f11_red_green', color: 'red', innerColor: 'green', r: 3, c: 1, shape: '3x3', frozen: 11 },

    // Riadky 4..5 (boky): 2x zvislé 2x1 bloky (žltá)
    { id: 'b_r4_c0_yellow', color: 'yellow', r: 4, c: 0, shape: '2x1' },
    { id: 'b_r4_c4_yellow', color: 'yellow', r: 4, c: 4, shape: '2x1' },

    // Riadky 6..7: 5x zvislých 2x1 blokov (modrá, žltá, modrá, žltá, modrá)
    { id: 'b_r6_c0_blue', color: 'blue', r: 6, c: 0, shape: '2x1' },
    { id: 'b_r6_c1_yellow', color: 'yellow', r: 6, c: 1, shape: '2x1' },
    { id: 'b_r6_c2_blue', color: 'blue', r: 6, c: 2, shape: '2x1' },
    { id: 'b_r6_c3_yellow', color: 'yellow', r: 6, c: 3, shape: '2x1' },
    { id: 'b_r6_c4_blue', color: 'blue', r: 6, c: 4, shape: '2x1' }
  ];
}

function createLevel9Blocks() {
  return [
    // Riadok 0: 3x vodorovné 1x2 bloky (modrá, žltá, modrá)
    { id: 'b_r0_c0_blue', color: 'blue', r: 0, c: 0, shape: '1x2' },
    { id: 'b_r0_c2_yellow', color: 'yellow', r: 0, c: 2, shape: '1x2' },
    { id: 'b_r0_c4_blue', color: 'blue', r: 0, c: 4, shape: '1x2' },

    // Riadok 1: 3x vodorovné 1x2 bloky (žltá, modrá, žltá)
    { id: 'b_r1_c0_yellow', color: 'yellow', r: 1, c: 0, shape: '1x2' },
    { id: 'b_r1_c2_blue', color: 'blue', r: 1, c: 2, shape: '1x2' },
    { id: 'b_r1_c4_yellow', color: 'yellow', r: 1, c: 4, shape: '1x2' },

    // Riadky 2..3: 3x zamrznuté 2x2 bloky
    // Vľavo: 19 (zvonka zelená, zvnútra žltá)
    { id: 'b_r2_c0_f19_green_yellow', color: 'green', innerColor: 'yellow', r: 2, c: 0, shape: '2x2', frozen: 19 },
    // V strede: 9 (zelená)
    { id: 'b_r2_c2_f9_green', color: 'green', r: 2, c: 2, shape: '2x2', frozen: 9 },
    // Vpravo: 19 (zvonka modrá, zvnútra žltá)
    { id: 'b_r2_c4_f19_blue_yellow', color: 'blue', innerColor: 'yellow', r: 2, c: 4, shape: '2x2', frozen: 19 },

    // Riadky 4..5: 3x zamrznuté 2x2 bloky
    // Vľavo: 19 (zvonka modrá, zvnútra žltá)
    { id: 'b_r4_c0_f19_blue_yellow', color: 'blue', innerColor: 'yellow', r: 4, c: 0, shape: '2x2', frozen: 19 },
    // V strede: 9 (červená)
    { id: 'b_r4_c2_f9_red', color: 'red', r: 4, c: 2, shape: '2x2', frozen: 9 },
    // Vpravo: 19 (zvonka červená, zvnútra červená)
    { id: 'b_r4_c4_f19_red_red', color: 'red', innerColor: 'red', r: 4, c: 4, shape: '2x2', frozen: 19 },

    // Riadok 6:
    // c0 (riadky 6..7): červený 2x1
    { id: 'b_r6_c0_red', color: 'red', r: 6, c: 0, shape: '2x1' },
    // c1: biely 1x1
    { id: 'b_r6_c1_white', color: 'white', r: 6, c: 1, shape: '1x1' },
    // c2 (riadky 6..7): zelený 2x1
    { id: 'b_r6_c2_green', color: 'green', r: 6, c: 2, shape: '2x1' },
    // c3: biely 1x1
    { id: 'b_r6_c3_white', color: 'white', r: 6, c: 3, shape: '1x1' },
    // c4..5: červený 1x2
    { id: 'b_r6_c4_red', color: 'red', r: 6, c: 4, shape: '1x2' },

    // Riadok 7:
    // c1: čierny 1x1
    { id: 'b_r7_c1_black', color: 'black', r: 7, c: 1, shape: '1x1' },
    // c3: čierny 1x1
    { id: 'b_r7_c3_black', color: 'black', r: 7, c: 3, shape: '1x1' },
    // c5: čierny 1x1
    { id: 'b_r7_c5_black', color: 'black', r: 7, c: 5, shape: '1x1' },

    // Riadok 8:
    // c0: čierny 1x1
    { id: 'b_r8_c0_black', color: 'black', r: 8, c: 0, shape: '1x1' },
    // c1: biely 1x1
    { id: 'b_r8_c1_white', color: 'white', r: 8, c: 1, shape: '1x1' },
    // c2: čierny 1x1
    { id: 'b_r8_c2_black', color: 'black', r: 8, c: 2, shape: '1x1' },
    // c3: biely 1x1
    { id: 'b_r8_c3_white', color: 'white', r: 8, c: 3, shape: '1x1' },
    // c4: biely 1x1
    { id: 'b_r8_c4_white', color: 'white', r: 8, c: 4, shape: '1x1' },
    // c5: čierny 1x1
    { id: 'b_r8_c5_black', color: 'black', r: 8, c: 5, shape: '1x1' }
  ];
}

export function isBlockOutLevelImplemented(levelIndex) {
  return typeof levelIndex === 'number' && levelIndex >= 0 && levelIndex < BLOCK_OUT_LEVELS.length;
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
    name: 'Level 3 - Presýpacie hodiny a zámky',
    width: 6,
    height: 9,
    doors: [
      { side: 'left', index: 0, span: 3, color: 'green', locked: 5 },
      { side: 'right', index: 0, span: 3, color: 'red' },
      { side: 'left', index: 6, span: 3, color: 'blue', locked: 5 },
      { side: 'right', index: 6, span: 3, color: 'yellow', locked: 3 }
    ],
    walls: [
      { r: 3, c: 0 }, { r: 3, c: 1 }, { r: 3, c: 4 }, { r: 3, c: 5 },
      { r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 4 }, { r: 4, c: 5 },
      { r: 5, c: 0 }, { r: 5, c: 1 }, { r: 5, c: 4 }, { r: 5, c: 5 }
    ],
    blocks: createLevel3Blocks()
  },
  {
    id: 4,
    name: 'Level 4 - Dvojfarebné bloky a zámky',
    width: 6,
    height: 8,
    doors: [
      { side: 'top', index: 0, span: 2, color: 'pink', locked: 5 },
      { side: 'top', index: 4, span: 2, color: 'red', locked: 6 },
      { side: 'right', index: 4, span: 2, color: 'yellow' },
      { side: 'bottom', index: 0, span: 2, color: 'blue', locked: 3 },
      { side: 'bottom', index: 4, span: 2, color: 'green', locked: 2 }
    ],
    walls: [
      { r: 0, c: 2 }, { r: 0, c: 3 },
      { r: 1, c: 2 }, { r: 1, c: 3 },
      { r: 6, c: 2 }, { r: 6, c: 3 },
      { r: 7, c: 2 }, { r: 7, c: 3 }
    ],
    blocks: createLevel4Blocks()
  },
  {
    id: 5,
    name: 'Level 5 - Zámkový stĺp',
    width: 6,
    height: 9,
    doors: [
      { side: 'top', index: 0, span: 3, color: 'green', locked: 3 },
      { side: 'top', index: 3, span: 3, color: 'yellow', locked: 4 },
      { side: 'bottom', index: 3, span: 3, color: 'blue', locked: 5 },
      { side: 'left', index: 6, span: 1, color: 'cyan', locked: 2 },
      { side: 'right', index: 5, span: 1, color: 'red' },
      { side: 'right', index: 6, span: 1, color: 'pink', locked: 1 }
    ],
    blocks: createLevel5Blocks()
  },
  {
    id: 6,
    name: 'Level 6 - Schody a zámky',
    width: 6,
    height: 8,
    doors: [
      { side: 'left', index: 6, span: 1, color: 'blue' },
      { side: 'bottom', index: 2, span: 1, color: 'white', locked: 3 },
      { side: 'bottom', index: 3, span: 1, color: 'yellow', locked: 8 },
      { side: 'bottom', index: 4, span: 2, color: 'black', locked: 15 },
      { side: 'right', index: 4, span: 4, color: 'red', locked: 12 }
    ],
    walls: [
      { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }, { r: 4, c: 0 }, { r: 5, c: 0 },
      { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 3, c: 1 }, { r: 4, c: 1 },
      { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 2 },
      { r: 0, c: 3 }, { r: 1, c: 3 }, { r: 2, c: 3 },
      { r: 0, c: 4 }, { r: 1, c: 4 }
    ],
    blocks: createLevel6Blocks()
  },
  {
    id: 7,
    name: 'Level 7 - Ľadové komory a dvojfarebné bloky',
    width: 6,
    height: 8,
    doors: [
      { side: 'top', index: 3, span: 3, color: 'red', locked: 16 },
      { side: 'left', index: 0, span: 2, color: 'blue', locked: 8 },
      { side: 'left', index: 3, span: 2, color: 'pink', locked: 21 },
      { side: 'bottom', index: 0, span: 3, color: 'green', locked: 26 },
      { side: 'right', index: 0, span: 2, color: 'yellow' }
    ],
    blocks: createLevel7Blocks()
  },
  {
    id: 8,
    name: 'Level 8 - Veľké ľadové jadro',
    width: 5,
    height: 8,
    doors: [
      { side: 'top', index: 1, span: 3, color: 'green' },
      { side: 'bottom', index: 1, span: 3, color: 'red' },
      { side: 'left', index: 4, span: 2, color: 'pink', locked: 12 },
      { side: 'left', index: 6, span: 2, color: 'blue', locked: 7 },
      { side: 'right', index: 4, span: 2, color: 'white', locked: 1 },
      { side: 'right', index: 6, span: 2, color: 'blue' }
    ],
    blocks: createLevel8Blocks()
  },
  {
    id: 9,
    name: 'Level 9 - Ľadová pevnosť (Level 19)',
    width: 6,
    height: 9,
    doors: [
      { side: 'left', index: 0, span: 2, color: 'blue', locked: 7 },
      { side: 'left', index: 7, span: 2, color: 'black', locked: 11 },
      { side: 'right', index: 0, span: 2, color: 'green', locked: 11 },
      { side: 'right', index: 8, span: 1, color: 'white' },
      { side: 'bottom', index: 0, span: 3, color: 'yellow', locked: 23 },
      { side: 'bottom', index: 4, span: 2, color: 'red' }
    ],
    blocks: createLevel9Blocks()
  }
];
