export const level09 = {
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
  blocks: [
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
  ]
};

export default level09;
