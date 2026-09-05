#!/usr/bin/env bash
# Renames whatever photos you have dropped into assets/img into the names the
# book expects, in alphabetical order.
#
#     bash tools/rename-photos.sh
#
# The list of slots is read from assets/js/config.js, so however many friends
# the magazine has, this follows. Nothing is deleted, and a name that is already
# taken is skipped, so you can run it again after adding more photos.
set -euo pipefail

dir="$(cd "$(dirname "$0")/../assets/img" && pwd)"
config="$dir/../js/config.js"

[ -f "$config" ] || { echo "Could not find assets/js/config.js."; exit 1; }

# every assets/img/<name>.jpg the config asks for, in reading order
mapfile -t names < <(grep -o 'assets/img/[A-Za-z0-9_-]*\.jpg' "$config" |
                     sed 's|assets/img/||; s|\.jpg$||' | awk '!seen[$0]++')

[ "${#names[@]}" -gt 0 ] || { echo "config.js does not name any photographs."; exit 0; }
echo "The magazine is asking for ${#names[@]} photograph(s)."
echo

if ls "$dir"/*.[hH][eE][iI][cC] >/dev/null 2>&1; then
  echo "Found HEIC photo(s). Browsers cannot show HEIC, and renaming one to .jpg"
  echo "does not convert it. Convert them first, then run this again."
  echo
fi

i=0
shopt -s nullglob nocaseglob
for photo in "$dir"/*.jpg "$dir"/*.jpeg "$dir"/*.png "$dir"/*.webp; do
  base="$(basename "${photo%.*}")"
  # already sitting in a slot
  for n in "${names[@]}"; do [ "$base" = "$n" ] && continue 2; done

  while [ "$i" -lt "${#names[@]}" ] && [ -f "$dir/${names[$i]}.jpg" ]; do i=$((i+1)); done
  if [ "$i" -ge "${#names[@]}" ]; then echo "All slots filled. $(basename "$photo") left as is."; break; fi

  mv "$photo" "$dir/${names[$i]}.jpg"
  echo "$(basename "$photo")  ->  ${names[$i]}.jpg"
  i=$((i+1))
done

missing=()
for n in "${names[@]}"; do [ -f "$dir/$n.jpg" ] || missing+=("$n"); done
echo
if [ "${#missing[@]}" -gt 0 ]; then
  echo "Still waiting on: ${missing[*]}"
else
  echo "Every slot is filled."
fi
echo "Refresh the page with Ctrl+F5."
