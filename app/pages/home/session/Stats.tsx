// Stats slides for the recap deck (meta/stats.md): award cards for the session,
// then the season standings with a hall-of-fame strip, plus a one-time
// previous-season slide when this session opened a new season. Off a heavy deck, one
// compact "Worth noting" slide instead, or none (meta/recap-slides.md → Deck weight).

import type { ReactNode } from 'react';
import { Badge, Card, ProgressBar } from 'jeff-ui';
import './stats.css';
import { beforeLast, type DeckSlide } from './deck.js';
import type { DeckWeight, StatBoard, StatRow, Stats } from './types.js';

const num = (x: { value: number; rough: boolean }) => `${x.rough ? '~' : ''}${x.value}`;
const names = (pcs: string[]) => pcs.join(' & ');
// "Killing blows" -> "killing blows", but "HP healed" keeps its acronym.
const lower = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

function Awards({ s }: { s: Stats }) {
  return (
    <div className="st-cards">
      {s.awards.map((a, i) => (
        <Card key={i} className={`st-card${a.best.length ? ' is-best' : ''}`}>
          <div className="st-icon">{a.icon}</div>
          <div className="st-card-text">
            <div className="st-award">{a.award}</div>
            <div className="st-pc">{names(a.pcs)}</div>
            <div className="st-value">{num(a)} <span>{lower(a.label)}</span></div>
            {a.best.length > 0 && <div className="st-best">⭐ Personal best{a.pcs.length > 1 ? `: ${names(a.best)}` : ''}</div>}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Row({ r, top }: { r: StatRow; top: number }) {
  const w = top ? Math.max(0.04, r.value / top) : 0;
  return (
    <div className={`st-row${r.value === top ? ' is-top' : ''}`}>
      <span className="st-row-pc">{r.pc}</span>
      <ProgressBar className="st-bar" value={w} />
      <span className="st-row-v">{num(r)}</span>
    </div>
  );
}

function Boards({ boards }: { boards: StatBoard[] }) {
  return (
    <div className="st-boards">
      {boards.map((b, i) => (
        <Card key={i} className="st-board" title={`${b.icon} ${b.label}`}>
          {b.rows.map((r, j) => <Row key={j} r={r} top={b.rows[0].value} />)}
        </Card>
      ))}
    </div>
  );
}

function Fame({ s }: { s: Stats }) {
  if (!s.lifetime.length) return null;
  return (
    <div className="st-fame">
      <span className="st-fame-h">Hall of fame</span>
      {s.lifetime.map((h, i) => <Badge key={i} className="st-chip" title={h.label}>{h.icon} {names(h.pcs)} <b>{num(h)}</b></Badge>)}
    </div>
  );
}

const Notable = ({ s }: { s: Stats }) => (
  <ul className="st-notable">
    {(s.notable ?? []).map((n, i) => <li key={i}><span className="st-icon">{n.icon}</span>{n.text}</li>)}
  </ul>
);

const wrap = (title: string, body: ReactNode): DeckSlide => ({ title, md: '', body: <div className="st-wrap">{body}</div> });

// The stats slides for one session, in deck order. Gated by deck weight
// (meta/recap-slides.md → Deck weight): the full honors + standings on a heavy deck or a
// season's first session; otherwise one compact "Worth noting" slide when something is
// notable, else nothing. A missing weight is heavy, so older decks keep the full set.
export function statsSlides(s: Stats | null | undefined, weight: DeckWeight = 'heavy'): DeckSlide[] {
  if (!s) return [];
  const out: DeckSlide[] = [];
  const prev = s.previousSeason;
  if (prev?.leaderboards.length) {
    out.push(wrap(prev.campaign === 'strahd' ? 'While you were in Barovia…' : 'Last season’s standings', <Boards boards={prev.leaderboards} />));
  }
  if (weight !== 'heavy' && !s.firstOfSeason) {
    if (s.notable?.length) out.push(wrap('Worth noting', <Notable s={s} />));
    return out;
  }
  if (s.awards.length) out.push(wrap('Last session’s honors', <Awards s={s} />));
  if (s.leaderboards.length || s.lifetime.length) out.push(wrap('The standings', <><Boards boards={s.leaderboards} /><Fame s={s} /></>));
  return out;
}

export const withStats = (deck: DeckSlide[], s: Stats | null | undefined, weight?: DeckWeight): DeckSlide[] =>
  beforeLast(deck, statsSlides(s, weight));
