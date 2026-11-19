// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, jsx } from './canon.js';
import { Markdown } from '../MarkdownView.js';
import { PromptBook } from '../PromptBook.js';
import { RefContext, type RefLinks } from '../RefChips.js';
import { buildRefIndex } from '../ref-index.js';
import { Steps } from '../Steps.js';
import { promptBookHtml } from '../legacy/prompt-book.js';
import { linkRefs } from '../legacy/refs.js';
import { stepsHtml } from '../legacy/steps.js';
import { renderMarkdown } from '../markdown.js';
import type { FlowNode, Scene } from '../types.js';

const n = (id: string, kind = 'social', scene = 'SC3', lines: string[] = []): FlowNode => ({ id, marker: 'committed', kind, scene, title: id, lines, notes: [] });
const nodes = [n('S2_HUNT'), n('S2_RELIEF', 'combat'), n('S2_FIGHT', 'combat'), n('S2_HOME', 'stake', 'SC4', ['a line', 'continued here']), n('S2_CELL', 'decision', 'SC4')];
const scenes: Scene[] = [
  { id: 'SC3', key: '3', title: 'Scene 3 — The Waystation', md: '#### S2_HUNT — Nella takes the ridge and sets the griffon loose\n\n#### S2_RELIEF — Riders on the south road' },
  { id: 'SC4', key: '4', title: 'Scene 4 — The Man in the Cell', md: '#### S2_HOME — The casks come home: on their own cart\n\n#### S2_CELL — The cell' },
];
const cards = [
  { path: 'handouts/tithe-title-card.html', title: 'Tithe, the Borrowed Wing', url: 'https://claude.ai/artifact/abc' },
  { path: 'handouts/nella-tally.html', title: "Nella's Tally", url: '' },
];
const ix = buildRefIndex(nodes, scenes, 'S2_RELIEF', cards);
const links: RefLinks = { ix, onBeat: () => {}, onScene: () => {} };
const withRefs = (node: unknown) => <RefContext.Provider value={links}>{node as never}</RefContext.Provider>;

const prose = [
  '- **What happens:** riders on the road, as in Scene 4 (not Scene 9). See `S2_HOME` and `S2_GONE`.',
  '- **Tokens:** four riders at M27. Show `handouts/tithe-title-card.html` then `handouts/nella-tally.html` and `handouts/none.html`.',
  '- **Read aloud, as she says it:** *"Tithe. Hunt."* and *leaves*.',
  '- **When the wings open:**',
  '  - **The voice.** Every crystal speaks, *"Ours."*',
  '- **Choice (Iggy):** cut her off or stay. [[Sable Wren|the brewer]] waits.',
  '- **Combat starts:** mid-fight',
  '- **Introduce:** Mara, sheriff',
  '  - **Look:** a star.',
  '- **Private (Dip):** Insight, in secret',
  '  - **15+:** It is "real" & hollow.',
  '  - **Under 15:** Nothing.',
  '- **Committed 2026-11-11 (Jeff 2026-11-10).** Nella\'s next turn.',
  '- Clatter on the roof.',
  '',
  '> *"Hoofbeats on the south road."*',
].join('\n');

describe('prompt book parity', () => {
  it('PromptBook', () => {
    expect(jsx(<PromptBook prose={prose} />)).toBe(html(promptBookHtml(prose, () => true)));
  });

  it('PromptBook with refs linked', () => {
    const out = jsx(withRefs(<PromptBook prose={prose} />));
    expect(out).toBe(html(linkRefs(promptBookHtml(prose, () => true), ix)));
    for (const c of ['sr-bref is-scene', 'data-beat=S2_HOME', 'sr-cardref', 'sr-ref-missing', 'sr-say', 'sr-copy', 'sr-pb-intro', 'sr-pb-fight']) expect(out).toContain(c);
  });

  it('Markdown with refs linked', () => {
    const md = '# Scene 4 heading\n\n### Scene 3 sub\n\nIn Scene 4 `S2_HUNT` **Scene 3** [[Scene 4]].\n\n```\nScene 4 in pre\n```\n\n- `S2_RELIEF` here';
    expect(jsx(withRefs(<Markdown md={md} />))).toBe(html(linkRefs(renderMarkdown(md), ix)));
  });
});

describe('steps parity', () => {
  const proseOf = new Map([
    ['S2_HUNT', '- **When:** Nella is down, or round 3\n- Plain beat in Scene 4.'],
    ['S2_RELIEF', prose],
    ['S2_FIGHT', '- **When:** the long condition that goes on well past the forty-two character cut\n- **Boss fight ends.**'],
    ['S2_CELL', '- **Choice (Dip):** keep it'],
  ]);
  const headings = new Map([['S2_HUNT', 'Nella takes the ridge'], ['S2_RELIEF', 'Riders on *the* road']]);
  const cases = [
    { current: 'S2_RELIEF', spans: { fight: [1, 2] as [number, number], boss: [2, 4] as [number, number] } },
    { current: 'S2_HOME', spans: undefined },
    { current: 'S2_HUNT', spans: { fight: [0, 4] as [number, number], boss: null } },
  ];
  for (const c of cases) {
    it(`Steps at ${c.current}`, () => {
      const v = { nodes, prose: proseOf, headings, current: c.current, visited: new Set(['S2_HUNT', 'S2_HOME']), spans: c.spans };
      const legacy = stepsHtml({ ...v, known: () => true, optionsHtml: '<div class="opts">x</div>' });
      const react = <Steps {...v} options={<div className="opts">x</div>} onGo={() => {}} />;
      expect(jsx(react)).toBe(html(legacy));
      expect(jsx(withRefs(react))).toBe(html(linkRefs(legacy, ix)));
    });
  }
});
