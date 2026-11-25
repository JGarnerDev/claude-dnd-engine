// Break a guide's `## ` sections into `### ` groups and their list items, so the page
// can show each play as its own tap target (pure).

import type { GuideSection } from "./guide-sections.js";

export interface GuideItem {
  /** Stable key: section slug, group slug and index. */
  id: string;
  /** The bold lead ("Divine Smite", "Is an ally at 0 HP?"), or null when the bullet has none. */
  lead: string | null;
  /** Everything after the lead, as inline markdown. */
  detail: string;
  /** True when the lead ended "(concentration)": the spell needs concentration. */
  concentration: boolean;
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
const CONCENTRATION = /\s*\(concentration\)$/i;

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toItem(raw: string, id: string): GuideItem {
  const m = LEAD.exec(raw);
  if (!m) return { id, lead: null, detail: raw, concentration: false };
  const lead = m[1].replace(/:$/, "");
  return {
    id,
    lead: lead.replace(CONCENTRATION, ""),
    detail: m[2],
    concentration: CONCENTRATION.test(lead),
  };
}

/** Split one `## ` section's body into its `### ` groups and their items. */
export function groupItems(section: GuideSection): GuideGroup[] {
  const groups: { title: string; ordered: boolean; note: string[]; raw: string[] }[] = [];
  for (const line of section.body.split(/\r?\n/)) {
    const h = /^### +(.+?)\s*$/.exec(line);
    if (h) {
      groups.push({ title: h[1], ordered: false, note: [], raw: [] });
      continue;
    }
    if (groups.length === 0 && line.trim())
      groups.push({ title: section.title, ordered: false, note: [], raw: [] });
    const g = groups[groups.length - 1];
    if (!g) continue;
    const b = BULLET.exec(line);
    if (b) {
      g.raw.push(b[1]);
      if (/^\d+\./.test(line)) g.ordered = true;
    } else if (/^\s+\S/.test(line) && g.raw.length > 0) {
      g.raw[g.raw.length - 1] += " " + line.trim();
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
      items: g.raw.map((r, i) => toItem(r, `${section.slug}/${gs}/${i}`)),
    };
  });
}

export function treeOf(sections: readonly GuideSection[]): TreeSection[] {
  return sections.map((s) => ({ title: s.title, slug: s.slug, groups: groupItems(s) }));
}

/** The first numbered group whose leads are all questions: the turn's checklist. */
export function questionGroup(tree: readonly TreeSection[]): GuideGroup | null {
  for (const s of tree)
    for (const g of s.groups)
      if (g.ordered && g.items.length > 1 && g.items.every((i) => i.lead?.endsWith("?"))) return g;
  return null;
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
        : group.items.filter((i) => hasAll(words, `${i.lead ?? ""} ${i.detail}`));
      return items.length > 0 ? [{ section: s.title, group, items }] : [];
    }),
  );
}
