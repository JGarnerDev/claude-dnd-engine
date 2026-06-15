# consumers: CLAUDE.md, maps/CLAUDE.md -- update these if usage, flags, or output format change.
#
# Download map images from the Inkarnate CDN listed in maps/sources.tsv.
# Map images are gitignored (large binaries); this pulls them on demand after a clone.
# Usage:
#   .\scripts\fetch-maps.ps1            # fetch any missing map images
#   .\scripts\fetch-maps.ps1 -Force     # re-download even if the file already exists
#   .\scripts\fetch-maps.ps1 -List      # show manifest entries and local presence, fetch nothing

param(
    [switch]$Force,
    [switch]$List
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$manifest = Join-Path $repoRoot 'maps\sources.tsv'

if (-not (Test-Path $manifest)) {
    Write-Error "Manifest not found: $manifest"
    exit 1
}

$entries = Get-Content $manifest |
    Where-Object { $_.Trim() -ne '' -and -not $_.TrimStart().StartsWith('#') } |
    ForEach-Object {
        $parts = $_ -split "`t", 2
        if ($parts.Count -ne 2) {
            Write-Warning "Skipping malformed line (need path<TAB>url): $_"
            return
        }
        [pscustomobject]@{ Path = $parts[0].Trim(); Url = $parts[1].Trim() }
    }

if (-not $entries) {
    Write-Host "No map entries in manifest."
    exit 0
}

$fetched = 0; $skipped = 0; $failed = 0
foreach ($e in $entries) {
    $dest = Join-Path $repoRoot $e.Path
    $exists = Test-Path $dest

    if ($List) {
        $mark = if ($exists) { 'present' } else { 'missing' }
        Write-Host ("[{0,-7}] {1}" -f $mark, $e.Path)
        continue
    }

    if ($exists -and -not $Force) {
        Write-Host "skip   $($e.Path) (already present; -Force to re-download)"
        $skipped++
        continue
    }

    $dir = Split-Path -Parent $dest
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

    try {
        # -PassThru gives us the response (status + headers) while the body streams to disk.
        $resp = Invoke-WebRequest -Uri $e.Url -OutFile $dest -UseBasicParsing -PassThru

        # Integrity guards: a 200 can still carry an error page (e.g. S3 AccessDenied XML)
        # or a truncated body. Reject anything that isn't a real image so the pipeline never
        # silently tiles garbage. CDN urls are revocable/presigned and do go stale.
        $ctype = "$($resp.Headers['Content-Type'])"
        $size  = (Get-Item $dest).Length
        if ($ctype -and $ctype -notmatch '^image/') {
            Remove-Item $dest -Force -ErrorAction SilentlyContinue
            Write-Warning "REJECT $($e.Path): server returned '$ctype', not an image (url stale/revoked?). Re-export in Inkarnate and update maps/sources.tsv."
            $failed++
            continue
        }
        if ($size -lt 51200) {   # < 50 KB: too small to be a real map export
            Remove-Item $dest -Force -ErrorAction SilentlyContinue
            Write-Warning "REJECT $($e.Path): only ${size} bytes -- likely an error page, not the map. Check the url in maps/sources.tsv."
            $failed++
            continue
        }

        $mb = [math]::Round($size / 1MB, 1)
        Write-Host "fetch  $($e.Path) (${mb} MB)"
        $fetched++
    } catch {
        Write-Warning "FAILED $($e.Path): $($_.Exception.Message)"
        $failed++
    }
}

if (-not $List) {
    Write-Host ""
    Write-Host "Done. fetched=$fetched skipped=$skipped failed=$failed"
    if ($failed -gt 0) { exit 1 }
}
