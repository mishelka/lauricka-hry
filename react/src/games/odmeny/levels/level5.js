export const level5 = {
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
  blocks: [
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
  ]
};

export default level5;
