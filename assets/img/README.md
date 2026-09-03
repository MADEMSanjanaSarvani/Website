# Photographs

Save the birthday girl's photos into this folder with these exact names.
Every slot in the book already points at them, and any file that is missing
shows a labelled placeholder instead of a broken image.

## The named slots

| File | Where it appears |
| --- | --- |
| `cover.jpg`    | The cover portrait |
| `hero.jpg`     | Editor's letter, beside the pull quote |
| `about.jpg`    | About You, beside the piece about her |
| `about-2.jpg`  | About You, under the facts |
| `portrait.jpg` | Life — the full-page photo |
| `song.jpg`     | Life on film — full page, behind the song card |
| `us.jpg`       | Life — the snapshot beside the filmstrip |
| `record.jpg`   | The soundtrack sleeve |

## The filmstrip (down the photographs page)

`strip-1.jpg` `strip-2.jpg` `strip-3.jpg` `strip-4.jpg`

## The gallery spread

`gallery-1.jpg` … `gallery-8.jpg`

Add more by adding lines to `gallery` in `assets/js/config.js` — the spread
lays out however many it is given.

## Notes

All the frames are portrait, so phone photos fit without being cropped through
the face. Photographs are used at up to about 900px wide, so anything larger
than ~1600px on the long edge is wasted weight — resize before committing if
you want the repo to stay small.

Friends' and family's photos are not listed here: those are filenames in
`config.js`, next to each person.
