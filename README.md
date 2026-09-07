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
**Twenty-Two Years**: the life collage given the whole page, uncropped, with a
note underneath. Both live in `pact` in `config.js`.

### The Archive

The photograph album, with a line under every picture. Each page is framed
like an album leaf — a ruled border with photo-corner brackets — and carries
its own plate numbers, so a sheet of photographs reads as a page rather than a
dump. The chapter is as long
as the album: add or remove entries in `gallery.photos` and the magazine makes
as many spreads as they need, sharing them out evenly so no page holds three
while its neighbour holds six. Each photograph keeps its own proportions, so
upright and sideways ones sit together the way a contact sheet does.

A gallery is the one thing page-scaling cannot rescue: a grid takes its height
from the page's *width*, so shrinking the page shrinks nothing. Each
photograph is sized by its height instead — a share of the page — with the
width following its own shape.

The **Pages**, **Chapters** and **Besties** figures on the contents page are
counted by the magazine itself, so they cannot go stale. Verified from two friends to ten,
with no page under 59% full and none overflowing.

## Putting a photograph in without touching files

Getting a photograph into `assets/img` — finding it, copying it, renaming it —
is the part that goes wrong. So the page can take one directly:

1. Press **Photos** (top right).
2. Click the picture you want to replace. Empty slots work too.
3. Choose the file.

It is scaled down and kept in your browser, so it survives a refresh **on that
computer only**. That is enough to see it and check the crop. For the magazine
to carry the photograph to anyone else the file still has to be committed, so
the bar at the bottom hands back a correctly named copy — save it, drop it into
`assets/img`, and commit.

When the magazine is finished, delete the `<button class="photobtn" …>` line in
`index.html` and the button is gone.

## Stickers

`stickers` in `config.js` pastes a cut-out onto a page. It goes *inside* the
page body, so it scales with everything else, and it is pinned to a corner, so
it fills space without pushing the writing about.

```js
{ src: "assets/img/sticker-1.png", on: "lore", side: "right",
  at: "bottom-right", size: 0.2, tilt: -7 }
```

`on` is the spread's id (`cover`, `lore`, `gallery`, `besties`, `family`),
`size` is a share of the page width, `tilt` is in degrees. A sticker whose file
is missing simply does not appear, so it is safe to list one before adding the
file. PNGs with transparent backgrounds look best.

## A design for each page

`pageStyles` in `config.js` gives a spread a look of its own:

```js
pageStyles: {
  gallery: "scrapbook"
}
```

The ids are `cover`, `lore`, `gallery`, `besties`, `family`. A generated spread
(`gallery-3`, `besties-2`) follows the one it was copied from, so a chapter
stays of a piece. Leave a spread out and it keeps the magazine's own
cream-and-pink look.

Three themes so far:

| Theme | What it looks like |
| --- | --- |
| `scrapbook` | photographs taped onto black card, handwritten captions |
| `beige` | a collage on tan paper, black frames, sweeping white arcs |
| `card` | a keepsake album, maroon mounts on warm ruled paper |

Each theme is one self-contained block in `magazine.css` under **Page
designs** — adding another is one block there and one line here. Nothing else
in the magazine is touched by any of them.

## Putting stickers where you want them

Press **Photos**, then **+ Sticker**, and choose the file. It lands on the
spread you are looking at and from there:

- **drag** it anywhere, including across to the facing page
- **wheel** over it to make it bigger or smaller
- **shift + wheel** to tilt it
- **double-click** to take it off

Position, size and tilt are held as shares of the page, so a sticker stays
where you put it whatever size the window is. They hang off the page rather
than sitting inside the writing, so adding one never shrinks the text. Kept in
this browser, like a chosen photograph.

`stickers` in `config.js` does the same thing permanently, for stickers that
should reach whoever opens the magazine.

## Adding a friend from the page

The last page of the friends chapter has **+ Add a friend**. Fill in her name,
her line and her letter and she gets a page of her own, in the chapter, like
everyone else — the chapter is as long as the list, so it simply grows.

She is kept in this browser, so she stays on that computer. **Copy for
config.js** hands back the lines to paste into the `besties` list to keep her
for good, and anyone added can be taken back out from the same form.

Her photograph slot will be empty at first: press **Photos**, click the empty
frame on her page, and choose the file.

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

## If a change does not show up

The stylesheet and scripts are loaded with a `?v=` tag on the end:

```html
<link rel="stylesheet" href="assets/css/magazine.css?v=12">
<script src="assets/js/config.js?v=12"></script>
<script src="assets/js/magazine.js?v=12"></script>
```

A browser caches by URL, so while that number stays the same it can keep
serving the copy it already has, however many times the file has changed
underneath. **Raise all three numbers whenever the CSS or JS changes**, and
refresh with **Ctrl+F5**. To check which version you are actually running:

```powershell
git log --oneline -1
```

## Publishing it

Static site, so anything works. Quickest is GitHub Pages:
**Settings → Pages → Deploy from a branch → `main` / root.**

To preview locally:

```bash
python3 -m http.server 8000   # Windows: py -m http.server 8000
# then open http://localhost:8000
```

Made with too much love and not enough sleep.
