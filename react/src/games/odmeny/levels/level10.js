export const level10 = {
  id: 10,
  name: 'Level 10 - Dvojitá komora a veľké jadro',
  width: 5,
  height: 8,
  walls: [
    { r: 3, c: 0 },
    { r: 3, c: 1 },
    { r: 3, c: 3 },
    { r: 3, c: 4 },
    { r: 4, c: 0 },
    { r: 4, c: 1 },
    { r: 4, c: 3 },
    { r: 4, c: 4 }
  ],
  doors: [
    // Horné východy: 7 (zelená) a 5 (červená)
    { side: 'top', index: 0, span: 2, color: 'green', locked: 7 },
    { side: 'top', index: 2, span: 3, color: 'red', locked: 5 },

    // Pravé východy: 6 (ružová) hore, odomknutá ružová dole
    { side: 'right', index: 1, span: 2, color: 'pink', locked: 6 },
    { side: 'right', index: 7, span: 1, color: 'pink' },

    // Ľavé východy: 9 (modrá) hore, 2 (červená) dole
    { side: 'left', index: 1, span: 2, color: 'blue', locked: 9 },
    { side: 'left', index: 6, span: 1, color: 'red', locked: 2 },

    // Spodné východy: 1 (modrá) vľavo, odomknutá žltá vpravo
    { side: 'bottom', index: 0, span: 2, color: 'blue', locked: 1 },
    { side: 'bottom', index: 3, span: 2, color: 'yellow' }
  ],
  blocks: [
    // Horná komora: Veľký zamrznutý blok 3x5 s číslom 5 ukrývajúci 7 dlaždíc
    {
      id: 'b_top_frozen5_group',
      color: 'red',
      r: 0,
      c: 0,
      shape: '3x5',
      frozen: 5,
      children: [
        // Stĺpec 0 (riadky 0..2): žltý 3x1 blok
        { id: 'b_top_yellow_3x1', color: 'yellow', r: 0, c: 0, shape: '3x1' },

        // Riadok 0: modrý 1x2 a červený 1x2 blok
        { id: 'b_top_r0_c1_blue', color: 'blue', r: 0, c: 1, shape: '1x2' },
        { id: 'b_top_r0_c3_red', color: 'red', r: 0, c: 3, shape: '1x2' },

        // Riadok 1: červený 1x2 a modrý 1x2 blok
        { id: 'b_top_r1_c1_red', color: 'red', r: 1, c: 1, shape: '1x2' },
        { id: 'b_top_r1_c3_blue', color: 'blue', r: 1, c: 3, shape: '1x2' },

        // Riadok 2: zelený 1x2 a ružový 1x2 blok
        { id: 'b_top_r2_c1_green', color: 'green', r: 2, c: 1, shape: '1x2' },
        { id: 'b_top_r2_c3_pink', color: 'pink', r: 2, c: 3, shape: '1x2' }
      ]
    },

    // Spodná komora - Riadok 5:
    // vľavo: červený 1x2 blok
    { id: 'b_r5_c0_red', color: 'red', r: 5, c: 0, shape: '1x2' },
    // v strede: zelený 3x1 blok (prechádza riadkami 5, 6, 7)
    { id: 'b_r5_c2_green', color: 'green', r: 5, c: 2, shape: '3x1' },
    // vpravo: žltý 1x2 blok
    { id: 'b_r5_c3_yellow', color: 'yellow', r: 5, c: 3, shape: '1x2' },

    // Spodná komora - Riadok 6:
    // vľavo: modrý 1x2 blok
    { id: 'b_r6_c0_blue', color: 'blue', r: 6, c: 0, shape: '1x2' },
    // vpravo: červený 1x2 blok
    { id: 'b_r6_c3_red', color: 'red', r: 6, c: 3, shape: '1x2' },

    // Spodná komora - Riadok 7:
    // vľavo: ružový 1x2 blok
    { id: 'b_r7_c0_pink', color: 'pink', r: 7, c: 0, shape: '1x2' }
    // vpravo: prázdne miesto (c=3..4)
  ]
};

export default level10;
