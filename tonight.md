# Tonight — map work (1–2 hours)

Do these in order and stop wherever the time runs out. Each one is useful on its own.

### Done already (2026-10-08)

- **Rivers named.** The Moorthistle is the upper border branch (purple/red). It feeds the
  **Broadwend**, the big river to the bay (red/navy). River F is now the **Bayward**, which
  reaches the bay at Tassad.
- **Dot 9 is Orrend**, a walled river city of about 12,000 on the Moorthistle's bend, a day and a
  half south of Ashford. The upper town is Cael's and the wharves are Marlow's
  (`data/locations/cities/Orrend.md`). Its barge trade to Tassad is **The Broadwend Run**
  (`data/routes/The Broadwend Run.md`).
- **Every red dot on the world map is a big city** (engine v0.21.0). Towns like Ashford never get a
  dot.
- **Registry IDs fixed.** Tassad is `C06-05a` (overlay dot 17), and the Calenmere draft's anchors
  point at the right dots.

### 1. Confirm or strike the new canon in Silas's map (10–15 min)

Read `maps/handouts/silas-road-sketch.md` and go through the six numbered items at the bottom:
Orrend, Duskwater's distance, Sable's Coldwell, the Stones, the old salt road, and the optional
"not below here" mark. Cross out anything you don't want. Orrend's DM-only cobbler hook (the
raiders' matched boots) is also your call.

### 2. Draw Silas's sketch in Inkarnate (45–60 min) ⭐ the main job

Trace from `maps/locations/silas-sheet-draft.png`. It's a local render, so ask Claude to
regenerate it if it's missing. Use a parchment, hand-drawn style: it's a merchant's sketch.

- **On the map:** Ashford and its creek, the Moorthistle loop, the Broadwend down to the bay,
  Orrend, the north road to Lord Cael's hall, the drover's road to Duskwater, and an arrow off the
  east edge to Tassad.
- **Off the map:** the red DM-only points (the dusk fork and the waystation), the registry rings,
  and the side panel.
- **Fog of war goes in Roll20**, not Inkarnate. Leave Sable's road east under fog until she tells
  them where she came from.

Export it as PNG.

### 3. One world-master pass in Inkarnate (20–30 min)

Make all the world-map edits in a single re-export, because the download link changes on every
export:

- Add *Moorthistle* on the upper branch only (lake to the junction), add *Broadwend* from the
  junction to the bay, and rename River F to *Bayward River*
- Label **Orrend** on dot 9
- Remove the Tassad and Orrend dots from the markers map, since they now have labels
- Add a compass rose
- Add the hemisphere names only if you've decided they go on the map. Otherwise skip them.

Then paste the new link into `maps/sources.tsv` and run:

```powershell
uv run scripts/fetch-maps.py --force
uv run scripts/gen-tiles.py
```

Tell Claude afterwards to read the new tiles, confirm the river and Orrend rows in
`maps/world/index.md`, and graduate Tassad and Orrend out of the city registry.

### 4. If time is left (5 min each)

- Run `uv run scripts/index-entities.py` so semantic search picks up Orrend, the route and the
  river names
- Set Session 30's `planned_date`
- Pick the waystation Common (`S2` Scene 7 still has a placeholder)
- Ask Claude to add the map handoff to `S2_HORSES` in the Session 30 plan, so Silas's line is on the
  page at the table
