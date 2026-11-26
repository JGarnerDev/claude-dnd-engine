---
name: "Player guide template"
type: player-guide
pc: "<PC name, as in historian/characters/pcs/>"
player: "<player name>"
rules: "2024"
level: 1
class: "<class and subclass, with multiclass levels>"
guide_confirmed: 0
---

A player's guide to their own PC's turn, shown on the app's Player guide page
(`http://localhost:5177/player.html`). `/player-guide <PC>` writes and refreshes it. One file per
PC: `meta/player-guides/<PC>.md`. Files starting with `_` are not shown, and neither is text
before the first `##` (keep it empty, or use it for a note to whoever edits the file).

### What a player provides

1. **Their PC's sheet:** a current Roll20 export, ingested into the PC file. The guide is only as
   good as the sheet.
2. **Rules edition:** 2014 or 2024.
3. **Their plan for the build**, if they have one (classes, feats, a level they stop at).
4. **What they want from it:** more damage, more support, staying alive, or a mix.
5. **House rules and homebrew items** the guide should account for.

### Rules for the content

- **Player-safe only.** Built from the PC file, the party's PC files and what the table has seen.
  Never from DM-only material: scheduler plans, `DM-only` blocks, `scheduler/campaign/_*.md`,
  `meta/loot-options/`, PC arcs.
- **Strategies cover enemy types the party has met, or common ones**, never what the DM has planned.
- **No Roll20 overlap:** no full sheet, dice, HP tracking, spell text or inventory. Name a feature
  and say when to use it.
- **No tables, no wikilinks.** Headings, bullets and numbered lists only; the page renders them.
- **Shape it for the page.** The page turns each `###` group into a card of tappable plays and
  searches them all, so:
  - Every bullet starts with a bold lead, `- **Divine Smite:** when…`. The lead is the tile's label;
    the rest opens under it. A bullet with no lead shows as plain text.
  - Every Strategies group uses the same leads in the same order (`**Team:**`, `**<PC>:**`), so the
    page shows one tile per enemy type.
  - Notes and Roleplay are not plays: `## Notes` and `## Roleplay` stay out of the tabs and the
    search.
- **Stamp it:** `level` is the PC's level the guide was written for and `guide_confirmed` the last
  session it was checked against. `/recap` restamps `guide_confirmed` after each session the PC
  plays. The page warns when the PC file's `level` moves past `level`, or when the PC has played
  two or more sessions past `guide_confirmed`.

## Turn

What to do with each part of the turn: one group each for the PC's own options: `### Action` (the PC's own actions, then a
`#### Any creature can` divider over the 2024 actions everyone has: Dash, Disengage, Dodge, Help,
Hide, Influence, Magic, Ready, Search, Study, Utilize, with a note where one suits this PC),
`### Bonus action`,
`### Reaction`, `### Movement`, and `### Free (no action)` (speaking, the free object
interaction, dropping prone, and any table ruling or feature that takes no action). Every
bullet's detail says what the play **does** (the effect, damage or healing, with numbers), then
when to use it. "When a called enemy attacks someone else" is only a trigger; say what happens.

Tag every spell's lead with its level and, if it needs concentration (2024 rules),
`concentration`, in any tab: `- **Bless (1st, concentration):** …`, `- **Shatter (2nd):** …`,
`- **Vicious Mockery (cantrip):** …`. The page drops the tags, lists a card's spells under a
**Spells** divider with one sublist per level (Cantrips, 1st level, …), and shows a **C** badge
on the tile. Level tags are for this PC's own casts in Turn; a combo or an ally's spell takes
only `(concentration)`, and an unled mention says `(concentration)` after the spell's name.

End a leveled spell's detail with `Upcast: …`, what a higher slot adds, with the number at this
PC's next slot level (`Upcast: +1d6 per slot level above 1st (4d6 with a 2nd).`). Say
`Upcast: nothing more.` when a higher slot adds nothing. A cantrip says how it grows with the
character's level instead. The page shows the upcast on its own line under the play.

## Combos

Plays alone, then one subsection per party member.

## Strategies

One subsection per enemy type: a **Team** line (the party plan) and a line for this PC's part.

## Build

Where the PC is, then the paths through the next five levels and feats for each ASI.

## Notes

Not a tab: the page shows these as small panels in a column beside the plays (folded above them
on a phone). Each `###` group is one panel of `- **Lead:** detail` bullets; keep them short.

### To do

Things the player has to do or decide: a stale sheet to re-import, a choice the sheet is missing,
a question for the DM. The page gives each a checkbox that stays ticked in that browser. End a
lead with `(at the table)` when it can only be done in session: `- **Ask the DM (at the table):** …`.

### Remember

The rules that trip this PC up, one bullet each.

### Currently

Where the PC stands in the campaign now, so the player stays on the mission: where the party is,
the mission or act, what's next, and the open mysteries that touch the PC, then the party's. Draw
it from the latest session's player-facing recap slides (`Where you stand`, `Next`, `Mysteries &
Loose Ends`), never from scheduler plans or DM-only notes.

## Roleplay

Not a tab: the page shows these as panels in a column at the left of the plays (under Notes on a
mid-size screen, folded above the search on a phone). One `###` group per character the PC
plays off, plus `### Your tells` for the PC's own habits. Each bullet is a hook:
`- **Lead:** detail`, short. Player-safe only: what happened at the table and what the others
showed there, never another PC's private backstory or anything DM-only.
