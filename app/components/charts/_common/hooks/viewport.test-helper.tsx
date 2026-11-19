// Test stand-in for a chart: one viewport div wired to the hooks under test.
// Shared by the hook specs; not a spec itself.

import { useRef, type ReactNode, type RefObject } from 'react';

export function Viewport({ wire, children }: { wire(ref: RefObject<HTMLDivElement | null>): void; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  wire(ref);
  return (
    <div ref={ref} className="viewport">
      {children}
    </div>
  );
}
