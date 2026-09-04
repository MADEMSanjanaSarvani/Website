# The Archive — a birthday book 📖

A printed keepsake book you read on screen: two facing pages bound at a centre
spine, and a page that swings across the spine in 3-D when you turn it. The
design is plain by construction — one clean typeface, a straight grid, generous
white space — but every chapter is printed in its own colour, so the book runs
through pink, teal, orange, violet, blue, green and gold as you turn it.

Plain HTML/CSS/JS. No build step, no dependencies. Open `index.html` and it runs.

## Reading it

The whole book is one page, `index.html`, made of ten spreads — twenty pages,
left and right. Turn with:

- the **‹ ›** arrows at the edges
- the **arrow keys** (`Home` / `End` jump to the cover and back cover)
- a **swipe** on a phone
- the **corner** at the bottom right
- the **Contents** button, or any line on the contents page

Each spread has its own address, so you can link straight to one:
`index.html#contributors`, `index.html#lastword`, and so on.

## Ten pages

Five spreads, ten pages, and every page full. Nothing scrolls: a page holds
what it holds, and the book is short on purpose.

| Pages | Left | Right |
| --- | --- | --- |
| — | The closed board | **Cover** — masthead, portrait, the age |
| 02–03 | **Contents** and the dedication | **About You** — portrait, the piece, the facts |
| 04–05 | **Friends** — two of them | Two more, and a pull quote |
| 06–07 | **Family** — two of them | Notes from everyone else |
| 08–09 | **Life** — four photographs | **The last word** — tap the cake |

The contents page lists the four chapters and nothing else.

Every letter opens in full when you click *Read the letter*, so a short book
still holds all the words.

### Making it longer

Each page is a `<section class="spread">` with a left and a right `.leaf` —
copy one, change what is inside, and it joins the book. Give it a
`data-section` and `data-blurb` to appear in the contents, or `data-hide-toc`
to stay out of it. Anything that will not fit on a page is carried onto a
continuation page automatically.

## Changing everything

**You only need to edit one file: `assets/js/config.js`.**

Name, age, birthday date, the issue number, coverlines, every friend, caption,
letter, wish and track, and the final message. Change the text between the
quotes and the book rebuilds itself. Add or delete items from any list.

```js
magazineName: "The Archive",
issueLine:    "Issue No. 23",
name:         "Sowgandhika",
age:          23,
birthday:     "2026-11-14",   // drives the "on sale in N days" line on the cover
```

Anywhere in the text, `{name}` is replaced with the birthday person's name.

### Adding photos

1. Drop your images into `assets/img/`.
2. Point at them in `config.js`:

```js
{ name: "Sarah J.", photo: "assets/img/sarah.jpg", ... }   // friends
{ name: "Amma",     photo: "assets/img/amma.jpg",  ... }   // family
```

Every empty slot on the page names the file it is waiting for. The full list:

| File | Where it goes | Shape |
| --- | --- | --- |
| `cover.jpg` | The cover | portrait, 3:4 |
| `hero.jpg` | Editor's letter | landscape, 16:10 |
| `about.jpg` | About You, main portrait | landscape, 16:10 |
| `about-2.jpg` | About You, facts page | square |
| `then.jpg` | Life, the oldest photo | wide panorama, 21:9 |
| `portrait.jpg` | Life, full-page right | fills the page |
| `us.jpg` | Life, the taped snapshot | landscape, 16:10 |
| `song.jpg` | Life on film, full-page right | fills the page |
| `record.jpg` | Sleeve art | square |
| `song-art.jpg` | The now-playing card | square |

Photos in `index.html` are placeholder `div`s — swap each for
`<img class="plate__frame" src="assets/img/hero.jpg" alt="">`, or for a
full-page one `<img class="fill__photo" src="assets/img/portrait.jpg" alt="">`.

Friends, family and the filmstrip are just filenames in `config.js` — no HTML
needed.

The filmstrip down the photo-essay page and the song card are both in
`config.js`:

```js
filmstrip: ["assets/img/f1.jpg", "assets/img/f2.jpg", "", ""],
nowPlaying: {
  title: "Stuck with you",     // set in the handwriting font
  sub:   "my love all mine...",
  art:   "assets/img/song-art.jpg",
  link:  "https://open.spotify.com/track/…"
}
```

Any photo left as `""` shows a plate placeholder, so nothing looks broken while
you're still collecting them.

### Adding videos

Put clips in `assets/video/` and reference them, or paste a YouTube **embed**
link (`https://www.youtube.com/embed/XXXXXXXX`):

```js
videos: [
  { title: "The interpretive dance era.", src: "assets/video/dance.mp4", poster: "assets/img/dance.jpg" }
]
```

### Letters to the editor

Notes written on the page save to that visitor's own browser (localStorage) —
they aren't sent anywhere. Copy the ones worth keeping into the `wishes` list in
`config.js` so they print for everyone.

## Design

Defined in `assets/css/magazine.css`:

- **Inter** throughout — headings at 500, body at 400. No display serif, no handwriting, no drop caps, no ornament
- Soft charcoal text `#3f3c39` — never black — on coloured paper
- **Each spread carries its own hue.** Three variables per chapter: `--accent` (the ink), `--accent-soft` (the paper) and `--accent-tint` (the photo blocks). They live together in one table in section 26 of the stylesheet:

```css
#contents    { --accent: #2e9d9a; --accent-soft: #ecf7f6; --accent-tint: #cfe9e7; }
#contributors{ --accent: #ef8a3c; --accent-soft: #fdf3ea; --accent-tint: #fadfc6; }
```

  Change one row and that whole spread — headings, rules, page numbers, buttons, chips, photo slots — changes with it. The closing pages invert the idea: deep plum and deep teal paper with gold ink.
- The turn is a real 3-D `rotateY(-180deg)` around the spine, with front and back faces and a shadow raking across the leaf as it lifts
- On a phone the book flattens into one scrolling column — left page then right page — and the turn becomes an instant cut. Same for anyone with `prefers-reduced-motion` on

Every colour is a CSS variable at the top of the file — change `--burgundy` and
the whole book follows.

## Publishing it

Static site, so anything works. Quickest is GitHub Pages:
**Settings → Pages → Deploy from a branch → `main` / root.**

To preview locally:

```bash
python3 -m http.server 8000   # Windows: py -m http.server 8000
# then open http://localhost:8000
```

Made with too much love and not enough sleep.
