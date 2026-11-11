---
type: meta
tags: [guideline]
default_attrition: standard
default_lethality: standard
---

# Difficulty Guidelines

Difficulty is a two-axis spectrum. **Attrition** and **lethality** are independent dimensions — a session can be grinding but safe, or short but deadly. When planning a session (`/session`), the DM picks one tier from each axis; if none is given, use the defaults in this file's frontmatter.

**Both axes describe combat, and combat is optional.** A session shaped roleplay-only is a valid plan, not a degenerate case of these axes — never invent encounters to fill a budget. For such a session the axes sit inert (the picks carry forward unused, the Rest Clock accrues zero rounds and still gets restamped at recap), and the operative difficulty dial is **Non-Combat Stakes** below.

## Party Profile

- **Level & size:** derived live, never hard-coded here. Source of truth is the `level` field in each PC's frontmatter (`historian/characters/pcs/`), surfaced by `party-status.py`. During `/session` orientation, state the derived level and party size and ask the DM to confirm. **Budget each fight at the level the party will be when it fights it.** If the plan levels a PC before or during an encounter, run the numbers at the new level. A mid-fight level-up can bring Extra Attack, a new spell level or more HP into that same fight. Each PC also carries `level_confirmed: <session number>` — restamped by every `/recap` — and `party-status.py` prints a LEVEL STALE warning when the stamp lags the latest played session, catching level-ups that missed canonization.
- **General power level:** plays above the sheet. Two homebrew fights in a row ended faster than
  planned, the second after the rules below were added to stop it (Session 33: four of ten enemies
  dead before the end of round 1). Assume the party opens with its best area spell and a set-up
  it planned, every time, and size against that, not against its average turn.

## Axis 1: Attrition

How much of the party's resource budget the adventuring day spends. 5e baseline assumption: 6–8 medium/hard encounters per long rest at ~3 rounds each — roughly **18–24 rounds of combat per long rest** — with ~2 short rests. Spell slots, hit dice, and HP are tuned to drain across that full day; a single fight on full resources lets the party nova and trivializes it.

**The budget belongs to the adventuring day, not the session.** Sessions are table-time slices; a session can open mid-day with the party already depleted. The live count of rounds and short rests since the last long rest is the **Rest Clock** — `### Rest Clock` block in the active campaign file's Current State, updated by every `/recap`, staleness-flagged by `session-brief.py`. When planning, remaining budget = tier budget − rounds on the clock. A depleted party also fights as if lethality were one tier higher — pushing past budget is a deliberate difficulty escalation, not a rounding error.

Tiers (rounds of combat per long rest):

- **Light** — ~6–10 rounds. 1–3 encounters. Party ends the day with most resources intact. Use for roleplay-heavy or travel sessions where combat is punctuation, not pressure. **Fewer fights means each fight must be harder.** A party on full resources facing one fight spends its best slots and features in round 1. Size the day's main fight at DMG **Hard or Deadly**, not Easy or Medium, or it will end before the monsters act.
- **Standard** — ~18–24 rounds. The DMG baseline. Resource management matters; the party should feel the squeeze by the last encounter.
- **Grinding** — 30+ rounds. Dungeon crawls, sieges, forced marches. Danger comes from depletion, not any single fight. Short rest access becomes a meaningful tactical question.

## Long Rest Rules

A long rest is what resets the Rest Clock — so when one can be *offered* is a difficulty lever, not a free button. Default 5e (2014 PHB), which this campaign uses unless the DM overrides:

- **Duration:** 8 hours — ~6 hours sleep + up to 2 hours light activity (reading, talking, eating, keeping watch).
- **Once per 24 hours:** a character benefits from only one long rest per 24-hour period, and must have at least 1 hour since the *end* of the last long rest before starting another. This is the gate `/session` enforces with the in-world clock.
- **Interruption:** ≥1 hour of strenuous activity (walking, fighting, casting spells, taking damage) breaks the rest — it must restart for any benefit. A planned rest in unsafe territory is therefore a *scene*, not a guaranteed reset (interrupted-rest encounters are valid attrition content).
- **0 HP:** a character who began the rest with 0 HP gets no benefit.

**Pacing variants** (DMG): gritty realism = long rest needs 7 days; epic heroism = 1 hour. If the DM switches variants, note it in the Rest Clock block — the 24-hour gate scales with it.

**What `/session` must honor:** never offer or assume a long rest unless (a) ≥24 in-world hours since the last long rest started, (b) the location is safe enough for 8 uninterrupted hours, and (c) no PC is sitting at 0 HP. When any condition fails, plan the rest as a scene with stakes (or a short rest) rather than a clean reset. Track in-world time across travel legs and downtime so this gate is always computable.

## Axis 2: Lethality

How capable the monsters are of actually killing a PC. Measured by two numbers and one behavior dial:

- **Rounds-to-down (RTD)** — average PC HP ÷ combined monster damage-per-round when focused on one target. RTD 1 means the encounter can drop a PC every round; RTD 4+ means chip damage only.
- **Spike** — maximum plausible single-round damage against one PC, compared to PC max HP. The instant-death rule triggers when damage ≥ remaining HP + max HP. Save-or-suck riders (paralysis, banishment, hold person) count as spike even without damage.
- **Tactics** — the free lever. Focus fire, attacking downed PCs, intelligent target selection (casters first). The same statblock swings an entire tier on tactics alone.
- **Rounds-to-clear (RTC)** — total monster HP ÷ party damage per round. RTD only counts if the monsters live long enough to act, and RTC says whether they will. Estimate party damage from the sheets: each PC's usual round, with nova options (area spells, Twinned Spell, Extra Attack) counted on a fresh rest. **RTC under 2 means the fight is over before RTD matters**, whatever tier it claims. A fight meant to sting wants RTC 3+.
- **One-hit bodies** — a monster whose HP is at or below one average PC hit usually dies before its first turn. Count each one as **half a body** in the action economy, and expect area damage to remove several at once. Six of them are not six threats. Every fight meant to sting needs at least one creature that survives two average hits.
- **Area damage counts per body hit.** For each area spell the party holds, count how many enemies it reaches *in the plan's own positions*, and multiply. Enemies holding a station together (behind a barricade, around a cart, in a doorway) are a line or a sphere waiting to happen: a Lightning Bolt through four of them is ~100 damage, not the ~28 a single-target estimate books. Put the party's best area spell into party damage once, at full value, whenever the enemy layout allows it.
- **Count round 0.** Readied actions, surprise, free turns before initiative, and set pieces the party plans (a charge, a sprung ambush, a cart driven into the yard) give the party a round before the monsters act. Book it as the party's nova plus its best area spell, take it off monster HP first, and only then compute RTC. **A fight meant to sting wants RTC 3+ after round 0.**
- **Levers when RTC comes out short** (pick by fit, don't stack them all): spread the stations so no line or 20-ft sphere covers more than two bodies · give the anchor enough HP to survive round 0 and two average hits · stagger arrivals, so reinforcements land in round 2 or 3 where the opener can't reach them · keep one threat out of reach until it matters (in the air, behind a door, across water).

Session 33 is the worked example. The plan booked ~85 party damage a round against a 203-HP floor (RTC ~2.4). At the table, a readied Lightning Bolt through four of the crew posted together behind the cart did ~100. With two free turns before initiative, that made ~125 before any enemy acted, and four of the ten were dead before the end of round 1.

Tiers:

- **Soft** — RTD 4+, no spike threats, monsters spread damage and ignore downed PCs. Combat as spectacle and resource tax. PC death effectively off the table.
- **Standard** — RTD 2–3 in the hardest fight of the day, occasional spike from a boss, monsters fight credibly but don't kill-confirm. Death possible through bad luck or bad play, not by design.
- **Dangerous** — RTD 1–2 in set-piece fights, real spike threats, smart target selection. Downed PCs draw opportunistic attacks. The party should retreat from at least one fight they can't win.
- **Lethal** — RTD 1 available to the encounter, spike capable of instant death, full kill-confirm tactics. PC death is an expected campaign outcome, not an accident.

## How `/session` Uses This

1. Resolve the two tier picks **after the story hook is chosen** (`/session` Phase 4 scoping): DM prompt override > DM's scoping answer > frontmatter defaults. Propose tiers that fit the hook and flag discrepancies both ways — a story whose implied intensity contradicts the picked tiers gets reshaped or the tiers get changed, never silently bent. If the session shape is roleplay-only, skip steps 2–4 — plan against Non-Combat Stakes instead, and the Rest Clock simply carries forward unchanged.
2. **Attrition tier** sets the round budget for the adventuring day; subtract the Rest Clock's rounds-since-long-rest to get this session's budget. Near-zero remainder means the long rest is the content — plan it as a scene (interrupted rests included), or push past budget as a deliberate lethality bump.
3. **Lethality tier** sets CR targets and statblock selection (via `monster-lookup.py`), plus a tactics note in each encounter writeup (focus fire? kill-confirm? retreat triggers?).
4. **State the XP band first.** Compare adjusted XP to the party's DMG 2014 thresholds and write the band (under Easy / Easy / Medium / Hard / Deadly) in the encounter writeup. Then sanity-check against the Party Profile above with **RTD and RTC**. XP-threshold tables run inaccurate at high levels and against optimized parties. Use the XP budget as a first pass only, and tune by RTD, RTC and rounds-per-rest.

## Skill Challenge DCs

- **Easy** —
- **Medium** —
- **Hard** —
- **Very Hard** —
- **Nearly Impossible** —

## Non-Combat Stakes

The third dial, and the only one that applies to roleplay-only sessions. Where the combat axes measure resource drain and kill capacity, this measures how consequential social, exploration, and roleplay choices are — what a failed persuasion, a broken promise, or a missed clue actually costs.

<!-- How consequential should social, exploration, and roleplay choices be? -->
<!-- e.g. "mistakes should have real consequences but rarely be permanent" -->
