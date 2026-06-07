# Lauricka hry - React verzia

Toto je React prepis povodneho projektu z priecinka `plain`.
Aplikacia obsahuje tri herne komponenty:

- `YiGame`
- `ObojakeGame`
- `SlovaYiGame`

Spolocna logika je zjednotena v `QuizGame` (DRY):

- miesanie uloh
- pocitanie skore
- validacia odpovedi
- hviezdicky po dokonceni
- zoznam chyb
- restart hry
- ohnostroj po spravnej odpovedi

## Poziadavky

- Node.js 18+
- npm 9+

## Spustenie

```bash
cd react
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Trasy (React Router)

Pouziva sa `HashRouter`, preto su URL vo formate:

- `/#/` - menu hier
- `/#/yi` - Mäkké / Tvrdé (I / Y)
- `/#/obojake` - Obojaké
- `/#/slova` - Slová

## GitHub Pages deployment

Projekt je pripraveny na nasadenie cez balik `gh-pages`.

### Pred pushom (lokalne)

```bash
cd react
npm install
npm run build
```

Volitelne test nasadenia lokalne:

```bash
npm run preview
```

### Push na GitHub

```bash
git add .
git commit -m "Prepare React app for GitHub Pages"
git push
```

### Po pushi

Spusti publikovanie:

```bash
cd react
npm run deploy
```

Potom v GitHub repozitari nastav:

1. `Settings` -> `Pages`
2. `Source`: `Deploy from a branch`
3. `Branch`: `gh-pages`
4. `Folder`: `/ (root)`

Po ulozeni bude aplikacia dostupna na URL tvojho repozitara GitHub Pages.
