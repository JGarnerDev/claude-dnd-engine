// The side panel's state and what the runner calls on it: the Back stack of what's
// open, the search query, and whether the panel is docked or slid over the notes.
// The runner draws the search box (by `searchId`), the pin and the rail from it;
// <Panel> draws the rest. The pin's choice is remembered per browser (session-runner:panel-dock).

import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import type { Resolver } from "./entities.js";
import type { EntityRef } from "./types.js";

export interface PanelContext {
  onCard: EntityRef[];
  inScene: EntityRef[];
}

export type Item =
  | { kind: "entity"; e: EntityRef }
  | { kind: "beat"; id: string }
  | { kind: "scene"; key: string }
  | { kind: "mystery"; i: number }
  | { kind: "section"; i: number };

const DOCK_KEY = "session-runner:panel-dock";
const WIDE = "(min-width: 1100px)";

function readPin(): boolean | null {
  try {
    const v = localStorage.getItem(DOCK_KEY);
    return v === "docked" ? true : v === "hidden" ? false : null;
  } catch {
    return null;
  }
}
function writePin(v: boolean | null): void {
  try {
    if (v === null) localStorage.removeItem(DOCK_KEY);
    else localStorage.setItem(DOCK_KEY, v ? "docked" : "hidden");
  } catch {
    /* per-viewer convenience only */
  }
}

const wideNow = () => (typeof matchMedia === "function" ? matchMedia(WIDE).matches : true);

export const crumb = (it: Item) =>
  it.kind === "entity"
    ? it.e.name
    : it.kind === "beat"
      ? it.id
      : it.kind === "scene"
        ? `Scene ${it.key}`
        : it.kind === "mystery"
          ? "Mystery"
          : "Plan";

interface PanelState {
  stack: Item[];
  query: string;
  slid: boolean; // slid over the notes, when not docked
  pinned: boolean | null; // the pin's choice; null = the width decides
  wide: boolean;
}

export interface PanelApi {
  stack: readonly Item[];
  query: string;
  searchId: string; // the header's search box, which jeff-ui's SearchInput takes by id
  docked: boolean;
  open: boolean; // slid over the notes
  setQuery(q: string): void;
  openEntity(name: string, fresh?: boolean): void;
  openBeat(id: string, fresh?: boolean): void;
  openScene(key: string, fresh?: boolean): void;
  openSection(kind: "mystery" | "section", i: number, fresh?: boolean): void;
  back(): void;
  home(): void;
  close(): void;
  jump(): void; // the panel's Jump here: drop the peek and close the slide-over
  rail(which: string): void;
  focusSearch(): void;
  toggleDock(): void;
  escape(): void;
  onSearchKey(ev: KeyboardEvent<HTMLInputElement>): void;
}

// The panel's DOM refs, kept out of PanelApi: callers destructure them and pass
// them on as their own props, so reading the api during render isn't a ref read.
export interface PanelRefs {
  body: RefObject<HTMLDivElement | null>;
}

export function usePanel(resolve: Resolver): PanelApi & PanelRefs {
  const [s, set] = useState<PanelState>(() => ({
    stack: [],
    query: "",
    slid: false,
    pinned: readPin(),
    wide: wideNow(),
  }));
  const searchId = useId();
  const searchBox = () => document.getElementById(searchId) as HTMLInputElement | null;
  const body = useRef<HTMLDivElement>(null);
  const docked = s.pinned ?? s.wide;

  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const m = matchMedia(WIDE);
    const on = () => set((x) => ({ ...x, wide: m.matches, slid: false }));
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);

  const dockedOf = (x: PanelState) => x.pinned ?? x.wide;
  const reveal = (x: PanelState): PanelState => (dockedOf(x) ? x : { ...x, slid: true });
  const push = (it: Item, fresh: boolean) =>
    set((x) => {
      const stack = fresh ? [] : [...x.stack];
      const top = stack[stack.length - 1];
      if (!top || crumb(top) !== crumb(it) || it.kind === "mystery" || it.kind === "section")
        stack.push(it);
      return reveal({ ...x, stack, query: "" });
    });

  const setQuery = (q: string) =>
    set((x) => (q.trim() ? reveal({ ...x, query: q }) : { ...x, query: q }));

  return {
    stack: s.stack,
    query: s.query,
    searchId,
    docked,
    open: !docked && s.slid,
    body,
    setQuery,
    openEntity(name, fresh = false) {
      const e = resolve(name);
      if (e) push({ kind: "entity", e }, fresh);
      else set((x) => reveal({ ...x, query: name }));
    },
    openBeat: (id, fresh = false) => push({ kind: "beat", id }, fresh),
    openScene: (key, fresh = false) => push({ kind: "scene", key }, fresh),
    openSection: (kind, i, fresh = false) => push({ kind, i }, fresh),
    back: () => set((x) => ({ ...x, stack: x.stack.slice(0, -1) })),
    home: () => set((x) => ({ ...x, stack: [] })),
    close: () => set((x) => ({ ...x, slid: false })),
    jump: () =>
      set((x) => ({
        ...x,
        slid: false,
        stack: x.stack[x.stack.length - 1]?.kind !== "entity" ? x.stack.slice(0, -1) : x.stack,
      })),
    rail(which) {
      set((x) => ({ ...x, slid: true, ...(which === "home" ? { stack: [], query: "" } : {}) }));
      if (which === "search") searchBox()?.focus();
    },
    focusSearch() {
      set(reveal);
      searchBox()?.focus();
      searchBox()?.select();
    },
    toggleDock() {
      set((x) => {
        const next = !dockedOf(x);
        const pinned = next === x.wide ? null : next; // back to the width's own choice clears the pin
        writePin(pinned);
        return { ...x, pinned, slid: false };
      });
    },
    escape() {
      set((x) =>
        x.query
          ? { ...x, query: "" }
          : !dockedOf(x) && x.slid
            ? { ...x, slid: false }
            : { ...x, stack: [] },
      );
      searchBox()?.blur();
    },
    onSearchKey(ev) {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      body.current
        ?.querySelector<HTMLElement>("[data-entity], [data-beat], [data-scene], [data-pn]")
        ?.click();
    },
  };
}
