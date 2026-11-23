// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Panel } from "./Panel.js";
import { usePanel, type PanelApi, type PanelContext } from "./usePanel.js";
import { SessionContext } from "./SessionContext.js";
import { buildRefIndex } from "./ref-index.js";
import { makeResolver } from "./entities.js";
import { fixture } from "./fixture-data.js";
import type { SessionData } from "./types.js";

// Each fold's summary as "title count" (jeff-ui Disclosure puts the count in its own span).
const foldTitles = (root: HTMLElement) =>
  [...root.querySelectorAll(".sr-pn-fold > summary")].map((x) =>
    [...x.childNodes].map((n) => n.textContent).join(" "),
  );

// The panel with the runner's search box and pin beside it, as Runner.tsx lays them out.
// The panel is a jeff-ui Drawer; its root (.sr-body) carries is-docked and is-open.
function setup(d: SessionData = fixture(), ctx: PanelContext = { onCard: [], inScene: [] }) {
  const resolve = makeResolver(d.entities);
  const known = (n: string) => !!resolve(n);
  const refs = buildRefIndex(d.nodes, d.scenes, "S1_OPEN", d.cards);
  const onGo = vi.fn();
  const api: { p?: PanelApi } = {};
  function Harness() {
    const { body, ...p } = usePanel(resolve);
    api.p = p;
    return (
      <SessionContext.Provider value={{ known, openEntity: (n) => p.openEntity(n) }}>
        <input
          id={p.searchId}
          type="search"
          value={p.query}
          onChange={(e) => p.setQuery(e.currentTarget.value)}
          onKeyDown={p.onSearchKey}
        />
        <button type="button" className="sr-pin" onClick={p.toggleDock}>
          {p.docked ? "Hide panel" : "Pin panel"}
        </button>
        <Panel
          p={p}
          body={body}
          data={d}
          resolve={resolve}
          refs={refs}
          ctx={ctx}
          where="step 1, Open"
          onGo={onGo}
        >
          <main />
        </Panel>
      </SessionContext.Provider>
    );
  }
  const root = render(<Harness />).container;
  const call = (f: (p: PanelApi) => void) => act(() => f(api.p!));
  return { d, root, onGo, call, input: () => screen.getByRole("searchbox") as HTMLInputElement };
}

describe("Panel", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("default view lists party, card and scene entities, the resolvable roster, and plan sections", async () => {
    const d = fixture();
    const { root } = setup(d, { onCard: [d.entities[0]], inScene: [d.entities[0], d.entities[1]] });
    const groups = [...root.querySelectorAll(".sr-group")].map((g) => g.textContent);
    expect(groups).toEqual(["Party", "On this step", "In this scene", "More"]);
    expect(root.querySelector(".sr-pc-name")!.textContent).toBe("Iggy");
    // "In this scene" omits what is already on the card; the roster skips unresolved names.
    expect(root.querySelectorAll(".sr-ent")).toHaveLength(1 + 1 + 2);
    // The roster and the plan sections fold away under More.
    expect(foldTitles(root)).toEqual(["Act roster 2", "Session plan 1"]);
    await userEvent.click(root.querySelector<HTMLButtonElement>('[data-pn="section|0"]')!);
    expect(root.querySelector(".sr-pn-title")!.textContent).toBe("Orientation");
    expect(root.querySelector(".sr-md")!.textContent).toBe("Five PCs.");
  });

  it("shows the established town / region / world facts above the plan sections", async () => {
    const d = fixture();
    d.established = [{ title: "Town — Ashford", md: "- A ford-town on the [[Ashford]] creek" }];
    const { root } = setup(d);
    const folds = foldTitles(root);
    expect(folds.slice(-2)).toEqual(["Established 1", "Session plan 1"]);
    await userEvent.click(root.querySelector<HTMLButtonElement>('[data-pn="section|0"]')!);
    expect(root.querySelector(".sr-pn-title")!.textContent).toBe("Town — Ashford");
  });

  it("search shows ranked results, and Escape clears it", async () => {
    const { root, call, input } = setup();
    await userEvent.type(input(), "ash");
    expect([...root.querySelectorAll(".sr-ent-name")].map((e) => e.textContent)).toEqual([
      "Ashford",
    ]);
    call((p) => p.escape());
    expect(input().value).toBe("");
    expect(root.querySelector(".sr-group")!.textContent).toBe("Party");
  });

  it("opens an entity with its session quick-ref, and back returns to the default view", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("---\nname: Sable Wren\n---\nBody text.")),
    );
    const { root, call } = setup();
    call((p) => p.openEntity("Sable Wren"));
    expect(root.querySelector(".sr-ent-head h2")!.textContent).toBe("Sable Wren");
    expect(root.querySelector(".sr-quickref")).not.toBeNull();
    await waitFor(() =>
      expect(root.querySelector(".sr-ent-body")!.textContent).toContain("Body text."),
    );
    await userEvent.click(root.querySelector<HTMLButtonElement>(".sr-back")!);
    expect(root.querySelector(".sr-group")!.textContent).toBe("Party");
  });

  it("peeks at a beat with one Back stack, and Jump here moves the walk", async () => {
    const user = userEvent.setup();
    const { root, call, onGo, input } = setup();
    call((p) => p.openEntity("Sable Wren"));
    call((p) => p.openBeat("S1_FIGHT"));
    expect(root.querySelector(".sr-pn-crumb")!.textContent).toBe("S1_FIGHT");
    expect(root.querySelector(".sr-pn-note")!.textContent).toContain("still on step 1, Open");
    await user.click(root.querySelector<HTMLButtonElement>(".sr-back")!);
    expect(root.querySelector(".sr-ent-head h2")!.textContent).toBe("Sable Wren");
    call((p) => p.openBeat("S1_FIGHT", true)); // from the notes: a fresh trail
    await user.click(root.querySelector<HTMLButtonElement>("[data-jump]")!);
    expect(onGo).toHaveBeenCalledWith("S1_FIGHT");
    expect(root.querySelector(".sr-group")!.textContent).toBe("Party");
    // Search finds beats, and Enter opens the top result.
    await user.type(input(), "s1_fight");
    expect(root.querySelector('.sr-panel-body [data-beat="S1_FIGHT"]')).not.toBeNull();
    await user.keyboard("{Enter}");
    expect(root.querySelector(".sr-pn-crumb")!.textContent).toBe("S1_FIGHT");
  });

  it("docks on a wide window or slides over on a narrow one, and the pin overrides and is kept", async () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { root, call } = setup();
    const shell = root.querySelector(".sr-body")!;
    expect(shell.classList.contains("is-docked")).toBe(false);
    expect(shell.classList.contains("is-open")).toBe(false);
    call((p) => p.openEntity("Sable Wren"));
    expect(shell.classList.contains("is-open")).toBe(true);
    call((p) => p.escape());
    expect(shell.classList.contains("is-open")).toBe(false);
    expect(root.querySelector(".sr-ent-head h2")!.textContent).toBe("Sable Wren"); // still there to slide back to
    await userEvent.click(screen.getByRole("button", { name: "Pin panel" }));
    expect(shell.classList.contains("is-docked")).toBe(true);
    expect(root.querySelector(".sr-pin")!.textContent).toContain("Hide panel");
    cleanup();
    expect(setup().root.querySelector(".sr-body")!.classList.contains("is-docked")).toBe(true);
  });

  it("an unknown name falls through to a search", () => {
    const { root, call, input } = setup();
    call((p) => p.openEntity("Nobody Real"));
    expect(input().value).toBe("Nobody Real");
    expect(root.querySelector(".sr-empty")).not.toBeNull();
  });
});
