# The Archive — a birthday magazine 📖

A one-issue magazine you read by turning the pages. Editorial layout — didone
masthead, hairline rules, drop caps, plate numbers, folios — on warm newsprint
cream with burgundy ink.

Plain HTML/CSS/JS. No build step, no dependencies. Open `index.html` and it runs.

## Reading it

The whole magazine is one page, `index.html`, made of eleven spreads. Turn with:

- the **‹ ›** arrows at the edges
- the **arrow keys** (`Home` / `End` jump to the cover and back cover)
- a **swipe** on a phone
- the **corner** at the bottom right
- the **Contents** button, or any line on the contents page

Each spread has its own address, so you can link straight to one:
`index.html#contributors`, `index.html#lastword`, and so on.

## The issue

| # | Spread | What it is |
| --- | --- | --- |
| 00 | Cover | Masthead, coverlines, the age, a countdown to the birthday |
| 01 | Contents | Every spread, with page numbers |
| 02 | Editor's Letter | The opening note, drop cap and all |
| 03 | The Contributors | Friends as a masthead — portraits, roles, filters, letters open in full |
| 04 | A Life in Chapters | The chronology, year by year |
| 05 | The Unpublished Archive | Photo essay of things that should have been deleted |
| 06 | Moving Pictures | Film strips — local video or YouTube |
| 07 | Letters to the Editor | Wishes, plus a form to write in |
| 08 | The Soundtrack | The tracklist, set as a chart |
| 09 | The Last Word | Dark spread — tap the cake, confetti, the message |
| 10 | Colophon | The back cover |

The old single-page URLs (`friends.html`, `cringe.html`, `final.html` …) still
work — they redirect to the right spread.

## Changing everything

**You only need to edit one file: `assets/js/config.js`.**

Name, age, birthday date, the issue number, coverlines, every friend, caption,
letter, wish and track, and the final message. Change the text between the
quotes and the magazine rebuilds itself. Add or delete items from any list.

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

The three fixed photo slots — the cover portrait, the editor's-letter portrait,
the sleeve art — are marked in `index.html` with the filename they expect
(`assets/img/cover.jpg`, `hero.jpg`, `record.jpg`); swap each placeholder `div`
for an `<img class="plate__frame" src="…" alt="…">`.

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

- **Bodoni Moda** for the masthead and headlines, **EB Garamond** for body copy, **Archivo** for kickers, captions and folios, **Caveat** for the odd margin note
- Newsprint cream `#f4f0e7`, near-black ink `#16110f`, burgundy `#570013`, with paper grain over everything
- The turn is a real 3-D `rotateY` with a sweeping shadow; it respects `prefers-reduced-motion` and falls back to an instant cut

Every colour is a CSS variable at the top of the file — change `--burgundy` and
the whole issue follows. `Ctrl/Cmd + P` prints it one spread per page.

## Publishing it

Static site, so anything works. Quickest is GitHub Pages:
**Settings → Pages → Deploy from a branch → `main` / root.**

To preview locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Made with too much love and not enough sleep.
