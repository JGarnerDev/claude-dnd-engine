// Markdown -> tokens (pure), for the <Markdown> component to render. Same rules as
// renderMarkdown in markdown.ts: headings, nested bullet/number lists, blockquotes,
// fenced code, paragraphs, **bold**, *italic*, `code` and [[wikilinks]]. No HTML is
// built here, so nothing needs escaping: React escapes text as it renders it.

export type Inline =
  | { t: "text"; s: string }
  | { t: "code"; s: string }
  | { t: "strong" | "em"; c: Inline[] }
  | { t: "wiki"; name: string; label: string };

export interface ListItem {
  c: Inline[];
  sub: ListItem[];
}

export type Block =
  | { t: "pre"; s: string }
  | { t: "h"; level: number; c: Inline[] }
  | { t: "quote"; c: Block[] }
  | { t: "list"; items: ListItem[] }
  | { t: "p"; c: Inline[] };

// Placeholders and markers, in characters no campaign file uses.
const CODE = "\u0000";
const WIKI = "\u0001";
const [B_ON, B_OFF, I_ON, I_OFF] = ["\u0002", "\u0003", "\u0004", "\u0005"];
const SPLIT_RE = /(\u0000\d+\u0000|\u0001\d+\u0001|[\u0002-\u0005])/;

export function parseInline(text: string): Inline[] {
  const codes: string[] = [];
  const wikis: Array<{ name: string; label: string }> = [];
  let s = text.replace(/`([^`]+)`/g, (_, c: string) => `${CODE}${codes.push(c) - 1}${CODE}`);
  s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, name: string, alias?: string) => {
    const n = name.trim();
    return `${WIKI}${wikis.push({ name: n, label: alias ?? n }) - 1}${WIKI}`;
  });
  s = s
    .replace(/\*\*(.+?)\*\*/g, `${B_ON}$1${B_OFF}`)
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, `$1${I_ON}$2${I_OFF}`);
  const root: Inline[] = [];
  const stack: Array<{ t: "strong" | "em"; c: Inline[] }> = [];
  const top = () => (stack.length ? stack[stack.length - 1].c : root);
  for (const part of s.split(SPLIT_RE)) {
    if (!part) continue;
    if (part === B_ON || part === I_ON) {
      const node = { t: part === B_ON ? ("strong" as const) : ("em" as const), c: [] };
      top().push(node);
      stack.push(node);
    } else if (part === B_OFF || part === I_OFF) {
      const t = part === B_OFF ? "strong" : "em";
      const at = stack.map((n) => n.t).lastIndexOf(t);
      if (at >= 0) stack.length = at;
    } else if (part[0] === CODE) top().push({ t: "code", s: codes[Number(part.slice(1, -1))] });
    else if (part[0] === WIKI) top().push({ t: "wiki", ...wikis[Number(part.slice(1, -1))] });
    else top().push({ t: "text", s: part });
  }
  return root;
}

const LIST_RE = /^(\s*)(?:[-*]|\d+\.)\s+(.*)$/;

export function parseMarkdown(md: string): Block[] {
  const lines = md.replace(/\r/g, "").split("\n");
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.trimStart().startsWith("```")) {
      const body: string[] = [];
      for (i++; i < lines.length && !lines[i].trimStart().startsWith("```"); i++)
        body.push(lines[i]);
      i++;
      out.push({ t: "pre", s: body.join("\n") });
    } else if (/^#{1,6}\s/.test(line.trimStart())) {
      const level = Math.min(6, line.trimStart().indexOf(" ") + 2);
      out.push({ t: "h", level, c: parseInline(line.replace(/^\s*#+\s*/, "")) });
      i++;
    } else if (line.trimStart().startsWith(">")) {
      // Indented quotes too: read-aloud text often sits under a list item.
      const body: string[] = [];
      for (; i < lines.length && lines[i].trimStart().startsWith(">"); i++)
        body.push(lines[i].replace(/^\s*>\s?/, ""));
      out.push({ t: "quote", c: parseMarkdown(body.join("\n")) });
    } else if (LIST_RE.test(line)) {
      const items: Array<{ depth: number; text: string }> = [];
      for (; i < lines.length; i++) {
        const m = LIST_RE.exec(lines[i]);
        if (m) items.push({ depth: m[1].length, text: m[2] });
        else if (lines[i].trim() && /^\s+/.test(lines[i]) && items.length)
          items[items.length - 1].text += " " + lines[i].trim();
        else break;
      }
      out.push({ t: "list", items: nestList(items) });
    } else {
      // Always take the first line, so a line no branch claims can't stall the loop.
      const body: string[] = [line.trim()];
      for (
        i++;
        i < lines.length &&
        lines[i].trim() &&
        !/^(#{1,6}\s|>|```)/.test(lines[i].trimStart()) &&
        !LIST_RE.test(lines[i]);
        i++
      )
        body.push(lines[i].trim());
      out.push({ t: "p", c: parseInline(body.join(" ")) });
    }
  }
  return out;
}

// A deeper item opens a sublist under the item before it; a shallower one closes
// sublists back to its depth, but never the outermost list (as renderMarkdown does).
function nestList(items: Array<{ depth: number; text: string }>): ListItem[] {
  const root: ListItem[] = [];
  const stack: Array<{ depth: number; list: ListItem[] }> = [];
  for (const it of items) {
    const item: ListItem = { c: parseInline(it.text), sub: [] };
    if (!stack.length) stack.push({ depth: it.depth, list: root });
    else if (it.depth > stack[stack.length - 1].depth) {
      const cur = stack[stack.length - 1].list;
      stack.push({ depth: it.depth, list: cur[cur.length - 1].sub });
    } else {
      while (stack.length > 1 && it.depth < stack[stack.length - 1].depth) stack.pop();
    }
    stack[stack.length - 1].list.push(item);
  }
  return root;
}
