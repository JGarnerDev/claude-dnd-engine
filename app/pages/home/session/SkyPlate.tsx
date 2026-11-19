// The sky slide's plate, an inline SVG in the manner of an old printed ring diagram.
// Rings ink themselves in, then each body sweeps from where it stood last session (sky.css).

import type { CSSProperties, ReactNode } from 'react';
import {
  ASTRA, C, R, astraEllipse, astraPoint, dialAngle, fidaAngle, forward, phasePath, polar, redAngle, ringPath,
  sunAngle, wanderers,
} from './sky-geometry.js';
import { roman } from './sky-words.js';
import type { Sky, SkyMoment } from './types.js';

const absDay = (m: SkyMoment) => m.year * 360 + m.dayOfYear - 1 + m.hour / 24;

// CSS custom properties (sky.css reads them for the ink-in and sweep animations).
const vars = (v: Record<string, string | number>) => v as CSSProperties;

// Ring labels, set along the top of each ring like the woodcut's: [radius, start offset %, text].
const LABELS: [number, number, string][] = [
  [R.slices, 22, 'I · The Slices'],
  [R.fida, 19, 'II · Fida, the broken moon'],
  [R.suns, 21, 'III · The two suns, gold and red'],
  [R.shards, 23, 'IV · The shard band, whence the glass falls'],
  [R.wanderers, 25, 'V · Nine wanderers'],
  [R.blanket, 27, 'VII · The Blanket, fixed and unmoving'],
];

// A body sweeping round the centre from `from` to `to` degrees; `children` is drawn at the top.
function Orbit({ cls, from, to, delay = 0, children }: { cls: string; from: number; to: number; delay?: number; children: ReactNode }) {
  return <g className={`sk-orbit ${cls}`} style={vars({ '--from': `${from}deg`, '--to': `${forward(from, to)}deg`, '--d': `${delay}s` })}>{children}</g>;
}

function Sun({ r, size, cls, rays }: { r: number; size: number; cls: string; rays: boolean }) {
  const y = C - r;
  const at = (deg: number, k: number) => ({ x: (C + Math.sin((deg * Math.PI) / 180) * k).toFixed(1), y: (y - Math.cos((deg * Math.PI) / 180) * k).toFixed(1) });
  return (
    <g className={`sk-sun ${cls}`}>
      {rays && Array.from({ length: 12 }, (_, i) => {
        const a = at(i * 30, size + 4);
        const b = at(i * 30, size + (i % 2 ? 9 : 13));
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
      })}
      <circle cx={C} cy={y} r={size} />
      <circle className="sk-dot" cx={C} cy={y} r="2.2" />
    </g>
  );
}

function Fida({ s, sunNow, fidaNow }: { s: Sky; sunNow: number; fidaNow: number }) {
  const turn = sunNow - fidaNow - 90; // lit side toward the gold sun
  const lit = phasePath(17, s.fida.lit);
  return (
    <g transform={`translate(${C},${C - R.fida})`}>
      <g className="sk-fida" transform={`rotate(${turn.toFixed(1)})`}>
        <circle className="sk-fida-dark" r="17" />
        {lit && <path className="sk-fida-lit" d={lit} />}
        <path className="sk-crack" d="M -9,-14 L -3,-5 L -7,2 L 1,9 L -2,16" />
        <circle className="sk-rim" r="17" />
        {[[22, -9], [29, 4], [36, -2]].map(([dx, dy], i) =>
          <path key={i} className="sk-shard" d={`M ${dx},${dy} l 4,-3 l 1,5 z`} style={vars({ '--k': i })} />)}
      </g>
    </g>
  );
}

export function SkyPlate({ s }: { s: Sky }) {
  const p = s.prev ?? s;
  const sunNow = sunAngle(s.hour);
  const fidaNow = fidaAngle(sunNow, s.fida.age);
  const el = astraEllipse();
  const astra = astraPoint(s.astra.trueAnomaly);
  const wNow = wanderers(absDay(s));
  const wPrev = wanderers(absDay(p));
  const day = polar(R.dial - 17, dialAngle(s.dayOfYear));
  const astraLabel = polar(Math.hypot(astra.x - C, astra.y - C) + 26, ASTRA.tilt + 180 + s.astra.trueAnomaly);
  return (
    <svg className="sk-plate" viewBox="0 0 1000 1000" role="img" aria-label={`Aethryn's sky on ${s.date}`}>
      <defs>
        <filter id="sk-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={4} seed={7} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.4  0 0 0 0 0.2  0 0 0 -1.4 0.9" />
        </filter>
        <filter id="sk-ink">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves={2} seed={3} />
          <feDisplacementMap in="SourceGraphic" scale={2.4} />
        </filter>
        <pattern id="sk-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="9" />
        </pattern>
        <radialGradient id="sk-vig"><stop offset="0.6" stopOpacity="0" /><stop offset="1" stopOpacity="0.45" /></radialGradient>
        {LABELS.map(([r], i) => <path key={i} id={`sk-l${i}`} d={ringPath(r + 7)} />)}
      </defs>
      <rect className="sk-paper" width="1000" height="1000" /><rect width="1000" height="1000" filter="url(#sk-paper)" opacity="0.5" />
      <rect className="sk-vig" width="1000" height="1000" fill="url(#sk-vig)" />
      <path className="sk-below" d={`M ${C - R.suns},${C} A ${R.suns} ${R.suns} 0 0 0 ${C + R.suns},${C} Z`} fill="url(#sk-hatch)" />
      <g className="sk-ink" filter="url(#sk-ink)">
        {[R.slices, R.fida, R.suns, R.wanderers, R.blanket, R.dial, R.dial + 34].map((r, i) =>
          <circle key={i} className="sk-line" pathLength={1} style={vars({ '--i': i })} cx={C} cy={C} r={r} />)}
        <circle className="sk-band" cx={C} cy={C} r={R.shards} />
        <ellipse className="sk-line sk-astra-path" pathLength={1} style={vars({ '--i': 7 })} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} transform={`rotate(${el.rot} ${el.cx} ${el.cy})`} />
        <line className="sk-horizon" x1={C - R.suns - 26} y1={C} x2={C + R.suns + 26} y2={C} />
        <g className="sk-ticks">
          {Array.from({ length: 36 }, (_, i) => {
            const a = polar(R.dial, i * 10);
            const b = polar(R.dial + (i % 3 ? 9 : 34), i * 10);
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
          })}
        </g>
        <g className="sk-slices">
          {[12, 83, 151, 222, 290].map((a, i) =>
            <path key={i} transform={`rotate(${a} ${C} ${C})`} d={`M ${C - 6},${C - R.slices - 3} l 7,-4 l 6,5 l -4,6 l -8,0 z`} style={vars({ '--k': i })} />)}
        </g>
      </g>
      <g className="sk-numerals">
        {Array.from({ length: 12 }, (_, i) => {
          const q = polar(R.dial + 21, i * 30 + 15);
          return <text key={i} x={q.x} y={q.y} transform={`rotate(${i * 30 + 15} ${q.x} ${q.y})`}>{roman(i + 1)}</text>;
        })}
      </g>
      <g className="sk-labels">
        {LABELS.map(([, o, t], i) => <text key={i}><textPath href={`#sk-l${i}`} startOffset={`${o}%`}>{t}</textPath></text>)}
        <text className="sk-side" x={C - R.suns - 30} y={C + 5} textAnchor="end">sunrise</text>
        <text className="sk-side" x={C + R.suns + 30} y={C + 5}>sunset</text>
        <text className="sk-astra-label" x={astraLabel.x} y={astraLabel.y} textAnchor="middle">VI · Astra</text>
      </g>
      <circle className="sk-world" cx={C} cy={C} r="24" /><path className="sk-caldera" d={`M ${C - 9},${C - 21} a 10 7 0 0 0 18,0`} />
      <text className="sk-world-label" x={C} y={C + 44} textAnchor="middle">Aethryn</text>
      {wNow.map((a, i) => (
        <Orbit key={i} cls="sk-wanderer" from={wPrev[i]} to={a} delay={0.05 * i}>
          <circle cx={C} cy={C - R.wanderers} r={i % 3 ? 4 : 5.5} />
        </Orbit>
      ))}
      <Orbit cls="sk-red" from={redAngle(p.hour, p.sun.offset)} to={redAngle(s.hour, s.sun.offset)} delay={0.2}><Sun r={R.suns} size={10} cls="is-red" rays={false} /></Orbit>
      <Orbit cls="sk-gold" from={sunAngle(p.hour)} to={sunNow}><Sun r={R.suns} size={16} cls="is-gold" rays /></Orbit>
      <Orbit cls="sk-moon" from={fidaAngle(sunAngle(p.hour), p.fida.age)} to={fidaNow} delay={0.1}><Fida s={s} sunNow={sunNow} fidaNow={fidaNow} /></Orbit>
      <path className="sk-astra" transform={`translate(${astra.x} ${astra.y})`} d="M 0,-11 L 2.5,-2.5 L 11,0 L 2.5,2.5 L 0,11 L -2.5,2.5 L -11,0 L -2.5,-2.5 Z" />
      <path className="sk-pointer" transform={`rotate(${dialAngle(s.dayOfYear)} ${C} ${C})`} d={`M ${C},${C - R.dial - 36} l -8,-16 l 16,0 z`} />
      <text className="sk-day" x={day.x} y={day.y} textAnchor="middle" dy="5">{s.dayOfYear}</text>
    </svg>
  );
}
