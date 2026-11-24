export const level11 = {
  id: 11,
  name: 'Level 11 - Skryté skupiny',
  width: 6,
  height: 9,
  walls: [],
  doors: [
    { side: 'top', index: 0, span: 2, color: 'blue', locked: 2 },
    { side: 'top', index: 2, span: 2, color: 'yellow', locked: 6 },
    { side: 'top', index: 4, span: 2, color: 'red' },
    { side: 'left', index: 4, span: 2, color: 'pink', locked: 13 },
    { side: 'bottom', index: 0, span: 4, color: 'green' }
  ],
  blocks: [
    { id: 'b_r0_c0_yellow', color: 'yellow', r: 0, c: 0, shape: '1x2' },
    { id: 'b_r0_c2_green', color: 'green', r: 0, c: 2, shape: '1x2' },
    { id: 'b_r0_c4_red', color: 'red', r: 0, c: 4, shape: '1x2' },

    { id: 'b_r1_c0_blue', color: 'blue', r: 1, c: 0, shape: '1x2' },
    { id: 'b_r1_c2_red', color: 'red', r: 1, c: 2, shape: '1x2' },
    { id: 'b_r1_c4_yellow', color: 'yellow', r: 1, c: 4, shape: '1x2' },

    {
      id: 'b_r2_c0_group10',
      color: 'blue',
      r: 2,
      c: 0,
      shape: '2x4',
      frozen: 10,
      children: [
        { id: 'b_group10_pink', color: 'pink', r: 0, c: 0, shape: '2x1' },
        { id: 'b_group10_red_yellow', color: 'red', innerColor: 'yellow', r: 0, c: 1, shape: '2x1' },
        {
          id: 'b_group10_frozen6',
          color: 'yellow',
          r: 0,
          c: 2,
          shape: '2x1',
          frozen: 6,
          children: [
            { id: 'b_group10_frozen6_red', color: 'red', r: 0, c: 0, shape: '2x1' }
          ]
        },
        { id: 'b_group10_blue_pink', color: 'blue', innerColor: 'pink', r: 0, c: 3, shape: '2x1' }
      ]
    },
    { id: 'b_r2_c4_blue', color: 'blue', r: 2, c: 4, shape: '1x2' },
    { id: 'b_r3_c4_red', color: 'red', r: 3, c: 4, shape: '1x2' },

    { id: 'b_r4_c0_green', color: 'green', r: 4, c: 0, shape: '1x2' },
    { id: 'b_r4_c2_blue', color: 'blue', r: 4, c: 2, shape: '1x2' },
    { id: 'b_r4_c4_red', color: 'red', r: 4, c: 4, shape: '1x2' },

    { id: 'b_r5_c0_red', color: 'red', r: 5, c: 0, shape: '1x2' },
    { id: 'b_r5_c2_yellow', color: 'yellow', r: 5, c: 2, shape: '1x2' },
    { id: 'b_r5_c4_pink', color: 'pink', r: 5, c: 4, shape: '1x2' },

    {
      id: 'b_r6_c0_group17',
      color: 'pink',
      r: 6,
      c: 0,
      shape: '3x4',
      frozen: 17,
      children: [
        {
          id: 'b_group17_frozen2',
          color: 'blue',
          r: 0,
          c: 0,
          shape: '2x2',
          frozen: 2,
          children: [
            { id: 'b_group17_frozen2_pink_yellow', color: 'pink', innerColor: 'yellow', r: 0, c: 0, shape: '2x2' }
          ]
        },
        { id: 'b_group17_green', color: 'green', r: 0, c: 2, shape: '1x2' },
        { id: 'b_group17_red', color: 'red', r: 1, c: 2, shape: '2x2' },
        { id: 'b_group17_yellow', color: 'yellow', r: 2, c: 0, shape: '1x2' }
      ]
    },
    {
      id: 'b_r6_c4_group19',
      color: 'blue',
      r: 6,
      c: 4,
      shape: '3x2',
      frozen: 19,
      children: [
        { id: 'b_group19_yellow', color: 'yellow', r: 0, c: 0, shape: '3x1' },
        { id: 'b_group19_blue', color: 'blue', r: 0, c: 1, shape: '3x1' }
      ]
    }
  ]
};

export default level11;