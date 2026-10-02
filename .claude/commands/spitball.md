Capture a loose story idea without committing to it — file it immediately, develop it as far as interest carries, and keep it searchable so it can be mined when planning gets serious.

**Arguments (all optional):**

- `[idea]` — the thought, in plain words. One line is a complete request
- `[entity]` — the bare name of an existing entity instead of an idea. Opens with a short reminder of where that entity stands, then asks what you want to explore
- `--list` — browse what is already filed; takes the same filters as `scripts/spitball-brief.py`
- `--promote <file>` — turn a filed idea into a `[?]` node in its target act's flow graph
- `--assign <file> <target>` — move an idea to a different act folder and update its `target`
- `--state <file> <state>` — set `raw` / `developed` / `used` / `parked` / `killed`

---

## Behavior

**Optimized for a phone, in bed, over `claude remote-control`.** Short input, short output, no
interrogation.

Read `meta/spitball.md` once per task — it carries the frontmatter schema, the folder rules, the
lifecycle, and the honesty rules. Everything below assumes it.

**A spitball is never canon** and never a source for commands that speak about what is true.

---

## Phase 1 — Which mode

Two shapes of input, and they behave differently:

- **Entity mode** — the argument is, essentially, just the name of a thing that already exists
  (`/spitball Nella`, `/spitball the Golden Lioness`). There is no idea yet, so nothing is filed.
  Go to Phase 2.
- **Idea mode** — anything else, including a name wrapped in a thought (`/spitball what if Nella
  turns on Bane`). Go to Phase 3.

The test is whether the argument is a bare reference or a proposition. A bare name is a request to
be reminded; a sentence is an idea. When genuinely torn, treat it as an idea and file it — a filed
idea is recoverable, a lost one is not.

Resolve the name against entity files and aliases in `data/`, `historian/` and `scheduler/`. If it
matches nothing, say so in one line and treat the input as an idea. If it matches several, list the
candidates in one line each and ask which — do not guess between two NPCs.

---

## Phase 2 — Entity mode: remind, then ask

**Write nothing.** This mode exists to reload your memory of where something stands before you
think about it.

Run:

```text
uv run scripts/entity-graph.py --name "<entity>"
```

Then compress what it returns into **about four lines** — this is a phone screen, and the script's
raw output is far too long to paste:

- what it is — type/subtype, and `state` if it carries one
- where it stands right now, in one sentence: the current situation, not the full backstory
- the two or three relations that actually matter, named, not the whole list
- anything unresolved or pending that a new idea would most plausibly attach to

Add one more line **only if** either applies:

- spitballs already exist for it — check `relates_to` matches via
  `uv run scripts/spitball-brief.py --all` and name them, so you do not re-file an idea you
  already had
- it appears in a flow graph — name the node ids, so an idea can attach to a known beat

Then **ask one open question** and stop. Something close to "What do you want to explore about
them?" — not a menu, not a list of suggestions, not three prompts. The point is to hand the floor
back, and a page of proposed angles is the opposite of that.

The next message is the idea. Take it to Phase 3, with `relates_to` pre-populated with this entity
and `campaign` inherited from it.

---

## Phase 3 — Idea mode: file it, immediately

Before riffing, before reading anything beyond what is already in context:

1. **Infer, do not ask.** Derive `subtype`, `campaign` and `target` from the idea's own words and
   the active campaign. Getting one wrong is cheap — the DM corrects it in four words, and
   `--assign` exists. Asking three questions on a phone is what kills the habit.
2. **Pick the folder.** The target act's slug folder, or `unassigned/` when there is no obvious
   home. Most ideas are `unassigned/`; that is the designed outcome, not a failure.
3. **Write the file** with full frontmatter, `state: raw`, `heat` omitted unless the DM volunteered
   a reaction, and a body holding the expansion.
4. **Expand briefly** — two to four sentences that make the idea concrete enough to recognise in
   three months. Name the beat, the hook, or the image at its centre. Do not write a design doc.

If the repo context is not loaded (a cold remote session), **still file it**. An idea with a
guessed `campaign` beats a lost one; note the guess in the body.

---

## Phase 4 — Confirm, in a few lines

Phone screens are small. The confirmation is:

- the path written
- the expansion, two to four sentences
- one line of frontmatter worth seeing: subtype, campaign, target
- a single short offer to push further

No tables, no headers, no summary of what you just did. If something was guessed, say which field
in four words so it can be corrected in four more.

---

## Phase 5 — Riff, same file

Every follow-up message in the same conversation **updates the file already written**. Never create
a second file for the same idea unless the DM is clearly starting a new one.

- Bump `updated` on every edit
- Move `state: raw` → `developed` once the body has real substance
- Set `heat` only when the DM expresses a reaction — "ooh", "meh", "this one's great". Never ask
- Append rather than rewrite, so the idea's evolution stays visible

When the DM gives a second unrelated idea, that is a new file. When they push on the current one,
it is the same file.

---

## Phase 6 — Honesty while developing

Keep the invented and the established visibly separate. Where an idea leans on something real —
an NPC, a location, a thread — link it in `relates_to` and say so. Where it invents, say that too.

A spitball **may contradict the historian**; note the contradiction in the body rather than quietly
bending the idea to fit. Resolving it is a later decision, and the tension is often the good part.

---

## `--list` — browsing

Run the brief and present it compactly:

```text
uv run scripts/spitball-brief.py [--target <slug>] [--subtype <kind>] [--campaign <name>] [--state <state>] [--min-heat <n>]
```

On a phone, group by target and show one line per idea: name, subtype, heat, one-clause
description. Nothing more unless asked.

---

## `--promote <file>` — into the flow graph

The only path from `spitball/` into planning structure.

1. Read `meta/flow-graphs.md` for the node conventions
2. Locate the target act's flow graph set. If the act has none, say so and stop — promotion needs
   somewhere to land
3. Propose a node id and the graph file it belongs in, and **ask before writing**. Promotion edits
   a planning artifact; it is not a capture action
4. Add the node as `[?]` **open** — never `[-]`, never `[x]`. An idea becoming a node is not the DM
   approving it
5. Set the spitball's `state: used` and record the node id in its frontmatter and body

---

## Closing suggestion

None by default. Capture should end in silence, not a prompt — the DM is in bed. Suggest a followup
only when `--promote` or `--list` was used and a next step is genuinely live.
