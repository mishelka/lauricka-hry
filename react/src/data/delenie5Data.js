export const DELENIE_5_RULES = [
  'Delenie číslom 1: Každé číslo vydelené jednotkou zostáva rovnaké (napr. 8 : 1 = 8).',
  'Delenie číslom 2: Delenie dvomi znamená rozdeliť číslo na polovicu (napr. 14 : 2 = 7, lebo 7 · 2 = 14).',
  'Delenie číslom 3: Delenie tromi rozdelí číslo na 3 rovnaké časti (napr. 15 : 3 = 5, lebo 5 · 3 = 15).',
  'Delenie číslom 4: Delenie štyrmi znamená dvakrát rozdeliť na polovicu (napr. 24 : 4 = 6, lebo 6 · 4 = 24).',
  'Delenie číslom 5: Delenie piatimi nájde, koľko pätiek je v čísle (napr. 35 : 5 = 7, lebo 7 · 5 = 35).',
  'Skúška správnosti: Delenie si vždy môžeme skontrolovať násobením (ak 36 : 4 = 9, potom 9 · 4 = 36).',
  'Nula pri delení: Nula vydelená akýmkoľvek číslom je 0 (napr. 0 : 5 = 0).'
];

export const DELENIE_5_GROUPS = [
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

  // Level 4: Delenie číslom 4
  [
    { a: 4, b: 4, text: '4 : 4', result: 1, hint: '4 : 4 = 1 (1 · 4 = 4)' },
    { a: 8, b: 4, text: '8 : 4', result: 2, hint: '8 : 4 = 2 (2 · 4 = 8)' },
    { a: 12, b: 4, text: '12 : 4', result: 3, hint: '12 : 4 = 3 (3 · 4 = 12)' },
    { a: 16, b: 4, text: '16 : 4', result: 4, hint: '16 : 4 = 4 (4 · 4 = 16)' },
    { a: 20, b: 4, text: '20 : 4', result: 5, hint: '20 : 4 = 5 (5 · 4 = 20)' },
    { a: 24, b: 4, text: '24 : 4', result: 6, hint: '24 : 4 = 6 (6 · 4 = 24)' },
    { a: 28, b: 4, text: '28 : 4', result: 7, hint: '28 : 4 = 7 (7 · 4 = 28)' },
    { a: 32, b: 4, text: '32 : 4', result: 8, hint: '32 : 4 = 8 (8 · 4 = 32)' },
    { a: 36, b: 4, text: '36 : 4', result: 9, hint: '36 : 4 = 9 (9 · 4 = 36)' },
    { a: 40, b: 4, text: '40 : 4', result: 10, hint: '40 : 4 = 10 (10 · 4 = 40)' },
    { a: 0, b: 4, text: '0 : 4', result: 0, hint: '0 : 4 = 0' }
  ],

  // Level 5: Delenie číslom 5
  [
    { a: 5, b: 5, text: '5 : 5', result: 1, hint: '5 : 5 = 1 (1 · 5 = 5)' },
    { a: 10, b: 5, text: '10 : 5', result: 2, hint: '10 : 5 = 2 (2 · 5 = 10)' },
    { a: 15, b: 5, text: '15 : 5', result: 3, hint: '15 : 5 = 3 (3 · 5 = 15)' },
    { a: 20, b: 5, text: '20 : 5', result: 4, hint: '20 : 5 = 4 (4 · 5 = 20)' },
    { a: 25, b: 5, text: '25 : 5', result: 5, hint: '25 : 5 = 5 (5 · 5 = 25)' },
    { a: 30, b: 5, text: '30 : 5', result: 6, hint: '30 : 5 = 6 (6 · 5 = 30)' },
    { a: 35, b: 5, text: '35 : 5', result: 7, hint: '35 : 5 = 7 (7 · 5 = 35)' },
    { a: 40, b: 5, text: '40 : 5', result: 8, hint: '40 : 5 = 8 (8 · 5 = 40)' },
    { a: 45, b: 5, text: '45 : 5', result: 9, hint: '45 : 5 = 9 (9 · 5 = 45)' },
    { a: 50, b: 5, text: '50 : 5', result: 10, hint: '50 : 5 = 10 (10 · 5 = 50)' },
    { a: 0, b: 5, text: '0 : 5', result: 0, hint: '0 : 5 = 0' }
  ],

  // Level 6: Mix delenia 1, 2 a 3
  [
    { a: 12, b: 3, text: '12 : 3', result: 4, hint: '12 : 3 = 4 (4 · 3 = 12)' },
    { a: 14, b: 2, text: '14 : 2', result: 7, hint: '14 : 2 = 7 (7 · 2 = 14)' },
    { a: 9, b: 1, text: '9 : 1', result: 9, hint: '9 : 1 = 9' },
    { a: 18, b: 3, text: '18 : 3', result: 6, hint: '18 : 3 = 6 (6 · 3 = 18)' },
    { a: 16, b: 2, text: '16 : 2', result: 8, hint: '16 : 2 = 8 (8 · 2 = 16)' },
    { a: 21, b: 3, text: '21 : 3', result: 7, hint: '21 : 3 = 7 (7 · 3 = 21)' },
    { a: 24, b: 3, text: '24 : 3', result: 8, hint: '24 : 3 = 8 (8 · 3 = 24)' },
    { a: 18, b: 2, text: '18 : 2', result: 9, hint: '18 : 2 = 9 (9 · 2 = 18)' },
    { a: 27, b: 3, text: '27 : 3', result: 9, hint: '27 : 3 = 9 (9 · 3 = 27)' },
    { a: 10, b: 2, text: '10 : 2', result: 5, hint: '10 : 2 = 5 (5 · 2 = 10)' },
    { a: 30, b: 3, text: '30 : 3', result: 10, hint: '30 : 3 = 10 (10 · 3 = 30)' },
    { a: 8, b: 2, text: '8 : 2', result: 4, hint: '8 : 2 = 4 (4 · 2 = 8)' },
    { a: 15, b: 3, text: '15 : 3', result: 5, hint: '15 : 3 = 5 (5 · 3 = 15)' }
  ],

  // Level 7: Mix delenia 4 a 5
  [
    { a: 16, b: 4, text: '16 : 4', result: 4, hint: '16 : 4 = 4 (4 · 4 = 16)' },
    { a: 20, b: 5, text: '20 : 5', result: 4, hint: '20 : 5 = 4 (4 · 5 = 20)' },
    { a: 24, b: 4, text: '24 : 4', result: 6, hint: '24 : 4 = 6 (6 · 4 = 24)' },
    { a: 25, b: 5, text: '25 : 5', result: 5, hint: '25 : 5 = 5 (5 · 5 = 25)' },
    { a: 28, b: 4, text: '28 : 4', result: 7, hint: '28 : 4 = 7 (7 · 4 = 28)' },
    { a: 30, b: 5, text: '30 : 5', result: 6, hint: '30 : 5 = 6 (6 · 5 = 30)' },
    { a: 32, b: 4, text: '32 : 4', result: 8, hint: '32 : 4 = 8 (8 · 4 = 32)' },
    { a: 35, b: 5, text: '35 : 5', result: 7, hint: '35 : 5 = 7 (7 · 5 = 35)' },
    { a: 36, b: 4, text: '36 : 4', result: 9, hint: '36 : 4 = 9 (9 · 4 = 36)' },
    { a: 40, b: 5, text: '40 : 5', result: 8, hint: '40 : 5 = 8 (8 · 5 = 40)' },
    { a: 45, b: 5, text: '45 : 5', result: 9, hint: '45 : 5 = 9 (9 · 5 = 45)' },
    { a: 40, b: 4, text: '40 : 4', result: 10, hint: '40 : 4 = 10 (10 · 4 = 40)' },
    { a: 50, b: 5, text: '50 : 5', result: 10, hint: '50 : 5 = 10 (10 · 5 = 50)' }
  ],

  // Level 8: Veľký záverečný mix delenia do 5
  [
    { a: 15, b: 3, text: '15 : 3', result: 5, hint: '15 : 3 = 5 (5 · 3 = 15)' },
    { a: 24, b: 4, text: '24 : 4', result: 6, hint: '24 : 4 = 6 (6 · 4 = 24)' },
    { a: 35, b: 5, text: '35 : 5', result: 7, hint: '35 : 5 = 7 (7 · 5 = 35)' },
    { a: 18, b: 2, text: '18 : 2', result: 9, hint: '18 : 2 = 9 (9 · 2 = 18)' },
    { a: 32, b: 4, text: '32 : 4', result: 8, hint: '32 : 4 = 8 (8 · 4 = 32)' },
    { a: 45, b: 5, text: '45 : 5', result: 9, hint: '45 : 5 = 9 (9 · 5 = 45)' },
    { a: 27, b: 3, text: '27 : 3', result: 9, hint: '27 : 3 = 9 (9 · 3 = 27)' },
    { a: 28, b: 4, text: '28 : 4', result: 7, hint: '28 : 4 = 7 (7 · 4 = 28)' },
    { a: 30, b: 5, text: '30 : 5', result: 6, hint: '30 : 5 = 6 (6 · 5 = 30)' },
    { a: 0, b: 4, text: '0 : 4', result: 0, hint: '0 : 4 = 0' },
    { a: 40, b: 5, text: '40 : 5', result: 8, hint: '40 : 5 = 8 (8 · 5 = 40)' },
    { a: 36, b: 4, text: '36 : 4', result: 9, hint: '36 : 4 = 9 (9 · 4 = 36)' },
    { a: 24, b: 3, text: '24 : 3', result: 8, hint: '24 : 3 = 8 (8 · 3 = 24)' },
    { a: 20, b: 5, text: '20 : 5', result: 4, hint: '20 : 5 = 4 (4 · 5 = 20)' },
    { a: 16, b: 4, text: '16 : 4', result: 4, hint: '16 : 4 = 4 (4 · 4 = 16)' }
  ]
];
