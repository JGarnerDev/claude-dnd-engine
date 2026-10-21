// Strips planning history out of plan prose for the table (pure). Plans record who
// decided what and when — "(Jeff, 2026-10-07)", "**Engine, 2026-10-09; committed
// 2026-10-13.**", "**Draft (engine, 2026-10-21).**" — which matters while planning
// and is noise while running. The file keeps it; only the runner drops it.

const DATE = String.raw`\d{4}-\d{2}-\d{2}`;
const WHO = String.raw`(?:Jeff|Kellan|DM|engine|Engine|committed|approved|decided)`;

// A parenthetical that names a decider and carries a date: "(Jeff, 2026-10-07)",
// "(engine 2026-10-09, committed 2026-10-13)", "(DM ruling, 2026-10-01)".
const PAREN_RE = new RegExp(String.raw`\s*\((?=[^()]*\b${WHO}\b)(?=[^()]*${DATE})[^()]*\)`, 'g');

// A bold lead that is only provenance: "**Engine, 2026-10-09; committed 2026-10-13.**",
// "**Draft (engine, 2026-10-21).**", "**Proposed by the engine, 2026-10-09; …:**".
const LEAD_RE = new RegExp(String.raw`^(\s*(?:[-*]|\d+\.)\s+)?\*\*(?=[^*]*${DATE})(?:Engine|Draft|Proposed|Decided|Committed)\b[^*]*\*\*\s*`);

export function stripProvenance(md: string): string {
  const out: string[] = [];
  for (const raw of md.replace(/\r/g, '').split('\n')) {
    // The lead goes first: its own date-bearing parenthetical is part of it.
    let line = raw;
    const lead = LEAD_RE.exec(line);
    if (lead) {
      const rest = line.slice(lead[0].length);
      // A bullet that was nothing but provenance goes away; otherwise keep the rest.
      if (!rest.trim()) continue;
      line = (lead[1] ?? '') + rest.charAt(0).toUpperCase() + rest.slice(1);
    }
    out.push(line.replace(PAREN_RE, ''));
  }
  return out.join('\n');
}
