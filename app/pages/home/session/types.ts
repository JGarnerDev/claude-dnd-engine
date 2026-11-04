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
  slides: Slide[]; // party-facing deck from the folder's _slides.md; [] when none
  stats?: Stats | null; // scripts/lib/stats.py standings (meta/stats.md); null when unledgered
  achievements?: PcAchievements[] | null; // scripts/lib/achievements.py (meta/achievements.md); null when unledgered
  reputation?: Reputation | null; // scripts/lib/reputation.py (meta/reputation.md); null when Strahd or no deeds yet
}

// One slide of a deck (meta/recap-slides.md): a `##` headline and its body.
// `html` is set only on generated slides (stats, achievements, reputation) and replaces the markdown body.
export interface Slide {
  title: string;
  md: string;
  html?: string;
}

// A stats category from the meta/stats.md catalog.
export interface StatCategory {
  id: string;
  award: string;
  label: string;
  icon: string;
  family: string;
  kind: 'count' | 'sum' | string;
}

// One PC's value; `rough` marks a transcript-mined sum not yet corrected (~).
export interface StatRow {
  pc: string;
  value: number;
  rough: boolean;
}

export interface StatLeader extends StatCategory {
  pcs: string[]; // ties share
  value: number;
  rough: boolean;
}

export interface StatAward extends StatLeader {
  best: string[]; // PCs for whom this is a new personal best
}

export interface StatBoard extends StatCategory {
  rows: StatRow[]; // top three
}

export interface Stats {
  session: number;
  campaign: string;
  season: { first: number; last: number };
  awards: StatAward[];
  leaderboards: StatBoard[];
  lifetime: StatLeader[];
  previousSeason: { campaign: string; first: number; last: number; leaderboards: StatBoard[] } | null;
  warnings: string[];
}

// One achievement (meta/achievements.md). `times` counts how often this PC has now
// earned the same title, this session included; above 1 it is a repeat.
export interface Achievement {
  title: string;
  text: string;
  times: number;
}

export interface PcAchievements {
  pc: string;
  items: Achievement[];
}

// Reputation (meta/reputation.md): one track's world score for one PC, up to this session.
export interface RepTrack {
  score: number;
  gain: number; // added this session
  tier: string;
  rank: number;
  up: boolean; // crossed into a higher tier this session
}

export interface RepDeed {
  track: 'fame' | 'infamy' | string;
  scope: string;
  points: number;
  text: string;
}

export interface RepLocal {
  place: string;
  fame: { score: number; tier: string; rank: number };
  infamy: { score: number; tier: string; rank: number };
}

export interface PcReputation {
  pc: string;
  fame: RepTrack;
  infamy: RepTrack;
  local: RepLocal[]; // DM-side; the slide does not show it
  deeds: RepDeed[]; // this session's top three
}

export interface Reputation {
  session: number;
  campaign: string;
  partyFame: number;
  partyTier: string;
  pcs: PcReputation[];
  crossings: { pc: string; track: string; scope: string; tier: string; rank: number }[];
  warnings: string[];
}

export interface SessionData {
  session: SessionMeta;
  nodes: FlowNode[];
  edges: FlowEdge[];
  scenes: Scene[];
  sections: Section[];
  // Town / region / world facts from the folder's optional _established.md.
  established?: Section[];
  quickRefs: Record<string, string>;
  roster: string[];
  party: PartyMember[];
  entities: EntityRef[];
  previously: PreviousSession[];
}
