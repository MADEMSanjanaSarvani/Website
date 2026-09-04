#!/usr/bin/env bash
# Mac/Linux version of tools/rename-photos.ps1
#     bash tools/rename-photos.sh
set -e
dir="$(cd "$(dirname "$0")/../assets/img" && pwd)"
names=(cover hero about about-2 portrait song us record
       strip-1 strip-2 strip-3 strip-4
       gallery-1 gallery-2 gallery-3 gallery-4
       gallery-5 gallery-6 gallery-7 gallery-8
       gallery-9 gallery-10 gallery-11 gallery-12 gallery-13 gallery-14 gallery-15 gallery-16 gallery-17 gallery-18 gallery-19 gallery-20 gallery-21 gallery-22 gallery-23 gallery-24 gallery-25 gallery-26 gallery-27 gallery-28 gallery-29 gallery-30 gallery-31 gallery-32 gallery-33 gallery-34 gallery-35 gallery-36 gallery-37 gallery-38 gallery-39 gallery-40)
i=0
shopt -s nullglob nocaseglob
for f in "$dir"/*.{jpg,jpeg,png,webp}; do
  base="$(basename "${f%.*}")"
  for n in "${names[@]}"; do [ "$base" = "$n" ] && continue 2; done
  while [ $i -lt ${#names[@]} ] && [ -e "$dir/${names[$i]}.jpg" ]; do i=$((i+1)); done
  [ $i -ge ${#names[@]} ] && { echo "All slots filled."; break; }
  mv "$f" "$dir/${names[$i]}.jpg"
  echo "$(basename "$f")  ->  ${names[$i]}.jpg"
  i=$((i+1))
done
echo; echo "Done. Refresh the page."
