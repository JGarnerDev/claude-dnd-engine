// A beat's prose as a prompt book (pure): each bullet, paragraph or read-aloud quote
// becomes one block, tagged with a voice the DM can see at a glance, in plan order.
// PromptBook.tsx draws the blocks; the voices are listed there.
//
// The voice comes from the bullet's bold label (`- **Tokens:** …`) or its shape (a
// `>` quote, a bullet that opens on a quoted line). Unlabeled DM bullets join the
// block before them, so a run of plain bullets reads as one list.

import { stripProvenance } from "./provenance.js";

export type Voice =
  "you" | "say" | "time" | "do" | "watch" | "choice" | "private" | "intro" | "fight";

export interface PbBlock {
  voice: Voice;
  label: string; // the plan's own label ("What happens", "Vey, riding in"), or ''
  md: string; // the block's markdown, label taken out; for callouts, the whole callout
}

export const VOICE_NAME: Record<Voice, string> = {
  you: "You",
  say: "Say",
  time: "Time",
  do: "Do",
  watch: "Watch",
  choice: "Choice",
  private: "Private",
  intro: "Introduce",
  fight: "Fight",
};

const ITEM_RE = /^(?:[-*]|\d+\.)\s+(.*)$/;
const LABEL_RE = /^\*\*([^*]+?):\*\*:?\s*(.*)$|^\*\*([^*]+?)\*\*:\s*(.*)$/;
const CALLOUT_RE = /^[-*]\s+\*\*(Introduce|Tokens|Private)\b/;
const DO_RE =
  /^(tokens?|music|jukebox|title card|handout|hp bars?|set hp|roll20|maps?|lighting|sound cue|show)\b/i;
// `- **Time passes:** night falls.` marks the clock moving: the day ends, it's dusk, two weeks go by.
const TIME_RE = /^time passes\b/i;
const SAY_RE = /\b(read(?:s)? aloud|read-aloud|say|says|aloud|lines?)\b/i;
export const FIGHT_RE = /^(combat|fight|boss fight|boss) (starts|begins|ends)\b/i;
const WATCH_RE = /^(when|if|once|after|until|unless|the moment|(?:the )?triggers?|watch)\b/i;
const QUOTED_RE = /^\*{1,3}["“']/;

interface Chunk {
  kind: "item" | "quote" | "para";
  lines: string[];
}

function chunks(md: string): Chunk[] {
  const out: Chunk[] = [];
  let cur: Chunk | null = null;
  let fenced = false;
  for (const line of md.replace(/\r/g, "").split("\n")) {
    if (line.trimStart().startsWith("```")) fenced = !fenced;
    if (fenced || line.trimStart().startsWith("```")) {
      if (!cur || cur.kind !== "para") out.push((cur = { kind: "para", lines: [] }));
      cur.lines.push(line);
      continue;
    }
    if (!line.trim()) {
      if (cur?.kind !== "item") cur = null;
      continue;
    }
    const indented = /^\s/.test(line);
    if (!indented && ITEM_RE.test(line)) out.push((cur = { kind: "item", lines: [line] }));
    else if (indented && cur?.kind === "item") cur.lines.push(line);
    else if (line.trimStart().startsWith(">")) {
      if (cur?.kind !== "quote") out.push((cur = { kind: "quote", lines: [] }));
      cur.lines.push(line.trimStart());
    } else {
      if (cur?.kind !== "para") out.push((cur = { kind: "para", lines: [] }));
      cur.lines.push(line);
    }
  }
  return out;
}

// A labeled bullet's body: the text after the label, its wrapped lines, then any
// nested bullets lifted one level so they render as the block's own list.
function body(rest: string, more: string[]): string {
  const wrap: string[] = [];
  let i = 0;
  for (; i < more.length && !ITEM_RE.test(more[i].trim()) && !more[i].trim().startsWith(">"); i++)
    wrap.push(more[i].trim());
  const nested = more.slice(i);
  const indent = nested.length
    ? Math.min(...nested.filter((l) => l.trim()).map((l) => l.match(/^\s*/)![0].length))
    : 0;
  return [[rest, ...wrap].join(" ").trim(), ...nested.map((l) => l.slice(indent))]
    .filter((l, k) => k > 0 || l)
    .join("\n");
}

const cleanLabel = (s: string) => s.replace(/\s*\(\d{4}-\d{2}-\d{2}\)/g, "").trim();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function classify(c: Chunk): PbBlock {
  if (c.kind === "quote") return { voice: "say", label: "", md: c.lines.join("\n") };
  if (c.kind === "para") {
    const md = c.lines.join("\n");
    return { voice: QUOTED_RE.test(md.trim()) ? "say" : "you", label: "", md };
  }
  const callout = CALLOUT_RE.exec(c.lines[0]);
  if (callout) {
    const kind = callout[1];
    if (kind === "Tokens") {
      return {
        voice: "do",
        label: "Tokens",
        md: body(c.lines[0].replace(/^[-*]\s+\*\*Tokens:?\*\*:?\s*/, ""), c.lines.slice(1)),
      };
    }
    return { voice: kind === "Private" ? "private" : "intro", label: "", md: c.lines.join("\n") };
  }
  const text = ITEM_RE.exec(c.lines[0])![1];
  const m = LABEL_RE.exec(text);
  if (!m) {
    const whole = c.lines.join("\n");
    const bare = text.replace(/^\*\*|\*\*\.?$/g, "");
    if (/^\*\*[^*]+\*\*\.?$/.test(text) && /\btrigger/i.test(bare))
      return { voice: "watch", label: "", md: body(bare, c.lines.slice(1)) };
    // A bold "If …" / "When …" lead is a condition, even without a colon.
    const lead = /^\*\*([^*]+?)\.?\*\*\.?\s*(.*)$/.exec(text);
    if (lead && FIGHT_RE.test(lead[1]))
      return { voice: "fight", label: cleanLabel(lead[1]), md: body(lead[2], c.lines.slice(1)) };
    if (lead && WATCH_RE.test(lead[1]))
      return { voice: "watch", label: cleanLabel(lead[1]), md: body(lead[2], c.lines.slice(1)) };
    if (QUOTED_RE.test(text)) return { voice: "say", label: "", md: body(text, c.lines.slice(1)) };
    return { voice: "you", label: "", md: whole };
  }
  const label = cleanLabel(m[1] ?? m[3]);
  const rest = cap((m[2] ?? m[4]).trim()); // the label moved to the gutter, so the text starts a sentence
  const md = body(rest, c.lines.slice(1));
  const voice: Voice = FIGHT_RE.test(label)
    ? "fight"
    : TIME_RE.test(label)
      ? "time"
      : /^choice\b/i.test(label)
        ? "choice"
        : DO_RE.test(label)
          ? "do"
          : SAY_RE.test(label) || QUOTED_RE.test(rest)
            ? "say"
            : WATCH_RE.test(label)
              ? "watch"
              : "you";
  // `Choice (Iggy)` and `Say (Dip)` show only who: the voice already says the rest.
  const who = /\(([^)]+)\)/.exec(label)?.[1] ?? "";
  const shown = voice === "choice" || /^say\b/i.test(label) ? who : label;
  return { voice, label: shown, md };
}

export function promptBlocks(prose: string): PbBlock[] {
  const out: PbBlock[] = [];
  // A bare `- **Say (Dip):**` heads the quote under it: its label goes on that quote,
  // and the quote starts a new block, so each speaker gets their own gutter.
  let heading: string | null = null;
  // Provenance goes twice: per line first, then per block, once a label's wrapped
  // lines are joined, so a "(draft, engine 2026-…)" split across lines goes too.
  for (const b of chunks(stripProvenance(prose))
    .map(classify)
    .map((x) => ({ ...x, md: stripProvenance(x.md) }))) {
    if (!b.md.trim() && b.voice !== "private" && b.voice !== "intro" && b.voice !== "fight") {
      if (b.voice === "say") heading = b.label;
      continue;
    }
    const headed = heading !== null && b.voice === "say";
    if (headed && !b.label) b.label = heading!;
    heading = null;
    const prev = out[out.length - 1];
    // Plain bullets carry on the DM block before them; quotes run together.
    if (
      prev &&
      !headed &&
      !b.label &&
      prev.voice === b.voice &&
      (b.voice === "you" || (b.voice === "say" && !prev.label))
    ) {
      // Quotes keep a blank line between them, or markdown runs them into one paragraph.
      prev.md += (b.voice === "say" ? "\n\n" : "\n") + b.md;
    } else out.push({ ...b });
  }
  return out;
}
