// How both charts' markers talk to jeff-ui's useMarkerInteraction: which nodes
// get a tooltip, the meta line, and the file a click opens.

import type { MarkerOptions } from 'jeff-ui/charts';

export const MARKER_OPTIONS: MarkerOptions = {
  selector: '.chart-marker, .chart-band, .chart-swim-sband',
  // A dot reads "date · track · click to open", a band just "click to open".
  meta: (d) => [d.date, d.track, d.source && 'click to open'].filter(Boolean).join(' · '),
  href: (d) => d.source,
};
