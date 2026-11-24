export const level6 = {
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
  blocks: [
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
  ]
};

export default level6;
