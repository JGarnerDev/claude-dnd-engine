# Spitballs

Loose story ideas, captured without commitment, kept so they can be mined later.

A spitball is a thought that might become an act, a session, an encounter, an NPC, a twist — or
nothing. It is filed the moment it is spoken, developed only as far as interest carries it, and
deliberately **not** held to the standards canon is held to. The value is in the pile: forty
half-ideas with searchable frontmatter beat four polished ones you forgot you had.

Read once per task when writing, developing, or mining spitballs. Written by `/spitball`; filtered
by `scripts/spitball-brief.py`; searchable by meaning through the semantic index.

## What a spitball is not

- **Not canon.** Nothing in `spitball/` is true until it graduates. It is never consulted as a
  source of fact, only as a source of options.
- **Not a pitch.** `/pitch` produces disposable text in chat with no files. A spitball persists.
- **Not an engine idea.** `/idea` handles changes to how the repo works. Spitballs are story.
- **Not a workshop draft.** Workshop material is being actively built toward a session. A spitball
  has no such commitment — it may sit untouched for a season.

## Where they live

`spitball/` at the repo root, **tracked in git**, one folder per target act plus a catch-all:

```text
spitball/
  README.md
  unassigned/                        no home yet — expect this to be the biggest folder
  <act-slug>/                        e.g. act-1-the-hearth-at-ashford/
  <act-slug>/
```

**Act folders use the full act slug**, kebab-cased from the act file's name — not a bare `act-1/`.
Two campaigns can each have an Act 1, and a bare number would collide the moment the other season
resumes.

Most ideas arrive with no target. That is expected and fine: they go to `unassigned/` and move when
a home appears. **Assigning a target moves the file** — the folder is the target, so a stale folder
is a lie.

Filenames are kebab-case slugs of the idea itself: `water-that-remembers.md`.

## Frontmatter

```yaml
---
name: "water-that-remembers"
type: spitball
subtype: thread
exists: false
campaign: homebrew
target: unassigned
state: raw
heat: 4
created: 2026-10-02
updated: 2026-10-02
description: "Asher's blessed water carries memory of what drowned in it."
relates_to:
  - "[[The Golden Lioness]]"
---
```

- **`subtype`** — `act` · `session` · `encounter` · `npc` · `location` · `thread` · `twist` ·
  `item` · `hook`. What shape the idea would take if it became real.
- **`exists: false`** — always. A spitball describes something that has not happened.
- **`campaign`** — `homebrew` · `strahd` · `agnostic`. Same season-axis meaning as everywhere else
  in the repo; `agnostic` when it would work in either world.
- **`target`** — the act it is aimed at, or `unassigned`. Must match the containing folder.
- **`state`** — the lifecycle, below.
- **`heat`** — 1 to 5, the DM's gut excitement. Optional; omit rather than guess. This is the
  field that makes a pile of forty triageable, so ask for it only when the DM volunteers a reaction
  — never interrogate for it.
- **`relates_to`** — wikilinks to existing entities, where the idea obviously touches one. Links to
  things that do not exist yet are **allowed and expected** — `spitball/` is excluded from
  `validate.ps1`'s link check precisely so an idea can name something imaginary.

## Lifecycle

- **`raw`** — filed, barely developed. The default on creation.
- **`developed`** — riffed on; has enough substance to be planned from.
- **`used`** — mined into a real plan. The plan must carry the substance itself, not a link back here.
- **`parked`** — good, not now. Deliberately set aside rather than forgotten.
- **`killed`** — rejected. Kept so it is not re-proposed, with a line saying why it died.

**Spitball documents may be deleted at any time - do not rely on linking them. If the information seems important, suggest relocating it.** Every spitball file carries that line as a blockquote right under its frontmatter.

- **Never link to a spitball** from canon, plans, player files, `/todo`, or anywhere else outside
  `spitball/`. A link breaks the moment the file goes.
- **Relocate, don't point.** When something in a spitball starts to matter (a plan uses it, a
  player is cast for it, a todo depends on it), copy the substance to where it belongs and suggest
  doing so to the DM.
- Keeping `killed` ideas is still useful (it stops re-proposals), but nothing may depend on one
  surviving.

## The capture rule

**File first, develop second.** The idea goes to disk on the first turn, before any riffing. The
common capture context is a phone, in bed, over a remote-control session — a dropped connection
must not cost the idea. Every follow-up turn updates the same file and bumps `updated`.

**The one exception: a bare entity name is not an idea.** `/spitball Nella` is a request to be
reminded where something stands before thinking about it, so it writes nothing — it answers with
about four lines on the entity's current situation and asks what the DM wants to explore. The
*next* message is the idea, and the capture rule applies to it in full, with the entity
pre-populated in `relates_to`. A name wrapped in a proposition (`what if Nella turns on Bane`) is
an idea, not a lookup; when genuinely torn, file it — a filed idea is recoverable, a lost one is
not.

Corollaries:

- **Do not interrogate.** One line of input is a complete request. Infer `subtype`, `campaign` and
  `target` from context and the active campaign; get them wrong rather than ask three questions.
- **Keep the confirmation short.** A phone screen holds a few lines. Name the path, show the
  expansion in two or three sentences, offer to push further. Nothing else.
- **Never block on a missing field.** `heat` unset, `target: unassigned`, a vague `subtype` — all
  fine. A filed rough idea beats a perfect unfiled one.

## Writing style

Spitballs are read on a phone, so the file body follows the same rules as the chat: plain words,
short sentences, and **numbered** ideas and open questions so the DM can refer to them by number.
Mark invented parts "(new)" and parts drawn from existing material "(from canon)". Never renumber an
item the DM has already seen; new items continue the count. Full rules: the "Reading style" section
of `.claude/commands/spitball.md`.

## Mining

The pile only pays off if it is read back. Four routes, all live:

- **`uv run scripts/spitball-brief.py`** — frontmatter filtering: by target, subtype, campaign,
  state, heat. The first call of a serious planning session.
- **The semantic index** — spitballs are indexed with `source_dir: spitball`, so
  `semantic-search.py "<text>" --source spitball` finds them by meaning. The facet also lets canon
  searches exclude them, which matters: **a spitball must never surface as if it were canon.**
- **`/session` and `/flow`** surface spitballs matching the act or session being planned, as
  candidates to consider — listed, never auto-adopted.
- **`/spitball --promote <file>`** turns an idea into a `[?]` open node in the target act's flow
  graph, where it enters the commitment ladder described in `meta/flow-graphs.md`. Promotion sets
  the spitball's `state: used` and records the node id.

Promotion is the only path from `spitball/` into planning structure, and it still lands at `[?]` —
never `[x]`. An idea becoming a node is not the DM approving it.

## Honesty rules

- **Do not depend on a spitball existing.** See the rule under Lifecycle: no links in, and
  relocate anything important.

- **Attribute nothing to canon.** When developing an idea, say plainly which parts are invented
  here and which are drawn from existing material.
- **Contradiction is allowed.** A spitball may contradict the historian — that is sometimes the
  point. Note the contradiction in the body rather than silently bending the idea to fit.
- **Do not let a spitball leak.** It is not a source for `/recap`, `/check`, `/voice`, or any
  command that speaks about what is true. It is a source for commands that speak about what could
  be.
