List all available slash commands for this campaign engine.

Output as an unordered list. For each command, one line: command name, dash, brief description. Include any notable arguments inline. No headers, no sections, no tables.

Commands to list:

- `/commands` — show this list
- `/session [--depth narrated|notes] [--scope inline|linked]` — plan the next session
- `/recap` — canonize a played session; moves it to historian and audits entities
- `/inventory` — report all free entities in `./data` grouped by type, with gaps
- `/pitch [--type <type>] [--count <n>]` — generate a creative flavor pitch (no files created)
- `/entity-questionnaire [--type <type>]` — generate a player-facing entity design questionnaire; also handles ingestion when a filled questionnaire is returned
- `/event [count|description] [--scale local|regional|global] [--add] [--from-pool] [--ai]` — generate world events from pool or AI; use `--add` to contribute new events
- `/sync` — sync shareable engine files to the template repo
- `pc-backstory` (auto-triggered) — ingest raw PC backstory text into a proper historian file
- `entity-ingest` (auto-triggered) — ingest a filled player entity questionnaire after balance review
