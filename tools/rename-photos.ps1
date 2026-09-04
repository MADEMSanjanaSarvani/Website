# Renames whatever photos you have dropped into assets/img into the names the
# book expects, in the order Windows lists them.
#
# Run it from the project folder:
#     powershell -ExecutionPolicy Bypass -File tools\rename-photos.ps1
#
# Nothing is deleted. If a name is already taken the file is skipped, so you can
# run it again after adding more photos.

$names = @(
  'cover','about',
  'friend-1','friend-2','friend-3','friend-4',
  'family-1','family-2','family-3','family-4',
  'gallery-1','gallery-2','gallery-3','gallery-4'
)

$dir = Join-Path $PSScriptRoot '..\assets\img'
$dir = (Resolve-Path $dir).Path

$heic = Get-ChildItem -Path $dir -File | Where-Object { $_.Extension -match '^\.(heic|heif)$' }
if ($heic.Count -gt 0) {
  Write-Host "Found $($heic.Count) HEIC photo(s). Browsers cannot show HEIC, and renaming"
  Write-Host "one to .jpg does not convert it. In Windows Photos: Open, then"
  Write-Host "... > Save as > JPG. Then run this again."
  Write-Host ""
}

$photos = Get-ChildItem -Path $dir -File |
          Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp)$' } |
          Where-Object { $names -notcontains $_.BaseName } |
          Sort-Object Name

if ($photos.Count -eq 0) {
  Write-Host "No unnamed photos found in assets\img."
  Write-Host "Save your photos there first, then run this again."
  exit
}

$i = 0
foreach ($p in $photos) {
  while ($i -lt $names.Count -and (Test-Path (Join-Path $dir ($names[$i] + '.jpg')))) { $i++ }
  if ($i -ge $names.Count) { Write-Host "All slots filled. $($p.Name) left as is."; break }

  $target = $names[$i] + '.jpg'
  Rename-Item -Path $p.FullName -NewName $target
  Write-Host "$($p.Name)  ->  $target"
  $i++
}

Write-Host ""
Write-Host "Done. Refresh the page in your browser."
Write-Host "If a photo landed in the wrong place, just swap the two filenames."
