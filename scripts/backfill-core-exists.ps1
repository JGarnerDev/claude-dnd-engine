# backfill-core-exists.ps1 -- one-time migration: mark core D&D material `exists: true`.
#
# `exists` means "is this a real, canon thing in the world" -- NOT "lives in historian".
# Core rulebook material (reference catalogs + published items) is real, so it is `exists: true`
# even while sitting in data/ as the reusable reference pool. Homebrew creative-pool entities
# stay `exists: false` until canonized into historian.
#
# Core set = reference-catalog folders (monsters/spells/deities/feats/races/classes/backgrounds/
# skills) + official magic items (data/items/magic). Files carrying `contributed_by` are
# player homebrew and are skipped.
#
# Usage:
#   .\scripts\backfill-core-exists.ps1            # dry run -- report only, no writes
#   .\scripts\backfill-core-exists.ps1 -Apply     # write changes

param([switch]$Apply)

$data = (Resolve-Path (Join-Path $PSScriptRoot "..\data")).Path
$coreDirs = 'monsters', 'spells', 'deities', 'feats', 'races', 'classes', 'backgrounds', 'skills'

$targets = @()
foreach ($d in $coreDirs) {
    $p = Join-Path $data $d
    if (Test-Path $p) { $targets += Get-ChildItem $p -Recurse -Filter *.md -File }
}
$magic = Join-Path $data 'items\magic'
if (Test-Path $magic) { $targets += Get-ChildItem $magic -Filter *.md -File }

$flipped = 0; $inserted = 0; $skipped = 0; $already = 0

foreach ($f in $targets) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $hasBom = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    if ($hasBom) { $text = $text.TrimStart([char]0xFEFF) }

    # Only touch the frontmatter block.
    if ($text -notmatch '(?s)^(---\r?\n)(.*?)(\r?\n---)') { $skipped++; continue }
    $head = $Matches[1]; $fmBlock = $Matches[2]; $foot = $Matches[3]
    $rest = $text.Substring($Matches[0].Length)

    if ($fmBlock -match '(?m)^contributed_by:') { $skipped++; continue }   # homebrew, leave alone

    # [^\r\n] keeps `.` from swallowing CR; the captured newline is reused so the file's
    # existing CRLF/LF style is preserved exactly (core.autocrlf=true makes most files CRLF).
    $newFm = $fmBlock
    if ($fmBlock -match '(?m)^exists:[ \t]*([^\r\n]*)') {
        if ($Matches[1].Trim() -eq 'true') { $already++; continue }
        $newFm = $fmBlock -replace '(?m)^exists:[^\r\n]*', 'exists: true'
        $flipped++
    }
    elseif ($fmBlock -match '(?m)^type:[^\r\n]*\r?\n') {
        $newFm = $fmBlock -replace '(?m)^(type:[^\r\n]*)(\r?\n)', '${1}${2}exists: true${2}'
        $inserted++
    }
    else {
        $skipped++; continue   # no type line to anchor against
    }

    if ($Apply) {
        $out = $head + $newFm + $foot + $rest
        $enc = New-Object System.Text.UTF8Encoding($hasBom)
        [System.IO.File]::WriteAllText($f.FullName, $out, $enc)
    }
}

$verb = if ($Apply) { "APPLIED" } else { "DRY RUN (no writes)" }
Write-Host "`n$verb" -ForegroundColor Cyan
Write-Host "  Files scanned:        $($targets.Count)"
Write-Host "  Flipped false->true:  $flipped" -ForegroundColor Green
Write-Host "  Inserted exists:true: $inserted" -ForegroundColor Green
Write-Host "  Already true:         $already"
Write-Host "  Skipped (homebrew/no-anchor): $skipped"
if (-not $Apply) { Write-Host "`nRe-run with -Apply to write." -ForegroundColor Yellow }
