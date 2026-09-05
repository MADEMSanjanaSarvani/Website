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

**No page ever scrolls, no page is split, and none is left half empty.** Each
spread is composed rather than poured: the page is laid out at its natural size
and then printed to whatever sheet the window gives it — reduced on a small
laptop, enlarged on a big monitor — so the line lengths, margins and
proportions stay the design's at every size.

A browser window is not a screen: a maximized 1366×768 laptop with tabs, an
address bar and a favourites bar leaves about 1366×600 of page. The book is
tested down to 1024×500 and up to 2560×1400, and the page count never changes
with the window. Turn with:

- the **‹ ›** arrows at the edges
- the **arrow keys** (`Home` / `End` jump to the ends)
- a **swipe** on a phone
- the **corner** at the bottom right
- the **Contents** button, or any line on the contents page

## The pages

| Spread | Left | Right |
| --- | --- | --- |
| 1 | **Cover** — masthead, portrait, barcode, Priceless | **Contents** and the editorial quote |
| 2 | **The Raveen Lore** — field biography | **The Report Card** — verified metrics |
| 3 | **The Archive** — the photograph album | *continued* |
| 4 … | **Best Friends Confidential** — one friend to a page | *and on, one per page* |
| last | **Pillars of Strength** — Amma & Nana | **The Finale** — tap the cake |

Every letter opens in full when you press *Read the letter*, so a single page
still holds all the words.

### The friends chapter is as long as the friendship list

Each friend gets a page of her own, and the chapter grows to fit: the magazine
copies its template spread as many times as `besties` in `config.js` needs.
Five friends make a twelve-page issue, seven make fourteen. Pages come in
facing pairs, so an odd number of friends leaves one page over — it becomes
the chapter's closing roll call rather than a blank.

### The Archive

A gallery spread: twelve photographs with a line under each, six to a page.
Add or remove entries in `gallery.photos` and the sheet re-lays itself. Each
photograph keeps its own proportions, so upright and sideways ones sit
together the way a contact sheet does.

A gallery is the one thing page-scaling cannot rescue: a grid takes its height
from the page's *width*, so shrinking the page shrinks nothing. Each
photograph is sized by its height instead — a share of the page — with the
width following its own shape.

The **Pages**, **Chapters** and **Besties** figures on the contents page are
counted by the magazine itself, so they cannot go stale. Verified from two friends to ten,
with no page under 59% full and none overflowing.

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
