# The Raveen Issue 💖

A one-copy collector's magazine for a 22nd birthday. Two facing cream pages
bound at a centre crease on a dark studio ground, and a page that swings across
the spine in 3-D when you turn it.

The design is the **Editorial Memory Zine** system: Bodoni Moda mastheads,
Plus Jakarta Sans copy, Epilogue labels, polaroids with washi tape, die-cut
stickers and pill buttons with a hard bottom lip — hot pink, lavender, butter
yellow and sky on warm art paper.

Plain HTML/CSS/JS. No build step, no dependencies. Open `index.html` and it runs.

## Reading it

**No page ever scrolls.** Each page holds exactly what fits; anything longer is
carried onto the next page automatically. Turn with:

- the **‹ ›** arrows at the edges
- the **arrow keys** (`Home` / `End` jump to the ends)
- a **swipe** on a phone
- the **corner** at the bottom right
- the **Contents** button, or any line on the contents page

## Ten pages

| Pages | Left | Right |
| --- | --- | --- |
| 01–02 | **Cover** — masthead, portrait, barcode, Priceless | **Contents** and the editorial quote |
| 03–04 | **The Raveen Lore** — field biography | **The Report Card** — verified metrics |
| 05–06 | **Entry 01** — a bestie dossier | **Entry 02** |
| 07–08 | **Entries 03 & 04** — the squad | **Entry 05** |
| 09–10 | **Pillars of Strength** — Amma & Nana | **The Finale** — tap the cake |

Every letter opens in full when you press *Read the letter*, so ten pages still
hold all the words.

## Changing everything

**You only need to edit one file: `assets/js/config.js`.** The name, age, the
issue line, the lore entries, the report-card percentages, all five besties,
both family letters and the finale message live there. Change the text between
the quotes and the magazine rebuilds itself.

```js
magazineName: "RAVEEN",
name:         "Raveen",
fullName:     "Lakkakula Sai Raveena Sowgandhika",
age:          22,
birthday:     "2026-11-14",   // drives the "out in N days" line on the cover
```

Photographs: see `assets/img/README.md` for the nine filenames and where each
one lands.

## Design

Defined in `assets/css/magazine.css`:

- **Bodoni Moda** for mastheads and headlines, **Plus Jakarta Sans** for copy, **Epilogue** for labels, folios and badges
- Warm art paper `#fdfbf7`, editorial midnight ink `#1a162b`, hot pink `#ff2a85`, lavender `#7b5cfa`, butter `#ffdf6d`, sky `#7dd3fc`
- Polaroids sit at a micro-rotation and straighten on hover; washi tape is a torn-edge `clip-path`; buttons press down onto a hard bottom lip
- The turn is a real 3-D `rotateY(-180deg)` around the spine with front and back faces
- On a phone the book flattens into one scrolling column — an unscrollable book does not fit a phone screen

### Adding a page

A page is a `.leaf` inside a `<section class="spread">`. Copy a spread, change
what is inside, and it joins the magazine. `data-section` + `data-blurb` +
`data-ch` put it in the contents; `data-hide-toc` keeps it out.

## Publishing it

Static site, so anything works. Quickest is GitHub Pages:
**Settings → Pages → Deploy from a branch → `main` / root.**

To preview locally:

```bash
python3 -m http.server 8000   # Windows: py -m http.server 8000
# then open http://localhost:8000
```

Made with too much love and not enough sleep.
