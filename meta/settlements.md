# Settlement & Route Conventions

Domain rules for creating and managing settlements (cities, towns, villages, hamlets) and the roads and routes that connect them. Read this before creating any `location-city`, `route`, or road-flavored `location-wilderness` entity. The universal creation protocol stays in `meta/entity-creation.md` — this file adds the settlement-specific conventions on top.

## Settlement & Road Tiers (Minor Places)

The world map's scale governs everything here: **1 grid cell = 1000km × 1000km**, and foot pace is ~30km/day (see `scripts/region-scale.py`). Map dots and registry IDs mark *major* cities only. At this scale a realistic world has a hamlet or waystation roughly every day's walk along any maintained road — thousands of settlements the map cannot and should not show. **Map silence is not world absence** (same principle as `/region`), and the inverse holds too: world presence does not demand an entity file.

**Settlement tiers** — no new schema or subtype. Towns, villages, and hamlets all use `location-city` (`subtype: city`), distinguished by convention:

- Town / large village → `importance: minor`, `population` free-text (e.g. `"~800, market town"`)
- Hamlet / waystation / crossroads inn cluster → `importance: background`
- Minor settlements have **no registry ID** — they sit below map resolution. Skip City Registry Graduation entirely (per its "no registry entry matches" clause).
- **Composition by inheritance:** a minor settlement defaults to the composition of its surrounding region or nearest major city — leave `composition` empty unless the place *deviates* (a dwarven mining hamlet near the range, a tortle fishing village). Unstated composition means standard-D&D human-majority mix per `meta/worldbuilding.md`'s base-setting principle. Never require the field at `background` importance.

**Road promotion ladder** — a minor road earns representation in steps, never all at once:

1. **Narration only** — the default. A road the party merely travels is scene description, not an entity.
2. **`waypoints:` entry** — if the road feeds an existing route, add the settlement or junction to that route's `waypoints:` list. One line, no new file.
3. **Own route entity** (`subtype: trail` or `highway`, `importance: minor`) — only once the road carries play weight: revisited, contested, named in an open thread, or load-bearing for a mission. The existing wilderness-vs-route split still applies (playable stretch → `location-wilderness`; trade edge → `route`).

**When to create the entity at all:** a minor settlement or road becomes a file only when play touches it — the party stops there, an NPC lives there, a thread points at it. Never pre-generate minor settlements to fill space; the travel-leg step in `/session` proposes them as working labels first, and `/recap` canonizes only what the table actually visited.

**Provenance:** minor settlements and roads improvised at the table are DM-created canon, not player pool material. At `/recap` they skip `data/` and are written **directly to `historian/`** with `exists: true`, `source_session`, and `confirmed_date`. The free-entity pool rules do not apply to them.

## Travel Legs (Session Planning)

`/session` reads this section when a plan moves the party overland or by water between known points.

1. **Size the leg first.** The world map scale is 1 grid cell = 1000km. Paces: foot 30km/day, horse 60, river barge 80 down / 30 up, ship 150 (per `scripts/region-scale.py`).
2. **Advance the clock.** A leg's duration advances the in-world clock. Track days and hours elapsed across the session so the Rest Clock's `In-world time now` and the long-rest gate stay correct. Note where on the route the 24-hour window reopens: the party can long-rest at the first safe stop past that point (`meta/difficulty.md` → Long Rest Rules).
3. **Derive 1–3 stops from geography alone** (river crossings, passes, day's-walk spacing — the same map-first principle as `/region`), using working labels, not proper nouns, unless the DM names them. Only stops that serve the session (a scene, an encounter, a rest) become scene blocks; the rest is narration.
4. **Never enumerate every settlement a realistic road would have.** At this scale that's one per travel day, and almost none deserve files. Stops live in the session plan as scheduler content (`exists: false`); `/recap` canonizes only the ones the party actually visits, per the tiers above.

## Trade Routes for Cities

Cities with `importance: critical` or `importance: major` should have at least one route entity that names them in `origin` or `destination`. A city with no route connections is a design gap — flag it and fill it when the city becomes relevant.

Cities with `importance: minor` or `importance: background` may defer. Do not create placeholder routes just to satisfy coverage; wait until narrative context makes the route meaningful.

The route's `origin`/`destination` fields create the graph edge — no `routes` field is needed on the city entity itself.

## City Registry Graduation

**A registry dot is always a big city.** Graduate it at `importance: major` or `critical`, with a population in the thousands or more, and give it a route per **Trade Routes for Cities**. A smaller settlement is placed without a dot (see the tiers above), even when it sits near one.

When creating a `location-city` entity that corresponds to a dot in `maps/world/city-registry.md`:

1. Look up the city's registry ID by its col/row position in `city-registry.md`
2. Add the ID to the entity's `aliases:` field (e.g. `aliases: [C05-04a]`) so any prior cross-references resolve
3. Remove the entry from `city-registry.md` — the city is now canonical
4. Follow the full graduation checklist in `maps/world/CLAUDE.md` (label on map, dot removed, tiles regenerated)

If no registry entry matches (city was newly placed, not a pre-existing dot), skip steps 1–3.
