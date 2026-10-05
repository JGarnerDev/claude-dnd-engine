import { describe, expect, it } from 'vitest';
import { splitEntity } from './frontmatter.js';

describe('splitEntity', () => {
  it('splits shown fields from the body, hiding bookkeeping keys and comments', () => {
    const text = '---\nname: "Mara"\n# a comment\nstate: active\nrelates_to:\n  - "[[Ashford]] (home)"\nempty:\ntags:\n  - x\n---\nBody here.';
    const { fields, body } = splitEntity(text);
    expect(fields).toEqual([['state', 'active'], ['relates_to', ['[[Ashford]] (home)']]]);
    expect(body).toBe('Body here.');
  });

  it('returns the whole text as body when there is no frontmatter', () => {
    expect(splitEntity('just text')).toEqual({ fields: [], body: 'just text' });
  });
});
