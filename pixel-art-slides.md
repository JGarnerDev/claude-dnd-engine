# Pixel Art for Recap Slides

Lofi pixel art of characters, items and places, shown beside the text on recap slides. Deferred
out of the recap-slides build (v0.27.0) on 2026-10-10. Jeff: "text only for now, but I'd like us to
be able to make lofi 64bit (?) art of characters, items, etc to go beside the text." Resume with
`/idea pixel-art-slides`. Stage 1 is drafted below; nothing past it is decided.

## Core Ideas

<!-- Stage 1: numbered atomic claims — DRAFT, not yet reviewed with Jeff -->

1. A slide reads better on screen-share with a picture beside the text: a PC, an item they gained,
   a place they reached.
2. The art style is lofi pixel art, consistent across every deck so it reads as one look.
3. An image belongs to an entity (a PC, an NPC, an item, a place), not to a slide, so one portrait
   is reused in every deck that mentions it.
4. A slide names at most one image. A slide with none shows text only, as now.
5. Images stay party-safe like the text: no picture of something the party hasn't seen, and no
   image file named after a secret.

## Key Terms

<!-- Stage 2 -->

- **"64bit"**: to pin down with Jeff. Likely a canvas size (64×64 px, scaled up crisp) or a 16-bit
  console look. Decides the tooling.

## Grounding

<!-- Stage 3 — what is already known; a full scan is still owed -->

1. **Image slot: Exists.** `app/pages/home/session/slides.ts` renders an empty `.sr-slide-art`
   column beside every slide's text (square, hidden under 700 px wide, `slides.css`).
2. **Slide format: Partial.** `meta/recap-slides.md` reserves an image per slide with no syntax yet.
   It needs a line (e.g. `image: <entity name>`) and `scripts/session-cards.py` → `slides()` must
   read it.
3. **Serving files: Partial.** `app/pages/home/session-data-plugin.ts` serves only `.md` under the
   entity layers via `/__entity`. Images need a route or a static folder.
4. **Making the art: Gap.** No image tooling in the repo. Options to weigh: hand-made in a pixel
   editor (Aseprite, Piskel), AI-generated then downscaled to a fixed palette, or a script that
   pixelates a reference image.
5. **Where art lives: Gap.** Candidates: next to each entity (`<entity>.png`), or one `art/` folder
   keyed by entity name. Battlemap renders already go under `maps/battlemaps/` and are layout
   references only (see memory: battlemaps are references).

## What the change looks like to the DM and the Players

<!-- Stage 4 -->

## Action steps

<!-- Stage 5 -->
