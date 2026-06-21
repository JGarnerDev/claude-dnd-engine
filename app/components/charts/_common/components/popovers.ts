// Shared open/close coordination for the header's popover buttons (Save, Load,
// settings gear). Only one may be open at a time: opening any one closes the
// rest, and an outside (document) click or Escape closes all. The savedviews and
// settingspanel widgets are separate modules and each stops propagation on its
// own clicks, so neither could close the other on its own — they coordinate
// through a document event bus here instead of knowing about each other.

const OPEN_EVENT = 'chart-popover-open';
let nextId = 0;

export interface PopoverMember {
  // Call right before this popover opens — closes every other group member.
  announceOpen(): void;
}

// Join the popover group. `close` is invoked whenever another member opens, or on
// an outside click / Escape. The member's own button/popover must stopPropagation
// so its clicks don't reach the document-level outside-close listeners here.
export function joinPopoverGroup(close: () => void): PopoverMember {
  const id = ++nextId;
  document.addEventListener(OPEN_EVENT, (e) => {
    if ((e as CustomEvent<number>).detail !== id) close();
  });
  document.addEventListener('click', () => close());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  return {
    announceOpen(): void {
      document.dispatchEvent(new CustomEvent<number>(OPEN_EVENT, { detail: id }));
    },
  };
}
