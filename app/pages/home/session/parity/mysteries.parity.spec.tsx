// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, jsx } from './canon.js';
import * as N from '../Mysteries.js';
import { withMysteries } from '../legacy/mysteries.js';
import type { Slide } from '../types.js';

const md = '- Who is *Harrow Bane*?\n- Who pressed the charm into the hearth, and why smother\n  the fire?\n- Who sent [[Nella|the archer]]?';
const deck: Slide[] = [{ title: 'Title', md: '' }, { title: 'Mysteries', md }, { title: 'Next', md: 'Down the hill.' }];

describe('mysteries parity', () => {
  it('withMysteries(deck)', () => {
    const a = withMysteries(deck); const b = N.withMysteries(deck);
    expect(b.length).toBe(a.length);
    a.forEach((s, i) => {
      expect(b[i].title).toBe(s.title);
      expect(!!b[i].bare).toBe(!!s.bare);
      if (s.html) expect(jsx(b[i].body)).toBe(html(s.html));
      else expect(b[i].body).toBeUndefined();
    });
  });
});
