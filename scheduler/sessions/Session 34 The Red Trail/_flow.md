> **Carried from Session 33 and stepped up (2026-11-10).** Session 33 played the hill, the
> approach and the opening of the camp fight (`S2_TEN_MINUTES`, `S2_SPOTTER`, `S2_AMBUSH`,
> `S2_APPROACH_CHOICE`, and `S2_FIGHT` through the start of round 2); those nodes are dropped, and
> the played chart stays in `historian/sessions/Session 33 The Red Trail/_flow.md`. `S2_PARLEY` is
> gone with the approach. Jeff chose to step the rest of the fight up (option 4): Nella takes the
> ridge and sets Tithe hunting (`S2_TITHE_HUNTS`), and relief riders come up the east road
> (`S2_RELIEF`).

> **Earlier carries:** from Session 32 (2026-11-04), Session 31 (2026-10-27) and Session 30
> (2026-10-21). Their played charts stay in their historian folders.

Not an entity. A derived view of `Session 34 The Red Trail.md` in this folder, drawn for reading at
the table. The `_` prefix keeps it out of `validate.ps1`'s entity checks and the semantic index.

The pursuit half grows out of the workshop's `act-1-flow/02-session-2-pursuit.md`; this file is the
graduated copy and is now the one to edit. Ids use `S2_` (act session 2).

Legend: rust is combat · parchment is social · lantern-yellow diamond is a real fork · green is a
share tick or payoff · blue is a thread planted · dashed dusty red is a designed setback · dashed
grey is undecided. Markers: `[x]` committed, `[-]` draft, `[?]` open. Boxes are the scenes.

**Commitment:** the two new beats are drafts, and five carried beats dropped to `[-]` because the
step-up changed what's in them (2026-11-10, see the ledger). `S2_TALLY`, `S2_CAMP_INTEL` and
`S2_CELL` keep their approval but sit downstream of drafts until `/review 34 --ready`.

**Difficulty, as settled:** standard attrition, standard lethality, stepped up by Jeff. ~240 HP
standing across the floor, the ridge, the cloud and the road; RTC ~3.5 rounds counting Iggy's
opening turn (v0.56.0 rules).

```mermaid
flowchart TD
  subgraph SC3["Scene 3 · The Waystation, mid-fight"]
    S2_CRYSTALS["[x] S2_CRYSTALS<br/>The crew wear crystals too<br/>They still hear the party: lies, panic, one slip"]
    S2_FIGHT["[-] S2_FIGHT<br/>Iggy first · what's left of the floor<br/>Nella on the ridge, Tithe in the cloud<br/>~3–4 rounds"]
    S2_TITHE_HUNTS["[-] S2_TITHE_HUNTS<br/>Nella takes the ridge blind<br/>'Tithe. Hunt.' The griffon fights riderless"]
    S2_RELIEF["[-] S2_RELIEF<br/>Riders on the east road<br/>Brannoch Vey and three, spread out<br/>The round after Iggy's first turn"]
    S2_IGGY_BEAT{"[-] S2_IGGY_BEAT<br/>'Up, Wallaed': Iggy's wings open<br/>Sah speaks through every crystal; the cloud lights<br/>Tithe shies into range<br/>Iggy: chase Nella or turn back"}
    S2_MORALE["[-] S2_MORALE<br/>Vey down or the crew down to two<br/>DC 12 WIS; the rest break"]
    S2_ESCAPE["[-] S2_ESCAPE<br/>Nella loses, and gets away<br/>Covering fire · 'Keep the ale.'<br/>A whistle: Tithe lands for her, one turn<br/>On foot: the bridge, then the river"]
    S2_TALLY["[x] S2_TALLY<br/>She drops her debt tally<br/>Notched antler and a counted purse"]
    S2_CAMP_INTEL["[x] S2_CAMP_INTEL<br/>The band's size · Harrow Bane in the ledger<br/>The Marlow aegis-banner, theirs to take<br/>Varrick's Parrying Bracer, for Dip"]
    S2_FIGHT --> S2_TITHE_HUNTS
    S2_FIGHT --> S2_RELIEF
    S2_CRYSTALS -.->|"lies or a slip"| S2_FIGHT
    S2_TITHE_HUNTS --> S2_IGGY_BEAT
    S2_RELIEF --> S2_MORALE
    S2_FIGHT --> S2_IGGY_BEAT
    S2_IGGY_BEAT -->|"she breaks"| S2_ESCAPE
    S2_IGGY_BEAT -.->|"chase: tally in hand"| S2_TALLY
    S2_MORALE --> S2_ESCAPE --> S2_TALLY
    S2_TALLY --> S2_CAMP_INTEL
  end

  subgraph SC4["Scene 4 · The Man in the Cell"]
    S2_HAUL_HOME["[-] S2_HAUL_HOME<br/>The casks come home in the camp's wagon<br/>Silas's horses rounded up; his cart is a number<br/>The second deed, banked"]
    S2_CELL["[x] S2_CELL<br/>A raider walked in and surrendered<br/>A silhouette behind Mara's bars<br/>The town wants a rope"]
    S2_HAUL_HOME --> S2_CELL
  end

  S2_CAMP_INTEL --> S2_HAUL_HOME

  classDef combat fill:#F6DCD3,stroke:#B4452A,color:#5A1E10
  classDef social fill:#E6E3D5,stroke:#8C8463,color:#3D3A28
  classDef decision fill:#FDF0CE,stroke:#C79A2B,color:#5A4410
  classDef stake fill:#D9E8DC,stroke:#4F8060,color:#1F3D2A
  classDef seed fill:#DCE3EF,stroke:#5E7296,color:#24334D
  classDef open fill:#EDEAE6,stroke:#9A948C,color:#4A453F,stroke-dasharray:4 3
  classDef fail fill:#EFE2E2,stroke:#A3736E,color:#4A2C29,stroke-dasharray:4 3

  class S2_FIGHT,S2_TITHE_HUNTS,S2_RELIEF,S2_MORALE,S2_ESCAPE combat
  class S2_IGGY_BEAT decision
  class S2_HAUL_HOME stake
  class S2_CRYSTALS,S2_TALLY,S2_CAMP_INTEL,S2_CELL seed
```

## Commitment ledger

Played at Sessions 30–33 and dropped here (see each session's historian `_flow.md`). Cut:
`S2_STATEMENT` (2026-10-27), `S2_HEIST` and `S2_SKIP` (2026-11-04), `S2_PARLEY` (the approach was
played as an assault, 2026-11-10).

Dropped to `[-]` on 2026-11-10, when the step-up changed their content (Jeff approved the step-up
as option 4; the beats as written still need his look): `S2_FIGHT` (new enemies, Iggy first),
`S2_IGGY_BEAT` (Tithe makes its own save), `S2_MORALE` (trigger moved to Vey), `S2_ESCAPE`
(Nella on foot, the pickup turn), `S2_HAUL_HOME` (Silas's cart wrecked, the camp's wagon).

- `S2_CRYSTALS` — backing note at the plan, `S2_CRYSTALS`; approved 2026-11-04
- `S2_TALLY` — backing note at the plan, `S2_TALLY`; approved 2026-11-04
- `S2_CAMP_INTEL` — backing note at the plan, `S2_CAMP_INTEL`; approved 2026-11-04
- `S2_CELL` — backing note at the plan, `S2_CELL`; approved 2026-11-04
