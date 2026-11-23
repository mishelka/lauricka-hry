export const NASOBENIE_5_RULES = [
  'Násobenie číslom 0: Každé číslo vynásobené nulou sa rovná 0 (napr. 5 · 0 = 0).',
  'Násobenie číslom 1: Každé číslo vynásobené jednotkou zostáva nezmenené (napr. 7 · 1 = 7).',
  'Násobenie číslom 2: Násobenie dvomi znamená dvojnásobok čísla (napr. 2 · 6 = 6 + 6 = 12).',
  'Násobenie číslom 3: Násobenie tromi je trojnásobok čísla (napr. 3 · 4 = 4 + 4 + 4 = 12).',
  'Násobenie číslom 4: Násobenie štyrmi je dvojnásobok dvojnásobku (napr. 4 · 5 = 2 · (2 · 5) = 2 · 10 = 20).',
  'Násobenie číslom 5: Násobky čísla 5 končia vždy číslicou 0 alebo 5 (napr. 5 · 6 = 30, 5 · 7 = 35).',
  'Zámena činiteľov: Poradie čísel pri násobení nerozhoduje (napr. 4 · 5 = 5 · 4 = 20).'
];

export const NASOBENIE_5_GROUPS = [
  // Level 1: Násobenie číslom 1
  [
    { a: 1, b: 1, text: '1 · 1', result: 1, hint: '1 · 1 = 1' },
    { a: 1, b: 2, text: '1 · 2', result: 2, hint: '1 · 2 = 2' },
    { a: 1, b: 3, text: '1 · 3', result: 3, hint: '1 · 3 = 3' },
    { a: 1, b: 4, text: '1 · 4', result: 4, hint: '1 · 4 = 4' },
    { a: 1, b: 5, text: '1 · 5', result: 5, hint: '1 · 5 = 5' },
    { a: 1, b: 6, text: '1 · 6', result: 6, hint: '1 · 6 = 6' },
    { a: 1, b: 7, text: '1 · 7', result: 7, hint: '1 · 7 = 7' },
    { a: 1, b: 8, text: '1 · 8', result: 8, hint: '1 · 8 = 8' },
    { a: 1, b: 9, text: '1 · 9', result: 9, hint: '1 · 9 = 9' },
    { a: 1, b: 10, text: '1 · 10', result: 10, hint: '1 · 10 = 10' },
    { a: 4, b: 1, text: '4 · 1', result: 4, hint: 'Každé číslo krát 1 je to isté číslo: 4 · 1 = 4' },
    { a: 7, b: 1, text: '7 · 1', result: 7, hint: 'Každé číslo krát 1 je to isté číslo: 7 · 1 = 7' },
    { a: 0, b: 1, text: '0 · 1', result: 0, hint: 'Čokoľvek krát 0 je 0: 0 · 1 = 0' },
    { a: 9, b: 1, text: '9 · 1', result: 9, hint: '9 · 1 = 9' }
  ],

  // Level 2: Násobenie číslom 2
  [
    { a: 2, b: 1, text: '2 · 1', result: 2, hint: '2 · 1 = 2' },
    { a: 2, b: 2, text: '2 · 2', result: 4, hint: '2 · 2 = 2 + 2 = 4' },
    { a: 2, b: 3, text: '2 · 3', result: 6, hint: '2 · 3 = 3 + 3 = 6' },
    { a: 2, b: 4, text: '2 · 4', result: 8, hint: '2 · 4 = 4 + 4 = 8' },
    { a: 2, b: 5, text: '2 · 5', result: 10, hint: '2 · 5 = 5 + 5 = 10' },
    { a: 2, b: 6, text: '2 · 6', result: 12, hint: '2 · 6 = 6 + 6 = 12' },
    { a: 2, b: 7, text: '2 · 7', result: 14, hint: '2 · 7 = 7 + 7 = 14' },
    { a: 2, b: 8, text: '2 · 8', result: 16, hint: '2 · 8 = 8 + 8 = 16' },
    { a: 2, b: 9, text: '2 · 9', result: 18, hint: '2 · 9 = 9 + 9 = 18' },
    { a: 2, b: 10, text: '2 · 10', result: 20, hint: '2 · 10 = 10 + 10 = 20' },
    { a: 3, b: 2, text: '3 · 2', result: 6, hint: '3 · 2 = 2 · 3 = 6' },
    { a: 6, b: 2, text: '6 · 2', result: 12, hint: '6 · 2 = 2 · 6 = 12' },
    { a: 8, b: 2, text: '8 · 2', result: 16, hint: '8 · 2 = 2 · 8 = 16' },
    { a: 2, b: 0, text: '2 · 0', result: 0, hint: 'Čokoľvek krát 0 je 0: 2 · 0 = 0' }
  ],

  // Level 3: Násobenie číslom 3
  [
    { a: 3, b: 1, text: '3 · 1', result: 3, hint: '3 · 1 = 3' },
    { a: 3, b: 2, text: '3 · 2', result: 6, hint: '3 · 2 = 2 + 2 + 2 = 6' },
    { a: 3, b: 3, text: '3 · 3', result: 9, hint: '3 · 3 = 3 + 3 + 3 = 9' },
    { a: 3, b: 4, text: '3 · 4', result: 12, hint: '3 · 4 = 4 + 4 + 4 = 12' },
    { a: 3, b: 5, text: '3 · 5', result: 15, hint: '3 · 5 = 5 + 5 + 5 = 15' },
    { a: 3, b: 6, text: '3 · 6', result: 18, hint: '3 · 6 = 6 + 6 + 6 = 18' },
    { a: 3, b: 7, text: '3 · 7', result: 21, hint: '3 · 7 = 7 + 7 + 7 = 21' },
    { a: 3, b: 8, text: '3 · 8', result: 24, hint: '3 · 8 = 8 + 8 + 8 = 24' },
    { a: 3, b: 9, text: '3 · 9', result: 27, hint: '3 · 9 = 9 + 9 + 9 = 27' },
    { a: 3, b: 10, text: '3 · 10', result: 30, hint: '3 · 10 = 10 + 10 + 10 = 30' },
    { a: 4, b: 3, text: '4 · 3', result: 12, hint: '4 · 3 = 3 · 4 = 12' },
    { a: 7, b: 3, text: '7 · 3', result: 21, hint: '7 · 3 = 3 · 7 = 21' },
    { a: 8, b: 3, text: '8 · 3', result: 24, hint: '8 · 3 = 3 · 8 = 24' },
    { a: 3, b: 0, text: '3 · 0', result: 0, hint: 'Čokoľvek krát 0 je 0: 3 · 0 = 0' }
  ],

  // Level 4: Násobenie číslom 4
  [
    { a: 4, b: 1, text: '4 · 1', result: 4, hint: '4 · 1 = 4' },
    { a: 4, b: 2, text: '4 · 2', result: 8, hint: '4 · 2 = 8 (2 · 4 = 8)' },
    { a: 4, b: 3, text: '4 · 3', result: 12, hint: '4 · 3 = 12 (3 · 4 = 12)' },
    { a: 4, b: 4, text: '4 · 4', result: 16, hint: '4 · 4 = 16' },
    { a: 4, b: 5, text: '4 · 5', result: 20, hint: '4 · 5 = 20 (5 · 4 = 20)' },
    { a: 4, b: 6, text: '4 · 6', result: 24, hint: '4 · 6 = 24' },
    { a: 4, b: 7, text: '4 · 7', result: 28, hint: '4 · 7 = 28' },
    { a: 4, b: 8, text: '4 · 8', result: 32, hint: '4 · 8 = 32' },
    { a: 4, b: 9, text: '4 · 9', result: 36, hint: '4 · 9 = 36' },
    { a: 4, b: 10, text: '4 · 10', result: 40, hint: '4 · 10 = 40' },
    { a: 6, b: 4, text: '6 · 4', result: 24, hint: '6 · 4 = 4 · 6 = 24' },
    { a: 7, b: 4, text: '7 · 4', result: 28, hint: '7 · 4 = 4 · 7 = 28' },
    { a: 9, b: 4, text: '9 · 4', result: 36, hint: '9 · 4 = 4 · 9 = 36' },
    { a: 4, b: 0, text: '4 · 0', result: 0, hint: 'Čokoľvek krát 0 je 0: 4 · 0 = 0' }
  ],

  // Level 5: Násobenie číslom 5
  [
    { a: 5, b: 1, text: '5 · 1', result: 5, hint: '5 · 1 = 5' },
    { a: 5, b: 2, text: '5 · 2', result: 10, hint: '5 · 2 = 10 (2 · 5 = 10)' },
    { a: 5, b: 3, text: '5 · 3', result: 15, hint: '5 · 3 = 15 (3 · 5 = 15)' },
    { a: 5, b: 4, text: '5 · 4', result: 20, hint: '5 · 4 = 20 (4 · 5 = 20)' },
    { a: 5, b: 5, text: '5 · 5', result: 25, hint: '5 · 5 = 25' },
    { a: 5, b: 6, text: '5 · 6', result: 30, hint: '5 · 6 = 30' },
    { a: 5, b: 7, text: '5 · 7', result: 35, hint: '5 · 7 = 35' },
    { a: 5, b: 8, text: '5 · 8', result: 40, hint: '5 · 8 = 40' },
    { a: 5, b: 9, text: '5 · 9', result: 45, hint: '5 · 9 = 45' },
    { a: 5, b: 10, text: '5 · 10', result: 50, hint: '5 · 10 = 50' },
    { a: 6, b: 5, text: '6 · 5', result: 30, hint: '6 · 5 = 5 · 6 = 30' },
    { a: 8, b: 5, text: '8 · 5', result: 40, hint: '8 · 5 = 5 · 8 = 40' },
    { a: 9, b: 5, text: '9 · 5', result: 45, hint: '9 · 5 = 5 · 9 = 45' },
    { a: 5, b: 0, text: '5 · 0', result: 0, hint: 'Čokoľvek krát 0 je 0: 5 · 0 = 0' }
  ],

  // Level 6: Mix násobenia 1, 2 a 3
  [
    { a: 3, b: 4, text: '3 · 4', result: 12, hint: '3 · 4 = 12' },
    { a: 2, b: 6, text: '2 · 6', result: 12, hint: '2 · 6 = 12' },
    { a: 3, b: 7, text: '3 · 7', result: 21, hint: '3 · 7 = 21' },
    { a: 2, b: 8, text: '2 · 8', result: 16, hint: '2 · 8 = 16' },
    { a: 1, b: 9, text: '1 · 9', result: 9, hint: '1 · 9 = 9' },
    { a: 3, b: 3, text: '3 · 3', result: 9, hint: '3 · 3 = 9' },
    { a: 6, b: 3, text: '6 · 3', result: 18, hint: '6 · 3 = 3 · 6 = 18' },
    { a: 2, b: 9, text: '2 · 9', result: 18, hint: '2 · 9 = 18' },
    { a: 3, b: 8, text: '3 · 8', result: 24, hint: '3 · 8 = 24' },
    { a: 5, b: 3, text: '5 · 3', result: 15, hint: '5 · 3 = 15' },
    { a: 2, b: 7, text: '2 · 7', result: 14, hint: '2 · 7 = 14' },
    { a: 3, b: 9, text: '3 · 9', result: 27, hint: '3 · 9 = 27' },
    { a: 9, b: 3, text: '9 · 3', result: 27, hint: '9 · 3 = 27' },
    { a: 3, b: 6, text: '3 · 6', result: 18, hint: '3 · 6 = 18' }
  ],

  // Level 7: Mix násobenia 4 a 5
  [
    { a: 4, b: 4, text: '4 · 4', result: 16, hint: '4 · 4 = 16' },
    { a: 5, b: 3, text: '5 · 3', result: 15, hint: '5 · 3 = 15' },
    { a: 4, b: 6, text: '4 · 6', result: 24, hint: '4 · 6 = 24' },
    { a: 5, b: 6, text: '5 · 6', result: 30, hint: '5 · 6 = 30' },
    { a: 4, b: 7, text: '4 · 7', result: 28, hint: '4 · 7 = 28' },
    { a: 5, b: 7, text: '5 · 7', result: 35, hint: '5 · 7 = 35' },
    { a: 4, b: 8, text: '4 · 8', result: 32, hint: '4 · 8 = 32' },
    { a: 5, b: 8, text: '5 · 8', result: 40, hint: '5 · 8 = 40' },
    { a: 4, b: 9, text: '4 · 9', result: 36, hint: '4 · 9 = 36' },
    { a: 5, b: 9, text: '5 · 9', result: 45, hint: '5 · 9 = 45' },
    { a: 7, b: 4, text: '7 · 4', result: 28, hint: '7 · 4 = 4 · 7 = 28' },
    { a: 8, b: 5, text: '8 · 5', result: 40, hint: '8 · 5 = 5 · 8 = 40' },
    { a: 9, b: 4, text: '9 · 4', result: 36, hint: '9 · 4 = 4 · 9 = 36' },
    { a: 5, b: 5, text: '5 · 5', result: 25, hint: '5 · 5 = 25' }
  ],

  // Level 8: Veľký záverečný mix násobenia do 5
  [
    { a: 3, b: 5, text: '3 · 5', result: 15, hint: '3 · 5 = 15' },
    { a: 4, b: 6, text: '4 · 6', result: 24, hint: '4 · 6 = 24' },
    { a: 5, b: 7, text: '5 · 7', result: 35, hint: '5 · 7 = 35' },
    { a: 2, b: 8, text: '2 · 8', result: 16, hint: '2 · 8 = 16' },
    { a: 4, b: 8, text: '4 · 8', result: 32, hint: '4 · 8 = 32' },
    { a: 5, b: 9, text: '5 · 9', result: 45, hint: '5 · 9 = 45' },
    { a: 3, b: 9, text: '3 · 9', result: 27, hint: '3 · 9 = 27' },
    { a: 4, b: 7, text: '4 · 7', result: 28, hint: '4 · 7 = 28' },
    { a: 5, b: 6, text: '5 · 6', result: 30, hint: '5 · 6 = 30' },
    { a: 0, b: 4, text: '0 · 4', result: 0, hint: '0 · 4 = 0' },
    { a: 5, b: 8, text: '5 · 8', result: 40, hint: '5 · 8 = 40' },
    { a: 4, b: 9, text: '4 · 9', result: 36, hint: '4 · 9 = 36' },
    { a: 3, b: 8, text: '3 · 8', result: 24, hint: '3 · 8 = 24' },
    { a: 5, b: 5, text: '5 · 5', result: 25, hint: '5 · 5 = 25' },
    { a: 4, b: 4, text: '4 · 4', result: 16, hint: '4 · 4 = 16' }
  ]
];
