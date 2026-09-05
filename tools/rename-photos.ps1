# Renames whatever photos you have dropped into assets/img into the names the
# book expects, in the order Windows lists them.
#
# Run it from the project folder:
#     powershell -ExecutionPolicy Bypass -File tools\rename-photos.ps1
#
# The list of slots is read from assets/js/config.js, so however many friends
# the magazine has, this follows. Nothing is deleted, and a name that is already
# taken is skipped, so you can run it again after adding more photos.

$dir = (Resolve-Path (Join-Path $PSScriptRoot '..\assets\img')).Path
$configPath = Join-Path $dir '..\js\config.js'

if (-not (Test-Path $configPath)) {
  Write-Host "Could not find assets\js\config.js. Run this from the project folder."
  exit 1
}

# every assets/img/<name>.jpg the config asks for, in reading order
$config = Get-Content $configPath -Raw
$names = [regex]::Matches($config, 'assets/img/([A-Za-z0-9_-]+)\.jpg') |
         ForEach-Object { $_.Groups[1].Value } |
         Select-Object -Unique

if ($names.Count -eq 0) {
  Write-Host "config.js does not name any photographs. Nothing to do."
  exit
}

Write-Host "The magazine is asking for $($names.Count) photograph(s)."
Write-Host ""

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

$missing = $names | Where-Object { -not (Test-Path (Join-Path $dir ($_ + '.jpg'))) }
Write-Host ""
if ($missing.Count -gt 0) {
  Write-Host "Still waiting on: $($missing -join ', ')"
} else {
  Write-Host "Every slot is filled."
}
Write-Host "Refresh the page with Ctrl+F5."
Write-Host "If a photo landed in the wrong place, just swap the two filenames."
