# Renames whatever photos you have dropped into assets/img into the names the
# book expects, in the order Windows lists them.
#
# Run it from the project folder:
#     powershell -ExecutionPolicy Bypass -File tools\rename-photos.ps1
#
# Nothing is deleted. If a name is already taken the file is skipped, so you can
# run it again after adding more photos.

$names = @(
  'cover','hero','about','about-2','portrait','song','us','record',
  'strip-1','strip-2','strip-3','strip-4',
  'gallery-1','gallery-2','gallery-3','gallery-4',
  'gallery-5','gallery-6','gallery-7','gallery-8',
  'gallery-9','gallery-10','gallery-11','gallery-12','gallery-13','gallery-14','gallery-15','gallery-16',
  'gallery-17','gallery-18','gallery-19','gallery-20','gallery-21','gallery-22','gallery-23','gallery-24',
  'gallery-25','gallery-26','gallery-27','gallery-28','gallery-29','gallery-30','gallery-31','gallery-32',
  'gallery-33','gallery-34','gallery-35','gallery-36','gallery-37','gallery-38','gallery-39','gallery-40'
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
