// Pure: the sky slide's plate, an inline SVG in the manner of an old printed ring diagram.
// Rings ink themselves in, then each body sweeps from where it stood last session (sky.css).

import {
  ASTRA, C, R, astraEllipse, astraPoint, dialAngle, fidaAngle, forward, phasePath, polar, redAngle, ringPath,
  sunAngle, wanderers,
} from './sky-geometry.js';
import { roman } from './sky-words.js';
import type { Sky, SkyMoment } from './types.js';

const absDay = (m: SkyMoment) => m.year * 360 + m.dayOfYear - 1 + m.hour / 24;

// Ring labels, set along the top of each ring like the woodcut's: [radius, start offset %, text].
const LABELS: [number, number, string][] = [
  [R.slices, 22, 'I · The Slices'],
  [R.fida, 19, 'II · Fida, the broken moon'],
  [R.suns, 21, 'III · The two suns, gold and red'],
  [R.shards, 23, 'IV · The shard band, whence the glass falls'],
  [R.wanderers, 25, 'V · Nine wanderers'],
  [R.blanket, 27, 'VII · The Blanket, fixed and unmoving'],
];

// A body sweeping round the centre from `from` to `to` degrees; `glyph` is drawn at the top.
const orbit = (cls: string, from: number, to: number, glyph: string, delay = 0) =>
  `<g class="sk-orbit ${cls}" style="--from:${from}deg;--to:${forward(from, to)}deg;--d:${delay}s">${glyph}</g>`;

function sun(r: number, size: number, cls: string, rays: boolean): string {
  const y = C - r;
  const at = (deg: number, k: number) => ({ x: (C + Math.sin((deg * Math.PI) / 180) * k).toFixed(1), y: (y - Math.cos((deg * Math.PI) / 180) * k).toFixed(1) });
  const ray = rays
    ? Array.from({ length: 12 }, (_, i) => {
      const a = at(i * 30, size + 4);
      const b = at(i * 30, size + (i % 2 ? 9 : 13));
      return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
    }).join('')
    : '';
  return `<g class="sk-sun ${cls}">${ray}<circle cx="${C}" cy="${y}" r="${size}"/><circle class="sk-dot" cx="${C}" cy="${y}" r="2.2"/></g>`;
}

function fida(s: Sky, sunNow: number, fidaNow: number): string {
  const turn = sunNow - fidaNow - 90; // lit side toward the gold sun
  const lit = phasePath(17, s.fida.lit);
  const shards = [[22, -9], [29, 4], [36, -2]].map(([dx, dy], i) =>
    `<path class="sk-shard" d="M ${dx},${dy} l 4,-3 l 1,5 z" style="--k:${i}"/>`).join('');
  return `<g transform="translate(${C},${C - R.fida})"><g class="sk-fida" transform="rotate(${turn.toFixed(1)})">
    <circle class="sk-fida-dark" r="17"/>${lit ? `<path class="sk-fida-lit" d="${lit}"/>` : ''}
    <path class="sk-crack" d="M -9,-14 L -3,-5 L -7,2 L 1,9 L -2,16"/><circle class="sk-rim" r="17"/>${shards}</g></g>`;
}

export function plateSvg(s: Sky): string {
  const p = s.prev ?? s;
  const sunNow = sunAngle(s.hour);
  const fidaNow = fidaAngle(sunNow, s.fida.age);
  const el = astraEllipse();
  const astra = astraPoint(s.astra.trueAnomaly);
  const wNow = wanderers(absDay(s));
  const wPrev = wanderers(absDay(p));
  const rings = [R.slices, R.fida, R.suns, R.wanderers, R.blanket, R.dial, R.dial + 34]
    .map((r, i) => `<circle class="sk-line" pathLength="1" style="--i:${i}" cx="${C}" cy="${C}" r="${r}"/>`).join('');
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const a = polar(R.dial, i * 10);
    const b = polar(R.dial + (i % 3 ? 9 : 34), i * 10);
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  }).join('');
  const numerals = Array.from({ length: 12 }, (_, i) => {
    const q = polar(R.dial + 21, i * 30 + 15);
    return `<text x="${q.x}" y="${q.y}" transform="rotate(${i * 30 + 15} ${q.x} ${q.y})">${roman(i + 1)}</text>`;
  }).join('');
  const slices = [12, 83, 151, 222, 290].map((a, i) =>
    `<path transform="rotate(${a} ${C} ${C})" d="M ${C - 6},${C - R.slices - 3} l 7,-4 l 6,5 l -4,6 l -8,0 z" style="--k:${i}"/>`).join('');
  const planets = wNow.map((a, i) => orbit('sk-wanderer', wPrev[i], a,
    `<circle cx="${C}" cy="${C - R.wanderers}" r="${i % 3 ? 4 : 5.5}"/>`, 0.05 * i)).join('');
  const labelPaths = LABELS.map(([r], i) => `<path id="sk-l${i}" d="${ringPath(r + 7)}"/>`).join('');
  const labels = LABELS.map(([, o, t], i) =>
    `<text><textPath href="#sk-l${i}" startOffset="${o}%">${t}</textPath></text>`).join('');
  const day = polar(R.dial - 17, dialAngle(s.dayOfYear));
  const astraLabel = polar(Math.hypot(astra.x - C, astra.y - C) + 26, ASTRA.tilt + 180 + s.astra.trueAnomaly);
  return `<svg class="sk-plate" viewBox="0 0 1000 1000" role="img" aria-label="Aethryn's sky on ${s.date}">
  <defs>
    <filter id="sk-paper"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="7"/>
      <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.4  0 0 0 0 0.2  0 0 0 -1.4 0.9"/></filter>
    <filter id="sk-ink"><feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="2.4"/></filter>
    <pattern id="sk-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="9"/></pattern>
    <radialGradient id="sk-vig"><stop offset="0.6" stop-opacity="0"/><stop offset="1" stop-opacity="0.45"/></radialGradient>
    ${labelPaths}
  </defs>
  <rect class="sk-paper" width="1000" height="1000"/><rect width="1000" height="1000" filter="url(#sk-paper)" opacity="0.5"/>
  <rect class="sk-vig" width="1000" height="1000" fill="url(#sk-vig)"/>
  <path class="sk-below" d="M ${C - R.suns},${C} A ${R.suns} ${R.suns} 0 0 0 ${C + R.suns},${C} Z" fill="url(#sk-hatch)"/>
  <g class="sk-ink" filter="url(#sk-ink)">
    ${rings}<circle class="sk-band" cx="${C}" cy="${C}" r="${R.shards}"/>
    <ellipse class="sk-line sk-astra-path" pathLength="1" style="--i:7" cx="${el.cx}" cy="${el.cy}" rx="${el.rx}" ry="${el.ry}" transform="rotate(${el.rot} ${el.cx} ${el.cy})"/>
    <line class="sk-horizon" x1="${C - R.suns - 26}" y1="${C}" x2="${C + R.suns + 26}" y2="${C}"/>
    <g class="sk-ticks">${ticks}</g><g class="sk-slices">${slices}</g>
  </g>
  <g class="sk-numerals">${numerals}</g>
  <g class="sk-labels">${labels}
    <text class="sk-side" x="${C - R.suns - 30}" y="${C + 5}" text-anchor="end">sunrise</text>
    <text class="sk-side" x="${C + R.suns + 30}" y="${C + 5}">sunset</text>
    <text class="sk-astra-label" x="${astraLabel.x}" y="${astraLabel.y}" text-anchor="middle">VI · Astra</text>
  </g>
  <circle class="sk-world" cx="${C}" cy="${C}" r="24"/><path class="sk-caldera" d="M ${C - 9},${C - 21} a 10 7 0 0 0 18,0"/>
  <text class="sk-world-label" x="${C}" y="${C + 44}" text-anchor="middle">Aethryn</text>
  ${planets}
  ${orbit('sk-red', redAngle(p.hour, p.sun.offset), redAngle(s.hour, s.sun.offset), sun(R.suns, 10, 'is-red', false), 0.2)}
  ${orbit('sk-gold', sunAngle(p.hour), sunNow, sun(R.suns, 16, 'is-gold', true))}
  ${orbit('sk-moon', fidaAngle(sunAngle(p.hour), p.fida.age), fidaNow, fida(s, sunNow, fidaNow), 0.1)}
  <path class="sk-astra" transform="translate(${astra.x} ${astra.y})" d="M 0,-11 L 2.5,-2.5 L 11,0 L 2.5,2.5 L 0,11 L -2.5,2.5 L -11,0 L -2.5,-2.5 Z"/>
  <path class="sk-pointer" transform="rotate(${dialAngle(s.dayOfYear)} ${C} ${C})" d="M ${C},${C - R.dial - 36} l -8,-16 l 16,0 z"/>
  <text class="sk-day" x="${day.x}" y="${day.y}" text-anchor="middle" dy="5">${s.dayOfYear}</text>
</svg>`;
}
