export const DELENIE_3_RULES = [
  'Delenie číslom 1: Každé číslo vydelené jednotkou zostáva rovnaké (napr. 8 : 1 = 8).',
  'Delenie číslom 2: Delenie dvomi znamená rozdeliť číslo na polovicu (napr. 14 : 2 = 7, lebo 7 · 2 = 14).',
  'Delenie číslom 3: Delenie tromi rozdelí číslo na 3 rovnaké časti (napr. 15 : 3 = 5, lebo 5 · 3 = 15).',
  'Skúška správnosti: Delenie si vždy môžeme skontrolovať násobením (ak 18 : 3 = 6, potom 6 · 3 = 18).',
  'Nula pri delení: Nula vydelená akýmkoľvek číslom je 0 (napr. 0 : 3 = 0).'
];

export const DELENIE_3_GROUPS = [
  // Level 1: Delenie číslom 1
  [
    { a: 1, b: 1, text: '1 : 1', result: 1, hint: '1 : 1 = 1 (1 · 1 = 1)' },
    { a: 2, b: 1, text: '2 : 1', result: 2, hint: '2 : 1 = 2 (2 · 1 = 2)' },
    { a: 3, b: 1, text: '3 : 1', result: 3, hint: '3 : 1 = 3 (3 · 1 = 3)' },
    { a: 4, b: 1, text: '4 : 1', result: 4, hint: '4 : 1 = 4 (4 · 1 = 4)' },
    { a: 5, b: 1, text: '5 : 1', result: 5, hint: '5 : 1 = 5 (5 · 1 = 5)' },
    { a: 6, b: 1, text: '6 : 1', result: 6, hint: '6 : 1 = 6 (6 · 1 = 6)' },
    { a: 7, b: 1, text: '7 : 1', result: 7, hint: '7 : 1 = 7 (7 · 1 = 7)' },
    { a: 8, b: 1, text: '8 : 1', result: 8, hint: '8 : 1 = 8 (8 · 1 = 8)' },
    { a: 9, b: 1, text: '9 : 1', result: 9, hint: '9 : 1 = 9 (9 · 1 = 9)' },
    { a: 10, b: 1, text: '10 : 1', result: 10, hint: '10 : 1 = 10 (10 · 1 = 10)' },
    { a: 0, b: 1, text: '0 : 1', result: 0, hint: '0 : 1 = 0' }
  ],

  // Level 2: Delenie číslom 2
  [
    { a: 2, b: 2, text: '2 : 2', result: 1, hint: '2 : 2 = 1 (1 · 2 = 2)' },
    { a: 4, b: 2, text: '4 : 2', result: 2, hint: '4 : 2 = 2 (2 · 2 = 4)' },
    { a: 6, b: 2, text: '6 : 2', result: 3, hint: '6 : 2 = 3 (3 · 2 = 6)' },
    { a: 8, b: 2, text: '8 : 2', result: 4, hint: '8 : 2 = 4 (4 · 2 = 8)' },
    { a: 10, b: 2, text: '10 : 2', result: 5, hint: '10 : 2 = 5 (5 · 2 = 10)' },
    { a: 12, b: 2, text: '12 : 2', result: 6, hint: '12 : 2 = 6 (6 · 2 = 12)' },
    { a: 14, b: 2, text: '14 : 2', result: 7, hint: '14 : 2 = 7 (7 · 2 = 14)' },
    { a: 16, b: 2, text: '16 : 2', result: 8, hint: '16 : 2 = 8 (8 · 2 = 16)' },
    { a: 18, b: 2, text: '18 : 2', result: 9, hint: '18 : 2 = 9 (9 · 2 = 18)' },
    { a: 20, b: 2, text: '20 : 2', result: 10, hint: '20 : 2 = 10 (10 · 2 = 20)' },
    { a: 0, b: 2, text: '0 : 2', result: 0, hint: '0 : 2 = 0' }
  ],

  // Level 3: Delenie číslom 3
  [
    { a: 3, b: 3, text: '3 : 3', result: 1, hint: '3 : 3 = 1 (1 · 3 = 3)' },
    { a: 6, b: 3, text: '6 : 3', result: 2, hint: '6 : 3 = 2 (2 · 3 = 6)' },
    { a: 9, b: 3, text: '9 : 3', result: 3, hint: '9 : 3 = 3 (3 · 3 = 9)' },
    { a: 12, b: 3, text: '12 : 3', result: 4, hint: '12 : 3 = 4 (4 · 3 = 12)' },
    { a: 15, b: 3, text: '15 : 3', result: 5, hint: '15 : 3 = 5 (5 · 3 = 15)' },
    { a: 18, b: 3, text: '18 : 3', result: 6, hint: '18 : 3 = 6 (6 · 3 = 18)' },
    { a: 21, b: 3, text: '21 : 3', result: 7, hint: '21 : 3 = 7 (7 · 3 = 21)' },
    { a: 24, b: 3, text: '24 : 3', result: 8, hint: '24 : 3 = 8 (8 · 3 = 24)' },
    { a: 27, b: 3, text: '27 : 3', result: 9, hint: '27 : 3 = 9 (9 · 3 = 27)' },
    { a: 30, b: 3, text: '30 : 3', result: 10, hint: '30 : 3 = 10 (10 · 3 = 30)' },
    { a: 0, b: 3, text: '0 : 3', result: 0, hint: '0 : 3 = 0' }
  ],

  // Level 4: Mix delenia 1 a 2
  [
    { a: 6, b: 2, text: '6 : 2', result: 3, hint: '6 : 2 = 3' },
    { a: 7, b: 1, text: '7 : 1', result: 7, hint: '7 : 1 = 7' },
    { a: 14, b: 2, text: '14 : 2', result: 7, hint: '14 : 2 = 7' },
    { a: 8, b: 2, text: '8 : 2', result: 4, hint: '8 : 2 = 4' },
    { a: 9, b: 1, text: '9 : 1', result: 9, hint: '9 : 1 = 9' },
    { a: 18, b: 2, text: '18 : 2', result: 9, hint: '18 : 2 = 9' },
    { a: 12, b: 2, text: '12 : 2', result: 6, hint: '12 : 2 = 6' },
    { a: 16, b: 2, text: '16 : 2', result: 8, hint: '16 : 2 = 8' },
    { a: 10, b: 2, text: '10 : 2', result: 5, hint: '10 : 2 = 5' },
    { a: 4, b: 1, text: '4 : 1', result: 4, hint: '4 : 1 = 4' },
    { a: 20, b: 2, text: '20 : 2', result: 10, hint: '20 : 2 = 10' },
    { a: 4, b: 2, text: '4 : 2', result: 2, hint: '4 : 2 = 2' }
  ],

  // Level 5: Mix delenia 2 a 3
  [
    { a: 12, b: 3, text: '12 : 3', result: 4, hint: '12 : 3 = 4 (4 · 3 = 12)' },
    { a: 12, b: 2, text: '12 : 2', result: 6, hint: '12 : 2 = 6 (6 · 2 = 12)' },
    { a: 21, b: 3, text: '21 : 3', result: 7, hint: '21 : 3 = 7 (7 · 3 = 21)' },
    { a: 16, b: 2, text: '16 : 2', result: 8, hint: '16 : 2 = 8 (8 · 2 = 16)' },
    { a: 9, b: 3, text: '9 : 3', result: 3, hint: '9 : 3 = 3 (3 · 3 = 9)' },
    { a: 18, b: 3, text: '18 : 3', result: 6, hint: '18 : 3 = 6 (6 · 3 = 18)' },
    { a: 18, b: 2, text: '18 : 2', result: 9, hint: '18 : 2 = 9 (9 · 2 = 18)' },
    { a: 24, b: 3, text: '24 : 3', result: 8, hint: '24 : 3 = 8 (8 · 3 = 24)' },
    { a: 15, b: 3, text: '15 : 3', result: 5, hint: '15 : 3 = 5 (5 · 3 = 15)' },
    { a: 14, b: 2, text: '14 : 2', result: 7, hint: '14 : 2 = 7 (7 · 2 = 14)' },
    { a: 27, b: 3, text: '27 : 3', result: 9, hint: '27 : 3 = 9 (9 · 3 = 27)' },
    { a: 8, b: 2, text: '8 : 2', result: 4, hint: '8 : 2 = 4 (4 · 2 = 8)' },
    { a: 30, b: 3, text: '30 : 3', result: 10, hint: '30 : 3 = 10 (10 · 3 = 30)' }
  ],

  // Level 6: Veľký mix delenia do 3
  [
    { a: 15, b: 3, text: '15 : 3', result: 5, hint: '15 : 3 = 5 (5 · 3 = 15)' },
    { a: 14, b: 2, text: '14 : 2', result: 7, hint: '14 : 2 = 7 (7 · 2 = 14)' },
    { a: 9, b: 1, text: '9 : 1', result: 9, hint: '9 : 1 = 9' },
    { a: 24, b: 3, text: '24 : 3', result: 8, hint: '24 : 3 = 8 (8 · 3 = 24)' },
    { a: 18, b: 2, text: '18 : 2', result: 9, hint: '18 : 2 = 9 (9 · 2 = 18)' },
    { a: 18, b: 3, text: '18 : 3', result: 6, hint: '18 : 3 = 6 (6 · 3 = 18)' },
    { a: 0, b: 3, text: '0 : 3', result: 0, hint: '0 : 3 = 0' },
    { a: 27, b: 3, text: '27 : 3', result: 9, hint: '27 : 3 = 9 (9 · 3 = 27)' },
    { a: 10, b: 2, text: '10 : 2', result: 5, hint: '10 : 2 = 5 (5 · 2 = 10)' },
    { a: 21, b: 3, text: '21 : 3', result: 7, hint: '21 : 3 = 7 (7 · 3 = 21)' },
    { a: 30, b: 3, text: '30 : 3', result: 10, hint: '30 : 3 = 10 (10 · 3 = 30)' },
    { a: 8, b: 2, text: '8 : 2', result: 4, hint: '8 : 2 = 4 (4 · 2 = 8)' },
    { a: 12, b: 3, text: '12 : 3', result: 4, hint: '12 : 3 = 4 (4 · 3 = 12)' },
    { a: 16, b: 2, text: '16 : 2', result: 8, hint: '16 : 2 = 8 (8 · 2 = 16)' }
  ]
];
