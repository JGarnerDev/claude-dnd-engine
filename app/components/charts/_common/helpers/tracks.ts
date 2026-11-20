// Track tree (M4). Pure — turns the flat `track` strings on beats into the
// parent/child category tree the swimlane layout renders. No DOM.
//
// A track string is "category" or "category:member" (D7 explicit membership).
// Categories are config-driven (D5): DEFAULT_CATEGORIES ships sensible defaults
// (order, label, color, initial collapse); unknown categories still render,
// appended after the configured ones. Presence is auto-derived — a category or
// member row appears only once a beat references it.

import type { ChartLane } from 'jeff-ui/charts';
import type { CategoryConfig, ParsedTrack, TimelineEvent, TrackCategory } from '../types.js';

// Shipped defaults. Order here is the render order of the parent lanes.
export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  { key: 'party', label: 'Party', colorVar: '--track-party', collapsed: false },
  { key: 'character', label: 'Characters', colorVar: '--track-character', collapsed: false },
  { key: 'npc', label: 'NPCs', colorVar: '--track-npc', collapsed: false },
  { key: 'antagonist', label: 'Antagonists', colorVar: '--track-antagonist', collapsed: false },
  { key: 'faction', label: 'Factions', colorVar: '--track-faction', collapsed: true },
  { key: 'continent', label: 'Continents', colorVar: '--track-continent', collapsed: true },
  { key: 'world', label: 'World', colorVar: '--track-world', collapsed: false },
];

// Untyped/unknown categories fall back to this look.
const FALLBACK_COLOR = '--track-world';

// "faction:The Ashen Cult" -> { category, member }. Splits on the FIRST colon
// so member names may contain colons. Blank/undefined => the World lane.
export function parseTrack(track?: string): ParsedTrack {
  const raw = (track ?? '').trim();
  if (!raw) return { category: 'world', member: null };
  const i = raw.indexOf(':');
  if (i === -1) return { category: raw, member: null };
  const category = raw.slice(0, i).trim() || 'world';
  const member = raw.slice(i + 1).trim() || null;
  return { category, member };
}

// Build the present-only category tree. Categories render in config order
// (unknown ones appended in first-seen order); members in first-seen order.
export function buildTrackTree(
  events: TimelineEvent[],
  config: CategoryConfig[] = DEFAULT_CATEGORIES,
): TrackCategory[] {
  const cfg = new Map(config.map((c) => [c.key, c]));
  const order = config.map((c) => c.key);

  // category key -> accumulator
  const acc = new Map<string, { members: string[]; seen: Set<string>; hasParent: boolean }>();
  for (const e of events) {
    const { category, member } = parseTrack(e.track);
    let entry = acc.get(category);
    if (!entry) {
      entry = { members: [], seen: new Set(), hasParent: false };
      acc.set(category, entry);
      if (!order.includes(category)) order.push(category); // unknown -> append
    }
    if (member === null) entry.hasParent = true;
    else if (!entry.seen.has(member)) {
      entry.seen.add(member);
      entry.members.push(member);
    }
  }

  const out: TrackCategory[] = [];
  for (const key of order) {
    const entry = acc.get(key);
    if (!entry) continue; // configured but unused -> omit (presence-derived)
    const c = cfg.get(key);
    out.push({
      key,
      label: c ? c.label : key,
      colorVar: c ? c.colorVar : FALLBACK_COLOR,
      collapsed: c ? c.collapsed : false,
      members: entry.members.map((member) => ({ member, label: member })),
      hasParentBeats: entry.hasParent,
    });
  }
  return out;
}

// A beat's dot color: its category's track color (unknown categories get the
// World look). Both views color dots this way.
export function toneFor(track: string | undefined, config: CategoryConfig[] = DEFAULT_CATEGORIES): string {
  const { category } = parseTrack(track);
  return `var(${config.find((c) => c.key === category)?.colorVar ?? FALLBACK_COLOR})`;
}

// The swimlane's rows from the tree + collapse state (a set of category keys):
// a leaf category is one row; a collapsed parent one roll-up row with a toggle;
// an expanded parent a header row (holding its direct beats) with a toggle, then
// one child row per member keyed "category:member". A toggle row's key is its
// category, so the chart's onToggle hands back what to flip.
export function lanesFor(tree: TrackCategory[], collapsed: Set<string>): ChartLane[] {
  const lanes: ChartLane[] = [];
  for (const cat of tree) {
    const tone = `var(${cat.colorVar})`;
    if (cat.members.length === 0) {
      lanes.push({ key: cat.key, label: cat.label, tone });
    } else if (collapsed.has(cat.key)) {
      lanes.push({ key: cat.key, label: cat.label, tone, toggle: 'closed' });
    } else {
      lanes.push({ key: cat.key, label: cat.label, tone, toggle: 'open' });
      for (const m of cat.members) lanes.push({ key: `${cat.key}:${m.member}`, label: m.label, depth: 1, tone });
    }
  }
  return lanes;
}

// Which row a beat lands on: its child row when that child is shown, otherwise
// its category's header/roll-up row.
export function laneFor(track: string | undefined, laneKeys: Set<string>): string {
  const { category, member } = parseTrack(track);
  if (member !== null && laneKeys.has(`${category}:${member}`)) return `${category}:${member}`;
  return category;
}
