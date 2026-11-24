// Entity bodies often open with field lines, "Campaign: [[Curse of Strahd]] | Player:
// [[Ben]] |", written for a reader of the raw file. The panel shows them as a
// definition list instead (style pass item 24). A line counts only when all of it is
// fields: two or more "Name: value" parts split by `|`, an optional trailing `|`.

export type BodyPart = { kind: "md"; md: string } | { kind: "fields"; items: [string, string][] };

const PART_RE = /^([A-Z][A-Za-z ]{0,30}):\s+(\S.*)$/;

/** The fields on one line, or null when any part of it is not a field. */
export function fieldLine(line: string): [string, string][] | null {
  const parts = line.split("|").map((p) => p.trim());
  if (parts[parts.length - 1] === "") parts.pop();
  if (parts.length < 2) return null;
  const items: [string, string][] = [];
  for (const p of parts) {
    const m = PART_RE.exec(p);
    if (!m) return null;
    items.push([m[1], m[2]]);
  }
  return items;
}

/** A body cut into markdown runs and field blocks, in order; fenced code is left alone. */
export function splitFieldLines(body: string): BodyPart[] {
  const out: BodyPart[] = [];
  let md: string[] = [];
  let fence = false;
  const flushMd = () => {
    if (md.join("").trim()) out.push({ kind: "md", md: md.join("\n") });
    md = [];
  };
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    const items = fence ? null : fieldLine(line);
    if (!items) {
      md.push(line);
      continue;
    }
    flushMd();
    const prev = out[out.length - 1];
    if (prev?.kind === "fields") prev.items.push(...items);
    else out.push({ kind: "fields", items });
  }
  flushMd();
  return out;
}
