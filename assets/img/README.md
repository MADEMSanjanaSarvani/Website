# Photographs

The book is ten pages and uses **fourteen** photographs. Any that are missing
show a labelled placeholder rather than a broken image, so it always reads
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
| `cover.jpg` | The cover |
| `about.jpg` | About You, beside the piece about her |
| `friend-1` … `friend-4` | One per friend, Friends spread |
| `family-1` … `family-4` | One per family member, Family spread |
| `gallery-1` … `gallery-4` | The Life page |

If a photo lands in the wrong slot, swap the two filenames — nothing else needs
changing.

## Notes

Frames are square or portrait, so phone photos fit without being cropped
through the face. Anything larger than about 1600px on the long edge is wasted
weight — resize before committing if you want the repo to stay small.

iPhone `.HEIC` files cannot be shown by any browser, and renaming one to `.jpg`
does not convert it. In Windows Photos: open it, then **… → Save as → JPG**.
