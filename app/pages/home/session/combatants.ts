// Stat blocks from the plan's `## Combatants` section (pure), so a scene's Enemies
// line can show one compact row per enemy and expand to the full block.
//
// A stat block is a `### ` subsection whose first bullet carries an AC
// ("- AC 12 · HP 11 · Speed 30 ft · CR 1/8"). Subsections without one (At a
// glance, Difficulty check, Running it) are not blocks.

export interface StatBlock {
  title: string; // "Bandit — Fennel Dray (fork) and Clatter (camp)"
  stats: string; // "AC 12 · HP 11 · Speed 30 ft · CR 1/8"
  attack: string; // first "to hit" line: "Scimitar +3 to hit, 1d6+1 slashing (avg 4)"
  md: string;
}

const AC_RE = /^[-*]\s+(AC\s+\d+.*)$/m;
const HIT_RE = /^[-*]\s+(.*\bto hit\b.*)$/m;

export function parseCombatants(sectionMd: string): StatBlock[] {
  const out: StatBlock[] = [];
  const parts = ('\n' + sectionMd.replace(/\r/g, '')).split(/\n### /).slice(1);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const title = (nl < 0 ? part : part.slice(0, nl)).trim();
    const md = nl < 0 ? '' : part.slice(nl + 1).trim();
    const ac = AC_RE.exec(md);
    if (!ac) continue;
    out.push({ title, stats: ac[1].trim(), attack: HIT_RE.exec(md)?.[1].trim() ?? '', md });
  }
  return out;
}

// Match a header enemy entry — "Archer Rider (Ilsa Hask)", "Sniper ([[Nella]])",
// "Mastiff 1 (Brick)" — to its block. Blocks mention each other's people ("loves
// Cinder more than anyone"), so the strongest evidence goes first: the real name in a
// block's title, then the label on its Label line, then either anywhere in its text.
export function matchEnemy(entry: string, blocks: StatBlock[]): StatBlock | undefined {
  const plain = entry.replace(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, '$1');
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(plain);
  const label = (m ? m[1] : plain).trim().toLowerCase();
  const name = m?.[2].trim().toLowerCase();
  const title = (b: StatBlock) => b.title.toLowerCase();
  const text = (b: StatBlock) => `${b.title}\n${b.md}`.toLowerCase();
  // A shared block (Fennel and Clatter are both Bandits) carries one Label line each.
  const labelLine = (b: StatBlock) => [...b.md.matchAll(/label \(party-facing\):\*\*\s*(.*)$/gim)].map((x) => x[1]).join('\n').toLowerCase();
  return (name ? blocks.find((b) => title(b).includes(name)) : undefined)
    ?? (label ? blocks.find((b) => labelLine(b).includes(label)) : undefined)
    ?? (name ? blocks.find((b) => text(b).includes(name)) : undefined)
    ?? (label ? blocks.find((b) => text(b).includes(label)) : undefined);
}
