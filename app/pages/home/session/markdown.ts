// Minimal markdown -> HTML (pure). Covers what the campaign files use: headings,
// nested bullet/number lists, blockquotes, fenced code, paragraphs, **bold**,
// *italic*, `code`, and [[wikilinks]] — rendered as <a class="sr-wiki"
// data-entity="Name">, flagged `is-missing` when `known` rejects the name, so
// the page can open them in the side panel. Everything is HTML-escaped first.

export type Known = (name: string) => boolean;

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function inline(text: string, known: Known = () => true): string {
  const codes: string[] = [];
  let s = escapeHtml(text).replace(/`([^`]+)`/g, (_, c: string) => `\u0000${codes.push(c) - 1}\u0000`);
  s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, name: string, alias?: string) => {
    const n = name.trim();
    const cls = known(n) ? 'sr-wiki' : 'sr-wiki is-missing';
    return `<a class="${cls}" data-entity="${n}">${alias ?? n}</a>`;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i: string) => `<code>${codes[Number(i)]}</code>`);
}

// Plain text for one-line previews: [[Name|alias]] -> alias, markup dropped.
export function plainText(s: string): string {
  return s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, n: string, a?: string) => a ?? n).replace(/\*\*|`/g, '');
}

const LIST_RE = /^(\s*)(?:[-*]|\d+\.)\s+(.*)$/;

export function renderMarkdown(md: string, known: Known = () => true): string {
  const lines = md.replace(/\r/g, '').split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.trimStart().startsWith('```')) {
      const body: string[] = [];
      for (i++; i < lines.length && !lines[i].trimStart().startsWith('```'); i++) body.push(lines[i]);
      i++;
      out.push(`<pre>${escapeHtml(body.join('\n'))}</pre>`);
    } else if (/^#{1,6}\s/.test(line)) {
      const level = Math.min(6, line.indexOf(' ') + 2);
      out.push(`<h${level}>${inline(line.replace(/^#+\s*/, ''), known)}</h${level}>`);
      i++;
    } else if (line.startsWith('>')) {
      const body: string[] = [];
      for (; i < lines.length && lines[i].startsWith('>'); i++) body.push(lines[i].replace(/^>\s?/, ''));
      out.push(`<blockquote>${renderMarkdown(body.join('\n'), known)}</blockquote>`);
    } else if (LIST_RE.test(line)) {
      const items: Array<{ depth: number; text: string }> = [];
      for (; i < lines.length; i++) {
        const m = LIST_RE.exec(lines[i]);
        if (m) items.push({ depth: m[1].length, text: m[2] });
        else if (lines[i].trim() && /^\s+/.test(lines[i]) && items.length) items[items.length - 1].text += ' ' + lines[i].trim();
        else break;
      }
      out.push(renderList(items, known));
    } else {
      const body: string[] = [];
      for (; i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>|```)/.test(lines[i].trimStart()) && !LIST_RE.test(lines[i]); i++) body.push(lines[i].trim());
      out.push(`<p>${inline(body.join(' '), known)}</p>`);
    }
  }
  return out.join('\n');
}

function renderList(items: Array<{ depth: number; text: string }>, known: Known): string {
  let html = '';
  const stack: number[] = [];
  for (const it of items) {
    if (!stack.length || it.depth > stack[stack.length - 1]) {
      html += '<ul>';
      stack.push(it.depth);
    } else {
      while (stack.length > 1 && it.depth < stack[stack.length - 1]) {
        html += '</li></ul>';
        stack.pop();
      }
      html += '</li>';
    }
    html += `<li>${inline(it.text, known)}`;
  }
  return html + '</li></ul>'.repeat(stack.length);
}

// Splits scene prose into titled groups for collapsible display. A group starts
// at a `####`+ heading, a bold label paragraph (`**Beats:**`, `**Roster — six
// bodies:**`, `**Beats** — each PC...`), or a top-level `- **Transition:**`
// bullet. Text before the first label becomes "Setup" (trigger, location, NPCs).
// Text after a label on the same line stays as the group's opening line.
export function splitSections(md: string): Array<{ title: string; md: string }> {
  const lines = md.replace(/\r/g, '').split('\n');
  const groups: Array<{ title: string; lines: string[] }> = [{ title: 'Setup', lines: [] }];
  let fenced = false;
  lines.forEach((line, i) => {
    if (line.trimStart().startsWith('```')) fenced = !fenced;
    const paraStart = !fenced && (i === 0 || !lines[i - 1].trim());
    let m: RegExpExecArray | null = null;
    let title = '';
    let rest = '';
    if (!fenced && (m = /^#{4,6}\s+(.*)$/.exec(line))) {
      title = m[1];
    } else if (paraStart && (m = /^\*\*([^*]+?)(?::\*\*\s*|\*\*\s+—\s+)(.*)$/.exec(line))) {
      [, title, rest] = m;
    } else if (!fenced && (m = /^[-*]\s+\*\*(Transition):\*\*\s*(.*)$/.exec(line))) {
      [, title, rest] = m;
    }
    if (title) groups.push({ title: title.trim(), lines: rest ? [rest.charAt(0).toUpperCase() + rest.slice(1)] : [] });
    else groups[groups.length - 1].lines.push(line);
  });
  return groups
    .map((g) => ({ title: g.title, md: g.lines.join('\n').trim() }))
    .filter((g) => g.md);
}

// Splits scene prose at `#### S1_ID` node headings (anything after the id is
// ignored — the flow chart owns the title). Text before the first one is the
// scene's setup (trigger, location, NPCs). An empty `nodes` map means the plan
// isn't filed by node; the caller falls back to splitSections.
const NODE_HEAD_RE = /^####\s+([A-Z][A-Z0-9]*_[A-Z0-9_]+)\b/;

export function splitNodeSections(md: string): { setup: string; nodes: Map<string, string> } {
  const buckets: Array<{ id: string; lines: string[] }> = [{ id: '', lines: [] }];
  let fenced = false;
  for (const line of md.replace(/\r/g, '').split('\n')) {
    if (line.trimStart().startsWith('```')) fenced = !fenced;
    const m = fenced ? null : NODE_HEAD_RE.exec(line);
    if (m) buckets.push({ id: m[1], lines: [] });
    else buckets[buckets.length - 1].lines.push(line);
  }
  const nodes = new Map<string, string>();
  for (const b of buckets.slice(1)) {
    nodes.set(b.id, [nodes.get(b.id), b.lines.join('\n').trim()].filter(Boolean).join('\n\n'));
  }
  return { setup: buckets[0].lines.join('\n').trim(), nodes };
}
