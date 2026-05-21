param([switch]$WhatIf)

function Convert-CrToDecimal {
    param([string]$cr)
    switch ($cr.Trim()) {
        "1/8"  { return "0.125" }
        "1/4"  { return "0.25" }
        "1/2"  { return "0.5" }
        default { return $cr.Trim() }
    }
}

$root        = Resolve-Path "$PSScriptRoot\.."
$monstersDir = Join-Path $root "data\monsters"
$files       = Get-ChildItem "$monstersDir\*.md"
$updated     = 0
$skipped     = 0
$errors      = 0

foreach ($file in $files) {
    $lines = Get-Content $file.FullName -Encoding UTF8

    # Locate frontmatter bounds
    $fmStart = -1; $fmEnd = -1; $dashCount = 0
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^---') {
            $dashCount++
            if ($dashCount -eq 1) { $fmStart = $i }
            elseif ($dashCount -eq 2) { $fmEnd = $i; break }
        }
    }
    if ($fmEnd -lt 0) { $errors++; continue }

    # Check for existing cr/ tag
    $hasCrTag = $false
    $lastMonsterTagIdx = -1
    $inTags = $false

    for ($i = $fmStart; $i -le $fmEnd; $i++) {
        $l = $lines[$i]
        if ($l -match '^tags:') { $inTags = $true; continue }
        if ($inTags) {
            if ($l -match '^\s{2}-') {
                if ($l -match '\bcr/')      { $hasCrTag = $true }
                if ($l -match 'monster/')   { $lastMonsterTagIdx = $i }
            } else { $inTags = $false }
        }
    }

    if ($hasCrTag) { $skipped++; continue }

    # Extract challenge_rating
    $crRaw = $null
    for ($i = $fmStart; $i -le $fmEnd; $i++) {
        if ($lines[$i] -match '^challenge_rating:\s*"?([^"\r\n]+)"?') {
            $crRaw = $Matches[1].Trim()
            break
        }
    }
    if ($null -eq $crRaw) { $errors++; continue }
    if ($lastMonsterTagIdx -lt 0) { $errors++; continue }

    $crDecimal = Convert-CrToDecimal $crRaw
    $crTagLine = "  - cr/$crDecimal"

    $newLines = $lines[0..$lastMonsterTagIdx] + @($crTagLine) + $lines[($lastMonsterTagIdx + 1)..($lines.Count - 1)]

    if (-not $WhatIf) {
        Set-Content -Path $file.FullName -Value $newLines -Encoding UTF8
    }
    $updated++
}

Write-Host "Updated: $updated | Already tagged: $skipped | Errors: $errors"
