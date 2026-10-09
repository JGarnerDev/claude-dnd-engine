#!/usr/bin/env python3
# fetch-maps.py
# consumers: maps/CLAUDE.md -- update these if usage, flags, or output format change.
#
# Download map images from the Inkarnate CDN listed in maps/sources.tsv.
# Map images are gitignored (large binaries); this pulls them on demand after a clone.
# Usage:
#   uv run scripts/fetch-maps.py            # fetch any missing map images
#   uv run scripts/fetch-maps.py --force    # re-download even if the file already exists
#   uv run scripts/fetch-maps.py --list     # show manifest entries and local presence, fetch nothing

import argparse
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT  # noqa: E402

MANIFEST = ROOT / "maps" / "sources.tsv"

# < 50 KB: too small to be a real map export (likely an error page).
_MIN_BYTES = 51200


def parse_manifest(text: str):
    """Parse a path<TAB>url manifest. Returns (entries, warnings) where entries
    is a list of (path, url) tuples and warnings lists malformed source lines."""
    entries = []
    warnings = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped == "" or stripped.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) != 2:
            warnings.append(line)
            continue
        entries.append((parts[0].strip(), parts[1].strip()))
    return entries, warnings


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch gitignored map masters from the CDN")
    parser.add_argument("--force", action="store_true",
                        help="re-download even if the file already exists")
    parser.add_argument("--list", dest="list_only", action="store_true",
                        help="show manifest entries and local presence, fetch nothing")
    args = parser.parse_args()

    if not MANIFEST.exists():
        print(f"Manifest not found: {MANIFEST}", file=sys.stderr)
        sys.exit(1)

    entries, warnings = parse_manifest(MANIFEST.read_text(encoding="utf-8"))
    for bad in warnings:
        print(f"Skipping malformed line (need path<TAB>url): {bad}", file=sys.stderr)

    if not entries:
        print("No map entries in manifest.")
        return

    fetched = skipped = failed = 0
    for path, url in entries:
        dest = ROOT / path
        exists = dest.exists()

        if args.list_only:
            mark = "present" if exists else "missing"
            print(f"[{mark:<7}] {path}")
            continue

        if exists and not args.force:
            print(f"skip   {path} (already present; --force to re-download)")
            skipped += 1
            continue

        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            with urllib.request.urlopen(url, timeout=120) as resp:
                ctype = resp.headers.get("Content-Type", "") or ""
                data = resp.read()
            dest.write_bytes(data)
            size = dest.stat().st_size

            # Integrity guards: a 200 can still carry an error page (e.g. S3
            # AccessDenied XML) or a truncated body. Reject anything that isn't a
            # real image so the pipeline never silently tiles garbage. CDN urls are
            # revocable/presigned and do go stale.
            if ctype and not ctype.startswith("image/"):
                dest.unlink(missing_ok=True)
                print(f"REJECT {path}: server returned '{ctype}', not an image "
                      f"(url stale/revoked?). Re-export in Inkarnate and update maps/sources.tsv.",
                      file=sys.stderr)
                failed += 1
                continue
            if size < _MIN_BYTES:
                dest.unlink(missing_ok=True)
                print(f"REJECT {path}: only {size} bytes -- likely an error page, not the map. "
                      f"Check the url in maps/sources.tsv.", file=sys.stderr)
                failed += 1
                continue

            mb = round(size / 1048576, 1)
            print(f"fetch  {path} ({mb} MB)")
            fetched += 1
        except Exception as exc:  # noqa: BLE001 -- surface any fetch failure per-entry
            print(f"FAILED {path}: {exc}", file=sys.stderr)
            failed += 1

    if not args.list_only:
        print("")
        print(f"Done. fetched={fetched} skipped={skipped} failed={failed}")
        if failed > 0:
            sys.exit(1)


if __name__ == "__main__":
    main()
