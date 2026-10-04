Build or refresh a flow graph set — bird's-eye mermaid maps of an act and its sessions, showing what happens when and where, which branches the party is likely to take, and which beats are committed enough to run.

**Arguments:**

- `[act]` — act name or slug (default: the active campaign's active act)
- `--session <n>` — regenerate only that session's file
- `--status` — report commitment coverage and exit; no writes

---

## Behavior

Writes a folder of markdown files, one mermaid graph per file. Read-only with `--status`.

**Never invents design.** The graph maps what the drafts already say. A gap is drawn as a gap.

**Never self-commits.** Markers move `[-]` → `[x]` only on the DM's explicit approval. See the
commit gate in `meta/flow-graphs.md`.

---

## Phase 0 — Conventions

Read `meta/flow-graphs.md` once. It carries the id scheme, the commitment markers and their gate,
the seven node classes with their exact `classDef` lines, the drawing rules, and the honesty rules.
Everything below assumes it.

---

## Phase 1 — Locate the act and declare scope

Run:

```text
uv run scripts/session-state.py
```

Identify the active campaign and act. If `[act]` was given, use that instead.

Find the act's working material. Two places, both may exist:

- `scheduler/acts/<act>.md` — the canon act file; `relates_to` names its entities
- a workshop directory for the act, if one exists — beat sheets, topic deep-dives, drafts,
  mission backlog

**Declare the read scope before opening bodies** — list the files you intend to read and why, per
the root CLAUDE.md reading protocol. A flow graph needs the act file plus every session beat sheet
plus the topic docs the beat sheets cite; it does not need the whole entity graph.

If the act has no workshop material and no mission artifacts, stop and say so. There is nothing to
map yet, and generating a graph from an act file's four-line session list produces a picture that
looks more designed than the act is.

### Spitballs aimed at this act

Run `uv run scripts/spitball-brief.py --target <act-slug>` and note what is filed. Spitballs are
**not** drawn into the graph automatically — they are candidates the DM may want promoted. Mention
them in the Phase 6 report; `/spitball --promote` is what actually lands one, and it lands at `[?]`.

---

## Phase 2 — Reconcile against canon

Before drawing, check the act's `opening_state` against the historian's most recent session for
this campaign. An act designed before its opening session was played may describe a crossing, an
arrival, or a party state that did not happen.

Where they disagree, **the historian wins**. Draw the corrected shape, and put a line in the file's
prose saying which draft is now dead and why. Do not silently draw the old version.

Run `/check <claim>` on anything load-bearing you are unsure of.

---

## Phase 3 — Preserve existing markers

If the set already exists, read every current file and build a map of `node id → marker` plus the
existing commitment ledger entries.

Regeneration **preserves markers by node id**. A node that was `[x]` stays `[x]` and keeps its
ledger line. A node that no longer exists drops out; report it. A node whose upstream changed such
that a `[?]` now sits above it gets flagged, not silently demoted — tell the DM and let them call
it.

New nodes are born `[-]`, or `[?]` when they are a decision or a documented gap.

---

## Phase 4 — Draw

One file per graph, under the act's working directory:

```text
<act-dir>/notes/<act-slug>-flow/
```

- `README.md` — index linking every graph, the legend, the id scheme, the sources list, and an
  open-items list keyed to node ids
- `00-act-spine.md` — `flowchart LR`, one subgraph per designed session, plus act-wide overlays
  drawn with `-.->`: the thread that spans the act, the discoverable chain, the payoff region
- `NN-session-<n>-<slug>.md` — `flowchart TD`, one per designed session
- a final `NN-payoff-slots.md` if the season has slots the act has not designed into

**Then mirror each designed session's graph into its session folder**, if a scheduler artifact
exists for it:

```text
scheduler/sessions/Session {NN} {Name}/_flow.md
```

One graph per file, the session's own, with a short header naming the upstream set and the plan it
maps. This is the copy the DM reads at the table and the copy `/recap` carries into `historian/`;
the set under the act directory stays the live source. `--session <n>` regenerates exactly that
pair — the set file and its snapshot. Writing the snapshot into a tracked path is a graduation
step when the set lives under a gitignored working directory: **ask first**, per
`workshop/CLAUDE.md`.

Each session file opens with its date if known, its difficulty rating, and any rulings baked into
the drawing. Each closes with 2–4 sentences of prose that reference node ids directly — the prose
exists to explain *why* a branch is shaped that way, not to restate the labels.

Every file ends with its **Commitment ledger** section.

---

## Phase 5 — Verify

Three checks, all cheap:

1. **Marker and id match the label.** Every node's label must begin with `[marker] NODE_ID` where
   `NODE_ID` is the literal mermaid node id. Verify mechanically, not by eye.
2. **Lint.** This is bulk generation, so run it:

   ```text
   npx markdownlint-cli2 "<act-dir>/notes/<act-slug>-flow/*.md"
   ```

3. **Coverage.** Run the status report:

   ```text
   uv run scripts/flow-status.py
   ```

---

## Phase 6 — Report

Tell the DM:

- how many nodes, across how many files
- commitment coverage — committed, draft, open
- what Phase 2 found: any draft the historian contradicted
- what the graph surfaced that the drafts do not carry — a beat locked in a topic doc but absent
  from the session beat sheet is the common one, and it is the main reason this command earns its
  cost
- which `[?]` nodes block which `[-]` nodes, so the DM can see the critical path to committing

Then offer the commit pass: walk the `[-]` nodes against the gate, propose which now qualify, and
let the DM approve them one by one. **Propose; never flip.**

---

## Closing suggestion

If nodes were committed this run, suggest `/session` to turn the committed spine into the actual
session plan. Otherwise suggest nothing.
