---
type: meta
tags: [guideline]
---

# Loot Options — per-character menus

Nine candidate items per PC, written against `meta/rewards.md`. **Nothing here is canon.** These are menus to pick from, not entities — no file in this folder has `exists`, none is indexed, and none of these items is in the world until one is handed over at the table and canonized through `/recap`.

## Layout

One folder per character, and inside it one folder per item class:

```text
meta/loot-options/
  <Character>/
    README.md          <- character + player read, pick order, caveats
    weapons/
    armor/
    misc/
  Party/
    misc/              <- items shared by the whole party, one copy per PC
```

**`Party/` holds shared items**, one copy per PC. It has no README and sits outside the nine-per-character composition rule. Its item files use `character: Party` and `player: all`, and the two "why" sections argue for the party and the table instead of one character and one player.

**One item per file.** Each item file carries its own frontmatter — `character`, `player`, `item`, `class`, `form`, `rarity`, `attunement`, `bracket`, `status` — so the folder can be filtered or scripted on later without parsing prose. The body is fixed at four sections: what it does, why this character, why this player, and what it becomes at 6–8.

The character `README.md` holds everything that is about the *person* rather than any one object, and links the nine items by name.

## The rule that shapes every sheet

**Items carry no plot.** No option in this folder is tied to a location, an NPC, a faction, a relic, or an open thread. They are built from the character and the player only.

This is deliberate: **the story picks the items, not the other way round.** An item with a hook baked into it quietly commits the campaign to resolving that hook, and nine such items per PC commits it forty-five times over. A sheet of plot-free items stays usable whatever the season turns out to be about — any of them can be dropped into any scene, from any source, and a DM who wants an item to mean something can attach meaning at the moment of handing it over, which is the right time to decide.

Practical consequence: **where an item comes from is not written down here.** That is a session-planning decision, not a property of the object.

## Draft or confirmed

Every item file carries `status:` in its frontmatter:

- **`status: draft`**: an idea. It is the default, and what every item is until the DM picks it.
- **`status: confirmed`**: the DM has committed this item to a specific handout. Add
  `confirmed_for: "Session NN Name"` naming the session it lands in. Confirmed still does not
  mean canon. The item enters the world only when it is handed over at the table and
  canonized through `/recap`.

**Only the DM flips an item to `confirmed`.** Recommending an item, listing it as the best fit,
or finding it a perfect match does not confirm it. The engine never makes that flip on its own
judgment.

**A draft item is never named outside `meta/loot-options/`.** That covers session plans, flow
graphs, missions, acts, the todo dashboard, questionnaires, task notes, and anything else
written to disk. Refer to a draft by its character and slot instead: "a Common from Dip's
folder", "one of Iggy's misc options". A name in a plan reads as a decision, and gets carried
forward as one. Naming items is fine in chat with the DM while picking, because a pick happens
in conversation. Writing a pick down outside this folder waits until the DM confirms it.

Once an item is confirmed, plans may name it, and should cite `confirmed_for` so the link
between item and session can be found in both directions.

## Composition

Each character has **three weapons, three pieces of armor, and three misc**, stated in the character README frontmatter and enforced by the folder layout. The weapon and armor slots exist so every PC has a path to the two things that always matter mechanically, rather than nine pieces of flavor and nothing to hold. Each of those slots runs three deep so the DM has a real choice of *shape* within the slot — typically one Common and one or two Uncommon per slot, hitting different playstyles.

**A deeper menu is not a bigger budget.** Nine options per PC does not change the one-Uncommon-per-PC-per-act ceiling below; it only widens what that one Uncommon can be. Where two options fill the same body slot or overlap mechanically, the item file carries a **Note** section saying so and saying which to prefer.

## Bracket

Every option is stamped for the party's **current bracket: levels 4–5 (tier 1 into tier 2)**. Per `meta/rewards.md` that means a Common ceiling with Uncommon as the act-payoff tier, roughly **one Uncommon per PC per act** — so the Commons sprinkle freely and the Uncommons are the budgeted choice. Each item also carries an **At 6–8** section: what it grows into, so an item handed out now is not dead weight two months from now.

Attunement is strict RAW (3 slots). Items needing a slot say so in frontmatter (`attunement: true`), and each character README tallies the load.

## How each item is built

Every option is argued on two grounds, and an option that cannot make both is not in the folder:

- **The character** — something on their sheet, in their backstory, or in their session history
- **The player** — how that person actually plays, observed from table behavior

Plus a constraint: **nothing here is a flat numerical upgrade with no character reason to exist.** Where a bonus is flat, the flavor earns it.

## A note on the player half

`meta/players/` holds five profiles that are still blank templates (dashboard item 42), so the "how this player plays" reads are derived from **observed table behavior** in the historian session records, not from stated preferences. That is evidence, but it is inference — check each one against the actual person before spending it. The reads are stated explicitly in each character README so they can be corrected rather than silently trusted.

## Characters

- [Iggy](./Iggy/README.md) — Jeff · Aasimar Bard 3 / Paladin 1
- [Dip](./Dip/README.md) — Ben · Half-Orc Barbarian
- [Luci](./Luci/README.md) — Paul · Aasimar (Scourge) Monk
- [Odibli](./Odibli/README.md) — Miguel · Gnome Wizard
- [Halsby](./Halsby/README.md) — Kellan · Shadow Magic Sorcerer
