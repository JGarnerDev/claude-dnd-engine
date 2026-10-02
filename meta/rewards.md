---
type: meta
tags: [guideline]
---

# Reward Guidelines

The other half of `meta/difficulty.md`: difficulty sets what a session *costs*, this sets what it *pays*.

Campaign-agnostic. Act-level and campaign-level tuning overrides anything here — when an act file names its own loot emphasis or its own economy, that file wins.

## Calibration Baseline

- **Party level:** derived live, never hard-coded here. Source of truth is each PC's `level` field (`historian/characters/pcs/`), surfaced by `party-status.py`. The numbers below are tuned to **5 PCs at level 4–5** (tier 1 into tier 2); scale by tier per *Scaling* below.
- **Sessions per level:** no fixed cadence — the DM calls each level-up when the fiction earns it (see *Experience & Leveling*). Soft band: **2–4 sessions per level** at tier 1–2. If three sessions pass with no level *and* no named trigger in sight, the pace has drifted.
- **Gold pace:** normal/fun. Enough to equip and to buy into a base; never enough that coin solves the session.

## Gold & Currency

Ranges are **party totals**, not per-PC. Divide by table size for the per-PC feel.

| Context | Range |
|---|---|
| Minor reward (small job, pickpocket, loose loot) | 10–50 gp |
| Standard session reward | 100–250 gp (~20–50 gp/PC at a table of five) |
| Major reward (quest completion, big haul) | 300–700 gp (≈ one base room at 250–500 gp) |
| Exceptional reward (rare, climactic) | 1,000–2,500 gp, usually paired with an Uncommon item |

Anchors these numbers are tuned against:

- **Base construction** runs 250–500 gp per room, so one major reward buys roughly one room — a party that banks every major payoff grows its base at about a room per arc.
- **Passive base income** runs ~25 gp/PC per downtime at a starting stake, deliberately *below* a standard session reward. The base supplements adventuring; it never replaces it.
- A full **8-session season** at this table pays roughly 2,500–3,500 gp, split between personal gear and base reinvestment. That total is the dial to check first when the economy feels off.

**Scaling:** multiply the whole table by **~2.5 per tier** — ×1 at levels 1–4, ×2.5 at 5–10, ×6 at 11–16. Tier-1 ranges stop meaning anything the moment a PC can afford plate.

**Coin is not the default payout.** Where a reward would be a dull pile of gold, pay a favor, a contact, a deed, or an unlock instead — see *Narrative Rewards*.

**Specific items for specific PCs:** `meta/loot-options/` holds a folder per PC (`weapons/`, `armor/`, `misc/`, one item per file) totalling five options each — one weapon, one piece of armor, three misc — stamped for the party's current level bracket and argued from each character's sheet and each player's observed table behavior. Those items carry **no plot**: nothing in them is tied to a location, NPC, or open thread, so a session picks the item that fits the scene rather than an item committing the campaign to a hook. Nothing in that folder is canon; it is a menu, not an inventory of things that exist.

## Magic Items

- **Philosophy:** scarce but present, and never anonymous. Magic is wondrous, not shop stock — every permanent item should be traceable to who made it, who gave it, or where it was pulled from. An item with no story is a stat block, and stat blocks are forgettable.
- **Rarity frequency:** Common is free-flowing as flavor and consumables. Uncommon is the act-payoff tier — budget roughly **one per PC per act**. Rare is climactic only, at most once an act. Very Rare and above does not appear before tier 3.
- **Items carry progression when levels do not.** When the party is deliberately held at a level across several sessions, items *are* the progression mechanic — budget at least one meaningful item per PC across that stretch, and personalize some of them to a specific PC as a spotlight beat (`meta/character-focus.md`). A held level with no item compensation is the single failure mode this file exists to prevent.
- **Attunement stance:** RAW 3-slot limit, tracked on the PC sheet. Enforced strictly — the limit is the only thing that makes an Uncommon choice a choice.
- **Crafting / purchasing:** no magic shops. Consumables (potions, scrolls) are buyable in a town of any size. Permanent items come from loot, quest payoff, or **crafting at a station the party built or earned** — which is how sprinkled Common/Uncommon loot becomes something personalized, and why a workshop is worth building.

## Narrative Rewards

Given freely — they are the cheapest payout and the most durable one. Any session where the party helps someone should pay something non-material.

- **Favors** — a named NPC owes one concrete thing. Earned about one per real help-a-local beat; spend them visibly.
- **Standing** — reputation with a town or faction, written into the entity's `disposition` / `affinity` rather than narrated and forgotten.
- **Access** — safe houses, neutral ground, a room of their own, a seat at a lord's table.
- **Secrets and leverage** — information worth money or safety to somebody else.
- **Titles and deeds** — ownership stakes, land, a name the town uses for them without being asked.

**Test:** every narrative reward must be recordable as a frontmatter change on some entity. If it can't be written down, it was flavor, not a reward.

## Experience & Leveling

- **System:** hybrid — **milestone levels with an announced track**. The DM decides *when*; the players always know *what's next*.
- **The contract:** before a level is due, the DM names the trigger out loud, in fiction or out of it ("one more raid turned and you'll have grown into this"). Pace is on-the-fly and entirely the DM's call — the *visibility* is not optional. An unannounced level-up is the thing players read as arbitrary, and that reading is what this system is built to avoid.
- **No XP bookkeeping.** Combat is not the faucet, so a roleplay-only session can still level the party.
- **Pacing notes:** 2–4 sessions per level at tier 1–2 (soft band — see *Calibration Baseline*). Level-ups land best on act beats and base-building ladder ticks, not mid-arc. When a level is deliberately held, say so at the table and let loot carry the weight.
