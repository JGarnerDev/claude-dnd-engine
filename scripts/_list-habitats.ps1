$habitats = @()
Get-ChildItem "$PSScriptRoot\..\data\monsters\*.md" | ForEach-Object {
    $inHabitats = $false
    foreach ($line in (Get-Content $_.FullName)) {
        if ($line -match '^habitats:') { $inHabitats = $true; continue }
        if ($inHabitats -and $line -match '^\s{2}-\s(.+)') { $habitats += $Matches[1] }
        elseif ($inHabitats -and $line -notmatch '^\s') { $inHabitats = $false }
    }
}
$habitats | Sort-Object -Unique
