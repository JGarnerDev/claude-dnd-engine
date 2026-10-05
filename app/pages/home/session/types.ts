// Shape of the session runner's data — the JSON scripts/session-cards.py emits.

export type Marker = 'committed' | 'draft' | 'open' | null;

// One card: a mermaid node from the session's _flow.md. `kind` is its classDef
// (combat, social, decision, stake, seed, fail, open); `scene` the subgraph id it
// sits in (null for a node drawn outside every scene box).
export interface FlowNode {
  id: string;
  marker: Marker;
  kind: string;
  scene: string | null;
  title: string;
  lines: string[];
  notes: string[];
}

export interface FlowEdge {
  from: string;
  to: string;
  label: string;
  dashed: boolean;
}

// A flow subgraph paired with its `### Scene <key>` prose from the written plan.
export interface Scene {
  id: string;
  key: string;
  title: string;
  md: string;
}

export interface Section {
  title: string;
  md: string;
}

export interface PartyMember {
  name: string;
  player: string;
  raceClass: string;
  level: string;
  status: string;
  path: string;
}

export interface EntityRef {
  name: string;
  type: string;
  subtype: string;
  description: string;
  campaign: string;
  aliases: string[];
  path: string;
}

export interface SessionMeta {
  name: string;
  number: number | null;
  date: string;
  description: string;
  openingScene: string;
  closingHook: string;
  preamble: string;
  folder: string;
  campaign: string;
  root: string;
  looseThreads: string[];
}

// A played session from historian/sessions/, for the "Previously on…" card.
export interface PreviousSession {
  name: string;
  number: number;
  date: string;
  campaign: string;
  description: string;
  recap: string;
  cliffhanger: string;
  path: string;
}

export interface SessionData {
  session: SessionMeta;
  nodes: FlowNode[];
  edges: FlowEdge[];
  scenes: Scene[];
  sections: Section[];
  quickRefs: Record<string, string>;
  roster: string[];
  party: PartyMember[];
  entities: EntityRef[];
  previously: PreviousSession[];
}
