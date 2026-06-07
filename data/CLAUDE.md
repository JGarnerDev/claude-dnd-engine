# Data

## Free Entity Rule

Entities in `./data` with `exists: false` are **free** — available to be used in session content. Entities that get played and canonized move to `./historian` with `exists: true`.

**When generating or planning content that requires an entity:**
1. First search `./data` for a free entity (`exists: false`) of the needed type.
2. If one exists, use it — do not invent a new one.
3. If none exists, **stop and ask the user** before creating anything. Present the gap clearly: what type is needed, why, and ask whether they want to create one or proceed differently.

Never silently generate a net-new entity during session planning or content generation. The data pool is intentional — running it low is meaningful signal, not a problem to paper over.

## Data Entity Transparency

When suggesting a `./data` entity for use, always surface its gaps inline:

- **Inferred detail** — anything you're filling in beyond what the file explicitly states. Flag it: *"[inferred: motivation assumed to be X]"*
- **Missing detail** — fields relevant to the planned use that are absent from the file. List them: *"[missing: combat stats, known location]"*

Do this per entity, at the point of suggestion — not as a separate section. Keep it brief; one line per gap is enough. The DM decides whether to fill gaps before play or leave them loose.

## Contribution Balance

Every entity has an optional `contributed_by` field (values: `paul`, `ben`, `miguel`, `jeff`). Use this to keep player contributions roughly equal over time.

**When choosing between comparable free entities of the same type**, prefer the one whose `contributed_by` player has the fewest entries in `./historian`. If contributions are unequal, note it briefly: *"Pulling from Paul's pool — Ben and Miguel are underrepresented."*

**When planning a session**, if one player's entities dominate the candidate pool, flag it and suggest pulling from another player's material where the story permits.

**To check current balance** at any time: run `.\scripts\contribution-balance.ps1` — shows pool vs. canonized counts per player and identifies who is next up. To see one player's available entities: `.\scripts\free-entities.ps1 -Player <name>`.

Do not force balance at the expense of narrative fit. Flag the gap; let the DM decide.
