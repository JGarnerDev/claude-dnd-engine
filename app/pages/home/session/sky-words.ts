// Pure: the sky slide's words (sky.ts). Player-facing, so plain and in-world; never the DM's
// next-Kerning roll. Terms from data/lore/calendar.md.

const NUM = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
  'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth'];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const suffix = (n: number) => (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
export const ordinal = (n: number) => ORD[n] ?? `${n}${suffix(n)}`;
export const roman = (n: number) => ROMAN[n] ?? String(n);

// "About ten in the morning". Rounded to the nearest hour.
export function hourWords(hour: number): string {
  const h = Math.round(hour) % 24;
  if (h === 0) return 'Around midnight';
  if (h === 12) return 'Around noon';
  const n = NUM[h % 12 || 12];
  if (h < 5) return `About ${n} in the small hours`;
  if (h < 12) return `About ${n} in the morning`;
  if (h < 18) return `About ${n} in the afternoon`;
  if (h < 22) return `About ${n} in the evening`;
  return `About ${n} at night`;
}

// Tonight's true dark: the two suns' 18-day swing.
export function darkWords(hours: number): string {
  if (hours < 0.5) return 'No true dark tonight. The red sun holds the sky.';
  if (hours < 1.5) return 'Barely an hour of true dark tonight';
  if (hours > 11.5) return 'A full twelve hours of dark tonight';
  return `About ${NUM[Math.round(hours)]} hours of true dark tonight`;
}

// Fida's phase in Earth moon terms. age 0..1 through the cycle: 0 = full, 0.5 = new.
const PHASES: [number, string][] = [[0.03, 'full'], [0.22, 'waning gibbous'], [0.28, 'last quarter'],
  [0.47, 'waning crescent'], [0.53, 'new'], [0.72, 'waxing crescent'], [0.78, 'first quarter'],
  [0.97, 'waxing gibbous'], [1.01, 'full']];
export function fidaWords(age: number): string {
  const phase = PHASES.find(([edge]) => age < edge)?.[1] ?? 'full';
  return `Fida, the moon: ${phase}`;
}

export function crawlWords(crawl: number | null, day: number | null): string {
  if (!crawl) return '';
  return `The ${ordinal(crawl)} Crawl${day ? `, day ${day}` : ''}`;
}

// The age the year sits in: years since the last Glistening ("743 years since the Sixth Glistening").
export function eraWords(era: number, years: number): string {
  if (era < 1) return `${years.toLocaleString('en-US')} years since the Impact, before any Glistening`;
  if (years === 0) return `The year of the ${cap(ordinal(era))} Glistening`;
  return `${years.toLocaleString('en-US')} year${years === 1 ? '' : 's'} since the ${cap(ordinal(era))} Glistening`;
}

export function glisteningWords(next: number, years: number): string {
  return `Astra swings back like a comet in ${years.toLocaleString('en-US')} years: the ${cap(ordinal(next))} Glistening`;
}
