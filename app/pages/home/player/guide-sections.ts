// Split a guide's markdown body into the intro and its `## ` sections (pure).
// Headings inside fenced code blocks are not section breaks.

export interface GuideSection {
  /** Heading text, e.g. "Turn". */
  title: string;
  /** Stable key for tabs: the title lower-cased, spaces to dashes. */
  slug: string;
  /** Markdown under the heading, up to the next `## `. */
  body: string;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function splitSections(body: string): { intro: string; sections: GuideSection[] } {
  const intro: string[] = [];
  const sections: { title: string; lines: string[] }[] = [];
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const h = inFence ? null : /^## +(.+?)\s*$/.exec(line);
    if (h) sections.push({ title: h[1], lines: [] });
    else (sections[sections.length - 1]?.lines ?? intro).push(line);
  }
  return {
    intro: intro.join("\n").trim(),
    sections: sections.map((s) => ({
      title: s.title,
      slug: slugify(s.title),
      body: s.lines.join("\n").trim(),
    })),
  };
}
