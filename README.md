# The Archive — a birthday book 📖

A printed keepsake book you read on screen: two facing pages bound at a centre
spine, and a page that swings across the spine in 3-D when you turn it. The
design is deliberately plain — one clean typeface, a straight grid, hairline
rules, generous white space — in soft muted tones, so the photographs carry it.

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

## The spreads

| Pages | Left | Right |
| --- | --- | --- |
| — | The closed board | **Cover** — masthead, portrait, the age, coverlines |
| 02–03 | **Contents** | **Editor's Letter** — drop cap, pull quote |
| 04–05 | **The Contributors** — first three | Contributors continued |
| 06–07 | **A Life in Chapters** | Full-page photo with a script caption |
| 08–09 | **The Unpublished Archive** — plates | Filmstrip, taped snapshot, more plates |
| 10–11 | **Moving Pictures** — film reels | Full-page photo with the **now-playing card** |
| 12–13 | **Letters to the Editor** | Pull quote and the write-in form |
| 14–15 | **The Soundtrack** — the chart | Sleeve art, side-A note |
| 16–17 | **The Last Word** — the cake | The message (after the candle) |
| 18–19 | **Colophon** | The end |

The old single-page URLs (`friends.html`, `cringe.html`, `final.html` …) still
work — they redirect to the right spread.

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
{ name: "Sarah J.", photo: "assets/img/sarah.jpg", ... }
```

The fixed photo slots are marked in `index.html` with the filename they expect
— the cover portrait (`cover.jpg`), the two full-page photos (`portrait.jpg`,
`song.jpg`), the taped snapshot (`us.jpg`) and the sleeve art (`record.jpg`).
Swap each placeholder `div` for an `<img class="plate__frame" src="…" alt="…">`
(for a full-page one, use `class="fill__photo"`).

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
- Soft warm paper `#f7f5f2`, soft charcoal text `#3f3c39` (never black), muted clay-rose accent `#a9847f`, hairline rules `#e2ded8`
- The book rests on a light `#eae6e1` surface rather than a dark desk, so the whole page stays soft
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
