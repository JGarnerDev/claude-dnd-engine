// A beat's prose as a prompt book (pure): each bullet, paragraph or read-aloud quote
// becomes one block, tagged with a voice the DM can see at a glance, in plan order.
//
//   You      for the DM to read: what's true, what happens, how to run it (plain sans)
//   Say      for the players: read-aloud quotes and spoken lines (serif italic)
//   Do       at the table or in Roll20: tokens, music, title cards, HP to set (mono)
//   Watch    conditional: "When …", "If …", "Once …", what triggers what
//   Choice   a real choice (`Choice (party):`, `Choice (Iggy):`)
//   Private  a message for one player, one Copy button per outcome
//   Introduce  a character's first appearance: look, sound, impression
//   Fight    where a fight or a boss fight starts and ends (`Combat starts:`, `Boss fight ends:`)
//
// The voice comes from the bullet's bold label (`- **Tokens:** …`) or its shape (a
// `>` quote, a bullet that opens on a quoted line). Unlabeled DM bullets join the
// block before them, so a run of plain bullets reads as one list.

import { escapeHtml, extractCallouts, inline, renderMarkdown } from './markdown.js';
import type { Known } from './markdown.js';
import { stripProvenance } from './provenance.js';

export type Voice = 'you' | 'say' | 'do' | 'watch' | 'choice' | 'private' | 'intro' | 'fight';

export interface PbBlock {
  voice: Voice;
  label: string; // the plan's own label ("What happens", "Vey, riding in"), or ''
  md: string; // the block's markdown, label taken out; for callouts, the whole callout
}

const VOICE_NAME: Record<Voice, string> = {
  you: 'You', say: 'Say', do: 'Do', watch: 'Watch', choice: 'Choice', private: 'Private', intro: 'Introduce', fight: 'Fight',
};

const ITEM_RE = /^(?:[-*]|\d+\.)\s+(.*)$/;
const LABEL_RE = /^\*\*([^*]+?):\*\*:?\s*(.*)$|^\*\*([^*]+?)\*\*:\s*(.*)$/;
const CALLOUT_RE = /^[-*]\s+\*\*(Introduce|Tokens|Private)\b/;
const DO_RE = /^(tokens?|music|jukebox|title card|handout|hp bars?|set hp|roll20|maps?|lighting|sound cue|show)\b/i;
const SAY_RE = /\b(read(?:s)? aloud|read-aloud|say|says|aloud|lines?)\b/i;
export const FIGHT_RE = /^(combat|fight|boss fight|boss) (starts|begins|ends)\b/i;
const WATCH_RE = /^(when|if|once|after|until|unless|the moment|(?:the )?triggers?|watch)\b/i;
const QUOTED_RE = /^\*{1,3}["“']/;

interface Chunk { kind: 'item' | 'quote' | 'para'; lines: string[] }

function chunks(md: string): Chunk[] {
  const out: Chunk[] = [];
  let cur: Chunk | null = null;
  let fenced = false;
  for (const line of md.replace(/\r/g, '').split('\n')) {
    if (line.trimStart().startsWith('```')) fenced = !fenced;
    if (fenced || line.trimStart().startsWith('```')) {
      if (!cur || cur.kind !== 'para') out.push(cur = { kind: 'para', lines: [] });
      cur.lines.push(line);
      continue;
    }
    if (!line.trim()) { if (cur?.kind !== 'item') cur = null; continue; }
    const indented = /^\s/.test(line);
    if (!indented && ITEM_RE.test(line)) out.push(cur = { kind: 'item', lines: [line] });
    else if (indented && cur?.kind === 'item') cur.lines.push(line);
    else if (line.trimStart().startsWith('>')) {
      if (cur?.kind !== 'quote') out.push(cur = { kind: 'quote', lines: [] });
      cur.lines.push(line.trimStart());
    } else {
      if (cur?.kind !== 'para') out.push(cur = { kind: 'para', lines: [] });
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
  for (; i < more.length && !ITEM_RE.test(more[i].trim()) && !more[i].trim().startsWith('>'); i++) wrap.push(more[i].trim());
  const nested = more.slice(i);
  const indent = nested.length ? Math.min(...nested.filter((l) => l.trim()).map((l) => l.match(/^\s*/)![0].length)) : 0;
  return [[rest, ...wrap].join(' ').trim(), ...nested.map((l) => l.slice(indent))].filter((l, k) => k > 0 || l).join('\n');
}

const cleanLabel = (s: string) => s.replace(/\s*\(\d{4}-\d{2}-\d{2}\)/g, '').trim();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function classify(c: Chunk): PbBlock {
  if (c.kind === 'quote') return { voice: 'say', label: '', md: c.lines.join('\n') };
  if (c.kind === 'para') {
    const md = c.lines.join('\n');
    return { voice: QUOTED_RE.test(md.trim()) ? 'say' : 'you', label: '', md };
  }
  const callout = CALLOUT_RE.exec(c.lines[0]);
  if (callout) {
    const kind = callout[1];
    if (kind === 'Tokens') {
      return { voice: 'do', label: 'Tokens', md: body(c.lines[0].replace(/^[-*]\s+\*\*Tokens:?\*\*:?\s*/, ''), c.lines.slice(1)) };
    }
    return { voice: kind === 'Private' ? 'private' : 'intro', label: '', md: c.lines.join('\n') };
  }
  const text = ITEM_RE.exec(c.lines[0])![1];
  const m = LABEL_RE.exec(text);
  if (!m) {
    const whole = c.lines.join('\n');
    const bare = text.replace(/^\*\*|\*\*\.?$/g, '');
    if (/^\*\*[^*]+\*\*\.?$/.test(text) && /\btrigger/i.test(bare)) return { voice: 'watch', label: '', md: body(bare, c.lines.slice(1)) };
    // A bold "If …" / "When …" lead is a condition, even without a colon.
    const lead = /^\*\*([^*]+?)\.?\*\*\.?\s*(.*)$/.exec(text);
    if (lead && FIGHT_RE.test(lead[1])) return { voice: 'fight', label: cleanLabel(lead[1]), md: body(lead[2], c.lines.slice(1)) };
    if (lead && WATCH_RE.test(lead[1])) return { voice: 'watch', label: cleanLabel(lead[1]), md: body(lead[2], c.lines.slice(1)) };
    if (QUOTED_RE.test(text)) return { voice: 'say', label: '', md: body(text, c.lines.slice(1)) };
    return { voice: 'you', label: '', md: whole };
  }
  const label = cleanLabel(m[1] ?? m[3]);
  const rest = cap((m[2] ?? m[4]).trim()); // the label moved to the gutter, so the text starts a sentence
  const md = body(rest, c.lines.slice(1));
  const voice: Voice = FIGHT_RE.test(label) ? 'fight'
    : /^choice\b/i.test(label) ? 'choice'
    : DO_RE.test(label) ? 'do'
    : SAY_RE.test(label) || QUOTED_RE.test(rest) ? 'say'
    : WATCH_RE.test(label) ? 'watch'
    : 'you';
  const shown = voice === 'choice' ? (/\(([^)]+)\)/.exec(label)?.[1] ?? '') : label;
  return { voice, label: shown, md };
}

export function promptBlocks(prose: string): PbBlock[] {
  const out: PbBlock[] = [];
  // Provenance goes twice: per line first, then per block, once a label's wrapped
  // lines are joined, so a "(draft, engine 2026-…)" split across lines goes too.
  for (const b of chunks(stripProvenance(prose)).map(classify).map((x) => ({ ...x, md: stripProvenance(x.md) }))) {
    if (!b.md.trim() && b.voice !== 'private' && b.voice !== 'intro' && b.voice !== 'fight') continue;
    const prev = out[out.length - 1];
    // Plain bullets carry on the DM block before them; quotes run together.
    if (prev && !b.label && prev.voice === b.voice && (b.voice === 'you' || (b.voice === 'say' && !prev.label))) {
      prev.md += '\n' + b.md;
    } else out.push({ ...b });
  }
  return out;
}

// Spoken lines inside any block (*"…"*) get the read-aloud face, so a quote in a DM
// note still reads as something to say.
export const markSpoken = (html: string) => html.replace(/<em>(?=(?:<strong>)?(?:&quot;|“|'))/g, '<em class="sr-say">');

function introHtml(md: string, known: Known): string {
  return extractCallouts(md).intros.map((x) => `
    <h3 class="sr-intro-name">${inline(stripProvenance(x.name), known)}</h3>
    <div class="sr-md">${renderMarkdown(x.md, known)}</div>`).join('');
}

// One box per message, a Copy button per outcome, so the DM sends the right
// version to one player without retyping it.
function privateHtml(md: string, known: Known): { to: string; html: string } {
  const p = extractCallouts(md).privates[0];
  if (!p) return { to: '', html: '' };
  return {
    to: p.to,
    html: `${p.when ? `<div class="sr-private-when">${inline(stripProvenance(p.when), known)}</div>` : ''}
      <ul class="sr-private-list">${p.outcomes.map((o) => `
        <li>
          ${o.label ? `<span class="sr-private-label">${inline(o.label, known)}</span>` : ''}
          <span class="sr-private-text">${escapeHtml(o.text)}</span>
          <button type="button" class="sr-copy" data-copy="${escapeHtml(o.text)}" title="Copy this message">Copy</button>
        </li>`).join('')}
      </ul>`,
  };
}

export function blockHtml(b: PbBlock, known: Known): string {
  let label = b.label;
  let inner: string;
  if (b.voice === 'private') {
    const p = privateHtml(b.md, known);
    label = p.to ? `→ ${p.to}` : '';
    inner = p.html;
  } else if (b.voice === 'intro') {
    inner = introHtml(b.md, known);
  } else {
    inner = `<div class="sr-md">${markSpoken(renderMarkdown(b.md, known))}</div>`;
  }
  const sub = label ? `<small>${inline(label, known)}</small>` : '';
  return `<div class="sr-pb sr-pb-${b.voice}"><div class="sr-pb-gut"><span class="sr-pb-voice">${VOICE_NAME[b.voice]}</span>${sub}</div><div class="sr-pb-text">${inner}</div></div>`;
}

export function promptBookHtml(prose: string, known: Known): string {
  return `<div class="sr-pbook">${promptBlocks(prose).map((b) => blockHtml(b, known)).join('')}</div>`;
}
