export const level13 = {
  id: 13,
  name: 'Level 13 - Tajomné komory a zámky',
  width: 6,
  height: 8,
  walls: [
    { r: 2, c: 2 },
    { r: 2, c: 3 }
  ],
  doors: [
    // Horný východ: modrý (odomknutý)
    { side: 'top', index: 3, span: 3, color: 'blue' },

    // Ľavé východy:
    // 3 - fialová (r=0..1, span 2, locked: 3)
    { side: 'left', index: 0, span: 2, color: 'purple', locked: 3 },
    // 5 - zelená (r=2..4, span 3, locked: 5)
    { side: 'left', index: 2, span: 3, color: 'green', locked: 5 },
    // červený (r=5..7, span 3, odomknutý)
    { side: 'left', index: 5, span: 3, color: 'red' },

    // Pravý východ: žltý (r=5..7, span 3, odomknutý)
    { side: 'right', index: 5, span: 3, color: 'yellow' }
  ],
  blocks: [
    // Riadok 0:
    { id: 'b_r0_c0_blue', color: 'blue', r: 0, c: 0, shape: '1x1' },
    { id: 'b_r0_c1_blue', color: 'blue', r: 0, c: 1, shape: '1x1' },
    { id: 'b_r0_c2_red', color: 'red', r: 0, c: 2, shape: '1x2' },
    { id: 'b_r0_c4_blue', color: 'blue', r: 0, c: 4, shape: '1x2' },

    // Riadok 1:
    { id: 'b_r1_c0_green', color: 'green', r: 1, c: 0, shape: '1x2' },
    { id: 'b_r1_c2_yellow', color: 'yellow', r: 1, c: 2, shape: '1x2' },
    { id: 'b_r1_c4_purple', color: 'purple', r: 1, c: 4, shape: '1x2' },

    // Riadok 2:
    { id: 'b_r2_c0_purple', color: 'purple', r: 2, c: 0, shape: '1x2' },
    // c=2..3: voľné miesto
    { id: 'b_r2_c4_red', color: 'red', r: 2, c: 4, shape: '1x2' },

    // Riadky 3..4:
    // Dvojfarebný L-blok vľavo (vonkajšia modrá, vnútorná červená)
    {
      id: 'b_r3_c0_blue_red_L',
      color: 'blue',
      innerColor: 'red',
      r: 3,
      c: 0,
      shape: 'L1'
    },
    // Dvojfarebný L-blok v strede (vonkajšia fialová, vnútorná žltá)
    {
      id: 'b_r3_c1_purple_yellow_L',
      color: 'purple',
      innerColor: 'yellow',
      r: 3,
      c: 1,
      shape: 'L3'
    },
    // Vertikálne 2x1 bloky vpravo (modrý, žltý, modrý)
    { id: 'b_r3_c3_blue', color: 'blue', r: 3, c: 3, shape: '2x1' },
    { id: 'b_r3_c4_yellow', color: 'yellow', r: 3, c: 4, shape: '2x1' },
    { id: 'b_r3_c5_blue', color: 'blue', r: 3, c: 5, shape: '2x1' },

    // Riadky 5..7: Ľavá zamrznutá komora 3x3 s číslom 12
    {
      id: 'b_r5_c0_group12',
      color: 'purple',
      r: 5,
      c: 0,
      shape: '3x3',
      frozen: 12,
      children: [
        // Hore: modrý 1x2 blok
        { id: 'b_g12_blue_1x2', color: 'blue', r: 0, c: 0, shape: '1x2' },
        // Zelený L-blok (r=0, c=2 a r=1, c=1..2)
        { id: 'b_g12_green_L', color: 'green', r: 0, c: 1, cells: [[0, 1], [1, 0], [1, 1]] },
        // Žltý L-blok (r=1, c=0 a r=2, c=0..2)
        { id: 'b_g12_yellow_L', color: 'yellow', r: 1, c: 0, cells: [[0, 0], [1, 0], [1, 1], [1, 2]] }
      ]
    },

    // Riadky 5..7: Pravá zamrznutá komora 3x3 s číslom 9
    {
      id: 'b_r5_c3_group9',
      color: 'purple',
      r: 5,
      c: 3,
      shape: '3x3',
      frozen: 9,
      children: [
        // Hore: zelený 1x3 blok
        { id: 'b_g9_green_1x3', color: 'green', r: 0, c: 0, shape: '1x3' },
        // Dole: dva dvojfarebné 2x1 bloky a jeden modrý 2x1 blok
        { id: 'b_g9_blue_yellow_2x1', color: 'blue', innerColor: 'yellow', r: 1, c: 0, shape: '2x1' },
        { id: 'b_g9_red_yellow_2x1', color: 'red', innerColor: 'yellow', r: 1, c: 1, shape: '2x1' },
        { id: 'b_g9_blue_2x1', color: 'blue', r: 1, c: 2, shape: '2x1' }
      ]
    }
  ]
};

export default level13;
