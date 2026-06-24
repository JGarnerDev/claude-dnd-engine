#!/usr/bin/env python3
# spotlight-balance.py -- character-focus ledger: spotlight-vs-agnostic balance + per-PC rotation
# consumers: CLAUDE.md, .claude/commands/session.md, .claude/commands/todo.md, scripts/session-brief.py,
#   scripts/todo-brief.py, scripts/party-status.py -- update these if usage, flags, or output format change.
# Reads played-session `beats:` (see meta/schemas/session.md) and reports against meta/character-focus.md.
# Usage: python scripts/spotlight-balance.py [--section]
#   --section : print as a compact "--- SPOTLIGHT ---" subsection (for embedding in session-brief.py)
#               instead of the standalone banner report.
#
# Importable: render_lines(section=...) returns a list of (text, color) tuples so
# session-brief.py and todo-brief.py can embed/scan the readout without a subprocess.

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import (
    ROOT, color, get_frontmatter, get_played_spotlight_sessions,
    get_spotlight_rotation,
)

HOOK_RE = re.compile(r'(?m)^\s*-\s*hook:')


def _balance(session_set):
    spot = 0
    all_ = 0
    for s in session_set:
        for b in s.beats:
            all_ += b.value
            if b.cls in ('spotlight', 'shared'):
                spot += b.value
    if all_ == 0:
        return None
    return {'spot': spot, 'all': all_, 'ratio': spot / all_}


def render_lines(section=False):
    """Build the spotlight readout as a list of (text, color_name) tuples."""
    lines = []

    focus_doc = ROOT / 'meta' / 'character-focus.md'
    target = 0.5
    cold_start = 3
    window = 4
    if focus_doc.exists():
        ffm = get_frontmatter(focus_doc)
        if ffm.get('spotlight_target'):
            target = float(ffm['spotlight_target'])
        if ffm.get('cold_start_sessions'):
            cold_start = int(ffm['cold_start_sessions'])
        if ffm.get('rotation_window_sessions'):
            window = int(ffm['rotation_window_sessions'])

    sessions = get_played_spotlight_sessions(ROOT)
    played_count = len(sessions)

    pcs = []
    pcs_dir = ROOT / 'historian' / 'characters' / 'pcs'
    if pcs_dir.exists():
        for f in pcs_dir.glob('*.md'):
            fm = get_frontmatter(f)
            if fm.get('state') and fm.get('state') != 'active':
                continue
            raw = f.read_text(encoding='utf-8')
            hook_count = len(HOOK_RE.findall(raw))
            appetite = fm['spotlight'].strip() if fm.get('spotlight') else 'normal'
            pcs.append({
                'Name': fm.get('name'),
                'Player': fm.get('player'),
                'Appetite': appetite,
                'Hooks': hook_count,
            })
    active_names = [p['Name'] for p in pcs]

    if section:
        lines.append(("\n--- SPOTLIGHT ---", 'darkgray'))
    else:
        lines.append(("\n========================================", 'darkgray'))
        lines.append(("  SPOTLIGHT BALANCE", 'cyan'))
        lines.append(("========================================", 'darkgray'))

    # -- Cold start guard -----------------------------------------------------
    if played_count < cold_start:
        lines.append((
            "  insufficient history - spotlight balance not yet meaningful "
            "({0} of {1} sessions played).".format(played_count, cold_start), 'yellow'))
        no_hooks = [p for p in pcs if p['Appetite'] != 'low' and p['Hooks'] == 0]
        for p in no_hooks:
            lines.append((f"  ! {p['Name']} has no spotlight hooks - needs a backstory pass.", 'yellow'))
        if not section:
            lines.append(("\n========================================\n", 'darkgray'))
        return lines

    # -- Lifetime balance -----------------------------------------------------
    life = _balance(sessions)
    lines.append((f"\n--- BALANCE (lifetime, target {round(target * 100)}% spotlight) ---", 'darkgray'))
    if life is None:
        lines.append(("  no weighted beats recorded yet.", 'darkgray'))
    else:
        spot_pct = round(life['ratio'] * 100, 1)
        ag_pct = round((1 - life['ratio']) * 100, 1)
        if abs(life['ratio'] - target) <= 0.05:
            verdict = "on target"
        elif life['ratio'] > target:
            verdict = "spotlight-heavy -> campaign owes agnostic material"
        else:
            verdict = "agnostic-heavy -> room for more character focus"
        lines.append(("  lifetime: {0}% spotlight / {1}% agnostic ({2})".format(
            spot_pct, ag_pct, verdict), 'white'))

    # -- Recent trend ---------------------------------------------------------
    if played_count >= window:
        recent = sessions[-window:]
        tr = _balance(recent)
        if tr:
            tr_pct = round(tr['ratio'] * 100, 1)
            if abs(tr['ratio'] - target) <= 0.05:
                lean = "balanced - hold steady"
            elif tr['ratio'] > target:
                lean = "spotlight-heavy -> lean agnostic this week"
            else:
                lean = "agnostic-heavy -> lean spotlight this week"
            lines.append(("  recent trend (last {0}): {1}% spotlight -> {2}".format(
                window, tr_pct, lean), 'white'))
    else:
        lines.append(("  recent trend: suppressed (needs {0} sessions, have {1})".format(
            window, played_count), 'darkgray'))

    # -- Rotation -------------------------------------------------------------
    rot = get_spotlight_rotation(sessions, window, active_names)
    turns = rot['turns']
    present_in_window = rot['present']
    fallback_used = rot['fallback']

    lines.append((f"\n--- ROTATION (last {window} sessions, present-only) ---", 'darkgray'))
    if fallback_used:
        lines.append(("  (some sessions lack pcs_present: - assumed all active PCs present for those)", 'darkgray'))
    rows = []
    for p in pcs:
        t = turns.get(p['Name'], 0.0)
        seen = p['Name'] in present_in_window
        rows.append({'Name': p['Name'], 'Turns': t, 'Appetite': p['Appetite'], 'Seen': seen})
    for r in sorted(rows, key=lambda r: (r['Turns'], str(r['Name'] or '').lower())):
        if r['Appetite'] == 'low':
            tag = " [low appetite - excluded]"
        elif not r['Seen']:
            tag = " [absent this window]"
        else:
            tag = ""
        clr = 'darkgray' if (r['Appetite'] == 'low' or not r['Seen']) else 'white'
        lines.append(("  {0:<20} {1:>5} turns{2}".format(r['Name'], _fmt_num(r['Turns']), tag), clr))

    # Overdue = fewest windowed turns among present, normal-appetite PCs.
    #
    # All-zeros guard: if NO eligible PC has any turns, the ledger has no real
    # spotlight data in the window yet. Ranking an all-zero tie just sorts by name
    # and fabricates a meaningless "overdue" PC (this is why early runs flagged the
    # first PC alphabetically). Suppress the flag until at least one >= beat
    # spotlight is actually recorded.
    #
    # NOTE FOR KELLAN: this readout stays silent until you deliberately plan a
    # spotlight into a session and it gets tagged as a `beats:` line at /recap. It
    # is intentionally NOT reconstructed from past sessions -- those character
    # moments were player-reactive, not DM-built spotlights, so backfilling them
    # would mislead this metric. Once you start planning spotlights, the flag
    # tracks itself. Ask Claude to elaborate if this isn't clear.
    eligible = [r for r in rows if r['Appetite'] != 'low' and r['Seen']]
    max_turns = max((r['Turns'] for r in eligible), default=0)
    if eligible and max_turns > 0:
        overdue = sorted(eligible, key=lambda r: (r['Turns'], str(r['Name'] or '').lower()))[0]
        lines.append(("\n  Overdue: {0} ({1} turns - fewest among present, normal-appetite PCs)".format(
            overdue['Name'], _fmt_num(overdue['Turns'])), 'green'))
    elif eligible:
        lines.append(("\n  no structural spotlight data yet - starts once a planned spotlight beat is recorded.", 'darkgray'))

    # -- Missing hooks --------------------------------------------------------
    no_hooks = [p for p in pcs if p['Appetite'] != 'low' and p['Hooks'] == 0]
    if no_hooks:
        lines.append(("\n--- MISSING HOOKS ---", 'darkgray'))
        for p in no_hooks:
            lines.append((f"  ! {p['Name']} has no spotlight hooks - needs a backstory pass.", 'yellow'))

    if not section:
        lines.append(("\n========================================\n", 'darkgray'))
    return lines


def _fmt_num(n):
    """Match PowerShell's float rendering: 1.0 -> '1', 0.5 -> '0.5'."""
    if n == int(n):
        return str(int(n))
    return str(n)


def emit(lines):
    for text, clr in lines:
        print(color(text, clr) if clr else text)


def main():
    parser = argparse.ArgumentParser(description='Character-focus spotlight ledger')
    parser.add_argument('--section', action='store_true',
                        help='compact subsection form for embedding in session-brief.py')
    args = parser.parse_args()
    emit(render_lines(section=args.section))


if __name__ == '__main__':
    main()
