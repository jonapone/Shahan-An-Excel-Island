# Shahan: Ledger of the Fourth Expedition

An Excel and VBA learning game on a hand-styled fantasy world map. Every stop on the map is a short lesson or a boss fight, and every challenge is answered by typing a real formula into a working spreadsheet grid. It is a single HTML file, with no server and no install.

![World map](world-map.png)

**Play it:** open `index.html` in any modern browser. (After enabling GitHub Pages: https://jonapone.github.io/Shahan-An-Excel-Island/)

## What this project shows

- **Excel curriculum design.** 72 stops and 161 rounds, ordered from `SUM` and `IF` to `XLOOKUP`, `SUMPRODUCT`, `LET`, dynamic arrays, text cleaning, and VBA/Office Script reading. See [CURRICULUM.md](CURRICULUM.md).
- **Understanding of how formulas fail.** A third of the rounds are about reading or repairing formulas: predict the output, debug a broken formula (drifting references, unsorted `VLOOKUP`, text stored as numbers, `IFERROR` in the wrong place), or find the buggy line in a macro.
- **AI-assisted engineering with verification.** The game was built in collaboration with Claude. I specified the curriculum and the rules, then play-tested it and sent back every ambiguous puzzle, leaked answer and wrong target range I found. The answer-checking is automated, so it does not depend on trusting the AI (see below).

## How the challenges work

| Round type | What you do |
|---|---|
| Write formula | Fill a target range; the answer is checked against a hidden test sheet, not against a string |
| Debug formula | A broken formula is given; fix it so it works for every row |
| Predict result | Type what the cell will display |
| Choose formula | Pick the one formula that works for all inputs |
| Predict VBA / Office Script | Trace the code and type the output |
| Find the bug | Click the faulty line |

Formulas are graded by **evaluating them**, so any correct formula passes. Hard-coding the answer does not: inputs are varied and the formula must still produce the right result. The engine is a custom spreadsheet evaluator written in JavaScript, with about 95 functions.

## Structure

```
index.html         the built game (open this)
src/               source parts, concatenated by build.sh
  engine*.js       spreadsheet engine: parser, evaluator, function library
  c1..c9.js        lesson and boss content, one file per region
  g1..g4.js        game logic, challenge UI, map overlay, save/restore
  mapjs.js         SVG world map, terrain relief, monsters
  wisdom.html      the Excel cheat sheet shown in-game
  chk.js           validator: every reference solution must pass, every broken start must fail
docs/              curriculum map and screenshots
```

Rebuild with `bash src/build.sh`, which writes `index.html`.

## Verifying the content

`node src/chk.js` evaluates the reference answer of every formula round against its test sheet and checks that each broken starting formula really fails. The last run was 161 rounds with 0 failures.

## Screenshots

| | |
|---|---|
| ![Challenge](formula-challenge.png) | ![Sea monsters](sea-monsters.png) |
| ![Hoarfrost Spine](hoarfrost-spine.png) | ![Obsidian Isle](obsidian-isle.png) |

## Honest limits

- The spreadsheet engine implements a large subset of Excel, not all of it. Behaviour on edge cases (locale, rounding, some array functions) can differ from real Excel.
- Progress is saved in the browser's local storage; there is an export/import code in the in-game help.
- The code was largely written by an AI model under my direction. The curriculum choices, playtesting and corrections are mine.

## Author

Jonathan Ponette 
github: jonapone
Linkedin: www.linkedin.com/in/jonathan-ponette-9914bb70
