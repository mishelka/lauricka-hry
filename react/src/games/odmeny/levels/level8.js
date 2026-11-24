export const level8 = {
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
    { side: 'right', index: 6, span: 2, color: 'black' }
  ],
  blocks: [
    // Riadok 0..1: 5x zvislých 2x1 blokov (ružová, svetlomodrá, ružová, svetlomodrá, ružová)
    { id: 'b_r0_c0_pink', color: 'pink', r: 0, c: 0, shape: '2x1' },
    { id: 'b_r0_c1_blue', color: 'blue', r: 0, c: 1, shape: '2x1' },
    { id: 'b_r0_c2_pink', color: 'pink', r: 0, c: 2, shape: '2x1' },
    { id: 'b_r0_c3_blue', color: 'blue', r: 0, c: 3, shape: '2x1' },
    { id: 'b_r0_c4_pink', color: 'pink', r: 0, c: 4, shape: '2x1' },

    // Riadok 2..3 (boky): 2x zamrznuté zvislé 2x1 bloky s číslom 7 (modrá)
    { id: 'b_r2_c0_f7_blue', color: 'blue', r: 2, c: 0, shape: '2x1', frozen: 7 },
    { id: 'b_r2_c4_f7_blue', color: 'blue', r: 2, c: 4, shape: '2x1', frozen: 7 },

    // Riadok 2 (stred): zamrznutý vodorovný 1x3 blok s číslom 14 (biela)
    { id: 'b_r2_c1_f14_white', color: 'white', r: 2, c: 1, shape: '1x3', frozen: 14 },

    // Riadky 3..5 (stred): veľký zamrznutý 3x3 dvojfarebný blok s číslom 11 (zvonku červená, zvnútra zelená)
    { id: 'b_r3_c1_f11_red_green', color: 'red', innerColor: 'green', r: 3, c: 1, shape: '3x3', frozen: 11 },

    // Riadky 4..5 (boky): 2x zvislé 2x1 bloky (žltá)
    { id: 'b_r4_c0_white', color: 'white', r: 4, c: 0, shape: '2x1' },
    { id: 'b_r4_c4_white', color: 'white', r: 4, c: 4, shape: '2x1' },

    // Riadky 6..7: 5x zvislých 2x1 blokov (modrá, žltá, modrá, žltá, modrá)
    { id: 'b_r6_c0_black', color: 'black', r: 6, c: 0, shape: '2x1' },
    { id: 'b_r6_c1_white', color: 'white', r: 6, c: 1, shape: '2x1' },
    { id: 'b_r6_c2_black', color: 'black', r: 6, c: 2, shape: '2x1' },
    { id: 'b_r6_c3_white', color: 'white', r: 6, c: 3, shape: '2x1' },
    { id: 'b_r6_c4_black', color: 'black', r: 6, c: 4, shape: '2x1' }
  ]
};

export default level8;
