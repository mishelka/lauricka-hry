function createLevel01Blocks() {
  const blocks = [
    { id: 'b_pink', color: 'pink', r: 0, c: 0, shape: '1x2' },
    { id: 'b_red', color: 'red', r: 1, c: 0, shape: '1x2' },
    { id: 'b_orange', color: 'orange', r: 2, c: 0, shape: '1x2' },
    { id: 'b_yellow', color: 'yellow', r: 3, c: 0, shape: '1x2' },
    { id: 'b_lime', color: 'lime', r: 4, c: 0, shape: '1x2' },
    { id: 'b_green', color: 'green', r: 5, c: 0, shape: '1x2' },
    { id: 'b_cyan', color: 'cyan', r: 6, c: 0, shape: '1x2' },
    { id: 'b_blue', color: 'blue', r: 7, c: 0, shape: '1x2' },
    { id: 'b_purple', color: 'purple', r: 8, c: 0, shape: '1x2' }
  ];

  for (let r = 0; r <= 8; r++) {
    for (let c = 2; c <= 5; c++) {
      const isWhite = (r + c) % 2 === 0;
      blocks.push({
        id: `b_${r}_${c}`,
        color: isWhite ? 'white' : 'black',
        r,
        c,
        shape: '1x1'
      });
    }
  }

  return blocks;
}

export const level01 = {
  id: 1,
  name: 'Level 1 - Block Out Originál',
  width: 6,
  height: 9,
  doors: [
    { side: 'top', index: 2, color: 'white' },
    { side: 'bottom', index: 2, color: 'black' },
    { side: 'right', index: 0, color: 'yellow' },
    { side: 'right', index: 1, color: 'cyan' },
    { side: 'right', index: 2, color: 'lime' },
    { side: 'right', index: 3, color: 'blue' },
    { side: 'right', index: 4, color: 'pink' },
    { side: 'right', index: 5, color: 'purple' },
    { side: 'right', index: 6, color: 'red' },
    { side: 'right', index: 7, color: 'green' },
    { side: 'right', index: 8, color: 'orange' }
  ],
  blocks: createLevel01Blocks()
};

export default level01;
