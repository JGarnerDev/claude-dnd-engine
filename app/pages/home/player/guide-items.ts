// Break a guide's `## ` sections into `### ` groups and their list items, so the page
// can show each play as its own tap target (pure).

import type { GuideSection } from "./guide-sections.js";

export interface GuideItem {
  /** Stable key: section slug, group slug and index. */
  id: string;
  /**
   * The key a favorite is kept under: section, group and lead slugs, so it survives the
   * guide's lists being reordered or grown. The index id for a line with no lead.
   */
  favKey: string;
  /** The bold lead ("Divine Smite", "Is an ally at 0 HP?"), or null when the bullet has none. */
  lead: string | null;
  /** Everything after the lead, as inline markdown. */
  detail: string;
  /** True when the lead's spell tags include "concentration": the spell needs concentration. */
  concentration: boolean;
  /** The spell's level from the lead's tags ("1st", "cantrip"), or null when it has none. */
  level: string | null;
  /** What casting it with a higher slot does: the text after "Upcast:", or null. */
  upcast: string | null;
  /** When and how to use it: the text after "Tip:", or null. The detail before it is the rules. */
  tip: string | null;
  /** The `#### ` divider above it inside its group, or null before any divider. */
  part: string | null;
}

export interface GuideGroup {
  title: string;
  slug: string;
  /** True for a numbered list (an order to follow). */
  ordered: boolean;
  /** Text under the heading that isn't a list item. */
  note: string;
  items: GuideItem[];
}

export interface TreeSection {
  title: string;
  slug: string;
  groups: GuideGroup[];
}

/** A group to draw, maybe narrowed by a search, with the section it came from. */
export interface GroupHit {
  section: string;
  group: GuideGroup;
  items: GuideItem[];
}

const BULLET = /^(?:[-*]|\d+\.)\s+(.*)$/;
const LEAD = /^\*\*(.+?)\*\*:?\s*(.*)$/s;
const TAGS = /^(.*?)\s*\(([^()]*)\)$/;
const LEVELS = ["cantrip", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];
/** Labels that split the rest of a detail onto a line of its own, in any order. */
const MARKERS = { upcast: /\s+Upcast:\s+/, tip: /\s+Tip:\s+/ } as const;
type Marker = keyof typeof MARKERS;

interface SpellLead {
  name: string;
  level: string | null;
  concentration: boolean;
}

/**
 * Split a lead's spell tags off its name: "Bless (1st, concentration)" is Bless, a 1st-level
 * spell needing concentration. The parentheses count as tags only when every comma-separated
 * part is a level or "concentration", each at most once; otherwise ("Radiant Soul (once per
 * long rest)") the lead stays whole.
 */
export function spellLead(lead: string): SpellLead {
  const whole = { name: lead, level: null, concentration: false };
  const m = TAGS.exec(lead);
  if (!m) return whole;
  const tags = m[2].split(",").map((t) => t.trim().toLowerCase());
  const levels = tags.filter((t) => LEVELS.includes(t));
  const conc = tags.filter((t) => t === "concentration");
  if (levels.length > 1 || conc.length > 1 || levels.length + conc.length !== tags.length)
    return whole;
  return { name: m[1], level: levels[0] ?? null, concentration: conc.length === 1 };
}

/**
 * Split "… Tip: … Upcast: …" (either order) off a detail. Each label splits at its first
 * match only, and its text runs to the next label or the end.
 */
export function splitMarkers(detail: string): {
  detail: string;
  upcast: string | null;
  tip: string | null;
} {
  const found = (Object.keys(MARKERS) as Marker[])
    .map((name) => ({ name, at: MARKERS[name].exec(detail) }))
    .filter((f): f is { name: Marker; at: RegExpExecArray } => f.at !== null)
    .sort((a, b) => a.at.index - b.at.index);
  const out = { detail, upcast: null as string | null, tip: null as string | null };
  if (found.length === 0) return out;
  out.detail = detail.slice(0, found[0].at.index);
  found.forEach((f, n) => {
    const end = n + 1 < found.length ? found[n + 1].at.index : detail.length;
    out[f.name] = detail.slice(f.at.index + f.at[0].length, end);
  });
  return out;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toItem({
  raw,
  group,
  index,
  part,
}: {
  raw: string;
  group: string;
  index: number;
  part: string | null;
}): GuideItem {
  const id = `${group}/${index}`;
  const m = LEAD.exec(raw);
  if (!m)
    return {
      id,
      favKey: id,
      lead: null,
      detail: raw,
      concentration: false,
      level: null,
      upcast: null,
      tip: null,
      part,
    };
  const spell = spellLead(m[1].replace(/:$/, ""));
  return {
    id,
    favKey: `${group}/${slug(spell.name)}`,
    lead: spell.name,
    concentration: spell.concentration,
    level: spell.level,
    ...splitMarkers(m[2]),
    part,
  };
}

interface RawGroup {
  title: string;
  ordered: boolean;
  note: string[];
  raw: { text: string; part: string | null }[];
  part: string | null;
}

function newGroup(title: string): RawGroup {
  return { title, ordered: false, note: [], raw: [], part: null };
}

/**
 * Split one `## ` section's body into its `### ` groups and their items. A `#### ` heading
 * inside a group is a named divider: the items under it carry its name as `part`.
 */
export function groupItems(section: GuideSection): GuideGroup[] {
  const groups: RawGroup[] = [];
  for (const line of section.body.split(/\r?\n/)) {
    const h = /^### +(.+?)\s*$/.exec(line);
    if (h) {
      groups.push(newGroup(h[1]));
      continue;
    }
    if (groups.length === 0 && line.trim()) groups.push(newGroup(section.title));
    const g = groups[groups.length - 1];
    if (!g) continue;
    const d = /^#### +(.+?)\s*$/.exec(line);
    if (d) {
      g.part = d[1];
      continue;
    }
    const b = BULLET.exec(line);
    if (b) {
      g.raw.push({ text: b[1], part: g.part });
      if (/^\d+\./.test(line)) g.ordered = true;
    } else if (/^\s+\S/.test(line) && g.raw.length > 0) {
      g.raw[g.raw.length - 1].text += " " + line.trim();
    } else if (line.trim()) {
      g.note.push(line.trim());
    }
  }
  return groups.map((g) => {
    const gs = slug(g.title);
    return {
      title: g.title,
      slug: gs,
      ordered: g.ordered,
      note: g.note.join(" "),
      items: g.raw.map((r, index) =>
        toItem({ raw: r.text, group: `${section.slug}/${gs}`, index, part: r.part }),
      ),
    };
  });
}

/** One spell level's plays, for its own sublist. */
export interface LevelRun {
  /** "cantrip", "1st", "2nd", … */
  level: string;
  items: GuideItem[];
}

/**
 * Split plays into the ones that aren't spells (no level tag), in guide order, and the
 * spells, one run per level from cantrips up, each in guide order.
 */
export function byLevel(items: readonly GuideItem[]): { others: GuideItem[]; levels: LevelRun[] } {
  const levels = LEVELS.flatMap((level) => {
    const at = items.filter((i) => i.level === level);
    return at.length > 0 ? [{ level, items: at }] : [];
  });
  return { others: items.filter((i) => i.level === null), levels };
}

/** A level run's heading: "Cantrips", "1st level". */
export function levelTitle(level: string): string {
  return level === "cantrip" ? "Cantrips" : `${level} level`;
}

export function treeOf(sections: readonly GuideSection[]): TreeSection[] {
  return sections.map((s) => ({ title: s.title, slug: s.slug, groups: groupItems(s) }));
}

function leadsOf(g: GuideGroup): string {
  return g.items.map((i) => i.lead ?? "").join("|");
}

/** True when every group has the same leads in the same order, like Strategies' "Team" and "Iggy". */
export function isParallel(groups: readonly GuideGroup[]): boolean {
  return groups.length > 1 && groups.every((g) => leadsOf(g) === leadsOf(groups[0]));
}

/** The search's words: lower-cased, split on whitespace, empties dropped. */
export function searchWords(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function hasAll(words: readonly string[], text: string): boolean {
  const hay = text.toLowerCase();
  return words.every((w) => hay.includes(w));
}

/**
 * Every group holding plays that match all the words, in guide order. A group whose
 * title matches keeps all its plays; otherwise only the plays whose lead or text match.
 */
export function searchTree(tree: readonly TreeSection[], words: readonly string[]): GroupHit[] {
  return tree.flatMap((s) =>
    s.groups.flatMap((group) => {
      const items = hasAll(words, group.title)
        ? group.items
        : group.items.filter((i) =>
            hasAll(
              words,
              `${i.lead ?? ""} ${i.level ?? ""} ${i.detail} ${i.upcast ?? ""} ${i.tip ?? ""}`,
            ),
          );
      return items.length > 0 ? [{ section: s.title, group, items }] : [];
    }),
  );
}
