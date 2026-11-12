// The main column: one page per scene. The scene header (summary, where, cast,
// DCs, enemies), any read-aloud text from the setup, the beats as steps (each a
// prompt book), and a Tokens toggle with the scene's Roll20 cues. Beat ids and
// "Scene N" become chips that open in the side panel (refs.ts). While a fight runs,
// a fight bar sits pinned at the top: round counter, what's due now, HP chips. The
// recap card keeps its own body.

import { escapeHtml, extractCallouts, inline, nodeHeadings, plainText, renderMarkdown, splitNodeSections } from './markdown.js';
import type { Known } from './markdown.js';
import type { NextOption } from './flow.js';
import { parseSceneHeader } from './scene-header.js';
import { hpLogHtml, sceneHeadHtml, undoResetIndex } from './scene-head.js';
import { fightSpans, inSpan, stepsHtml } from './steps.js';
import { anyMet, enemyNames, parseConds } from './cues.js';
import type { Cond, FightNow } from './cues.js';
import { promptBookHtml } from './prompt-book.js';
import { linkRefs } from './refs.js';
import type { RefIndex } from './refs.js';
import { stripProvenance } from './provenance.js';
import { applyHp } from './combatants.js';
import { roll, rollDetailHtml } from './dice.js';
import type { Roll, RollKind, RollMode } from './dice.js';
import type { StatBlock } from './combatants.js';
import type { HpMap } from './scene-head.js';
import type { HpLogEntry } from './hp-log.js';
import type { FlowNode, Scene } from './types.js';

export interface SceneView {
  node: FlowNode;
  scene: Scene | undefined;
  sceneNodes: FlowNode[]; // the scene's beats in flow order
  visited: ReadonlySet<string>;
  position: string; // "step 2 of 4"
  options: NextOption[];
  titleOf: (id: string) => string;
  known: Known;
  refs: RefIndex; // beat and scene links
  closingHook: string;
  combatants: StatBlock[];
  hp: HpMap; // current enemy HP by enemy entry; missing = its known starting HP
  hpLog: readonly HpLogEntry[]; // every HP entry (hp-log.ts); the runner owns it
  tokensOpen: boolean;
  bodyHtml?: string; // the recap card's body, in place of steps
  onGo: (id: string) => void;
  onTokensToggle: (open: boolean) => void;
  onHpHit: (entry: string, input: string, before: number, after: number, start: number) => void;
  onHpReset: (before: Record<string, number>) => void; // the values the reset wipes
  onHpUndo: (index: number) => void; // undo one log entry; the runner re-renders
  round: number; // this scene's round counter
  onRound: (round: number) => void;
}

function optionsHtml(v: SceneView): string {
  const branches = v.options.filter((o) => o.kind !== 'aside');
  const asides = v.options.filter((o) => o.kind === 'aside');
  const fork = branches.length > 1;
  const btn = (o: NextOption, i: number) => {
    const label = !fork && o.kind === 'edge' ? `Next — ${v.titleOf(o.to)}` : o.label;
    const sub = fork && o.label !== v.titleOf(o.to) ? `<span class="sr-opt-to">→ ${inline(v.titleOf(o.to), v.known)}</span>` : '';
    return `
      <button type="button" class="sr-opt${i === 0 && o.kind !== 'aside' ? ' is-primary' : ''}" data-kind="${o.kind}" data-to="${o.to}">
        <kbd>${i + 1}</kbd><span class="sr-opt-label">${inline(label, v.known)}</span>${sub}
      </button>`;
  };
  return `
    <div class="sr-options">
      ${branches.length ? branches.map(btn).join('') : `<div class="sr-end"><strong>End of the plan.</strong> ${inline(v.closingHook, v.known)}</div>`}
    </div>
    ${asides.length ? `<div class="sr-asides"><span class="sr-asides-label">If it comes up</span>${asides.map((o, i) => btn(o, branches.length + i)).join('')}</div>` : ''}`;
}

// Read-aloud blocks in the setup stay open; the rest of the setup folds away.
function setupHtml(rest: string, open: boolean, known: Known): string {
  if (!rest) return '';
  const lines = rest.split('\n');
  const aloud = lines.filter((l) => l.trimStart().startsWith('>')).join('\n');
  const other = lines.filter((l) => !l.trimStart().startsWith('>')).join('\n').trim();
  return (aloud ? `<div class="sr-md sr-aloud">${renderMarkdown(aloud, known)}</div>` : '')
    + (other ? `<details class="sr-setup"${open ? ' open' : ''}><summary>Scene notes</summary>${promptBookHtml(other, known)}</details>` : '');
}

function tokensHtml(v: SceneView, prose: Map<string, string>): string {
  const cues = v.sceneNodes.flatMap((n, i) => extractCallouts(prose.get(n.id) ?? '').tokens.map((t) => ({ i, t })));
  if (!cues.length) return '';
  return `
    <details class="sr-tokens-box"${v.tokensOpen ? ' open' : ''}>
      <summary>Tokens</summary>
      <ol>${cues.map((c) => `<li><span class="sr-tok-step">${c.i + 1}</span> ${inline(stripProvenance(c.t), v.known)}</li>`).join('')}</ol>
    </details>`;
}

export function renderScene(main: HTMLElement, v: SceneView): void {
  const title = v.scene?.title ?? 'Aside — outside the scene boxes';
  const { setup, nodes: prose } = splitNodeSections(v.scene?.md ?? '');
  const header = parseSceneHeader(setup, v.scene?.md ?? '');
  const time = header.time ? `<span class="sr-scene-time">${escapeHtml(header.time)}</span>` : '';
  // The fight bar shows on the steps a fight runs over, and only with enemies to track.
  const spans = fightSpans(v.sceneNodes, prose, header.enemies.length > 0);
  const at = v.sceneNodes.findIndex((n) => n.id === v.node.id);
  const fighting = header.enemies.length > 0 && inSpan(spans.fight, at);
  const body = v.bodyHtml !== undefined
    ? `<h1 class="sr-card-title">${inline(v.node.title, v.known)}</h1><div class="sr-card-body">${v.bodyHtml}</div>${optionsHtml(v)}`
    : `${fighting ? fightBarHtml(inSpan(spans.boss, at) ? 'boss' : 'fight', v.round) : ''}
       ${sceneHeadHtml(header, v.combatants, v.known, v.hp, v.hpLog, hpLogOpen)}
       ${setupHtml(header.rest, prose.size === 0, v.known)}
       ${stepsHtml({ nodes: v.sceneNodes, prose, headings: nodeHeadings(v.scene?.md ?? ''), current: v.node.id, visited: v.visited, known: v.known, optionsHtml: optionsHtml(v), spans })}
       ${tokensHtml(v, prose)}`;
  // Same scene: keep the DM's scroll and bring the open step into view. New scene: top.
  const sameScene = main.dataset.scene === (v.scene?.id ?? '');
  const scroll = main.scrollTop;
  main.dataset.scene = v.scene?.id ?? '';
  main.innerHTML = `
    <article class="sr-scene" data-kind="${v.node.kind}" data-current="${escapeHtml(v.node.id)}">
      <header class="sr-scene-bar">
        <h2 class="sr-scene-title">${escapeHtml(title)}</h2>
        <span class="sr-scene-pos">${time}${escapeHtml(v.position)}</span>
      </header>
      ${linkRefs(body, v.refs)}
    </article>`;

  main.querySelectorAll<HTMLButtonElement>('.sr-opt, .sr-step-head').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.to !== v.node.id) v.onGo(b.dataset.to!);
  }));
  main.querySelectorAll<HTMLButtonElement>('.sr-copy').forEach((b) => b.addEventListener('click', () => {
    void navigator.clipboard?.writeText(b.dataset.copy ?? '').then(() => {
      b.textContent = 'Copied';
      b.classList.add('is-copied');
      setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('is-copied'); }, 1500);
    });
  }));
  wireHp(main, v, header.enemies);
  wireRolls(main);
  const tokens = main.querySelector<HTMLDetailsElement>('.sr-tokens-box');
  tokens?.addEventListener('toggle', () => v.onTokensToggle(tokens.open));
  main.scrollTop = sameScene ? scroll : 0;
  if (sameScene) main.querySelector('.sr-step.is-current')?.scrollIntoView?.({ block: 'nearest' });
}

// The HP boxes sit inside each enemy row's <summary>, so clicks and keys in them must
// not toggle the stat block open. Hits and resets land in place (no re-render), so an
// open stat block and the scroll position survive; the HP log redraws beside them.
// Undo goes through the runner, which re-renders. The log's open state outlives renders.
let hpLogOpen = false;

function wireHp(main: HTMLElement, v: SceneView, entries: readonly string[]): void {
  const enemies = main.querySelector<HTMLElement>('.sr-enemies');
  const refreshLog = () => {
    const log = main.querySelector<HTMLDetailsElement>('.sr-hplog');
    if (log) log.outerHTML = hpLogHtml(v.hpLog, entries, log.open);
    const undoReset = main.querySelector<HTMLButtonElement>('.sr-hp-undo-reset');
    if (undoReset) {
      const at = undoResetIndex(v.hpLog, entries);
      undoReset.dataset.undo = String(at);
      undoReset.hidden = at < 0;
    }
  };
  enemies?.addEventListener('toggle', (ev) => {
    if ((ev.target as Element).matches?.('.sr-hplog')) hpLogOpen = (ev.target as HTMLDetailsElement).open;
  }, true);
  enemies?.addEventListener('click', (ev) => {
    const b = (ev.target as Element).closest<HTMLButtonElement>('button[data-undo]');
    if (!b || b.disabled || Number(b.dataset.undo) < 0) return;
    ev.preventDefault();
    v.onHpUndo(Number(b.dataset.undo));
  });
  const boxes = [...main.querySelectorAll<HTMLElement>('.sr-hp')];
  const strip = wireFight(main, v, boxes, entries, (entry, typed) => {
    const box = boxes.find((b) => b.dataset.entry === entry);
    return box ? hit(box, typed) : false;
  });
  const show = (box: HTMLElement, cur: number) => {
    box.querySelector('.sr-hp-val b')!.textContent = String(cur);
    box.closest('.sr-enemy')?.classList.toggle('is-down', cur <= 0);
  };
  // One hit, typed in the Enemies box or in the strip: the box holds the number.
  const hit = (box: HTMLElement, typed: string): boolean => {
    const max = Number(box.dataset.max);
    const start = Number(box.dataset.start ?? max);
    const cur = Number(box.querySelector('.sr-hp-val b')!.textContent);
    const next = applyHp(cur, max, typed);
    if (next === null) return false;
    show(box, next);
    v.onHpHit(box.dataset.entry!, typed.trim(), cur, next, start);
    refreshLog();
    strip.refresh();
    return true;
  };
  boxes.forEach((box) => {
    const input = box.querySelector<HTMLInputElement>('.sr-hp-in')!;
    box.addEventListener('click', (ev) => ev.preventDefault());
    input.addEventListener('keyup', (ev) => { if (ev.key === ' ') ev.preventDefault(); });
    input.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      if (hit(box, input.value)) input.value = '';
    });
  });
  main.querySelector('.sr-hp-reset')?.addEventListener('click', () => {
    const before: Record<string, number> = {};
    boxes.forEach((box) => {
      const cur = Number(box.querySelector('.sr-hp-val b')!.textContent);
      const start = Number(box.dataset.start ?? box.dataset.max);
      if (cur !== start) before[box.dataset.entry!] = cur;
      show(box, start);
    });
    v.onHpReset(before);
    refreshLog();
    strip.refresh();
  });
}

// The fight bar, pinned at the top of the notes while a fight runs (steps.ts →
// fightSpans): the round counter, what's due now, and one HP chip per enemy, colored
// by how hurt it is. A chip click opens a damage box right in the bar, so damage goes
// in wherever the DM has scrolled. An enemy that "arrives round 3" waits greyed out
// until then.
//
// After every HP entry and every round, the cues refresh: Watch items and `When:`
// pills whose condition has come true light up (cues.ts), and the bar lists them.
let stripPick = '';

const shortName = (entry: string) => plainText(/\(([^)]+)\)\s*$/.exec(entry)?.[1] ?? entry);
const band = (cur: number, max: number) => (cur <= 0 ? 'down' : cur <= max / 4 ? 'low' : cur <= max / 2 ? 'hurt' : 'ok');
const clip = (s: string, n = 90) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export function fightBarHtml(mode: 'fight' | 'boss', round: number): string {
  return `
    <div class="sr-strip${mode === 'boss' ? ' is-boss' : ''}" aria-label="The fight">
      <div class="sr-strip-top">
        <span class="sr-strip-mode">${mode === 'boss' ? 'Boss fight' : 'Fight'}</span>
        <span class="sr-round"><button type="button" data-round="-1" aria-label="Previous round">−</button>
          <span>Round <output>${round}</output></span>
          <button type="button" data-round="1" aria-label="Next round">+</button></span>
        <div class="sr-strip-alerts" aria-live="polite"></div>
      </div>
      <div class="sr-strip-chips"></div>
      <div class="sr-strip-quickbox"></div>
    </div>`;
}

function wireFight(main: HTMLElement, v: SceneView, boxes: HTMLElement[], entries: readonly string[], hit: (entry: string, typed: string) => boolean): { refresh: () => void } {
  let round = Math.max(1, v.round);
  const names = enemyNames(entries);
  const conds = new WeakMap<Element, Cond[]>();
  const condsOf = (el: Element, text: string) => {
    if (!conds.has(el)) conds.set(el, parseConds(text, names));
    return conds.get(el)!;
  };
  const read = (b: HTMLElement) => ({ entry: b.dataset.entry!, cur: Number(b.querySelector('.sr-hp-val b')!.textContent), max: Number(b.dataset.max) });
  const arrives = (entry: string) => Number(main.querySelector<HTMLElement>(`.sr-enemy[data-arrives] .sr-hp[data-entry="${CSS.escape(entry)}"]`)?.closest<HTMLElement>('.sr-enemy')?.dataset.arrives ?? 0);
  const strip = main.querySelector<HTMLElement>('.sr-strip');
  if (!boxes.some((b) => b.dataset.entry === stripPick)) stripPick = '';

  const chips = () => {
    const box = strip?.querySelector<HTMLElement>('.sr-strip-chips');
    if (!box) return;
    box.innerHTML = boxes.map(read).map((e) => {
      const due = arrives(e.entry);
      const coming = due > round;
      return `<button type="button" class="sr-hpchip is-${band(e.cur, e.max)}${coming ? ' is-coming' : ''}${e.entry === stripPick ? ' is-picked' : ''}" data-entry="${escapeHtml(e.entry)}" title="${escapeHtml(plainText(e.entry))}${coming ? `, arrives round ${due}` : ''}: type damage">
        <i></i>${escapeHtml(shortName(e.entry))} <b>${e.cur}</b>/${e.max}${coming ? ` <small>R${due}</small>` : ''}</button>`;
    }).join('');
    const picked = boxes.map(read).find((e) => e.entry === stripPick);
    const quick = strip!.querySelector<HTMLElement>('.sr-strip-quickbox')!;
    const had = quick.querySelector('.sr-strip-in')?.getAttribute('data-entry');
    if (had !== (picked?.entry ?? null)) {
      quick.innerHTML = picked ? `<label class="sr-strip-quick"><span>${escapeHtml(plainText(picked.entry))}</span>
        <input class="sr-strip-in" data-entry="${escapeHtml(picked.entry)}" type="text" inputmode="numeric" size="5" placeholder="dmg" title="12 or -12 deals damage · +5 heals · =40 sets · Enter applies · Esc closes" aria-label="Damage or heal for ${escapeHtml(plainText(picked.entry))}"></label>` : '';
    }
  };

  // Light what has come true, and list it in the bar.
  const cues = () => {
    const now: FightNow = { round, hp: Object.fromEntries(boxes.map(read).map((e) => [e.entry, e.cur])) };
    const alerts: string[] = [];
    const arriving: string[] = [];
    main.querySelectorAll<HTMLElement>('.sr-enemy[data-arrives]').forEach((row) => {
      const due = Number(row.dataset.arrives);
      row.classList.toggle('is-coming', due > round);
      if (due === round) arriving.push(shortName(row.querySelector('.sr-enemy-name')?.firstChild?.textContent?.trim() ?? ''));
    });
    if (arriving.length) alerts.push(`<span class="sr-alert is-now">${escapeHtml(arriving.join(', '))} ${arriving.length > 1 ? 'arrive' : 'arrives'} this round</span>`);
    main.querySelectorAll<HTMLElement>('.sr-pb-watch').forEach((block) => {
      const label = block.querySelector('.sr-pb-gut small')?.textContent ?? '';
      const items = [...block.querySelectorAll<HTMLElement>('.sr-pb-text li')];
      const lit = anyMet(condsOf(block, items.length ? label : `${label} ${block.querySelector('.sr-pb-text')?.textContent ?? ''}`), now);
      block.classList.toggle('is-now', lit);
      // A step's own When line lights, but its pill already says so.
      if (lit && label !== 'When') alerts.push(`<span class="sr-alert is-now">${escapeHtml(clip(label || block.querySelector('.sr-pb-text')?.textContent?.trim() || ''))}</span>`);
      items.forEach((li) => {
        const on = anyMet(condsOf(li, li.firstChild?.textContent ?? li.textContent ?? ''), now) || anyMet(condsOf(li, li.textContent ?? ''), now);
        li.classList.toggle('is-now', on);
        if (on && !lit) alerts.push(`<span class="sr-alert is-now">${escapeHtml(clip(li.textContent?.trim() ?? ''))}</span>`);
      });
    });
    main.querySelectorAll<HTMLElement>('.sr-when').forEach((pill) => {
      const ready = anyMet(condsOf(pill, pill.dataset.when ?? ''), now);
      pill.classList.toggle('is-ready', ready);
      const step = pill.closest<HTMLElement>('.sr-step');
      if (ready && step?.classList.contains('is-todo')) {
        const title = step.querySelector('.sr-step-title')?.textContent ?? '';
        alerts.push(`<button type="button" class="sr-alert is-ready" data-to="${escapeHtml(step.dataset.id!)}">Ready: ${escapeHtml(step.querySelector('.sr-step-num')?.textContent ?? '')} · ${escapeHtml(clip(title, 60))}</button>`);
      }
    });
    const box = strip?.querySelector('.sr-strip-alerts');
    if (box) box.innerHTML = alerts.slice(0, 5).join('');
  };

  const refresh = () => { chips(); cues(); };
  strip?.addEventListener('click', (ev) => {
    const t = ev.target as Element;
    const step = t.closest<HTMLElement>('[data-round]');
    if (step) {
      round = Math.max(1, round + Number(step.dataset.round));
      strip.querySelector('.sr-round output')!.textContent = String(round);
      v.onRound(round);
      refresh();
      return;
    }
    const go = t.closest<HTMLElement>('.sr-alert[data-to]');
    if (go) { v.onGo(go.dataset.to!); return; }
    const chip = t.closest<HTMLElement>('.sr-hpchip');
    if (!chip) return;
    stripPick = stripPick === chip.dataset.entry ? '' : chip.dataset.entry!;
    chips();
    strip.querySelector<HTMLInputElement>('.sr-strip-in')?.focus();
  });
  strip?.addEventListener('keydown', (ev) => {
    const input = (ev.target as Element).closest<HTMLInputElement>('.sr-strip-in');
    if (!input) return;
    if (ev.key === 'Escape') { ev.stopPropagation(); stripPick = ''; chips(); return; }
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    if (hit(stripPick, input.value)) { input.value = ''; input.focus(); }
  });
  refresh();
  return { refresh };
}

// Dice buttons sit in the enemy rows' <summary> too, so a click rolls without toggling
// the block. The log lives here, not in the runner's store: rolls are for the moment,
// and it survives re-renders within the page but not a reload.
interface LoggedRoll { who: string; what: string; r: Roll }
const rollLog: LoggedRoll[] = [];
const LOG_SIZE = 6;

function logHtml(): string {
  return rollLog.map(({ who, what, r }, i) => {
    const tag = r.nat === 20 ? ' is-nat20' : r.nat === 1 ? ' is-nat1' : '';
    const mode = r.mode === 'adv' ? ' · adv' : r.mode === 'dis' ? ' · dis' : r.mode === 'crit' ? ' · crit' : '';
    const kind = r.kind === 'hit' ? 'to hit' : r.kind === 'dmg' ? 'damage' : 'roll';
    return `<li class="sr-roll-entry${tag}${i === 0 ? ' is-latest' : ''}"><b class="sr-roll-total">${r.total}</b>
      <span class="sr-roll-what">${escapeHtml(who)} · ${escapeHtml(what)} · ${kind}${mode}</span>
      <span class="sr-roll-detail">${rollDetailHtml(r)}</span></li>`;
  }).join('');
}

function wireRolls(main: HTMLElement): void {
  const log = main.querySelector<HTMLElement>('.sr-roll-log');
  const clear = main.querySelector<HTMLButtonElement>('.sr-roll-clear');
  const show = () => {
    if (log) log.innerHTML = logHtml();
    if (clear) clear.hidden = !rollLog.length;
  };
  show();
  clear?.addEventListener('click', () => { rollLog.length = 0; show(); });
  main.querySelectorAll<HTMLButtonElement>('.sr-roll').forEach((b) => b.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const kind = b.dataset.kind as RollKind;
    const mode: RollMode = kind === 'dmg' ? (ev.shiftKey ? 'crit' : 'normal') : ev.shiftKey ? 'adv' : ev.altKey ? 'dis' : 'normal';
    const r = roll(b.dataset.roll!, kind, mode);
    if (!r) return;
    const enemy = b.closest('.sr-enemy');
    const who = enemy?.querySelector('.sr-enemy-name')?.textContent?.trim() ?? '';
    const line = b.closest('.sr-atk, li');
    const what = b.dataset.label ?? line?.querySelector('strong')?.textContent?.replace(/:$/, '').trim() ?? '';
    rollLog.unshift({ who, what, r });
    rollLog.length = Math.min(rollLog.length, LOG_SIZE);
    show();
  }));
}
