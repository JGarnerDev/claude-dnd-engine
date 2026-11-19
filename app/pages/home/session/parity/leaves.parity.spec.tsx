// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, jsx } from './canon.js';
import { EntityBody, EntityHeader } from '../EntityView.js';
import { Rail } from '../Rail.js';
import { Recap } from '../Recap.js';
import { SceneHead } from '../SceneHead.js';
import { entityBody, entityHeader } from '../legacy/entity-view.js';
import { renderRail } from '../legacy/rail.js';
import { recapHtml } from '../legacy/recap.js';
import { sceneHeadHtml } from '../legacy/scene-head.js';
import { parseCombatants } from '../combatants.js';
import { fixture } from '../fixture-data.js';
import type { HpLogEntry } from '../hp-log.js';
import type { SceneHeader } from '../scene-header.js';
import type { PreviousSession } from '../types.js';

const prev = (n: number, campaign: string, slides = false): PreviousSession => ({
  name: `Session ${n} Before`, number: n, date: n > 6 ? '2026-09-29' : '', campaign,
  description: `What happened in ${n}, with [[Ashford]].`, recap: `Long recap of *${n}*.`, cliffhanger: `Left hanging in ${n}.`,
  path: `historian/sessions/Session ${n}.md`, slides: slides ? [{ title: 'x', md: 'y' }] as never : [],
});
const noop = () => {};

describe('leaves parity', () => {
  it('Recap', () => {
    const d = fixture();
    for (const data of [
      { ...d, previously: [prev(8, 'homebrew', true)] },
      { ...d, previously: [prev(8, 'strahd'), prev(5, 'homebrew')] },
      { ...d, party: [], session: { ...d.session, looseThreads: [] }, previously: [{ ...prev(8, ''), recap: '', cliffhanger: '' }] },
      { ...d, sections: [{ title: 'Recap', md: 'Read *this* aloud.' }, ...d.sections], previously: [prev(8, 'homebrew')] },
      { ...d, previously: [] },
    ]) {
      expect(jsx(<Recap data={data} onSlides={noop} />)).toBe(html(recapHtml(data, () => true)));
    }
  });

  it('Rail', () => {
    const d = fixture();
    const nodes = [...d.nodes, { ...d.nodes[0], id: 'LOOSE', scene: null }];
    const visited = new Set([d.nodes[0].id]);
    const el = document.createElement('div');
    renderRail(el, nodes, d.scenes, d.nodes[1].id, visited, noop);
    expect(jsx(<Rail nodes={nodes} scenes={d.scenes} current={d.nodes[1].id} visited={visited} onJump={noop} />)).toBe(html(el.innerHTML));
  });

  it('EntityHeader and EntityBody', () => {
    const e = fixture().entities[0];
    for (const [q, ent] of [['- **Voice:** warm', e], [undefined, { ...e, description: '', subtype: '' }]] as const) {
      expect(jsx(<EntityHeader e={ent} root="C:/repo" quickRef={q} />)).toBe(html(entityHeader(ent, 'C:/repo', q, () => true)));
    }
    for (const t of ['---\nname: x\nstate: active\nties: [a, "[[Sable Wren]]"]\nsome_key: v\n---\nShe keeps **score**.', 'Just a body.']) {
      expect(jsx(<EntityBody text={t} />)).toBe(html(entityBody(t, () => true)));
    }
  });

  it('SceneHead', () => {
    const blocks = parseCombatants([
      '### Wolf — Cinder', '', '- AC 13 · HP 11 · Speed 40 ft · Perception +3', '- **Bite** +4 to hit, 2d4+2', '- **Tactics (Jeff, 2026-10-07):** legs first',
      '', '### Dragon', '', '- AC 18 · HP 10/120', '- **Legendary Actions (3).** Tail swipe, DC 15 Dex save.', '- **Bloodied, 60 HP:** it flees.',
    ].join('\n'));
    const h: SceneHeader = {
      summary: 'The fight at the *ford*.', where: '[[Ashford]]', cast: '[[Silas Crubb]] · the fox', enemies: ['Wolf (Cinder)', 'Dragon', 'Ghost'],
      arrivals: { Dragon: 3 }, dcs: ['Athletics DC 12', 'Stealth 14'], tactics: 'they run at two', time: '', rest: '',
    };
    const log: HpLogEntry[] = [
      { kind: 'hit', at: 1_700_000_000_000, entry: 'Wolf (Cinder)', input: '5', before: 11, after: 6, round: 2 },
      { kind: 'reset', at: 1_700_000_100_000, label: 'Reset HP', before: { 'Wolf (Cinder)': 6, Other: 3 } },
      { kind: 'hit', at: 1_700_000_200_000, entry: 'Dragon', input: '=0', before: 10, after: 0, undone: true },
      { kind: 'hit', at: 1_700_000_300_000, entry: 'Dragon', input: '4', before: 10, after: 6 },
    ];
    const hp = { 'Wolf (Cinder)': 0 };
    for (const [l, open] of [[log, true], [log.slice(0, 2), false], [[], false]] as const) {
      const legacy = sceneHeadHtml(h, blocks, () => true, hp, l, open);
      const react = <SceneHead h={h} blocks={blocks} hp={hp} log={l} logOpen={open} onLogToggle={noop} rolls={[]} onClearRolls={noop} onHit={() => true} onReset={noop} onUndo={noop} />;
      expect(jsx(react)).toBe(html(legacy));
      if (open) for (const c of ['sr-roll', 'is-down', 'data-arrives=3', 'data-legendary=3', 'data-phases', 'is-unmatched', 'sr-hplog-undo', 'disabled', 'sr-hplog-round', 'undone']) expect(jsx(react)).toContain(c);
    }
    const bare: SceneHeader = { ...h, cast: 'just *one*', enemies: [], dcs: [], where: '' };
    expect(jsx(<SceneHead h={bare} blocks={blocks} hp={{}} log={[]} logOpen={false} onLogToggle={noop} rolls={[]} onClearRolls={noop} onHit={() => true} onReset={noop} onUndo={noop} />))
      .toBe(html(sceneHeadHtml(bare, blocks, () => true)));
  });
});
