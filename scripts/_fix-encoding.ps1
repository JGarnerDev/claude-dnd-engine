# Fix encoding corruption in monster description fields.
# The CR/habitat update scripts ran Get-Content without -Encoding UTF8,
# causing UTF-8 multibyte sequences to be read as CP1252 and re-written
# as garbled UTF-8. This script reverses the damage.

$emDash  = [char]0x2014   # U+2014 —
$rSQ     = [char]0x2019   # U+2019 '
$lSQ     = [char]0x2018   # U+2018 '
$rDQ     = [char]0x201D   # U+201D "
$lDQ     = [char]0x201C   # U+201C "
$ellipsis = [char]0x2026  # U+2026 …
$enDash  = [char]0x2013   # U+2013 –

# CP1252 corruption patterns -> correct char
$replacements = @(
    # double-corrupted UTF-8 patterns (now showing as 3 chars: U+00E2, U+20AC, U+201x)
    @{ from = "â" + [char]0x20AC + [char]0x201D; to = $emDash  }   # â€" -> —
    @{ from = "â" + [char]0x20AC + [char]0x2122; to = $rSQ      }   # â€™ -> '
    @{ from = "â" + [char]0x20AC + [char]0x02DC; to = $lSQ      }   # â€˜ -> '
    @{ from = "â" + [char]0x20AC + [char]0x0153; to = $lDQ      }   # â€œ -> "
    @{ from = "â" + [char]0x20AC + [char]0x00A6; to = $ellipsis }   # â€¦ -> …
    @{ from = "â" + [char]0x20AC + [char]0x201C; to = $enDash   }   # â€" (en) -> –
    # Already partially fixed: ASCII "" where em-dash should be
    # (Only if surrounded by word chars and space — too risky to replace blindly)
)

$root     = Resolve-Path "$PSScriptRoot\.."
$files    = Get-ChildItem "$root\data\monsters\*.md"
$fixed    = 0
$clean    = 0

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Encoding UTF8 -Raw
    $orig    = $content
    foreach ($r in $replacements) {
        $content = $content.Replace($r.from, $r.to)
    }
    if ($content -ne $orig) {
        Set-Content -Path $f.FullName -Value $content -Encoding UTF8 -NoNewline
        $fixed++
    } else {
        $clean++
    }
}
Write-Host "Files fixed: $fixed | Already clean: $clean"
