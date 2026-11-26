export const level12 = {
  id: 12,
  name: 'Level 12 - Šachovnica a tajná komora',
  width: 6,
  height: 10,
  walls: [],
  doors: [
    // Horné východy: čierny vľavo (c=0), biely vpravo (c=5)
    { side: 'top', index: 0, span: 1, color: 'black' },
    { side: 'top', index: 5, span: 1, color: 'white' },

    // Ľavé východy: červený hore (r=0), zamknutý oranžový na r=3 s počtom 17
    { side: 'left', index: 0, span: 1, color: 'red' },
    { side: 'left', index: 3, span: 1, color: 'orange', locked: 17 },

    // Spodné východy: zamknutý modrý vľavo s počtom 19, zamknutý ružový vpravo s počtom 19
    { side: 'bottom', index: 0, span: 3, color: 'blue', locked: 19 },
    { side: 'bottom', index: 3, span: 3, color: 'pink', locked: 19 }
  ],
  blocks: [
    // Riadok 0: šachovnica čierna / biela
    { id: 'b_r0_c0_black', color: 'black', r: 0, c: 0, shape: '1x1' },
    { id: 'b_r0_c1_white', color: 'white', r: 0, c: 1, shape: '1x1' },
    { id: 'b_r0_c2_black', color: 'black', r: 0, c: 2, shape: '1x1' },
    { id: 'b_r0_c3_white', color: 'white', r: 0, c: 3, shape: '1x1' },
    { id: 'b_r0_c4_black', color: 'black', r: 0, c: 4, shape: '1x1' },
    { id: 'b_r0_c5_white', color: 'white', r: 0, c: 5, shape: '1x1' },

    // Riadok 1: šachovnica biela / čierna
    { id: 'b_r1_c0_white', color: 'white', r: 1, c: 0, shape: '1x1' },
    { id: 'b_r1_c1_black', color: 'black', r: 1, c: 1, shape: '1x1' },
    { id: 'b_r1_c2_white', color: 'white', r: 1, c: 2, shape: '1x1' },
    { id: 'b_r1_c3_black', color: 'black', r: 1, c: 3, shape: '1x1' },
    { id: 'b_r1_c4_white', color: 'white', r: 1, c: 4, shape: '1x1' },
    { id: 'b_r1_c5_black', color: 'black', r: 1, c: 5, shape: '1x1' },

    // Riadok 2: šachovnica čierna / biela a červený 1x2 blok vpravo
    { id: 'b_r2_c0_black', color: 'black', r: 2, c: 0, shape: '1x1' },
    { id: 'b_r2_c1_white', color: 'white', r: 2, c: 1, shape: '1x1' },
    { id: 'b_r2_c2_black', color: 'black', r: 2, c: 2, shape: '1x1' },
    { id: 'b_r2_c3_white', color: 'white', r: 2, c: 3, shape: '1x1' },
    { id: 'b_r2_c4_red', color: 'red', r: 2, c: 4, shape: '1x2' },

    // Riadky 3..9: Veľký zamrznutý blok 7x6 s číslom 17
    {
      id: 'b_r3_c0_group17',
      color: 'purple',
      r: 3,
      c: 0,
      shape: '7x6',
      frozen: 17,
      children: [
        // Riadok 0 skupiny (r=3 hracej plochy):
        // vľavo červený 1x3 blok, vpravo oranžový 1x3 blok
        { id: 'b_g17_r0_c0_red', color: 'red', r: 0, c: 0, shape: '1x3' },
        { id: 'b_g17_r0_c3_orange', color: 'orange', r: 0, c: 3, shape: '1x3' },

        // Riadky 1..6 skupiny (r=4..9 hracej plochy):
        // Ľavý stĺpec (c=0..1): 3x 2x2 bloky (ružový, modrý, ružový)
        { id: 'b_g17_r1_c0_pink', color: 'pink', r: 1, c: 0, shape: '2x2' },
        { id: 'b_g17_r3_c0_blue', color: 'blue', r: 3, c: 0, shape: '2x2' },
        { id: 'b_g17_r5_c0_pink', color: 'pink', r: 5, c: 0, shape: '2x2' },

        // Stĺpec c=2: dva zamrznuté 3x1 bloky s číslom 5
        // 5 vľavo hore: ukrýva čierny 3x1 blok
        {
          id: 'b_g17_frozen5_left_top',
          color: 'black',
          r: 1,
          c: 2,
          shape: '3x1',
          frozen: 5,
          children: [
            { id: 'b_g17_left_top_black', color: 'black', r: 0, c: 0, shape: '3x1' }
          ]
        },
        // 5 vľavo dole: ukrýva biely 3x1 blok
        {
          id: 'b_g17_frozen5_left_bottom',
          color: 'white',
          r: 4,
          c: 2,
          shape: '3x1',
          frozen: 5,
          children: [
            { id: 'b_g17_left_bottom_white', color: 'white', r: 0, c: 0, shape: '3x1' }
          ]
        },

        // Stĺpec c=3..4: 3x 2x2 bloky (modrý, ružový, modrý)
        { id: 'b_g17_r1_c3_blue', color: 'blue', r: 1, c: 3, shape: '2x2' },
        { id: 'b_g17_r3_c3_pink', color: 'pink', r: 3, c: 3, shape: '2x2' },
        { id: 'b_g17_r5_c3_blue', color: 'blue', r: 5, c: 3, shape: '2x2' },

        // Stĺpec c=5: dva zamrznuté 3x1 bloky s číslom 5
        // 5 vpravo hore: ukrýva biely 3x1 blok
        {
          id: 'b_g17_frozen5_right_top',
          color: 'white',
          r: 1,
          c: 5,
          shape: '3x1',
          frozen: 5,
          children: [
            { id: 'b_g17_right_top_white', color: 'white', r: 0, c: 0, shape: '3x1' }
          ]
        },
        // 5 vpravo dole: ukrýva čierny 3x1 blok
        {
          id: 'b_g17_frozen5_right_bottom',
          color: 'black',
          r: 4,
          c: 5,
          shape: '3x1',
          frozen: 5,
          children: [
            { id: 'b_g17_right_bottom_black', color: 'black', r: 0, c: 0, shape: '3x1' }
          ]
        }
      ]
    }
  ]
};

export default level12;
