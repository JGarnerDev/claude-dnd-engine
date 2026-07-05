# Affinity Protocol

Affinity is a lightweight, per-target sentiment score: how much one character likes another. It is the single source of truth for the relationship-quantifier feature; commands and scripts reference this file rather than re-teaching the rules.

## What it is

- An **integer −10..+10** held *by* a subject *toward* a target, measuring liking/sentiment.
- Distinct from `relates_to` (a structural graph link) and from an NPC's `disposition` (a general stance toward the world/party). Affinity is **per-target** and finer-grained.
- **Scope:** tracked for **PC↔NPC** and **PC↔PC** pairs, plus **PC→creature-companion** (a named pet/animal a PC keeps). NPC↔NPC is out of scope.

## Storage

Distributed — each subject's file carries an `affinity:` frontmatter map of the targets it feels toward. `A→B` lives on **A's** file. This mirrors the `relates_to` / `known_by` idiom. The integer rides in the paren suffix already sanctioned for link annotations (`meta/entity-creation.md`):

```yaml
affinity:
  - [[Ireena Kolyana]] (6)
  - [[Iggy]] (-2)
```

## Rules

- Range integer −10..+10, **clamped** at both ends.
- An unrecorded pair = **0** (neutral). Absence is the common case — do not fill every pair.
- Self-affinity = N/A, never recorded.
- **Bi-directional:** `A→B` and `B→A` are independent; **no auto-mirroring**. A may adore B while B is cold.

## Bands → behavior

The band lets the DM read stance without memorizing numbers. The raw number is always shown alongside.

| Range | Band | Behavior |
|---|---|---|
| −10..−6 | hostile | sabotage, betray |
| −5..−1 | cool | unhelpful, guarded |
| 0 | neutral | — |
| +1..+5 | warm | helpful, fair prices |
| +6..+10 | devoted | risks self for them |

## Change magnitudes (DM-driven guide, not enforced)

- ±1 — minor moment (small kindness / slight)
- ±2–3 — notable act (saved a life / broke a promise)
- ±4–6 — major (betrayal / sacrifice)
- ±7–10 — defining, rare (love / mortal enemy); usually set outright, not nudged

## Adjustment surface

`/recap` is the structured path. When canonizing a session it translates the Phase 2 "relationship shifts" answer into **proposed** affinity nudges (`subject → target, ±n, one-line reason`), surfaces them as a confirm-list, and writes only what the DM approves — clamping to the range. Manual edits remain possible but are not the primary flow. No staleness stamp — affinity is soft by nature.

## Read surface

`uv run scripts/entity-graph.py --name "<entity>"` prints an **Affinity** block under the entity's relations: each recorded target with its number and band.
