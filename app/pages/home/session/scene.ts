// The main column: one page per scene. The scene header (summary, where, cast,
// DCs, enemies), any read-aloud text from the setup, the beats as steps, and a
// Tokens toggle with the scene's Roll20 cues. The recap card keeps its own body.

import { escapeHtml, extractCallouts, inline, nodeHeadings, renderMarkdown, splitNodeSections } from './markdown.js';
import type { Known } from './markdown.js';
import type { NextOption } from './flow.js';
import { parseSceneHeader } from './scene-header.js';
import { sceneHeadHtml } from './scene-head.js';
import { stepsHtml } from './steps.js';
import { stripProvenance } from './provenance.js';
import { applyHp } from './combatants.js';
import type { StatBlock } from './combatants.js';
import type { HpMap } from './scene-head.js';
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
  closingHook: string;
  combatants: StatBlock[];
  hp: HpMap; // current enemy HP by enemy entry; missing = full
  tokensOpen: boolean;
  bodyHtml?: string; // the recap card's body, in place of steps
  onGo: (id: string) => void;
  onTokensToggle: (open: boolean) => void;
  onHp: (entry: string, value: number | null) => void; // null = back to its known starting HP
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
  const other = stripProvenance(lines.filter((l) => !l.trimStart().startsWith('>')).join('\n')).trim();
  return (aloud ? `<div class="sr-md sr-aloud">${renderMarkdown(aloud, known)}</div>` : '')
    + (other ? `<details class="sr-setup"${open ? ' open' : ''}><summary>Scene notes</summary><div class="sr-md">${renderMarkdown(other, known)}</div></details>` : '');
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
  const body = v.bodyHtml !== undefined
    ? `<h1 class="sr-card-title">${inline(v.node.title, v.known)}</h1><div class="sr-card-body">${v.bodyHtml}</div>${optionsHtml(v)}`
    : `${sceneHeadHtml(header, v.combatants, v.known, v.hp)}
       ${setupHtml(header.rest, prose.size === 0, v.known)}
       ${stepsHtml({ nodes: v.sceneNodes, prose, headings: nodeHeadings(v.scene?.md ?? ''), current: v.node.id, visited: v.visited, known: v.known, optionsHtml: optionsHtml(v) })}
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
      ${body}
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
  wireHp(main, v);
  const tokens = main.querySelector<HTMLDetailsElement>('.sr-tokens-box');
  tokens?.addEventListener('toggle', () => v.onTokensToggle(tokens.open));
  main.scrollTop = sameScene ? scroll : 0;
  if (sameScene) main.querySelector('.sr-step.is-current')?.scrollIntoView?.({ block: 'nearest' });
}

// The HP boxes sit inside each enemy row's <summary>, so clicks and keys in them must
// not toggle the stat block open. Updates land in place (no re-render), so an open
// stat block and the scroll position survive a hit.
function wireHp(main: HTMLElement, v: SceneView): void {
  const show = (box: HTMLElement, cur: number) => {
    box.querySelector('.sr-hp-val b')!.textContent = String(cur);
    box.closest('.sr-enemy')?.classList.toggle('is-down', cur <= 0);
  };
  main.querySelectorAll<HTMLElement>('.sr-hp').forEach((box) => {
    const entry = box.dataset.entry!;
    const max = Number(box.dataset.max);
    const start = Number(box.dataset.start ?? max);
    const input = box.querySelector<HTMLInputElement>('.sr-hp-in')!;
    box.addEventListener('click', (ev) => ev.preventDefault());
    input.addEventListener('keyup', (ev) => { if (ev.key === ' ') ev.preventDefault(); });
    input.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      const cur = Number(box.querySelector('.sr-hp-val b')!.textContent);
      const next = applyHp(cur, max, input.value);
      if (next === null) return;
      input.value = '';
      show(box, next);
      v.onHp(entry, next === start ? null : next);
    });
  });
  main.querySelector('.sr-hp-reset')?.addEventListener('click', () => {
    main.querySelectorAll<HTMLElement>('.sr-hp').forEach((box) => {
      show(box, Number(box.dataset.start ?? box.dataset.max));
      v.onHp(box.dataset.entry!, null);
    });
  });
}
