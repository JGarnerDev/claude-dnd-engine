// Test fixture shaped like Session 29: a cold open, a parallel scene with no
// arrow into it (Halsby's intro), a fork, a dashed "if bitten" aside into a
// later scene, and a node drawn outside every scene box. Used by the specs only.

import type { FlowNode, SessionData } from './types.js';

const node = (id: string, scene: string | null, kind = 'social', title = id.toLowerCase()): FlowNode => ({
  id, marker: 'committed', kind, scene, title, lines: [], notes: [],
});

export function fixture(): SessionData {
  return {
    session: {
      name: 'Session 9 Test', number: 9, date: '2026-10-06', description: '', openingScene: '',
      closingHook: 'The stone does nothing.', preamble: '', folder: 'scheduler/sessions/Session 9 Test',
      campaign: 'homebrew', root: 'C:/repo', looseThreads: ['[[Ashford]] still bleeds'],
    },
    previously: [],
    nodes: [
      node('S1_OPEN', 'SC1'),
      node('S1_REST', 'SC1'),
      node('S1_WOODS', 'SC1B'),
      node('S1_ANSWER', 'SC1B', 'decision'),
      node('S1_BITE', 'SC1B', 'fail'),
      node('S1_DEAL', 'SC1B', 'stake'),
      node('S1_FIGHT', 'SC2', 'combat'),
      node('S1_OFFER', 'SC3', 'stake'),
      node('S1_ANTIDOTE', 'SC3', 'stake'),
      node('S1_BOON', 'SC3', 'seed'),
      node('S1_NELLA', null, 'seed'),
    ],
    edges: [
      { from: 'S1_OPEN', to: 'S1_REST', label: '', dashed: false },
      { from: 'S1_REST', to: 'S1_FIGHT', label: '', dashed: false },
      { from: 'S1_WOODS', to: 'S1_ANSWER', label: '', dashed: false },
      { from: 'S1_ANSWER', to: 'S1_DEAL', label: 'yes', dashed: false },
      { from: 'S1_ANSWER', to: 'S1_BITE', label: 'no', dashed: false },
      { from: 'S1_BITE', to: 'S1_DEAL', label: '', dashed: false },
      { from: 'S1_DEAL', to: 'S1_FIGHT', label: 'he arrives', dashed: false },
      { from: 'S1_BITE', to: 'S1_ANTIDOTE', label: 'if bitten', dashed: true },
      { from: 'S1_FIGHT', to: 'S1_OFFER', label: '', dashed: false },
      { from: 'S1_FIGHT', to: 'S1_NELLA', label: '', dashed: true },
      { from: 'S1_OFFER', to: 'S1_BOON', label: '', dashed: false },
    ],
    scenes: [
      { id: 'SC1', key: '1', title: 'Scene 1 · Open', md: '- **Trigger:** start\n\n> Read this aloud.' },
      { id: 'SC1B', key: '1b', title: 'Scene 1b · Woods', md: 'Meet [[Sable Wren]] in [[Ashford]].' },
      { id: 'SC2', key: '2', title: 'Scene 2 · Fight', md: '' },
      { id: 'SC3', key: '3', title: 'Scene 3 · Offer', md: '' },
    ],
    sections: [{ title: 'Orientation', md: 'Five PCs.' }],
    quickRefs: { 'Sable Wren': '- **Voice:** warm' },
    roster: ['Ashford', 'Sable Wren', 'Nobody Real'],
    party: [{ name: 'Iggy', player: 'Jeff', raceClass: 'Aasimar Bard', level: '4', status: 'Alive', path: 'historian/characters/pcs/Iggy.md' }],
    entities: [
      { name: 'Sable Wren', type: 'character', subtype: 'npc', description: 'Runs the Lioness.', campaign: '', aliases: [], path: 'data/characters/Sable Wren.md' },
      { name: 'Ashford', type: 'location', subtype: 'town', description: 'A ford-town.', campaign: 'homebrew', aliases: [], path: 'data/locations/Ashford.md' },
      { name: 'Iggy', type: 'character', subtype: 'pc', description: 'Bard.', campaign: '', aliases: ['Iggadron Wallaed'], path: 'historian/characters/pcs/Iggy.md' },
      { name: 'Strahd von Zarovich', type: 'character', subtype: 'npc', description: 'Vampire.', campaign: 'strahd', aliases: [], path: 'historian/characters/npcs/Strahd.md' },
    ],
  };
}
