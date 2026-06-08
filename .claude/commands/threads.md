Surface forgotten or unresolved campaign threads. Combines state-based scanning with semantic ranking against current story state.

**Arguments:** none required
- `-k <n>` — number of semantic results to surface (default: 10)

---

## Behavior

Read-only. No generation, no file writes. Surfaces what the campaign is forgetting.

---

## Phase 1 — Get Current Story State

Run:
```powershell
.\scripts\session-state.ps1
```

Extract: current cliffhanger (or most recent historian session cliffhanger), active mission hook, current act goal. This becomes the semantic anchor for relevance ranking.

---

## Phase 2 — State-Based Scan

Scan `historian/` frontmatter for entities with unresolved states:
- `state: missing`
- `state: imprisoned`
- `state: transformed`
- `state: unknown`
- Characters with `disposition: hostile` who have no recent session reference

Note each entity's name, type, and state.

---

## Phase 3 — Semantic Ranking

Run semantic search using the story anchor from Phase 1:

```powershell
.\scripts\semantic-search.ps1 -Query "<cliffhanger + mission hook text>" -Source historian -K <k>
```

Then run against pool to surface free entities the story may be ready to use:

```powershell
.\scripts\semantic-search.ps1 -Query "<cliffhanger + mission hook text>" -Exists false -K 5
```

---

## Phase 4 — Present Threads Report

Combine Phase 2 (state-based) and Phase 3 (semantic) results. Deduplicate. Present ranked by combined signal — semantic score weighted higher for historian results, state flag weighted higher for pool results.

Format:

**Unresolved (state-flagged):**
- [Name] (type) [state] — one-line note on what's unresolved and why it may matter now

**Semantically relevant (historian):**
- [Name] (type) score=X.XXX — one-line note on connection to current story

**Pool candidates ready to enter play:**
- [Name] (type) score=X.XXX — one-line note on thematic fit

End with:

> "Any of these worth pulling into the next session?"
