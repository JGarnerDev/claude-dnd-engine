Scan every markdown file inside `./data` and produce a free entity inventory report.

For each file, read its YAML frontmatter and extract: `name`, `type`, `subtype`, `importance`, and `active`.

Only include files where `exists: false`.

Report format:

1. A summary table grouped by `type` (and `subtype` where present), showing the count of free entities in each group.
2. Under each group, list each entity by name, with `importance` and `active` shown inline.
3. A **Gaps** section at the end listing any types that have zero free entities, based on the known types: faction, location/city, location/shop, character/npc.

Keep the report concise — this is a planning tool, not a narrative document.
