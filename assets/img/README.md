# Photographs

**The book shows placeholders until real files exist in this folder.** That is
what the labelled coloured blocks are — each one names the file it is waiting
for. Nothing is broken; the photographs simply are not here yet.

## The quick way

1. Save the photos into this folder (any names, any order).
2. From the project folder run:

       powershell -ExecutionPolicy Bypass -File tools\rename-photos.ps1

   (Mac or Linux: `bash tools/rename-photos.sh`)

3. Refresh the browser.

The script renames whatever it finds into the names below, in order. If a photo
lands in the wrong place, swap the two filenames — nothing else needs changing.

## Or name them by hand
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
