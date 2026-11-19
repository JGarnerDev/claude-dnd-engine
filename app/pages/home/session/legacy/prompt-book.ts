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

import { escapeHtml, extractCallouts, inline, renderMarkdown } from '../markdown.js';
import type { Known } from '../markdown.js';
import { stripProvenance } from '../provenance.js';
import { promptBlocks, VOICE_NAME } from '../prompt-blocks.js';
import type { PbBlock } from '../prompt-blocks.js';

export { FIGHT_RE, promptBlocks } from '../prompt-blocks.js';
export type { PbBlock, Voice } from '../prompt-blocks.js';

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
