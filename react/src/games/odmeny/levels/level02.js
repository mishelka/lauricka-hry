export const level02 = {
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
  blocks: [
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
  ]
};

export default level02;
