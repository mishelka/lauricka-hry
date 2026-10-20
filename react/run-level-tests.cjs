const { solveLevel } = require('./test-solver.cjs');

// Test specific level configurations
const testLevels = [
  {
    id: 1,
    name: 'Level 1 - Prvé kroky',
    hint: 'Posuň každú kocku priamo do dverí rovnakej farby.',
    width: 4,
    height: 4,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'right', index: 2, color: 'blue' }
    ],
    blocks: [
      { id: 'b1', color: 'red', r: 2, c: 1, shape: '1x1' },
      { id: 'b2', color: 'blue', r: 2, c: 0, shape: '1x1' }
    ]
  },
  {
    id: 2,
    name: 'Level 2 - Dlhý blok',
    hint: 'Žltý blok (2x1) blokuje cestu. Najprv ho posuň do jeho dverí!',
    width: 4,
    height: 4,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'bottom', index: 2, color: 'yellow' }
    ],
    blocks: [
      { id: 'b1', color: 'red', r: 2, c: 1, shape: '1x1' },
      { id: 'b2', color: 'yellow', r: 0, c: 1, shape: '2x1' }
    ]
  },
  {
    id: 3,
    name: 'Level 3 - Horizontálne a vertikálne bloky',
    hint: 'Zelený blok je vodorovný (1x2) a modrý zvislý (2x1). Nájdi správne poradie.',
    width: 4,
    height: 4,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'right', index: 1, color: 'green' },
      { side: 'bottom', index: 2, color: 'blue' }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 1, c: 0, shape: '1x2' },
      { id: 'b2', color: 'red', r: 2, c: 1, shape: '1x1' },
      { id: 'b3', color: 'blue', r: 0, c: 2, shape: '2x1' }
    ]
  },
  {
    id: 4,
    name: 'Level 4 - Premávka s dlhými blokmi',
    hint: 'Zelený blok je vodorovný (1x2) a fialový zvislý (2x1). Uvoľni cestu pre červenú.',
    width: 4,
    height: 4,
    doors: [
      { side: 'left', index: 1, color: 'green' },
      { side: 'right', index: 2, color: 'purple' },
      { side: 'top', index: 2, color: 'red' }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 1, c: 1, shape: '1x2' }, // (1,1), (1,2) -> exits left at r=1
      { id: 'b2', color: 'purple', r: 2, c: 1, shape: '1x2' }, // (2,1), (2,2) -> exits right at r=2
      { id: 'b3', color: 'red', r: 3, c: 2, shape: '1x1' }     // (3,2) -> exits top at c=2
    ]
  },
  {
    id: 5,
    name: 'Level 5 - Dlhý pás (1x3)',
    hint: 'Oranžový blok je dlhý pás (1x3). Manévruj s ním opatrne.',
    width: 5,
    height: 5,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'left', index: 2, color: 'orange' },
      { side: 'bottom', index: 3, color: 'blue' }
    ],
    blocks: [
      { id: 'b1', color: 'red', r: 2, c: 1, shape: '2x1' },
      { id: 'b2', color: 'orange', r: 2, c: 2, shape: '1x3' },
      { id: 'b3', color: 'blue', r: 1, c: 3, shape: '2x1' }
    ]
  },
  {
    id: 6,
    name: 'Level 6 - Tvar písmena L',
    hint: 'Žltý blok má tvar L a potrebuje voľnú cestu do žltých dverí.',
    width: 5,
    height: 5,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'bottom', index: 1, color: 'yellow', span: 2 }, // yellow exits bottom at cols 1,2
      { side: 'right', index: 2, color: 'green' },
      { side: 'left', index: 3, color: 'blue' }
    ],
    blocks: [
      { id: 'b1', color: 'yellow', r: 1, c: 1, shape: 'L' }, // (1,1), (2,1), (2,2) -> bottom edge is at cols 1,2
      { id: 'b2', color: 'red', r: 3, c: 1, shape: '1x1' },
      { id: 'b3', color: 'green', r: 2, c: 3, shape: '1x2' },
      { id: 'b4', color: 'blue', r: 3, c: 2, shape: '1x1' }
    ]
  },
  {
    id: 7,
    name: 'Level 7 - Logický labyrint tvarov',
    hint: 'Veľký štvorec 2x2 a domino bloky. Premysli si každý ťah.',
    width: 5,
    height: 5,
    doors: [
      { side: 'top', index: 3, color: 'purple' },
      { side: 'bottom', index: 1, color: 'yellow' },
      { side: 'left', index: 1, color: 'orange', span: 2 }, // orange 2x2 exits left at rows 1,2
      { side: 'right', index: 2, color: 'blue' },
      { side: 'top', index: 1, color: 'red' }
    ],
    blocks: [
      { id: 'b1', color: 'orange', r: 1, c: 2, shape: '2x2' }, // (1,2), (1,3), (2,2), (2,3)
      { id: 'b2', color: 'purple', r: 3, c: 3, shape: '2x1' },  // (3,3), (4,3)
      { id: 'b3', color: 'yellow', r: 1, c: 1, shape: '2x1' },  // (1,1), (2,1)
      { id: 'b4', color: 'blue', r: 4, c: 1, shape: '1x2' },    // (4,1), (4,2)
      { id: 'b5', color: 'red', r: 0, c: 1, shape: '1x1' }      // (0,1)
    ]
  },
  {
    id: 8,
    name: 'Level 8 - Majstrovská hádanka',
    hint: 'Päť farebných tvarov v prepojenom labyrinte. Nájdi správne poradie vysúvania!',
    width: 5,
    height: 5,
    doors: [
      { side: 'top', index: 2, color: 'red' },
      { side: 'bottom', index: 2, color: 'green' },
      { side: 'left', index: 1, color: 'yellow' },
      { side: 'right', index: 3, color: 'blue' },
      { side: 'top', index: 4, color: 'purple' }
    ],
    blocks: [
      { id: 'b1', color: 'red', r: 2, c: 2, shape: '2x1' },
      { id: 'b2', color: 'green', r: 0, c: 2, shape: '2x1' },
      { id: 'b3', color: 'yellow', r: 1, c: 3, shape: '1x2' },
      { id: 'b4', color: 'purple', r: 2, c: 4, shape: '2x1' },
      { id: 'b5', color: 'blue', r: 3, c: 0, shape: '1x2' }
    ]
  }
];

for (const lvl of testLevels) {
  const result = solveLevel(lvl);
  console.log(`Level ${lvl.id} (${lvl.name}): ${result.winnable ? 'SOLVABLE in ' + result.steps + ' steps' : 'NOT SOLVABLE!'}`);
  if (result.winnable) {
    console.log('  Solution:', result.solution.join(' -> '));
  }
}
