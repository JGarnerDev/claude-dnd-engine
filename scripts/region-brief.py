#!/usr/bin/env python3
# region-brief.py -- compressed summary of an existing region draft
# consumers: maps/CLAUDE.md, .claude/commands/region.md -- update these if usage, flags, or output format change.
# Usage: uv run scripts/region-brief.py [--region <slug>]
# Auto-detects draft if only one exists in data/locations/regions/

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite, get_frontmatter_from_text, read_text_no_bom

_ZONE_RE = re.compile(r"(?m)^## Zone")
_LOC_RE = re.compile(r"(?m)^### Location")
_LOC_BLOCK_RE = re.compile(r"(?s)### (Location \d+[^\n]*)\n(.*?)(?=\n### |\n## |\Z)")
_WIKI_RE = re.compile(r"\[\[([^\]]+)\]\]")
_OPEN_QS_RE = re.compile(r"(?s)## Open Questions\r?\n\r?\n(.*?)(?=\r?\n---|\r?\n## |\Z)")
_OQ_BOLD_RE = re.compile(r"^\s*-\s*\*\*([^*]+)\*\*")


def find_draft(drafts_dir: Path, region_slug: str = "") -> Path:
    """Locate the draft file; raise SystemExit with a helpful message on failure."""
    if region_slug:
        candidate = drafts_dir / f"{region_slug}.md"
        if not candidate.exists():
            candidate = drafts_dir / region_slug
        if not candidate.exists():
            cwrite(f"Draft not found: {region_slug}", "red")
            sys.exit(1)
        return candidate

    drafts = [f for f in drafts_dir.glob("*.md")
              if not f.stem.endswith(".original")]
    if not drafts:
        cwrite(f"No region drafts in {drafts_dir}", "red")
        sys.exit(1)
    if len(drafts) == 1:
        return drafts[0]
    cwrite("Multiple drafts -- specify --region <slug>:", "yellow")
    for d in sorted(drafts):
        cwrite(f"  {d.stem}", "gray")
    sys.exit(1)


def parse_anchoring(content: str) -> tuple:
    """Return (anchored, unanchored) lists from Location blocks."""
    anchored = []
    unanchored = []
    for m in _LOC_BLOCK_RE.finditer(content):
        header = m.group(1).strip()
        body = m.group(2)
        num_m = re.search(r"\d+", header)
        num = num_m.group() if num_m else header

        if "**Candidate entities:**" in body:
            if "None. No free entities" in body:
                unanchored.append(num)
            else:
                names = list(dict.fromkeys(
                    w.split("|")[0].strip()
                    for w in _WIKI_RE.findall(body)
                ))
                anchored.append(f"{num} -- {', '.join(names)}")
        else:
            unanchored.append(f"{num} (no anchor section yet)")
    return anchored, unanchored


def parse_open_questions(content: str) -> list:
    """Return list of open question topic strings (text between ** markers)."""
    m = _OPEN_QS_RE.search(content)
    if not m:
        return []
    qs = []
    for line in m.group(1).split("\n"):
        bm = _OQ_BOLD_RE.match(line)
        if bm:
            qs.append(bm.group(1).strip())
    return qs


def phases_complete(content: str, draft_file: Path, questionnaires_dir: Path) -> list:
    """Heuristically determine which phases are done."""
    done = []
    zone_count = len(_ZONE_RE.findall(content))
    anchored, unanchored = parse_anchoring(content)
    if zone_count > 0:
        done.append("Phase 4 (draft)")
    if anchored or unanchored:
        done.append("Phase 6 (anchoring)")
    if questionnaires_dir.exists():
        slug = draft_file.stem
        # questionnaires/ is grouped into topic subfolders -- walk it, don't flat-glob.
        # Current layout is <region-slug>/cities/city-<n>.md; the older flat spelling
        # was <region-slug>-city-<n>.md. Count both so old regions still register.
        found = set(questionnaires_dir.rglob(f"{slug}-city-*.md"))
        found |= set((questionnaires_dir / slug / "cities").glob("city-*.md"))
        q_count = len(found)
        if q_count > 0:
            done.append(f"Phase 7 ({q_count} questionnaires)")
    return done


def build_output(draft_file: Path, questionnaires_dir: Path = None,
                 maps_dir: Path = None) -> list:
    """Return list of (text, color_name) tuples for the full brief."""
    if questionnaires_dir is None:
        questionnaires_dir = ROOT / "questionnaires"

    content = read_text_no_bom(draft_file)
    fm = get_frontmatter_from_text(content)

    zone_count = len(_ZONE_RE.findall(content))
    loc_count = len(_LOC_RE.findall(content))
    anchored, unanchored = parse_anchoring(content)
    open_qs = parse_open_questions(content)
    done = phases_complete(content, draft_file, questionnaires_dir)

    name_display = fm.get("name") or draft_file.stem
    slug = draft_file.stem
    if maps_dir is None:
        maps_dir = ROOT / "maps" / "regions" / slug

    lines = [
        ("", None),
        ("========================================", "darkgray"),
        ("  REGION BRIEF", "cyan"),
        ("========================================", "darkgray"),
        ("", None),
        (f"Region:   {name_display}", "white"),
    ]
    if fm.get("world_position"):
        lines.append((f"Position: {fm['world_position']}", "gray"))
    if fm.get("climate"):
        lines.append((f"Climate:  {fm['climate']}", "gray"))
    if fm.get("major_water"):
        lines.append((f"Water:    {fm['major_water']}", "gray"))

    lines.append(("", None))
    lines.append((f"Zones: {zone_count}    Locations: {loc_count}", "white"))
    if done:
        lines.append((f"Done:  {' | '.join(done)}", "green"))
    lines.append(("", None))

    if anchored:
        lines.append((f"-- Anchored ({len(anchored)}) -------------------------", "green"))
        for a in anchored:
            lines.append((f"  {a}", "gray"))
    if unanchored:
        lines.append((f"-- Unanchored ({len(unanchored)}) ---------------------", "yellow"))
        lines.append((f"  Locations: {', '.join(unanchored)}", "gray"))

    if open_qs:
        lines.append(("", None))
        lines.append((f"-- Open Questions ({len(open_qs)}) ----------------------", "cyan"))
        for q in open_qs:
            lines.append((f"  - {q}", "gray"))

    # Map files
    if maps_dir.exists():
        try:
            rel = str(maps_dir.relative_to(ROOT))
        except ValueError:
            rel = str(maps_dir)
        lines.append((f"-- Maps ({rel}) ------------", "darkgray"))
        images = sorted(f for f in maps_dir.iterdir()
                        if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
        if images:
            for img in images:
                lines.append((f"  {img.name}", "gray"))
        else:
            lines.append((f"  No images yet -- add to maps/regions/{slug}/", "darkyellow"))
        lines.append(("", None))

    lines += [
        (f"File: {draft_file.name}", "darkgray"),
        ("========================================\n", "darkgray"),
    ]
    return lines


def render(draft_file: Path, questionnaires_dir: Path = None,
           maps_dir: Path = None) -> list:
    """Return rendered plain-text lines (no color, for test assertions)."""
    return [text for text, _ in build_output(draft_file, questionnaires_dir, maps_dir)]


def main():
    parser = argparse.ArgumentParser(
        description="Compressed summary of an existing region draft")
    parser.add_argument("--region", default="", help="Region slug (filename without .md)")
    args = parser.parse_args()

    drafts_dir = ROOT / "data" / "locations" / "regions"
    draft_file = find_draft(drafts_dir, args.region)
    for text, color_name in build_output(draft_file):
        cwrite(text, color_name)


if __name__ == "__main__":
    main()
