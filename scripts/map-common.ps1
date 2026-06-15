# map-common.ps1 -- shared helpers for map scripts.
# consumers: scripts/map-crop.ps1, scripts/count-markers.ps1 (dot-sourced).
# Map masters and tiles are NOT committed -- masters are fetched from the CDN and
# tiles are generated locally. Scripts that need a master must guard for its
# presence and tell the user how to produce it.

function Require-Master {
    param([Parameter(Mandatory)][string]$Path)
    if (-not (Test-Path $Path)) {
        Write-Error @"
Master image not found: $Path
Map masters are not committed -- fetch them first, then regenerate tiles:
  .\scripts\fetch-maps.ps1
  python scripts\gen-tiles.py
"@
        exit 1
    }
}
