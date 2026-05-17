# location-entities.ps1 — find all historian entities at or near a location
# Searches location:, region:, and relates_to: frontmatter fields
# Usage: .\scripts\location-entities.ps1 -Location "Barovia Village"

param(
    [Parameter(Mandatory)]
    [string]$Location
)

$root = Resolve-Path "$PSScriptRoot\.."
$histDir = "$root\historian"

function Get-Frontmatter($path) {
    $lines = Get-Content $path -Raw -Encoding UTF8
    if ($lines -notmatch '(?s)^---\r?\n(.+?)\r?\n---') { return @{} }
    $block = $Matches[1]
    $fm = @{}
    $currentKey = $null
    foreach ($line in ($block -split "`n")) {
        $line = $line.TrimEnd("`r")
        if ($line -match '^(\w[\w_]*):\s*\[\[([^\]]+)\]\]') {
            $currentKey = $Matches[1].Trim()
            $fm[$currentKey] = $Matches[2].Trim()
        } elseif ($line -match '^(\w[\w_]*):\s*"?([^"#\r\n]*)"?\s*$') {
            $currentKey = $Matches[1].Trim()
            $fm[$currentKey] = $Matches[2].Trim()
        } elseif ($line -match '^\s+-\s+\[\[([^\]]+)\]\]') {
            if (-not $fm.ContainsKey("_list_$currentKey")) { $fm["_list_$currentKey"] = @() }
            $fm["_list_$currentKey"] += $Matches[1].Trim()
        } elseif ($line -match '^\s+-\s+"?([^"#\r\n]+)"?\s*$') {
            if ($currentKey -and -not $fm.ContainsKey("_list_$currentKey")) { $fm["_list_$currentKey"] = @() }
            if ($currentKey) { $fm["_list_$currentKey"] += $Matches[1].Trim() }
        }
    }
    return $fm
}

function Matches-Location($fm, $loc) {
    $locLower = $loc.ToLower()
    # Direct location/region fields
    foreach ($key in @('location', 'region')) {
        if ($fm[$key] -and $fm[$key].ToLower() -like "*$locLower*") { return $true }
    }
    # List fields: locations:, relates_to:
    foreach ($key in @('_list_locations', '_list_relates_to')) {
        if ($fm[$key]) {
            foreach ($item in $fm[$key]) {
                if ($item.ToLower() -like "*$locLower*") { return $true }
            }
        }
    }
    return $false
}

$allFiles = Get-ChildItem $histDir -Recurse -Filter "*.md"
$results = @()

foreach ($file in $allFiles) {
    $fm = Get-Frontmatter $file.FullName
    if (-not (Matches-Location $fm $Location)) { continue }
    $relPath = $file.FullName.Replace($root.Path + "\", "")
    $results += [PSCustomObject]@{
        Name       = $fm['name']
        Type       = $fm['type']
        Subtype    = $fm['subtype']
        State      = $fm['state']
        Exists     = $fm['exists']
        Importance = $fm['importance']
        Desc       = $fm['description']
        File       = $relPath
    }
}

if ($results.Count -eq 0) {
    Write-Host "No historian entities found referencing '$Location'." -ForegroundColor Yellow
    Write-Host "Try a partial name (e.g. 'Barovia' instead of 'Barovia Village')." -ForegroundColor DarkGray
    exit
}

Write-Host "`n=== Entities at/near: $Location ($($results.Count)) ===" -ForegroundColor Cyan

$grouped = $results | Group-Object Type | Sort-Object Name
foreach ($group in $grouped) {
    Write-Host "`n  [$($group.Name)]" -ForegroundColor Yellow
    foreach ($r in ($group.Group | Sort-Object Importance, Name)) {
        $sub = if ($r.Subtype) { "/$($r.Subtype)" } else { "" }
        $existsColor = if ($r.Exists -eq 'true') { 'Green' } else { 'DarkYellow' }
        Write-Host ("    {0}{1} - {2}" -f $r.Name, $sub, $r.State) -ForegroundColor $existsColor
        if ($r.Desc) { Write-Host "      $($r.Desc)" -ForegroundColor DarkGray }
    }
}

Write-Host ""
