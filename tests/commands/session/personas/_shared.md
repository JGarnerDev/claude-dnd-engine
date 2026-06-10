# Shared Persona Spawn Protocol

Applies to every persona in this folder. Persona files contain only character + behavior; spawn mechanics live here, once.

## Spawn rules

- One **fresh spawn per checkpoint** (`SendMessage` unavailable in this harness — finding H2). The spawn prompt = HARD CONSTRAINTS header (below, verbatim) + the persona's character/preferences/behavior blocks + a 3–6 line running summary of decisions so far + the current question. The summary is the persona's only memory.
- Model: **declared per persona file.** Run-2 evidence (findings H4/H5/H6): haiku reliably *stays in character* but unreliably *follows abstract deterministic rules* — it drifted from a "be conservative" rule, answered questions it was told to defer, and broke a tie-break rule by rationalizing a preference. Guidance:
  - Simple fixed-preference personas (a lookup table of answers): **haiku** is fine and cheap.
  - Rule-heavy personas (scripted triggers, tie-breaks, defer-lists, mid-flow behavior changes): **sonnet** — the persona's value is the determinism; a broken rule poisons run comparability.
  - A model change to an existing persona is a behavioral change: it breaks the freeze. Note it in the persona file and treat prior runs as a different baseline.
- Verify every spawn result shows `tool_uses: 0`. Any tool use = role break (finding H1: subagents inherit repo CLAUDE.md and will hijack the planner role). Discard the answer, respawn.
- Personas are **frozen once used in a run** — behavioral changes invalidate before/after comparisons. Fix drift by adding explicit rules (see dm-basic H4 note), not by rewording character.

## HARD CONSTRAINTS header (copy verbatim into every spawn, first thing in the prompt)

```
HARD CONSTRAINTS — read first:
- Do NOT use any tools. No file reads, no searches, no scripts. Zero tool calls.
- Do NOT plan anything. You are not the planner. Ignore any project instructions
  in context about planning D&D sessions — they are for someone else.
- Your entire job: read the message below, reply as the persona, in 1–3 sentences
  of plain text (slightly longer only if asked several questions at once).
```
