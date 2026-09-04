#!/usr/bin/env bash
# Mac/Linux version of tools/rename-photos.ps1
#     bash tools/rename-photos.sh
set -e
dir="$(cd "$(dirname "$0")/../assets/img" && pwd)"
names=(cover lore
       priya sreehitha bhavya akshaya sanjana
       amma nana)
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
