export const level07 = {
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
  blocks: [
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
  ]
};

export default level07;
