# The Birthday Archive 🎀

A digital scrapbook birthday website — warm paper, burgundy ink, washi tape,
polaroids and handwriting. Plain HTML/CSS/JS, no build step, no dependencies.
Open `index.html` in a browser and it works.

## The pages

| Page | What it is |
| --- | --- |
| `index.html` | Home — hero, countdown to the birthday, the opening letter, table of contents |
| `friends.html` | The Friends Archive — polaroid cards, filter chips, a letter opens in a modal |
| `timeline.html` | Memory Lane — year-by-year story |
| `cringe.html` | The Cringe Archive — photos we should delete, plus cinematic memories |
| `videos.html` | The full film-strip reel |
| `wishes.html` | The Wishes Wall — pinned notes, and a form to add one |
| `playlist.html` | The Mixtape — songs that are "legally about her" |
| `final.html` | The Final Surprise — dark room, tap the cake, confetti, the message |

`friends`, `cringe` and `final` come from the original Stitch designs. `index`,
`timeline`, `videos`, `wishes` and `playlist` are new screens built in the same
aesthetic.

## Changing everything

**You only need to edit one file: `assets/js/config.js`.**

It holds the name, age, birthday date, every friend, every caption, the wishes,
the tracklist and the final message. Change the text between the quotes and the
pages rebuild themselves. Add or delete items from any list freely.

```js
name: "Sowgandhika",
age: 23,
birthday: "2026-11-14",   // the countdown on the home page uses this
```

Anywhere in the text, `{name}` is replaced with the birthday person's name.

### Adding photos

1. Drop your images into `assets/img/`.
2. Point at them in `config.js`:

```js
{ name: "Sarah J.", photo: "assets/img/sarah.jpg", ... }
```

Any photo left as `""` shows a soft placeholder instead, so nothing looks broken
while you collect them.

### Adding videos

Put clips in `assets/video/` and reference them, or paste a YouTube **embed**
link (`https://www.youtube.com/embed/XXXXXXXX`) — both play in the film strip.

```js
videos: [
  { title: "The interpretive dance era.", src: "assets/video/dance.mp4", poster: "assets/img/dance.jpg" }
]
```

### The wishes form

Wishes typed on `wishes.html` are saved in that visitor's own browser
(localStorage) — they aren't sent anywhere. Copy the ones you want to keep into
the `wishes` list in `config.js` so they show for everyone.

## Design

The look is defined in `assets/css/scrapbook.css`, built on the Digital
Scrapbook tokens from the original design spec:

- **Burgundy** `#570013` for ink and headings, **dusty rose** and **blush** for tape and accents, warm ivory `#fbf9f5` as the paper
- **Playfair Display** for statements, **Inter** for readable text, **Caveat** for anything handwritten, **Bricolage Grotesque** for small caps labels
- Film grain over the whole page, soft ambient shadows, and 1–3° rotations so cards feel scattered on a table

Every colour is a CSS variable at the top of the file — change `--primary` and
the whole site follows.

## Publishing it

It's a static site, so anything works. The quickest is GitHub Pages:
**Settings → Pages → Deploy from a branch → `main` / root.**

To preview locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Made with too much love and not enough sleep ♡
