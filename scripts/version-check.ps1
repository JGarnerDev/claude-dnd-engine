# version-check.ps1 -- flag engine changes since the last version bump
# consumers: CLAUDE.md, meta/versioning.md -- update these if usage, flags, or output format change.
# Usage: .\scripts\version-check.ps1
#
# Reads root VERSION, finds the last commit that touched it (the bump commit),
# then lists engine-path commits since. Non-blocking advisory, same spirit as
# the semantic-index staleness check. Bump rules live in meta/versioning.md.

$root = Resolve-Path "$PSScriptRoot\.."
Set-Location $root

# Engine paths the version is meant to track. Routine content (data/historian/
# scheduler) is below the bump bar and deliberately excluded.
$enginePaths = @(
    '.claude/commands',
    'scripts',
    'meta',
    'app',
    'CLAUDE.md',
    'README.md'
)

$versionFile = Join-Path $root 'VERSION'
if (-not (Test-Path $versionFile)) {
    Write-Host "VERSION file missing -- versioning not initialized. See meta/versioning.md." -ForegroundColor Yellow
    return
}
$version = (Get-Content $versionFile -Raw).Trim()
Write-Host "`nEngine version: $version" -ForegroundColor Cyan

# Last commit that touched VERSION = the last bump.
$bumpRaw = & git log -1 --format=%H -- VERSION 2>$null
$bumpSha = if ($bumpRaw) { "$bumpRaw".Trim() } else { $null }
if (-not $bumpSha) {
    Write-Host "  VERSION not yet committed -- commit the bump so staleness can be tracked." -ForegroundColor Yellow
    return
}
$bumpShort = $bumpSha.Substring(0, [Math]::Min(7, $bumpSha.Length))
$dateRaw = & git log -1 --format=%ci $bumpSha 2>$null
$bumpDate = if ($dateRaw) { "$dateRaw".Trim() } else { "unknown" }
Write-Host "  Last bump: $bumpShort ($bumpDate)" -ForegroundColor DarkGray

# Engine commits since the bump.
$changes = & git log --oneline "$bumpSha..HEAD" -- $enginePaths 2>$null
if ($changes) {
    $count = ($changes | Measure-Object).Count
    Write-Host "`n  Engine changed in $count commit(s) since last bump -- decide whether this clears the bump bar:" -ForegroundColor Yellow
    foreach ($line in $changes) { Write-Host "    $line" -ForegroundColor Gray }
    Write-Host "`n  If yes: edit VERSION + prepend CHANGELOG.md (see meta/versioning.md)." -ForegroundColor DarkGray
} else {
    Write-Host "  No engine changes since last bump -- version is current." -ForegroundColor Green
}
Write-Host ""
