export const ADAPTIVNE_OPAKOVANIE_RULES = [
  'V hre sa striedajú príklady na násobenie a delenie z násobilky 2 až 5.',
  'Príklady, ktoré vyriešiš správne na prvý pokus, sa budú objavovať menej často.',
  'Keď vyriešiš rovnaký príklad dvakrát správne na prvý pokus, zvládneš ho a hra ti ho už nezadá.',
  'Ak sa pomýliš, dosiahnutá úroveň poznania daného príkladu zostáva zachovaná.',
  'Keď zvládneš všetky príklady jednej násobilky (napr. celé násobenie trojkou), získaš smajlíka do zbierky.'
];

export const NASOBILKA_TABLES = [2, 3, 4, 5];

export const NASOBILKA_OPS = [
  { op: 'multiply', label: 'Násobenie' },
  { op: 'divide', label: 'Delenie' }
];

function createFacts() {
  const facts = [];
  const seenTexts = new Set();

  function addFact(id, text, result, hint, op, a, b) {
    if (seenTexts.has(text)) return;
    seenTexts.add(text);
    facts.push({ id, text, result, hint, op, a, b });
  }

  for (const table of NASOBILKA_TABLES) {
    for (let factor = 1; factor <= 10; factor++) {
      const product = table * factor;
      addFact(
        `multiply-${table}-${factor}`,
        `${table} · ${factor}`,
        product,
        `${table} · ${factor} = ${product}`,
        'multiply',
        table,
        factor
      );
      addFact(
        `multiply-${factor}-${table}`,
        `${factor} · ${table}`,
        product,
        `${factor} · ${table} = ${product}`,
        'multiply',
        factor,
        table
      );
      addFact(
        `divide-${product}-${table}`,
        `${product} : ${table}`,
        factor,
        `${product} : ${table} = ${factor} (${factor} · ${table} = ${product})`,
        'divide',
        product,
        table
      );
    }
  }

  return facts;
}

export const NASOBENIE_DELENIE_FACTS = createFacts();

// Príklad patrí do násobilky `table`, ak sa ňou násobí (ľubovoľný činiteľ)
// alebo delí (deliteľ). Napr. `2 · 3` patrí do násobilky 2 aj 3.
export function factBelongsToTable(fact, table) {
  if (!fact) return false;
  if (fact.op === 'multiply') return fact.a === table || fact.b === table;
  if (fact.op === 'divide') return fact.b === table;
  return false;
}

export function getTableFacts(table, op) {
  return NASOBENIE_DELENIE_FACTS.filter(fact => fact.op === op && factBelongsToTable(fact, table)).sort((x, y) => {
    if (op === 'divide') return x.a - y.a;
    const xOther = x.a === table ? x.b : x.a;
    const yOther = y.a === table ? y.b : y.a;
    if (xOther !== yOther) return xOther - yOther;
    return x.a === table ? -1 : 1;
  });
}
