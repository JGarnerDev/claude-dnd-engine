// Reputation slide for the recap deck (meta/reputation.md): party fame up top, then each PC's
// fame and infamy with tier names, the gain last session, what the PC is known for, its top
// deeds, and a banner on a tier-up. Only PCs who gained; nobody gained, no slide. Never the rewards.

import './reputation.css';
import { beforeLast, unlink, type DeckSlide } from './deck.js';
import { InlineMd } from './MarkdownView.js';
import type { PcReputation, RepTrack, Reputation } from './types.js';

const num = (n: number) => n.toLocaleString('en-US');

// One track: the score row, with the known-for line under it.
function Track({ kind, t, known = '' }: { kind: 'fame' | 'infamy'; t: RepTrack; known?: string }) {
  if (!t.score) return null;
  return (
    <div className={`rp-track is-${kind}${t.up ? ' is-up' : ''}`}>
      <div className="rp-line">
        <span className="rp-label">{kind === 'fame' ? 'Fame' : 'Infamy'}</span>
        <span className="rp-score">{num(t.score)}</span>
        <span className="rp-tier">{t.tier}</span>
        {t.gain ? <span className="rp-gain">+{num(t.gain)}</span> : null}
      </div>
      {known && <div className="rp-known"><InlineMd md={unlink(known)} /></div>}
    </div>
  );
}

function Pc({ p }: { p: PcReputation }) {
  const ups = (['fame', 'infamy'] as const).filter((k) => p[k].up);
  // Name in the left column; tracks, then deeds, stacked on the right.
  return (
    <div className="rp-pc">
      {ups.length > 0 && (
        <div className="rp-banners">
          {ups.map((k) => <div key={k} className={`rp-banner is-${k}`}>{p.pc} is now <b>{p[k].tier}</b></div>)}
        </div>
      )}
      <span className="rp-name">{p.pc}</span>
      <div className="rp-body">
        <Track kind="fame" t={p.fame} known={p.known?.fame} />
        <Track kind="infamy" t={p.infamy} known={p.known?.infamy} />
        {p.deeds.length > 0 && (
          <ul className="rp-deeds">
            {p.deeds.map((d, i) => (
              <li key={i} className={`rp-deed is-${d.track === 'infamy' ? 'infamy' : 'fame'}`}>
                <span className="rp-pts">+{num(d.points)}</span>
                <span className="rp-text"><InlineMd md={unlink(d.text)} /></span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const moved = (t: RepTrack) => t.gain > 0 || t.up;

// The reputation slide, or none when nobody gained (meta/recap-slides.md → Deck weight:
// changed slides only). PCs who gained nothing on either track are left out.
export function reputationSlides(r: Reputation | null | undefined): DeckSlide[] {
  const pcs = (r?.pcs ?? []).filter((p) => moved(p.fame) || moved(p.infamy));
  if (!r || !pcs.length) return [];
  return [{
    title: 'Reputation',
    md: '',
    body: (
      <div className="rp-wrap">
        <div className="rp-party">Party fame <b>{num(r.partyFame)}</b>{r.partyTier && <> <span>{r.partyTier}</span></>}</div>
        <div className="rp-grid">{pcs.map((p, i) => <Pc key={i} p={p} />)}</div>
      </div>
    ),
  }];
}

// The deck with the reputation slide slotted in before its last slide ("Next time…").
// Run after withAchievements and before withStats, so it lands between them.
export const withReputation = (deck: DeckSlide[], r: Reputation | null | undefined): DeckSlide[] =>
  beforeLast(deck, reputationSlides(r));
