// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Runner } from "./Runner.js";
import { fixture } from "./fixture-data.js";
import type { SessionData } from "./types.js";

const current = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(".sr-scene")!.dataset.current;
const mount = (d: SessionData | null) => render(<Runner data={d} />).container;

describe("Runner", () => {
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, "", location.pathname); // drop the #card hash a prior test left
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("")),
    );
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows the empty page without data", () => {
    mount(null);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("No session to run");
  });

  it("walks branches by click and key, steps back, and persists the path", async () => {
    const user = userEvent.setup();
    const root = mount(fixture());
    expect(current(root)).toBe("S1_OPEN");
    await user.click(root.querySelector<HTMLButtonElement>(".sr-opt")!);
    expect(current(root)).toBe("S1_REST");
    (document.activeElement as HTMLElement | null)?.blur();
    await user.keyboard("{ArrowRight}"); // primary = cut to the parallel scene
    expect(current(root)).toBe("S1_WOODS");
    await user.keyboard("{ArrowLeft}");
    expect(current(root)).toBe("S1_REST");
    await user.keyboard("2"); // second option = the edge straight to the fight
    expect(current(root)).toBe("S1_FIGHT");

    cleanup();
    expect(current(mount(fixture()))).toBe("S1_FIGHT");
  });

  it("opens on the recap card when historian has a previous session", async () => {
    const user = userEvent.setup();
    const d = fixture();
    d.previously = [
      {
        name: "Session 8 Before",
        number: 8,
        date: "",
        campaign: "strahd",
        description: "Before.",
        recap: "",
        cliffhanger: "Hanging.",
        path: "",
        slides: [],
      },
    ];
    const root = mount(d);
    expect(current(root)).toBe("PREVIOUSLY");
    expect(root.querySelector(".sr-recap-lead")!.textContent).toBe("Before.");
    await user.keyboard("{ArrowRight}");
    expect(current(root)).toBe("S1_OPEN");
  });

  it("opens the previous session’s slides from the recap card, and Esc returns to it", async () => {
    const user = userEvent.setup();
    const d = fixture();
    d.previously = [
      {
        name: "Session 8 Before",
        number: 8,
        date: "",
        campaign: "homebrew",
        description: "Before.",
        recap: "",
        cliffhanger: "",
        path: "",
        slides: [
          { title: "Session 8 Before", md: "Played." },
          { title: "Next time…", md: "Hanging." },
        ],
      },
    ];
    const root = mount(d);
    await user.click(root.querySelector<HTMLButtonElement>('[data-act="slides"]')!);
    const title = () => document.querySelector(".sr-slides .sr-slide-title")!.textContent;
    expect(title()).toBe("Session 8 Before");
    await user.keyboard("{ArrowRight}");
    expect(title()).toBe("Next time…");
    expect(current(root)).toBe("PREVIOUSLY");
    await user.keyboard("{Escape}");
    expect(document.querySelector(".sr-slides")).toBeNull();
    expect(current(root)).toBe("PREVIOUSLY");
  });

  it("a beat chip in the notes peeks in the panel without moving, and Jump here moves", async () => {
    const user = userEvent.setup();
    const d = fixture();
    d.scenes[1].md += " If it turns ugly, `S1_FIGHT`.";
    const root = mount(d);
    await user.click(root.querySelector<HTMLButtonElement>('.sr-chip[data-id="S1_WOODS"]')!);
    await user.click(
      root.querySelector<HTMLButtonElement>('.sr-main .sr-bref[data-beat="S1_FIGHT"]')!,
    );
    expect(current(root)).toBe("S1_WOODS");
    expect(root.querySelector(".sr-panel .sr-pn-crumb")!.textContent).toBe("S1_FIGHT");
    await user.click(root.querySelector<HTMLButtonElement>('.sr-panel [data-jump="S1_FIGHT"]')!);
    expect(current(root)).toBe("S1_FIGHT");
  });

  it("searches from the header, and \\ docks or hides the panel", async () => {
    const user = userEvent.setup();
    const root = mount(fixture());
    const body = root.querySelector<HTMLElement>(".sr-body")!;
    const docked = body.classList.contains("is-docked");
    await user.keyboard("\\");
    expect(body.classList.contains("is-docked")).toBe(!docked);
    await user.keyboard("\\");
    expect(body.classList.contains("is-docked")).toBe(docked);
    await user.keyboard("/");
    const input = screen.getByRole("searchbox");
    expect(document.activeElement).toBe(input);
    await user.keyboard("ash");
    expect(root.querySelector(".sr-panel .sr-ent-name")!.textContent).toBe("Ashford");
  });

  it("jumps from the rail, and wikilinks in the scene open the panel", async () => {
    const user = userEvent.setup();
    const root = mount(fixture());
    await user.click(root.querySelector<HTMLButtonElement>('.sr-chip[data-id="S1_WOODS"]')!);
    expect(current(root)).toBe("S1_WOODS");
    await user.click(
      root.querySelector<HTMLElement>('.sr-scene a.sr-wiki[data-entity="Ashford"]')!,
    );
    expect(root.querySelector(".sr-ent-head h2")!.textContent).toBe("Ashford");
  });
});
