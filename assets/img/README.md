# Photographs

The magazine is ten pages and uses **nine** photographs. Any that are missing
show a labelled slot rather than a broken image, so the book always reads
properly while you are still collecting them.

## The quick way

1. Save the photos into this folder — any names, any order.
2. From the project folder run:

       powershell -ExecutionPolicy Bypass -File tools\rename-photos.ps1

   (Mac or Linux: `bash tools/rename-photos.sh`)

3. Refresh the browser with Ctrl+F5.

## What goes where

| File | Page |
| --- | --- |
| `cover.jpg` | P.01 — the cover portrait |
| `lore.jpg` | P.03 — the field biography |
| `priya.jpg` | P.05 — Entry 01 |
| `sreehitha.jpg` | P.06 — Entry 02 |
| `bhavya.jpg` | P.07 — Entry 03 |
| `akshaya.jpg` | P.07 — Entry 04 |
| `sanjana.jpg` | P.08 — Entry 05 |
| `amma.jpg` | P.09 — Amma's letter |
| `nana.jpg` | P.09 — Nana's letter |

If a photo lands in the wrong slot, swap the two filenames.

Names come from `assets/js/config.js` — rename a bestie there and point
`photo:` at whatever file you like.

## Notes

The cover is portrait 3:4; dossier photographs are landscape 16:11; the squad
and family photographs are square. Anything larger than about 1600px on the
long edge is wasted weight.

iPhone `.HEIC` files cannot be shown by any browser, and renaming one to `.jpg`
does not convert it. In Windows Photos: open it, then **… → Save as → JPG**.
