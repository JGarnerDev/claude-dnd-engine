// The scene header (pure): what a scene is doing, who is in it, what they fight and
// what they roll, read off the top of its `### Scene N` prose. `/session` writes it:
//
//   - **Summary:** The night closes out: …
//   - **Cast:** [[Sable Wren]] · [[Mara Tull]] · Dunny Marsh
//   - **Enemies:** Archer Rider (Ilsa Hask) · Wolf (Cinder)      (or "none")
//     (one who joins mid-fight ends "arrives round 3": Relief Captain (Garran Vey) arrives round 3)
//   - **DCs:** Arcana 13 — read the charm · DEX 13 save — half damage
//   - **Tactics:** one line: how they fight and when they break
//   - **Time:** ~30 min
//
// Older plans have no header, so it falls back on their setup bullets (Trigger,
// Location, NPCs present, Time) and on DCs found anywhere in the scene's prose.

export interface SceneHeader {
  summary: string;
  where: string;
  cast: string;
  enemies: string[];
  arrivals: Record<string, number>; // enemy entry -> the round it joins the fight
  dcs: string[];
  tactics: string;
  time: string;
  rest: string; // setup prose the header didn't consume
}

const FIELDS: Record<string, keyof SceneHeader> = {
  summary: 'summary', trigger: 'summary',
  cast: 'cast', 'npcs present': 'cast', "who's here": 'cast',
  location: 'where', where: 'where',
  enemies: 'enemies', dcs: 'dcs', tactics: 'tactics', time: 'time',
};
const FIELD_RE = /^[-*]\s+\*\*([^*:]+):\*\*\s*(.*)$/;
const SPLIT_RE = /\s+·\s+/;
const ARRIVES_RE = /[\s,—–-]+\(?arrives (?:in |on )?round (\d+)\)?\.?$/i;

export function parseSceneHeader(setup: string, sceneMd: string): SceneHeader {
  const h: SceneHeader = { summary: '', where: '', cast: '', enemies: [], arrivals: {}, dcs: [], tactics: '', time: '', rest: '' };
  const lines = setup.replace(/\r/g, '').split('\n');
  const rest: string[] = [];
  let hadSummary = false;
  for (let i = 0; i < lines.length; i++) {
    const m = FIELD_RE.exec(lines[i]);
    const field = m ? FIELDS[m[1].trim().toLowerCase()] : undefined;
    if (!m || !field) { rest.push(lines[i]); continue; }
    const text = [m[2].trim()];
    while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1]) && !/^\s+[-*]\s/.test(lines[i + 1])) text.push(lines[++i].trim());
    const value = text.join(' ');
    const label = m[1].trim().toLowerCase();
    // A real Summary beats the Trigger fallback, whichever comes first.
    if (field === 'summary') {
      if (label === 'summary') { h.summary = value; hadSummary = true; } else if (!hadSummary) h.summary = value;
    } else if (field === 'dcs') {
      h.dcs = /^none\b/i.test(value) ? [] : value.split(SPLIT_RE).filter(Boolean);
    } else if (field === 'enemies') {
      // "arrives round 3" comes off the entry, which stays the HP key.
      h.enemies = /^none\b/i.test(value) ? [] : value.split(SPLIT_RE).filter(Boolean).map((e) => {
        const a = ARRIVES_RE.exec(e);
        if (!a) return e;
        const entry = e.slice(0, a.index).trim();
        h.arrivals[entry] = Number(a[1]);
        return entry;
      });
    } else if (field !== 'arrivals' && !h[field]) {
      h[field] = value;
    }
  }
  if (!h.dcs.length) h.dcs = findDcs(sceneMd);
  h.rest = rest.join('\n').trim();
  return h;
}

// Fallback: every "<Check> DC n" or "DC n <Check>" in the prose, deduplicated,
// as "Arcana 13". A DC with no check named nearby comes back as "DC 12".
const CHECKS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation',
  'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
  'Sleight of Hand', 'Stealth', 'Survival', 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA',
];
const CHECK_ALT = CHECKS.join('|');
const BEFORE_RE = new RegExp(String.raw`\b(${CHECK_ALT})\b[^.;:\n]{0,40}?\bDC\s*(\d+)`, 'g');
const AFTER_RE = new RegExp(String.raw`\bDC\s*(\d+)\s+(${CHECK_ALT})\b`, 'g');
const BARE_RE = /\bDC\s*(\d+)/g;

export function findDcs(md: string): string[] {
  const text = md.replace(/\r/g, '');
  const found: Array<{ at: number; label: string }> = [];
  const taken = new Set<number>();
  for (const m of text.matchAll(BEFORE_RE)) {
    const at = m.index! + m[0].lastIndexOf('DC');
    found.push({ at, label: `${m[1]} ${m[2]}` });
    taken.add(at);
  }
  for (const m of text.matchAll(AFTER_RE)) {
    if (taken.has(m.index!)) continue;
    found.push({ at: m.index!, label: `${m[2]} ${m[1]}` });
    taken.add(m.index!);
  }
  for (const m of text.matchAll(BARE_RE)) if (!taken.has(m.index!)) found.push({ at: m.index!, label: `DC ${m[1]}` });
  return [...new Set(found.sort((a, b) => a.at - b.at).map((f) => f.label))];
}
