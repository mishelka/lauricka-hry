export const level03 = {
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
  blocks: [
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
  ]
};

export default level03;
