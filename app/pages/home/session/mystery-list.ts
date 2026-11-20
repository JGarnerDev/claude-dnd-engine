// The Mysteries & Loose Ends slide's questions, and the sidebar search over the DM's
// answer key (pure; Mysteries.tsx draws the slide).

import type { Section } from "./types.js";

export const MAX_SHOWN = 8;

// The questions in a markdown bullet list; an indented line continues the bullet above it.
export function questions(md: string): string[] {
  const out: string[] = [];
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (m) out.push(m[1].trim());
    else if (line.trim() && out.length) out[out.length - 1] += ` ${line.trim()}`;
  }
  return out;
}

// The DM answer key's entries (scheduler/campaign/_mysteries.md) a sidebar search matches.
// "myst…" lists them all; otherwise a hit on the question or the answer, case-insensitive.
export function searchMysteries(query: string, answers: Section[]): Section[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  if (q.length >= 3 && "mysteries".startsWith(q)) return answers;
  return answers.filter((s) => s.title.toLowerCase().includes(q) || s.md.toLowerCase().includes(q));
}
