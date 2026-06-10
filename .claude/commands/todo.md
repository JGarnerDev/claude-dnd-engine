Give the DM a plain-language summary of everything that needs attention or action — outstanding player questionnaires, unfinished drafts, sessions awaiting canonization, engine housekeeping.

**Audience note: the output is for a DM, not an engine operator.** The DM's name appears in the script header (`DM: <name>` — sourced from the active campaign's `dm:` field; currently Kellan). Address them by name where it reads naturally, and never list the DM as someone to "chase" — 🙋 chasing is for players; the DM's own creative calls are just stated as theirs. No frontmatter jargon, no file paths unless the DM would open the file, no internal terms (`exists: false`, "canonize" → say "make official", "stale index" → say "search needs a refresh"). Every line says *what* and *why it matters* in one sentence.

---

## Step 1 — Gather signals (one script call, no manual reads)

```powershell
.\scripts\todo-brief.ps1
```

This collects: uncanonized/pending sessions, recap inbox files, **no-plan-for-next-game-night warning** (game night is Tuesday — sourced from the campaign's Rules Decisions), open threads (characters missing/imprisoned/transformed), graph health (validate error count), index staleness, unchecked `todo.md` items, questionnaire fill states, draft lore/acts/missions, and undeployed design preferences. **Do not re-read the underlying files** — the script output is the complete signal set. Read a file only if the DM asks a follow-up about a specific item.

**Stale-checklist cross-check:** while translating `todo.md` items, flag any that look already done against other signals in the same script output — e.g. a lore file listed as no-longer-draft while its fill-it item sits unchecked, or a "create X" item where X now exists. Present those as *"possibly done — confirm and check off"* rather than as open work. Do not check items off yourself.

**Graph health phrasing:** report the validate count in plain words, and if the errors are the known placeholder world names (world still under construction), say so — "19 broken references, all expected placeholder names" — rather than raising alarm.

## Step 2 — Present, grouped by who acts

Three groups, in this order. One line per item: plain-language what + why it matters. Skip empty groups silently.

**Number every item sequentially across all groups (1, 2, 3… — do not restart per group)** so the DM can reference items in conversation ("tell me more about 7", "do 3"). When the DM refers to an item by number in a follow-up, resolve it against the numbering from your most recent /todo output.

**Tag every item with who can act**, so the DM sees at a glance what to delegate to Claude vs. chase in person:
- 🤖 — Claude can do it now; name the command or script ("say *do 2* and I'll rebuild the search index")
- 🙋 — needs a human: a player filling something in, the DM making a creative call (name them — "Kellan decides"), or manual work outside the engine (image edits)
- 🤝 — joint: Claude drafts or runs the mechanics, but the DM must decide or approve (session plans, canonization, ingesting questionnaires)

Judge honestly: anything requiring taste, approval, or table knowledge is 🤝 at best, not 🤖. Pure script runs, index rebuilds, validation, drafting from existing answers are 🤖.

**🔴 Do soon** — things that block or degrade the next session:
- No plan drafted for the next game night (the single most urgent line when it appears)
- Sessions played but never written up (memory fades — historian drifts from the table)
- Notes sitting in the recap inbox
- A search index that needs a refresh (story suggestions quietly get worse without it)

**🟡 Waiting on people** — things the DM should chase, with names:
- Questionnaires waiting on specific players (name the player, say what the questionnaire designs)
- Filled questionnaires ready to be made official
- Blank preference/difficulty files (say what improves once filled — e.g. "encounters are generic D&D math until difficulty.md is filled")

**⚪ Backlog** — worth knowing, nothing urgent:
- Open story threads (name the characters in plain terms — "the night hag is still out there with the child"; suggest /threads if the list is long)
- Broken cross-references beyond the expected placeholders
- Draft world docs pending questionnaire answers
- Map label work (manual image edits)
- Unused design wishlist count ("N story ideas from the group still waiting for their moment")
- Anything else from todo.md, summarized — collapse long sections to "N items about X" rather than listing every line

## Step 3 — Write the dashboard file

After presenting the list in chat, write the same content to `todo-dashboard.md` at the repo root (overwrite every run — it is a snapshot, not a log). Same numbering, same wording, plus a first line noting the generation date: `*Generated 2026-06-10 by /todo*`. This file is disposable output, not an entity — no frontmatter. Number references in conversation resolve against this file when chat history is unavailable.

## Step 4 — Close with one suggestion

End with a single "if you do one thing today" line — the highest-leverage item, chosen by judgment: an uncanonized session beats everything; otherwise whichever blank file or pending questionnaire most affects the next session.

Keep total output under ~30 lines. The DM should read it in one glance, not scroll.

Open with a one-line themed header (🎲 something fun, vary it run to run) and always close with exactly: **🤘 👑 All hail the DM 👑 🤘**
