// The top of a scene page: what the scene is doing, where, who is in it, the
// enemies as compact rows that expand to their stat blocks, and the DCs. Each
// enemy row carries every attack line and an HP box (current / max) the DM types
// damage into; scene.ts wires the box, the runner stores the numbers. To-hit
// bonuses, damage dice, checks and saves are dice buttons (dice.ts); scene.ts
// rolls them into the roll log under the Enemies heading. Under the enemies sits
// the HP log (hp-log.ts): every entry, newest first, each one undoable.

import { escapeHtml, inline, plainText, renderMarkdown } from './markdown.js';
import type { Known } from './markdown.js';
import { matchEnemy } from './combatants.js';
import type { Phase, StatBlock } from './combatants.js';
import type { SceneHeader } from './scene-header.js';
import { stripProvenance } from './provenance.js';
import { rollableHtml } from './dice.js';
import { touches, undoable } from './hp-log.js';
import type { HpLogEntry } from './hp-log.js';

const row = (label: string, body: string, isChips = false) =>
  body ? `<div class="sr-sh-row"><span class="sr-sh-label">${label}</span><div class="sr-sh-val${isChips ? ' is-chips' : ''}">${body}</div></div>` : '';

// The compact row keeps what the DM reaches for mid-round; skills live in the full block.
export const rowStats = (stats: string) =>
  stats.split(' · ').filter((x) => /^(\*\*)?(AC|HP|Speed|CR)\b/.test(x.trim())).join(' · ') || stats;

const chips = (items: string[], known: Known) =>
  items.map((x) => `<span class="sr-sh-chip">${inline(x, known)}</span>`).join('');

// Current HP per enemy entry ("Drover (Varrick Tenn)"), so two enemies sharing one
// block (both cask-hands are Thugs) keep their own numbers. Missing = the block's known
// starting HP ("HP 10/27" carries damage from an earlier session), else full.
export type HpMap = Readonly<Record<string, number>>;

// A boss carries its legendary actions and phases on the box, for the fight bar's chip.
export function hpHtml(entry: string, max: number, hp: HpMap, start: number = max, boss: { legendary?: number; phases?: readonly Phase[] } = {}): string {
  const cur = Math.min(hp[entry] ?? start, max);
  const extra = (boss.legendary ? ` data-legendary="${boss.legendary}"` : '')
    + (boss.phases?.length ? ` data-phases="${escapeHtml(JSON.stringify(boss.phases))}"` : '');
  return `<span class="sr-hp" data-entry="${escapeHtml(entry)}" data-max="${max}" data-start="${start}"${extra}>
      <span class="sr-hp-val"><b>${cur}</b>/${max}</span>
      <input class="sr-hp-in" type="text" inputmode="numeric" size="4" placeholder="dmg" title="12 or -12 deals damage · +5 heals · =40 sets · Enter applies" aria-label="Damage or heal">
    </span>`;
}

function enemyHtml(entry: string, blocks: StatBlock[], known: Known, hp: HpMap, arrives = 0): string {
  const tag = arrives ? ` <span class="sr-arrives">arrives round ${arrives}</span>` : '';
  const at = arrives ? ` data-arrives="${arrives}"` : '';
  const b = matchEnemy(entry, blocks);
  if (!b) return `<div class="sr-enemy is-unmatched"${at}><span class="sr-enemy-name">${inline(entry, known)}${tag}</span></div>`;
  const down = b.hp !== null && (hp[entry] ?? b.start ?? b.hp) <= 0;
  const atks = b.attacks.map((a) => `<span class="sr-atk">${rollableHtml(inline(stripProvenance(a), known))}</span>`).join('');
  return `
    <details class="sr-enemy${down ? ' is-down' : ''}"${at}>
      <summary>
        <span class="sr-enemy-name">${inline(entry, known)}${tag}</span>
        <span class="sr-enemy-stats">${inline(rowStats(b.stats), known)}</span>
        <span class="sr-enemy-atk">${atks}</span>
        ${b.hp !== null ? hpHtml(entry, b.hp, hp, b.start ?? b.hp, b) : '<span></span>'}
      </summary>
      <div class="sr-md sr-enemy-block"><div class="sr-enemy-title">${escapeHtml(b.title)}</div>${rollableHtml(renderMarkdown(stripProvenance(b.md), known))}</div>
    </details>`;
}

const clock = (at: number) => new Date(at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

// This scene's entries in the HP log, newest first. A reset row lists the values it
// wiped. Undo is offered while nothing newer has touched that enemy.
export function hpLogHtml(log: readonly HpLogEntry[], entries: readonly string[], open = false): string {
  const mine = new Set(entries);
  const rows = log.map((e, i) => ({ e, i })).filter(({ e }) => touches(e).some((k) => mine.has(k))).reverse();
  const li = ({ e, i }: { e: HpLogEntry; i: number }) => {
    const what = e.kind === 'hit'
      ? `<b>${escapeHtml(plainText(e.entry))}</b> <code>${escapeHtml(e.input)}</code> ${e.before} → ${e.after}`
      : `<b>${escapeHtml(e.label)}</b> ${Object.entries(e.before).filter(([k]) => mine.has(k)).map(([k, v]) => `${escapeHtml(plainText(k))} was ${v}`).join(' · ')}`;
    const act = e.undone
      ? '<span class="sr-hplog-tag">undone</span>'
      : `<button type="button" class="sr-hplog-undo" data-undo="${i}"${undoable(log, i) ? '' : ' disabled title="Changed since: undo the newer entry first"'}>Undo</button>`;
    const round = e.kind === 'hit' && e.round ? ` <span class="sr-hplog-round">R${e.round}</span>` : '';
    return `<li class="${e.undone ? 'is-undone' : ''}"><span class="sr-hplog-at">${clock(e.at)}${round}</span><span class="sr-hplog-what">${what}</span>${act}</li>`;
  };
  const live = rows.filter(({ e }) => !e.undone).length;
  return `<details class="sr-hplog"${open ? ' open' : ''}><summary>HP log (${live})</summary>${rows.length
    ? `<ol>${rows.map(li).join('')}</ol>`
    : '<p class="sr-hplog-empty">Every HP entry lands here, and Reset HP never clears it.</p>'}</details>`;
}

// The newest reset touching this scene, if it can still be undone; else -1.
export function undoResetIndex(log: readonly HpLogEntry[], entries: readonly string[]): number {
  const mine = new Set(entries);
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i];
    if (e.kind === 'reset' && touches(e).some((k) => mine.has(k))) return undoable(log, i) ? i : -1;
  }
  return -1;
}

export function sceneHeadHtml(h: SceneHeader, blocks: StatBlock[], known: Known, hp: HpMap = {}, log: readonly HpLogEntry[] = [], logOpen = false): string {
  const undoAt = undoResetIndex(log, h.enemies);
  const p = (s: string) => inline(stripProvenance(s), known);
  return `
    ${h.summary ? `<p class="sr-sh-summary">${p(h.summary)}</p>` : ''}
    <div class="sr-sh-grid">
      ${row('Where', h.where ? p(h.where) : '')}
      ${row('Who’s here', h.cast ? (h.cast.includes(' · ') ? chips(h.cast.split(' · '), known) : p(h.cast)) : '', h.cast.includes(' · '))}
      ${row('DCs', h.dcs.length ? chips(h.dcs, known) : '', true)}
    </div>
    ${h.enemies.length ? `
    <div class="sr-enemies">
      <div class="sr-enemies-head"><span class="sr-sh-label">Enemies</span><span class="sr-enemies-btns"><button type="button" class="sr-roll-clear" title="Clear the roll log" hidden>Clear rolls</button><button type="button" class="sr-hp-undo-reset" data-undo="${undoAt}" title="Put back the HP the last reset wiped"${undoAt < 0 ? ' hidden' : ''}>Undo reset</button><button type="button" class="sr-hp-reset" title="Put every enemy back to its known HP at the start of the session. The HP log keeps the old numbers.">Reset HP</button></span></div>
      <ol class="sr-roll-log" aria-live="polite"></ol>
      ${h.enemies.map((e) => enemyHtml(e, blocks, known, hp, h.arrivals[e])).join('')}
      ${h.tactics ? `<p class="sr-tactics">${p(h.tactics)}</p>` : ''}
      ${hpLogHtml(log, h.enemies, logOpen)}
    </div>` : ''}`;
}
