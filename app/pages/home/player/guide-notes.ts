// The guide's side sections, apart from the tabs (pure). Each `### ` group is one
// panel of `- **Lead:** detail` bullets.
// - `## Notes` (right column): the group titled "To do" is a checklist; a lead ending
//   "(at the table)" is one to do in session. Other groups are reminders.
// - `## Roleplay` (left column): one group per character, each a list of hooks.

import { groupItems } from "./guide-items.js";
import type { GuideSection } from "./guide-sections.js";

export const NOTES_SLUG = "notes";
export const ROLEPLAY_SLUG = "roleplay";
const SIDE_SLUGS: readonly string[] = [NOTES_SLUG, ROLEPLAY_SLUG];
const TODO_SLUG = "to-do";
const AT_TABLE = /\s*\(at the table\)$/i;

export interface Note {
  id: string;
  lead: string;
  detail: string;
  atTable: boolean;
}

export interface NotePanelData {
  title: string;
  checklist: boolean;
  notes: Note[];
}

export interface SplitGuide {
  /** The sections that become tabs. */
  sections: GuideSection[];
  /** `## Notes`, one panel per group. */
  panels: NotePanelData[];
  /** `## Roleplay`, one panel per character. */
  roleplay: NotePanelData[];
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function panelsOf(
  section: GuideSection | undefined,
  { checklists }: { checklists: boolean },
): NotePanelData[] {
  return (section ? groupItems(section) : []).map((g) => {
    const checklist = checklists && g.slug === TODO_SLUG;
    return {
      title: g.title,
      checklist,
      notes: g.items.map((i) => {
        const raw = i.lead ?? i.detail;
        const lead = checklist ? raw.replace(AT_TABLE, "") : raw;
        return {
          id: slug(lead),
          lead,
          detail: i.lead === null ? "" : i.detail,
          atTable: checklist && AT_TABLE.test(raw),
        };
      }),
    };
  });
}

export function splitNotes(sections: readonly GuideSection[]): SplitGuide {
  const find = (s: string) => sections.find((x) => x.slug === s);
  return {
    sections: sections.filter((s) => !SIDE_SLUGS.includes(s.slug)),
    panels: panelsOf(find(NOTES_SLUG), { checklists: true }),
    roleplay: panelsOf(find(ROLEPLAY_SLUG), { checklists: false }),
  };
}
