"""Handout cards: a session folder's handouts/*.html, each with its published artifact link.

A card records where it is published in a tag in its <head>, written after the first publish:
  <meta name="artifact-url" content="https://claude.ai/artifact/...">
Every edit republishes from the same file to the same URL, so the link stays put
(meta/loot-options/README.md -> Item cards). Plans name a card by its path
(`handouts/tithe-title-card.html`); the session runner turns that into a link.
"""

import re
from pathlib import Path

from lib.common import read_text_no_bom

URL_RE = re.compile(r'<meta\s+name="artifact-url"\s+content="([^"]+)"', re.IGNORECASE)
TITLE_RE = re.compile(r'<title>(.*?)</title>', re.IGNORECASE | re.DOTALL)
CARD_REF_RE = re.compile(r'`((?:[^`\s]*/)?handouts/[^`\s]+\.html)`')


def cards(folder: Path) -> list:
    """[{path, title, url}] for every card in the folder's handouts/, url '' when unpublished."""
    out = []
    d = folder / 'handouts'
    for f in sorted(d.glob('*.html')) if d.exists() else []:
        text = read_text_no_bom(f)
        u, t = URL_RE.search(text), TITLE_RE.search(text)
        out.append({
            'path': f'handouts/{f.name}',
            'title': re.sub(r'\s+', ' ', t.group(1)).strip() if t else f.stem,
            'url': u.group(1) if u else '',
        })
    return out


def card_refs(text: str) -> list:
    """Card paths a plan names in backticks, in order, deduped, as handouts/<file>."""
    seen = []
    for p in CARD_REF_RE.findall(text):
        p = 'handouts/' + p.rsplit('handouts/', 1)[1]
        if p not in seen:
            seen.append(p)
    return seen
