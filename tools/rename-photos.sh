#!/usr/bin/env bash
# Mac/Linux version of tools/rename-photos.ps1
#     bash tools/rename-photos.sh
set -e
dir="$(cd "$(dirname "$0")/../assets/img" && pwd)"
names=(cover about
       friend-1 friend-2 friend-3 friend-4
       family-1 family-2 family-3 family-4
       gallery-1 gallery-2 gallery-3 gallery-4)
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
