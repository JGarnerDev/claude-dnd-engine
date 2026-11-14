---
type: meta
tags: [narration]
---

# Narration cast

Who speaks in which voice when `/narrate` renders a take (`meta/narration.md` → Casting). One
bullet per speaker, read by `scripts/narrate.py`. `clip: default` is Chatterbox's built-in
voice; any other clip is a file under `narration/voices/` (gitignored, made with
`narrate.py --seed` and `--keep`). `exaggeration` (0.25–1.0) is how much feeling goes into it;
`cfg_weight` (0.2–0.8) is pace, lower is slower. `from` is the `voice:` core the cast was chosen
from, so a recast can tell whether the NPC has changed.

## Cast

- **narrator** — clip: voices/narrator.wav · exaggeration: 0.5 · cfg_weight: 0.45 · from: "Kokoro bm_lewis (Jeff, 2026-11-14); remake with --seed narrator --voices bm_lewis, then --keep narrator=bm_lewis"
- **Silas Crubb** — clip: voices/silas-crubb.wav · exaggeration: 0.55 · cfg_weight: 0.4 · from: "Affable small-town drawl that always lands on a number. Shrewd, never predatory, slow to commit."
- **Sable Wren** — clip: voices/sable-wren.wav · exaggeration: 0.45 · cfg_weight: 0.5 · from: "Practical and dry: acts first, thanks later. Blunt to the point of swearing when pushed, warm under it, never explains herself."
- **Mara Tull** — clip: voices/mara-tull.wav · exaggeration: 0.35 · cfg_weight: 0.45 · from: "Short, plain soldier's report: what happened, how many, what's next. Gives an order once."
- **Hob Fenner** — clip: voices/hob-fenner.wav · exaggeration: 0.6 · cfg_weight: 0.5 · from: "walk-on: Ashford's cooper"
- **Pell Ashby** — clip: voices/pell-ashby.wav · exaggeration: 0.55 · cfg_weight: 0.5 · from: "walk-on: Ashford's lamplighter"
