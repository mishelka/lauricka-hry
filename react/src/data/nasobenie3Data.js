export const NASOBENIE_3_RULES = [
  'Násobenie číslom 0: Každé číslo vynásobené nulou sa rovná 0 (napr. 5 · 0 = 0).',
  'Násobenie číslom 1: Každé číslo vynásobené jednotkou zostáva nezmenené (napr. 7 · 1 = 7).',
  'Násobenie číslom 2: Násobenie dvomi znamená dvojnásobok čísla (napr. 2 · 6 = 6 + 6 = 12).',
  'Násobenie číslom 3: Násobenie tromi je trojnásobok čísla (napr. 3 · 4 = 4 + 4 + 4 = 12).',
  'Zámena činiteľov: Poradie čísel pri násobení nerozhoduje (napr. 2 · 5 = 5 · 2 = 10).'
];

export const NASOBENIE_3_GROUPS = [
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

  // Level 4: Mix násobenia 1 a 2
  [
    { a: 2, b: 3, text: '2 · 3', result: 6, hint: '2 · 3 = 6' },
    { a: 1, b: 8, text: '1 · 8', result: 8, hint: '1 · 8 = 8' },
    { a: 2, b: 7, text: '2 · 7', result: 14, hint: '2 · 7 = 7 + 7 = 14' },
    { a: 5, b: 2, text: '5 · 2', result: 10, hint: '5 · 2 = 2 · 5 = 10' },
    { a: 2, b: 4, text: '2 · 4', result: 8, hint: '2 · 4 = 4 + 4 = 8' },
    { a: 6, b: 1, text: '6 · 1', result: 6, hint: '6 · 1 = 6' },
    { a: 2, b: 9, text: '2 · 9', result: 18, hint: '2 · 9 = 9 + 9 = 18' },
    { a: 8, b: 2, text: '8 · 2', result: 16, hint: '8 · 2 = 16' },
    { a: 2, b: 6, text: '2 · 6', result: 12, hint: '2 · 6 = 12' },
    { a: 1, b: 10, text: '1 · 10', result: 10, hint: '1 · 10 = 10' },
    { a: 2, b: 2, text: '2 · 2', result: 4, hint: '2 · 2 = 4' },
    { a: 4, b: 2, text: '4 · 2', result: 8, hint: '4 · 2 = 8' },
    { a: 10, b: 2, text: '10 · 2', result: 20, hint: '10 · 2 = 20' },
    { a: 2, b: 8, text: '2 · 8', result: 16, hint: '2 · 8 = 16' }
  ],

  // Level 5: Mix násobenia 2 a 3
  [
    { a: 3, b: 4, text: '3 · 4', result: 12, hint: '3 · 4 = 12' },
    { a: 2, b: 6, text: '2 · 6', result: 12, hint: '2 · 6 = 12' },
    { a: 3, b: 7, text: '3 · 7', result: 21, hint: '3 · 7 = 21' },
    { a: 2, b: 8, text: '2 · 8', result: 16, hint: '2 · 8 = 16' },
    { a: 3, b: 3, text: '3 · 3', result: 9, hint: '3 · 3 = 9' },
    { a: 6, b: 3, text: '6 · 3', result: 18, hint: '6 · 3 = 3 · 6 = 18' },
    { a: 2, b: 9, text: '2 · 9', result: 18, hint: '2 · 9 = 18' },
    { a: 3, b: 8, text: '3 · 8', result: 24, hint: '3 · 8 = 24' },
    { a: 5, b: 3, text: '5 · 3', result: 15, hint: '5 · 3 = 15' },
    { a: 2, b: 7, text: '2 · 7', result: 14, hint: '2 · 7 = 14' },
    { a: 3, b: 9, text: '3 · 9', result: 27, hint: '3 · 9 = 27' },
    { a: 9, b: 3, text: '9 · 3', result: 27, hint: '9 · 3 = 27' },
    { a: 3, b: 6, text: '3 · 6', result: 18, hint: '3 · 6 = 18' },
    { a: 8, b: 3, text: '8 · 3', result: 24, hint: '8 · 3 = 24' }
  ],

  // Level 6: Veľký mix násobenia do 3
  [
    { a: 3, b: 5, text: '3 · 5', result: 15, hint: '3 · 5 = 15' },
    { a: 2, b: 7, text: '2 · 7', result: 14, hint: '2 · 7 = 14' },
    { a: 1, b: 9, text: '1 · 9', result: 9, hint: '1 · 9 = 9' },
    { a: 3, b: 8, text: '3 · 8', result: 24, hint: '3 · 8 = 24' },
    { a: 2, b: 9, text: '2 · 9', result: 18, hint: '2 · 9 = 18' },
    { a: 3, b: 6, text: '3 · 6', result: 18, hint: '3 · 6 = 18' },
    { a: 0, b: 3, text: '0 · 3', result: 0, hint: '0 · 3 = 0' },
    { a: 3, b: 9, text: '3 · 9', result: 27, hint: '3 · 9 = 27' },
    { a: 2, b: 5, text: '2 · 5', result: 10, hint: '2 · 5 = 10' },
    { a: 3, b: 7, text: '3 · 7', result: 21, hint: '3 · 7 = 21' },
    { a: 3, b: 10, text: '3 · 10', result: 30, hint: '3 · 10 = 30' },
    { a: 7, b: 2, text: '7 · 2', result: 14, hint: '7 · 2 = 14' },
    { a: 8, b: 3, text: '8 · 3', result: 24, hint: '8 · 3 = 24' },
    { a: 6, b: 2, text: '6 · 2', result: 12, hint: '6 · 2 = 12' }
  ]
];
