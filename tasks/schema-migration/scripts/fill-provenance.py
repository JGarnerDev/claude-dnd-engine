#!/usr/bin/env python3
# fill-provenance.py -- temporary (schema migration step 6, entity base).
# Fills missing source_session / confirmed_date in historian/ entity files (sessions exempt),
# so validate.py can enforce them as errors.
#   source_session: the file's `last_updated` session link, else the earliest [[Session NN ...]]
#                   link anywhere in the file, else the earliest session file that links this
#                   entity (its first appearance). Files with none are listed as unresolved.
#   confirmed_date: the played_date of the source session; "pre-campaign" for player backstory.
# The two lines go just before the closing `---`. A new source_session link that the body
# doesn't mention is echoed in a `## Sources` section at the end (validate.py's echo rule).
# The file's line endings are kept.
#
# Usage: uv run tasks/schema-migration/scripts/fill-provenance.py [--apply]

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "scripts"))
from lib.common import get_frontmatter  # noqa: E402

SESSION_LINK = re.compile(r"\[\[(Session (\d+)[^\]|#]*)")
FM = re.compile(rb"\A((?:\xef\xbb\xbf)?---\r?\n.*?\r?\n)(---[ \t]*(?:\r?\n|\Z))", re.S)


def sessions() -> list:
    """(number, name, played_date, text) for every session file, oldest first."""
    out = []
    for p in (ROOT / "historian" / "sessions").rglob("Session *.md"):
        fm = get_frontmatter(p)
        n = re.match(r"Session (\d+)", p.stem)
        out.append(
            (
                int(n.group(1)),
                p.stem,
                fm.get("played_date", "").strip('"'),
                p.read_text(encoding="utf-8"),
            )
        )
    return sorted(out)


def first_appearance(stem: str, all_sessions: list) -> str | None:
    link = re.compile(r"\[\[" + re.escape(stem) + r"[\]|#]", re.I)
    return next((name for _, name, _, text in all_sessions if link.search(text)), None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    all_sessions = sessions()
    dates = {name.lower(): played for _, name, played, _ in all_sessions if played}
    unresolved = []
    for p in sorted((ROOT / "historian").rglob("*.md")):
        rel = p.relative_to(ROOT).as_posix()
        if "/sessions/" in rel or p.name == "CLAUDE.md" or "template" in p.name.lower():
            continue
        text = p.read_text(encoding="utf-8")
        fm = get_frontmatter(p)
        if not fm.get("type"):
            continue
        source, confirmed = (
            fm.get("source_session", "").strip('"'),
            fm.get("confirmed_date", "").strip('"'),
        )
        if source and confirmed:
            continue
        add = {}
        if not source:
            m = SESSION_LINK.search(fm.get("last_updated", ""))
            if not m:
                links = sorted(SESSION_LINK.findall(text), key=lambda x: int(x[1]))
                m = links and links[0]
            name = (
                (m.group(1) if hasattr(m, "group") else m[0])
                if m
                else first_appearance(p.stem, all_sessions)
            )
            if not name:
                unresolved.append(f"{rel}: no session link for source_session")
                continue
            source = f"[[{name.strip()}]]"
            add["source_session"] = f'"{source}"'
        if not confirmed:
            if source.lower().startswith("player backstory"):
                confirmed = "pre-campaign"
            else:
                name = source.removeprefix("[[").removesuffix("]]").split("|")[0].strip()
                confirmed = dates.get(name.lower())
            if not confirmed:
                unresolved.append(f"{rel}: no played_date for {source}")
                continue
            add["confirmed_date"] = f'"{confirmed}"'
        print(f"{rel}: " + ", ".join(f"{k}: {v}" for k, v in add.items()))
        if args.apply:
            raw = p.read_bytes()
            nl = b"\r\n" if b"\r\n" in raw[:200] else b"\n"
            lines = b"".join(f"{k}: {v}".encode() + nl for k, v in add.items())
            new, n = FM.subn(lambda m, lines=lines: m.group(1) + lines + m.group(2), raw, count=1)
            assert n == 1, rel
            if "source_session" in add and source.startswith("[["):
                name = source[2:-2]
                body = new[FM.match(new).end() :]
                if not re.search(rb"\[\[" + re.escape(name.encode()) + rb"[\]|#]", body, re.I):
                    new = new.rstrip(b"\r\n") + nl + nl + b"## Sources" + nl + nl
                    new += f"Recorded in [[{name}]].".encode() + nl
            p.write_bytes(new)
    for u in unresolved:
        print("UNRESOLVED", u)


if __name__ == "__main__":
    main()
