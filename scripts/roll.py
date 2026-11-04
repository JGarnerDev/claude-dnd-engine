#!/usr/bin/env python3
# roll.py -- roll dice for hidden DM rolls the engine makes on the DM's behalf (Citadel d6, etc.)
# consumers: none yet -- add instruction files here when one starts calling it.
# Usage: uv run scripts/roll.py <expr> [<expr> ...] [--label "<text>" ...]
#   expr: NdM[+/-K] with optional " adv" / " dis" on a d20, e.g. d6, 2d8+3, "d20 adv"
#   --label: one per expr, in order, printed beside each result

import argparse
import re
import secrets
import sys

EXPR = re.compile(r'^\s*(\d*)d(\d+)\s*([+-]\s*\d+)?\s*(adv|dis)?\s*$', re.I)


def roll_die(sides: int) -> int:
    return secrets.randbelow(sides) + 1


def roll(expr: str) -> tuple[int, str]:
    m = EXPR.match(expr)
    if not m:
        raise ValueError(f"can't read dice expression: {expr!r}")
    count = int(m.group(1) or 1)
    sides = int(m.group(2))
    mod = int((m.group(3) or '0').replace(' ', ''))
    mode = (m.group(4) or '').lower()
    if count < 1 or sides < 2:
        raise ValueError(f"need at least one die with 2+ sides: {expr!r}")
    if mode and not (count == 1 and sides == 20):
        raise ValueError(f"adv/dis only applies to a single d20: {expr!r}")

    if mode:
        pair = [roll_die(20), roll_die(20)]
        kept = max(pair) if mode == 'adv' else min(pair)
        detail = f"{pair} {mode} -> {kept}"
        total = kept + mod
    else:
        dice = [roll_die(sides) for _ in range(count)]
        detail = str(dice)
        total = sum(dice) + mod
    if mod:
        detail += f" {'+' if mod > 0 else '-'} {abs(mod)}"
    return total, detail


def main() -> int:
    ap = argparse.ArgumentParser(description="Roll dice.")
    ap.add_argument('exprs', nargs='+', help='dice expressions, e.g. d6 2d8+3 "d20 adv"')
    ap.add_argument('--label', action='append', default=[], help='label per expression, in order')
    args = ap.parse_args()

    for i, expr in enumerate(args.exprs):
        label = args.label[i] if i < len(args.label) else ''
        try:
            total, detail = roll(expr)
        except ValueError as e:
            print(f"error: {e}", file=sys.stderr)
            return 1
        prefix = f"{label}: " if label else ''
        print(f"{prefix}{expr.strip()} = {total}  {detail}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
