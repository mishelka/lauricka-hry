export const COLOR_CONFIG = {
  red: {
    id: 'red',
    name: 'Červená',
    bg: '#ef4444',
    border: '#b91c1c',
    glow: 'rgba(239, 68, 68, 0.4)',
    text: '#ffffff',
    label: '🔴',
    icon: '♥'
  },
  blue: {
    id: 'blue',
    name: 'Modrá',
    bg: '#3b82f6',
    border: '#1d4ed8',
    glow: 'rgba(59, 130, 246, 0.4)',
    text: '#ffffff',
    label: '🔵',
    icon: '◆'
  },
  green: {
    id: 'green',
    name: 'Zelená',
    bg: '#22c55e',
    border: '#15803d',
    glow: 'rgba(34, 197, 94, 0.4)',
    text: '#ffffff',
    label: '🟢',
    icon: '▲'
  },
  yellow: {
    id: 'yellow',
    name: 'Žltá',
    bg: '#eab308',
    border: '#a16207',
    glow: 'rgba(234, 179, 8, 0.4)',
    text: '#ffffff',
    label: '🟡',
    icon: '★'
  },
  purple: {
    id: 'purple',
    name: 'Fialová',
    bg: '#a855f7',
    border: '#7e22ce',
    glow: 'rgba(168, 85, 247, 0.4)',
    text: '#ffffff',
    label: '🟣',
    icon: '✿'
  },
  orange: {
    id: 'orange',
    name: 'Oranžová',
    bg: '#f97316',
    border: '#c2410c',
    glow: 'rgba(249, 115, 22, 0.4)',
    text: '#ffffff',
    label: '🟠',
    icon: '✦'
  }
};

export const BLOCK_OUT_LEVELS = [
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
      { id: 'b1', color: 'red', r: 2, c: 1 },
      { id: 'b2', color: 'blue', r: 2, c: 0 }
    ]
  },
  {
    id: 2,
    name: 'Level 2 - Uvoľni cestu',
    hint: 'Žltá kocka blokuje červenú. Posuň najprv žltú do jej dverí!',
    width: 4,
    height: 4,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'bottom', index: 2, color: 'yellow' }
    ],
    blocks: [
      { id: 'b1', color: 'red', r: 1, c: 1 },
      { id: 'b2', color: 'yellow', r: 0, c: 1 }
    ]
  },
  {
    id: 3,
    name: 'Level 3 - Tri farby',
    hint: 'Nájdi správne poradie, aby si kocky navzájom nezavadzali.',
    width: 4,
    height: 4,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'right', index: 1, color: 'green' },
      { side: 'bottom', index: 2, color: 'blue' }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 1, c: 0 },
      { id: 'b2', color: 'red', r: 2, c: 1 },
      { id: 'b3', color: 'blue', r: 0, c: 2 }
    ]
  },
  {
    id: 4,
    name: 'Level 4 - Premávka v pruhu',
    hint: 'Urob priestor na bočnej dráhe a uvoľni hlavný pruh.',
    width: 4,
    height: 4,
    doors: [
      { side: 'left', index: 1, color: 'green' },
      { side: 'right', index: 1, color: 'purple' },
      { side: 'top', index: 2, color: 'red' }
    ],
    blocks: [
      { id: 'b1', color: 'green', r: 1, c: 2 },
      { id: 'b2', color: 'purple', r: 1, c: 1 },
      { id: 'b3', color: 'red', r: 2, c: 2 }
    ]
  },
  {
    id: 5,
    name: 'Level 5 - Dvojité kocky',
    hint: 'Dve červené a dve modré kocky. Ktorá pôjde von ako prvá?',
    width: 4,
    height: 4,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'bottom', index: 2, color: 'blue' }
    ],
    blocks: [
      { id: 'b1', color: 'red', r: 1, c: 1 },
      { id: 'b2', color: 'red', r: 2, c: 1 },
      { id: 'b3', color: 'blue', r: 1, c: 2 },
      { id: 'b4', color: 'blue', r: 2, c: 2 }
    ]
  },
  {
    id: 6,
    name: 'Level 6 - Štyri smery',
    hint: 'Využi všetky štyri strany herného plánu.',
    width: 5,
    height: 5,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'right', index: 2, color: 'green' },
      { side: 'bottom', index: 3, color: 'blue' },
      { side: 'left', index: 2, color: 'yellow' }
    ],
    blocks: [
      { id: 'b1', color: 'red', r: 2, c: 1 },
      { id: 'b2', color: 'green', r: 2, c: 0 },
      { id: 'b3', color: 'yellow', r: 1, c: 2 },
      { id: 'b4', color: 'blue', r: 1, c: 3 }
    ]
  },
  {
    id: 7,
    name: 'Level 7 - Logický labyrint',
    hint: 'Premysli si každý krok vopred a vyčisti celú plochu.',
    width: 5,
    height: 5,
    doors: [
      { side: 'top', index: 1, color: 'red' },
      { side: 'top', index: 3, color: 'purple' },
      { side: 'bottom', index: 1, color: 'yellow' },
      { side: 'right', index: 2, color: 'blue' },
      { side: 'left', index: 3, color: 'orange' }
    ],
    blocks: [
      { id: 'b1', color: 'purple', r: 2, c: 3 },
      { id: 'b2', color: 'red', r: 3, c: 1 },
      { id: 'b3', color: 'yellow', r: 1, c: 1 },
      { id: 'b4', color: 'blue', r: 2, c: 1 },
      { id: 'b5', color: 'orange', r: 3, c: 3 }
    ]
  },
  {
    id: 8,
    name: 'Level 8 - Majstrovská hádanka',
    hint: 'Viacero farebných kociek na väčšej ploche.',
    width: 5,
    height: 5,
    doors: [
      { side: 'top', index: 2, color: 'red' },
      { side: 'bottom', index: 2, color: 'green' },
      { side: 'left', index: 1, color: 'yellow' },
      { side: 'left', index: 3, color: 'orange' },
      { side: 'right', index: 1, color: 'purple' },
      { side: 'right', index: 3, color: 'blue' }
    ],
    blocks: [
      { id: 'b1', color: 'yellow', r: 1, c: 3 },
      { id: 'b2', color: 'purple', r: 1, c: 1 },
      { id: 'b3', color: 'red', r: 3, c: 2 },
      { id: 'b4', color: 'green', r: 1, c: 2 },
      { id: 'b5', color: 'orange', r: 3, c: 3 },
      { id: 'b6', color: 'blue', r: 3, c: 1 }
    ]
  }
];
