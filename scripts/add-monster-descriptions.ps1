# add-monster-descriptions.ps1 -- generate monster descriptions via claude CLI
# Skips files where description is already filled.
# Usage: .\scripts\add-monster-descriptions.ps1 [-Filter <name>] [-Count <n>] [-DryRun]

param(
    [string]$Filter = "",
    [int]$Count     = 0,
    [switch]$DryRun
)

$root  = Resolve-Path "$PSScriptRoot\..\data\monsters"
$files = Get-ChildItem $root -Filter "*.md" | Sort-Object Name
if ($Filter) { $files = $files | Where-Object { $_.BaseName -ilike "*$Filter*" } }

$queue = [System.Collections.Generic.List[object]]::new()
foreach ($file in $files) {
    $c = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($c -match 'description:\s*"[^"]+"') { continue }
    $queue.Add($file)
}
if ($Count -gt 0) { $queue = $queue | Select-Object -First $Count }

Write-Host "Queue: $($queue.Count) monsters" -ForegroundColor Cyan
if ($DryRun) { $queue | ForEach-Object { Write-Host "  $($_.BaseName)" -ForegroundColor DarkGray }; exit }

function Get-FM($content, $key) {
    if ($content -match "(?m)^$([regex]::Escape($key))\s*:\s*`"?([^`"\r\n]*)`"?\s*`$") { return $Matches[1].Trim() }
    return ""
}

function Get-Habitats($content) {
    if ($content -notmatch "(?s)habitats:\r?\n((?:\s+-[^\r\n]+\r?\n?)+)") { return "" }
    return ($Matches[1] -split "`r?\n" |
        Where-Object { $_ -match '^\s+-\s+"?\[\[(.+?)\]\]"?' } |
        ForEach-Object { $Matches[1] }) -join ", "
}

$hits = 0; $errors = 0

foreach ($file in $queue) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    $name   = Get-FM $content "name"
    $crType = Get-FM $content "creature_type"
    $cr     = Get-FM $content "challenge_rating"
    $size   = Get-FM $content "size"
    $align  = Get-FM $content "alignment"
    $habs   = Get-Habitats $content

    $prompt = @"
Generate D&D 5e flavor text for this monster. Campaign tone: dark, politically complex, gritty, ancient mystery. Small people facing a vast indifferent world.

Monster: $name
Type: $crType | CR: $cr | Size: $size | Alignment: $align
Habitats: $habs

Return JSON only, no markdown fences:
{
  "summary": "one sentence - the sharpest most distinctive thing about this creature",
  "flavor": "2-3 paragraphs - physical description, behavior and ecology, what makes encountering one dangerous or memorable. No game mechanics. No ability scores."
}
"@

    try {
        $raw = ($prompt | claude --print 2>&1) -join "`n"
    } catch {
        Write-Host "  CLI ERROR  $name" -ForegroundColor Red
        $errors++
        continue
    }

    # Strip accidental markdown fences
    $raw = $raw -replace '(?s)^```json\s*', '' -replace '(?s)^```\s*', '' -replace '```\s*$', ''
    $raw = $raw.Trim()

    try {
        $parsed  = $raw | ConvertFrom-Json
        $summary = ($parsed.summary -replace '"', "'").Trim()
        $flavor  = $parsed.flavor.Trim()
    } catch {
        Write-Host "  PARSE ERROR  $name" -ForegroundColor Red
        Write-Host "  $($raw.Substring(0, [Math]::Min(200, $raw.Length)))" -ForegroundColor DarkGray
        $errors++
        continue
    }

    # Patch frontmatter description
    $newContent = $content -replace '(?m)^description:\s*""', "description: `"$summary`""

    # Insert flavor into body after habitats line (literal replace - safe for $ chars in flavor)
    if ($newContent -match '(?m)^(\*\*Habitats:\*\*[^\r\n]*)') {
        $habLine    = $Matches[1]
        $newContent = $newContent.Replace($habLine, "$habLine`n`n$flavor")
    } else {
        $newContent = $newContent.TrimEnd() + "`n`n$flavor`n"
    }

    Set-Content $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
    Write-Host "  OK  $name" -ForegroundColor Green
    $hits++
}

Write-Host ""
Write-Host "Done. Generated: $hits  |  Errors: $errors" -ForegroundColor Yellow
