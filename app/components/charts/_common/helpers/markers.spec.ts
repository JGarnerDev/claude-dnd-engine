import { describe, it, expect } from 'vitest';
import { MARKER_OPTIONS } from './markers.js';

describe('MARKER_OPTIONS', () => {
  const { meta, href } = MARKER_OPTIONS;

  it('reads a dot as date · track · click to open', () => {
    expect(meta!({ date: '1342-08-01', track: 'world', source: 'a.md' })).toBe('1342-08-01 · world · click to open');
  });

  it('reads a band with only a source as click to open', () => {
    expect(meta!({ source: 'a.md' })).toBe('click to open');
  });

  it('drops the click hint when there is no source', () => {
    expect(meta!({ date: '1342-08-01', track: 'world' })).toBe('1342-08-01 · world');
  });

  it('opens the source file', () => {
    expect(href!({ source: 'historian/events/redfen.md' })).toBe('historian/events/redfen.md');
    expect(href!({})).toBeUndefined();
  });
});
