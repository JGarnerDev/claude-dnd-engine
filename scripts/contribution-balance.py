#!/usr/bin/env python3
# contribution-balance.py -- contributed_by counts per player across ./data and ./historian
# consumers: CLAUDE.md, .claude/commands/region.md, data/CLAUDE.md -- update these if usage, flags, or output format change.
# Usage: uv run scripts/contribution-balance.py

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, color, fmt_num, get_frontmatter

PLAYERS = ["paul", "ben", "miguel", "jeff"]


def count_contributions(folder):
    counts = {p: 0 for p in PLAYERS}
    counts["(none)"] = 0
    folder = Path(folder)
    if not folder.exists():
        return counts
    for f in folder.rglob("*.md"):
        fm = get_frontmatter(f)
        raw = fm.get("contributed_by")
        contributor = str(raw).split()[0].strip('"') if raw else None
        if contributor:
            counts[contributor] = counts.get(contributor, 0) + 1
        else:
            counts["(none)"] += 1
    return counts


def render(pool, historian):
    total_pool = sum(pool.values())
    total_hist = sum(historian.values())

    lines = [
        color("\n=== Contribution Balance ===", "cyan"),
        color(f"{'Player':<12} {'Pool':>8} {'Canonized':>12} {'% Canon':>10}", "yellow"),
        color(f"{'------':<12} {'----':>8} {'---------':>12} {'-------':>10}", "darkgray"),
    ]

    rows = []
    for idx, p in enumerate(PLAYERS + ["(none)"]):
        pool_c = pool.get(p, 0)
        hist_c = historian.get(p, 0)
        pct = round((hist_c / total_hist) * 100, 1) if total_hist > 0 else 0
        rows.append({"Player": p, "Pool": pool_c, "Canon": hist_c, "Pct": pct, "Idx": idx})

    for row in sorted(rows, key=lambda r: (r["Canon"], r["Idx"])):
        clr = "darkgray" if row["Player"] == "(none)" else "white"
        lines.append(color(
            f"{row['Player']:<12} {row['Pool']:>8} {row['Canon']:>12} {fmt_num(row['Pct']):>9}%",
            clr))

    lines.append(color(f"{'TOTAL':<12} {total_pool:>8} {total_hist:>12}", "yellow"))

    candidates = [r for r in rows if r["Player"] != "(none)" and r["Pool"] > 0]
    if candidates:
        nxt = sorted(candidates, key=lambda r: (r["Canon"], r["Player"]))[0]
        lines.append("")
        lines.append(color(
            f"Next up: {nxt['Player']} ({nxt['Canon']} canonized, {nxt['Pool']} in pool)",
            "green"))
    return lines


def main():
    pool = count_contributions(ROOT / "data")
    historian = count_contributions(ROOT / "historian")
    for line in render(pool, historian):
        print(line)


if __name__ == "__main__":
    main()
