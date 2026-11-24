export const level4 = {
  id: 4,
  name: 'Level 4 - Dvojfarebné bloky a zámky',
  width: 6,
  height: 8,
  doors: [
    { side: 'top', index: 0, span: 2, color: 'pink', locked: 5 },
    { side: 'top', index: 4, span: 2, color: 'red', locked: 6 },
    { side: 'right', index: 4, span: 2, color: 'yellow' },
    { side: 'bottom', index: 0, span: 2, color: 'blue', locked: 3 },
    { side: 'bottom', index: 4, span: 2, color: 'green', locked: 2 }
  ],
  walls: [
    { r: 0, c: 2 }, { r: 0, c: 3 },
    { r: 1, c: 2 }, { r: 1, c: 3 },
    { r: 6, c: 2 }, { r: 6, c: 3 },
    { r: 7, c: 2 }, { r: 7, c: 3 }
  ],
  blocks: [
    // Riadok 0..1 (top row)
    // Horný-ľavý (col 0..1): vonkajšia ružová, vnútorná modrá
    { id: 'b_0_0', color: 'pink', innerColor: 'blue', r: 0, c: 0, shape: '2x2' },
    // Horný-pravý (col 4..5): vonkajšia červená, vnútorná žltá
    { id: 'b_0_4', color: 'red', innerColor: 'yellow', r: 0, c: 4, shape: '2x2' },

    // Riadok 2..3 (druhý riadok)
    // Ľavý (col 0..1): žltá
    { id: 'b_2_0', color: 'yellow', r: 2, c: 0, shape: '2x2' },
    // Stredný (col 2..3): vonkajšia modrá, vnútorná červená
    { id: 'b_2_2', color: 'blue', innerColor: 'red', r: 2, c: 2, shape: '2x2' },
    // Pravý (col 4..5): ružová
    { id: 'b_2_4', color: 'pink', r: 2, c: 4, shape: '2x2' },

    // Riadok 4..5 (tretí riadok)
    // Ľavý (col 0..1): červená
    { id: 'b_4_0', color: 'red', r: 4, c: 0, shape: '2x2' },
    // Stredný (col 2..3): zelená
    { id: 'b_4_2', color: 'green', r: 4, c: 2, shape: '2x2' },
    // Pravý (col 4..5): žltá
    { id: 'b_4_4', color: 'yellow', r: 4, c: 4, shape: '2x2' },

    // Riadok 6..7 (štvrtý riadok)
    // Dolný-ľavý (col 0..1): vonkajšia modrá, vnútorná ružová
    { id: 'b_6_0', color: 'blue', innerColor: 'pink', r: 6, c: 0, shape: '2x2' },
    // Dolný-pravý (col 4..5): vonkajšia zelená, vnútorná modrá
    { id: 'b_6_4', color: 'green', innerColor: 'blue', r: 6, c: 4, shape: '2x2' }
  ]
};

export default level4;
