// The runner's keyboard, on the document:
//
// → / Enter / Space take the first branch · 1–9 pick a branch or aside ·
// ← / Backspace step back · / focuses search · \ docks or hides the panel ·
// Esc clears search, closes the slide-over, then closes what's open.
//
// Typing in a box, or a key with Ctrl / Cmd / Alt, is left alone; Enter or Space
// on a focused button or summary presses that instead. The recap slides catch keys
// first (Slides.tsx), so none reach here while the deck is open.

import { useEffect, useRef } from "react";
import type { NextOption } from "./flow.js";

export interface KeyActions {
  options: NextOption[];
  go: (id: string) => void;
  back: () => void;
  escape: () => void;
  focusSearch: () => void;
  toggleDock: () => void;
}

export function onRunnerKey(ev: KeyboardEvent, a: KeyActions): void {
  const t = ev.target instanceof Element ? ev.target : document.body;
  if (ev.key === "Escape") {
    a.escape();
    return;
  }
  if (t.matches("input, textarea") || ev.ctrlKey || ev.metaKey || ev.altKey) return;
  if (ev.key === "/") {
    ev.preventDefault();
    a.focusSearch();
    return;
  }
  if (ev.key === "\\") {
    ev.preventDefault();
    a.toggleDock();
    return;
  }
  if (t.matches("button, summary") && (ev.key === "Enter" || ev.key === " ")) return;
  const primary = a.options.find((o) => o.kind !== "aside");
  if ((ev.key === "ArrowRight" || ev.key === "Enter" || ev.key === " ") && primary) {
    ev.preventDefault();
    a.go(primary.to);
  } else if (ev.key === "ArrowLeft" || ev.key === "Backspace") {
    ev.preventDefault();
    a.back();
  } else if (/^[1-9]$/.test(ev.key) && a.options[Number(ev.key) - 1])
    a.go(a.options[Number(ev.key) - 1].to);
}

// One listener for the page's life; it always sees the latest options and actions.
export function useKeys(a: KeyActions): void {
  const latest = useRef(a);
  latest.current = a;
  useEffect(() => {
    const on = (ev: KeyboardEvent) => onRunnerKey(ev, latest.current);
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, []);
}
