# todo-brief.ps1 -- DM action-item dashboard. Backbone of the /todo command.
# Collects every mechanical "needs attention" signal in one call:
#   uncanonized sessions, recap inbox, index staleness, unchecked todo.md items,
#   questionnaire fill states, draft files, undeployed design preferences.
# Output is raw signals; /todo translates them to plain DM language.
# Usage: .\scripts\todo-brief.ps1

$root = Resolve-Path "$PSScriptRoot\.."

function Get-Frontmatter($path) {
    $lines = Get-Content $path -Raw -Encoding UTF8
    if ($lines -notmatch '(?s)^---\r?\n(.+?)\r?\n---') { return @{} }
    $block = $Matches[1]
    $fm = @{}
    foreach ($line in ($block -split "`n")) {
        $line = $line.TrimEnd("`r")
        if ($line -match '^(\w[\w_]*):\s*\[\[([^\]]+)\]\]') {
            $fm[$Matches[1].Trim()] = $Matches[2].Trim()
        } elseif ($line -match '^(\w[\w_]*):\s*"?([^"#\r\n]*)"?\s*$') {
            $fm[$Matches[1].Trim()] = $Matches[2].Trim()
        }
    }
    return $fm
}

Write-Host "`n========================================" -ForegroundColor DarkGray
Write-Host "  DM TODO BRIEF" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor DarkGray

# -- 1. Uncanonized sessions + recap inbox -------------------------------------
$histSessions  = Get-ChildItem "$root\historian\sessions" -Filter "*.md" -ErrorAction SilentlyContinue
$schedSessions = Get-ChildItem "$root\scheduler\sessions" -Filter "*.md" -ErrorAction SilentlyContinue
$today = (Get-Date).Date

$histNums = @{}
foreach ($s in $histSessions) {
    $fm = Get-Frontmatter $s.FullName
    if ($fm['session_number']) { $histNums[[string]$fm['session_number']] = $true }
}

Write-Host "`n--- SESSIONS ---" -ForegroundColor DarkGray
$sessionFlags = 0
foreach ($s in $schedSessions) {
    $fm = Get-Frontmatter $s.FullName
    if (@('draft', 'planned') -notcontains $fm['state']) { continue }
    $pd = [datetime]::MinValue
    $hasDate = $fm['planned_date'] -and $fm['planned_date'] -ne 'null' -and [datetime]::TryParse([string]$fm['planned_date'], [ref]$pd)
    if ($hasDate -and $pd.Date -lt $today -and -not $histNums.ContainsKey([string]$fm['session_number'])) {
        Write-Host "  UNCANONIZED: #$($fm['session_number']) '$($fm['name'])' planned $($fm['planned_date'])" -ForegroundColor Red
    } else {
        Write-Host "  Pending plan: #$($fm['session_number']) '$($fm['name'])' [$($fm['state'])]$(if ($hasDate) { " for $($fm['planned_date'])" })" -ForegroundColor Yellow
    }
    $sessionFlags++
}
$inbox = Get-ChildItem "$root\recaps\inbox" -Filter "*.md" -ErrorAction SilentlyContinue
foreach ($f in $inbox) {
    Write-Host "  INBOX NOTES: recaps/inbox/$($f.Name) awaiting /recap" -ForegroundColor Red
    $sessionFlags++
}

# No plan drafted for the next game night (Tuesdays, per campaign Rules Decisions)
$futurePlans = 0
foreach ($s in $schedSessions) {
    $fm = Get-Frontmatter $s.FullName
    if (@('draft', 'planned') -notcontains $fm['state']) { continue }
    $pd = [datetime]::MinValue
    $hasDate = $fm['planned_date'] -and $fm['planned_date'] -ne 'null' -and [datetime]::TryParse([string]$fm['planned_date'], [ref]$pd)
    if (-not $hasDate -or $pd.Date -ge $today) { $futurePlans++ }
}
if (-not $futurePlans) {
    $daysUntil = ([int][DayOfWeek]::Tuesday - [int]$today.DayOfWeek + 7) % 7
    $nextGame = $today.AddDays($daysUntil).ToString('yyyy-MM-dd')
    $when = if ($daysUntil -eq 0) { "TONIGHT ($nextGame)" } else { "Tuesday $nextGame ($daysUntil day(s) away)" }
    Write-Host "  NO PLAN: next game is $when - nothing drafted. Run /session." -ForegroundColor Red
    $sessionFlags++
}
if (-not $sessionFlags) { Write-Host "  (clean)" -ForegroundColor DarkGray }

# -- 1b. Open threads (states that mean unfinished business) --------------------
Write-Host "`n--- OPEN THREADS ---" -ForegroundColor DarkGray
$threadHits = Get-ChildItem "$root\historian" -Recurse -Filter "*.md" -ErrorAction SilentlyContinue |
    Select-String -Pattern '^state:\s*(missing|imprisoned|transformed|stranded|captured)\s*$'
if ($threadHits) {
    foreach ($h in $threadHits) {
        $base = [IO.Path]::GetFileNameWithoutExtension($h.Filename)
        Write-Host "  $base [$($h.Matches[0].Groups[1].Value)]" -ForegroundColor White
    }
    Write-Host "  ($(@($threadHits).Count) total - run /threads for the full picture)" -ForegroundColor DarkGray
} else {
    Write-Host "  (none)" -ForegroundColor DarkGray
}

# -- 1c. Graph health ------------------------------------------------------------
Write-Host "`n--- GRAPH HEALTH ---" -ForegroundColor DarkGray
$vOut = powershell -NoProfile -File "$PSScriptRoot\validate.ps1" -Quiet 2>&1
$vLine = $vOut | Where-Object { $_ -match 'Errors:\s*(\d+)' } | Select-Object -Last 1
if ($vLine -match 'Errors:\s*(\d+)') {
    $errCount = [int]$Matches[1]
    if ($errCount) {
        Write-Host "  $errCount broken cross-reference(s) or missing field(s) - run validate.ps1 for detail" -ForegroundColor Yellow
        Write-Host "  (placeholder world names under construction are expected here)" -ForegroundColor DarkGray
    } else {
        Write-Host "  Clean" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  (validate.ps1 did not report - run it manually)" -ForegroundColor Yellow
}

# -- 2. Semantic index staleness ------------------------------------------------
Write-Host "`n--- INDEX ---" -ForegroundColor DarkGray
$stamp = "$root\vector-index\.index-built"
if (Test-Path $stamp) {
    $lines = Get-Content $stamp
    $sha = $lines[1]
    $commits = @(git -C $root log --oneline "$sha..HEAD" -- data/ historian/ scheduler/ 2>$null)
    if ($commits.Count) {
        Write-Host "  Stale: $($commits.Count) entity-dir commit(s) since last build ($($sha.Substring(0,7)))" -ForegroundColor Yellow
        Write-Host "  (commits touching only CLAUDE.md/README do not stale the index)" -ForegroundColor DarkGray
    } else {
        Write-Host "  Fresh (built $($lines[0].Substring(0,10)))" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  Never built - run: py -3.10 scripts\index-entities.py" -ForegroundColor Red
}

# -- 3. Unchecked todo.md items --------------------------------------------------
Write-Host "`n--- TODO.MD (unchecked) ---" -ForegroundColor DarkGray
$todoFile = Get-ChildItem "$root" -Filter "todo.md" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($todoFile) {
    $section = ""
    foreach ($line in (Get-Content $todoFile.FullName -Encoding UTF8)) {
        if ($line -match '^##\s+(.*)') { $section = $Matches[1].Trim(); continue }
        if ($line -match '^\s*-\s+\[ \]\s+(.*)') {
            $item = $Matches[1].Trim()
            if ($item.Length -gt 110) { $item = $item.Substring(0, 107) + "..." }
            Write-Host "  [$section] $item" -ForegroundColor White
        }
    }
} else {
    Write-Host "  (no todo.md found)" -ForegroundColor DarkGray
}

# -- 4. Questionnaires ------------------------------------------------------------
Write-Host "`n--- QUESTIONNAIRES ---" -ForegroundColor DarkGray
$qFiles = Get-ChildItem "$root\questionnaires" -Filter "*.md" -File -ErrorAction SilentlyContinue
if ($qFiles) {
    foreach ($q in $qFiles) {
        $raw = Get-Content $q.FullName -Raw -Encoding UTF8
        $player = if ($raw -match '(?m)^player:\s*(.+)$') { $Matches[1].Trim() } else { "?" }
        if ($raw -match '(?m)^filled:\s*true') {
            Write-Host "  READY TO INGEST: $($q.Name) (player: $player)" -ForegroundColor Yellow
        } else {
            Write-Host "  Waiting on player: $($q.Name) (player: $player)" -ForegroundColor White
        }
    }
} else {
    Write-Host "  (none outstanding)" -ForegroundColor DarkGray
}

# -- 5. Draft files ---------------------------------------------------------------
Write-Host "`n--- DRAFTS ---" -ForegroundColor DarkGray
$draftCount = 0
foreach ($dir in @("$root\data\lore", "$root\scheduler\acts", "$root\scheduler\missions")) {
    $files = Get-ChildItem $dir -Filter "*.md" -ErrorAction SilentlyContinue
    foreach ($f in $files) {
        $fm = Get-Frontmatter $f.FullName
        if ($fm['state'] -eq 'draft') {
            $rel = $f.FullName.Replace("$root\", "")
            Write-Host "  $rel - $($fm['description'])" -ForegroundColor White
            $draftCount++
        }
    }
}
if (-not $draftCount) { Write-Host "  (none)" -ForegroundColor DarkGray }

# -- 6. Design preferences not yet used ---------------------------------------------
Write-Host "`n--- DESIGN PREFERENCES ---" -ForegroundColor DarkGray
$prefFile = "$root\meta\campaign-design-preferences.md"
if (Test-Path $prefFile) {
    $raw = Get-Content $prefFile -Raw -Encoding UTF8
    # Deployed lines hold either an em-dash (unused) or a [[session wikilink]] (used).
    # Match on the wikilink's absence: a literal em-dash here breaks under PS 5.1's
    # ANSI read of BOM-less .ps1 files.
    $total    = ([regex]::Matches($raw, '(?m)^\s*-\s*\*Deployed:')).Count
    $deployed = ([regex]::Matches($raw, '(?m)^\s*-\s*\*Deployed:[^\r\n]*\[\[')).Count
    $undeployed = $total - $deployed
    $seeded   = ([regex]::Matches($raw, '(?m)^\s*-\s*\*Seeded:')).Count
    Write-Host "  $undeployed of $total items not yet deployed; $seeded seeded" -ForegroundColor White
}

Write-Host "`n========================================`n" -ForegroundColor DarkGray
