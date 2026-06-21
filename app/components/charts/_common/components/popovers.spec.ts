// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { joinPopoverGroup } from './popovers.js';

// A minimal member: tracks open state, closes when the group tells it to.
function fakeMember() {
  let open = false;
  const member = joinPopoverGroup(() => {
    open = false;
  });
  return {
    get open() {
      return open;
    },
    openIt() {
      member.announceOpen();
      open = true;
    },
  };
}

describe('joinPopoverGroup', () => {
  it('opening one member closes every other member', () => {
    const a = fakeMember();
    const b = fakeMember();
    a.openIt();
    expect(a.open).toBe(true);
    b.openIt();
    expect(b.open).toBe(true);
    expect(a.open).toBe(false); // a was closed when b announced
  });

  it('the opening member stays open (does not close itself)', () => {
    const a = fakeMember();
    a.openIt();
    expect(a.open).toBe(true);
  });

  it('an outside (document) click closes all members', () => {
    const a = fakeMember();
    const b = fakeMember();
    a.openIt();
    b.openIt();
    document.body.click();
    expect(a.open).toBe(false);
    expect(b.open).toBe(false);
  });

  it('Escape closes all members', () => {
    const a = fakeMember();
    a.openIt();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(a.open).toBe(false);
  });
});
