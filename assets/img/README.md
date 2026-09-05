# Photographs

One photograph per slot. Any that are missing show a labelled slot rather than
a broken image, so the book always reads properly while you are still
collecting them.

The exact list depends on how many friends are in `assets/js/config.js` — the
rename script below reads it from there, so it is always right.

## The quick way

1. Save the photos into this folder — any names, any order.
2. From the project folder run:

       powershell -ExecutionPolicy Bypass -File tools\rename-photos.ps1

   (Mac or Linux: `bash tools/rename-photos.sh`)

3. Refresh the browser with Ctrl+F5.

## What goes where

Photographs are matched in reading order:

| File | Page |
| --- | --- |
| `cover.jpg` | P.01 — the cover portrait |
| `lore.jpg` | P.03 — the field biography |
| one per friend | P.05 onwards — the dossiers, in config order |
| `amma.jpg` | Amma's letter |
| `nana.jpg` | Nana's letter |

Run the script with no photos in the folder and it prints the full list it
wants for your current config.

If a photo lands in the wrong slot, swap the two filenames.

Names come from `assets/js/config.js` — rename a friend there and point
`photo:` at whatever file you like.

## How many friends

Each friend gets a page of her own, and the chapter grows to fit the list in
`config.js` — so one photograph per friend, plus the cover, the biography and
the two family portraits.

## Notes

The cover is portrait 3:4 and a friend's dossier photograph is a deep 2:3
portrait — both are shaped for a phone held upright, which is how these
photographs actually arrive. The family photographs are square. Nothing is
stretched: a photograph crops into its frame from the upper part, so faces
near the top survive. Anything larger than about 1600px on the
long edge is wasted weight.

iPhone `.HEIC` files cannot be shown by any browser, and renaming one to `.jpg`
does not convert it. In Windows Photos: open it, then **… → Save as → JPG**.
