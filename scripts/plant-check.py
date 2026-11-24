#!/usr/bin/env python3
"""plant-check.py -- check a session plan's plants against its payoffs.
consumers: .claude/commands/review.md, .claude/commands/session.md
-- update those if usage, flags, or output change.

A plan marks a set-up with a keyed bold label and its pay-off the same way:

  - **Plant (rope):** a coil of new rope on the boards, not yet hung.
  - **Payoff (rope):** Hob Fenner ties the rope to the crossbeam.
  - **Plant (letter, kept for Session 36):** the letter stays folded.

Keys are lowercase words joined by hyphens. Problems reported:
  - a plant with no payoff, unless it says which later session keeps it
  - a payoff with no plant (usually a mistyped key)
  - a payoff that comes before its plant
  - a key planted twice, or a marker that doesn't match the format above

Usage: uv run scripts/plant-check.py --session <folder name or session number>
Exit 0 when clean, 1 when anything is reported.
"""

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SESSIONS_DIR = ROOT / "scheduler" / "sessions"

MARKER_RE = re.compile(r"\*\*(?:Plant|Payoff)\b[^*]*\*\*")
KEY = r"[a-z0-9]+(?:-[a-z0-9]+)*"
PLANT_RE = re.compile(rf"\*\*Plant \((?P<key>{KEY})(?:, kept for Session (?P<kept>\d+))?\):\*\*")
PAYOFF_RE = re.compile(rf"\*\*Payoff \((?P<key>{KEY})\):\*\*")


@dataclass(frozen=True)
class Marker:
    kind: str  # "plant" or "payoff"
    key: str
    line_no: int
    kept_for_session: int | None = None


@dataclass(frozen=True)
class Problem:
    line_no: int
    message: str


def parse_marker(text: str, *, line_no: int) -> Marker | Problem:
    """Match one bold marker whole; anything else is a format problem."""
    if m := PLANT_RE.fullmatch(text):
        kept = int(m["kept"]) if m["kept"] else None
        return Marker("plant", m["key"], line_no, kept)
    if m := PAYOFF_RE.fullmatch(text):
        return Marker("payoff", m["key"], line_no)
    return Problem(
        line_no,
        f"bad marker {text}: use **Plant (key):**, **Plant (key, kept for Session N):** "
        "or **Payoff (key):**, key in lowercase-with-hyphens",
    )


def scan_plan(text: str) -> tuple[list[Marker], list[Problem]]:
    markers: list[Marker] = []
    problems: list[Problem] = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        for found in MARKER_RE.findall(line):
            result = parse_marker(found, line_no=line_no)
            (markers if isinstance(result, Marker) else problems).append(result)
    return markers, problems


def check_markers(markers: list[Marker]) -> list[Problem]:
    plants: dict[str, Marker] = {}
    problems: list[Problem] = []
    for m in markers:
        if m.kind != "plant":
            continue
        if m.key in plants:
            first = plants[m.key].line_no
            problems.append(Problem(m.line_no, f"'{m.key}' planted again (first at line {first})"))
        else:
            plants[m.key] = m
    paid: set[str] = set()
    for m in markers:
        if m.kind != "payoff":
            continue
        plant = plants.get(m.key)
        if plant is None:
            problems.append(Problem(m.line_no, f"payoff '{m.key}' has no plant"))
        elif m.line_no < plant.line_no:
            problems.append(
                Problem(
                    m.line_no, f"payoff '{m.key}' comes before its plant (line {plant.line_no})"
                )
            )
        else:
            paid.add(m.key)
    for key, plant in plants.items():
        if key not in paid and plant.kept_for_session is None:
            problems.append(
                Problem(
                    plant.line_no,
                    f"plant '{key}' has no payoff: add **Payoff ({key}):**, "
                    f"or mark it **Plant ({key}, kept for Session N):**",
                )
            )
    return sorted(problems, key=lambda p: p.line_no)


def resolve_session(want: str, *, sessions_dir: Path) -> Path:
    """The one session folder named `want`, or numbered `want`."""
    folders = [d for d in sorted(sessions_dir.glob("*/")) if d.is_dir()]
    matches = [
        d
        for d in folders
        if d.name == want or ((m := re.match(r"Session (\d+)\b", d.name)) and m[1] == want)
    ]
    if len(matches) != 1:
        found = ", ".join(d.name for d in matches) or "none"
        raise SystemExit(f"--session {want!r}: need exactly one matching folder, found {found}")
    return matches[0]


def plan_file(folder: Path) -> Path:
    plans = [f for f in folder.glob("*.md") if not f.name.startswith("_")]
    if len(plans) != 1:
        raise SystemExit(f"{folder.name}: expected one plan file, found {len(plans)}")
    return plans[0]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--session", required=True, help="session folder name or number")
    args = ap.parse_args()
    plan = plan_file(resolve_session(args.session, sessions_dir=SESSIONS_DIR))
    markers, problems = scan_plan(plan.read_text(encoding="utf-8-sig"))
    problems = sorted(problems + check_markers(markers), key=lambda p: p.line_no)
    plants = [m for m in markers if m.kind == "plant"]
    kept = [m for m in plants if m.kept_for_session is not None]
    print(
        f"{plan.name}: {len(plants)} plant(s), {len(kept)} kept for later, {len(problems)} problem(s)"
    )
    for m in kept:
        print(f"  kept: '{m.key}' for Session {m.kept_for_session} (line {m.line_no})")
    for p in problems:
        print(f"  line {p.line_no}: {p.message}")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
