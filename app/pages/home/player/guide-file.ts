// A player guide file (meta/player-guides/<PC>.md) and what the page needs from it
// (pure). Shared by the dev-server plugin (Node) and the page.

import { splitSections, type GuideSection } from "./guide-sections.js";

/** One guide as the plugin hands it over: raw text plus the PC file's level. */
export interface GuideFile {
  file: string;
  text: string;
  /** `level` in historian/characters/pcs/<pc>.md; null if the file or field is missing. */
  pcLevel: number | null;
  /** Completed sessions whose `pcs_present` lists the PC, by `session_number`, ascending. */
  sessionsPlayed: number[];
}

export interface Guide {
  file: string;
  pc: string;
  player: string;
  /** The PC level the guide was written for. */
  level: number | null;
  pcLevel: number | null;
  /** Last session the guide was checked against. */
  confirmed: string;
  sessionsPlayed: number[];
  sections: GuideSection[];
}

const FRONTMATTER = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** A top-level scalar from the YAML frontmatter, unquoted; null when absent or empty. */
export function frontmatterValue(text: string, key: string): string | null {
  const block = FRONTMATTER.exec(text)?.[1] ?? "";
  for (const line of block.split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv?.[1] !== key) continue;
    const v = kv[2].trim().replace(/^"(.*)"$/, "$1");
    return v === "" ? null : v;
  }
  return null;
}

/** A top-level list from the YAML frontmatter (`key:` then `  - item` lines), unquoted. */
export function frontmatterList(text: string, key: string): string[] {
  const block = FRONTMATTER.exec(text)?.[1] ?? "";
  const items: string[] = [];
  let inList = false;
  for (const line of block.split(/\r?\n/)) {
    if (!inList) {
      inList = line.trimEnd() === `${key}:`;
      continue;
    }
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (!item) break;
    items.push(item[1].trim().replace(/^"(.*)"$/, "$1"));
  }
  return items;
}

function toLevel(raw: string | null): number | null {
  return raw !== null && /^\d+$/.test(raw) ? Number(raw) : null;
}

export function parseGuide(g: GuideFile): Guide {
  const body = g.text.replace(FRONTMATTER, "");
  // Text before the first `## ` is a note to whoever edits the file, not page content.
  const { sections } = splitSections(body);
  return {
    file: g.file,
    pc: frontmatterValue(g.text, "pc") ?? g.file.replace(/\.md$/, ""),
    player: frontmatterValue(g.text, "player") ?? "",
    level: toLevel(frontmatterValue(g.text, "level")),
    pcLevel: g.pcLevel,
    confirmed: frontmatterValue(g.text, "guide_confirmed") ?? "",
    sessionsPlayed: g.sessionsPlayed,
    sections,
  };
}

/** True when the PC has levelled past the level the guide was written for. */
export function isBehind(g: Pick<Guide, "level" | "pcLevel">): boolean {
  return g.level !== null && g.pcLevel !== null && g.pcLevel > g.level;
}

/** Sessions the PC played that the guide misses at or past this many count as stale. */
export const STALE_AFTER_SESSIONS = 2;

/** The sessions the PC played after `guide_confirmed`; all of them if it is unset. */
export function sessionsSince(g: Pick<Guide, "confirmed" | "sessionsPlayed">): number[] {
  const confirmed = toLevel(g.confirmed) ?? 0;
  return g.sessionsPlayed.filter((n) => n > confirmed);
}

/** True when the guide misses STALE_AFTER_SESSIONS or more sessions the PC played. */
export function isSessionsBehind(g: Pick<Guide, "confirmed" | "sessionsPlayed">): boolean {
  return sessionsSince(g).length >= STALE_AFTER_SESSIONS;
}
