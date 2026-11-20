// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SCROLL, Slide, Slides, stepScroll } from "./Slides.js";
import type { DeckSlide } from "./deck.js";

const deck: DeckSlide[] = [
  { title: "Session 8 The Raid", md: "Played 2026-10-06" },
  { title: "Previously on…", md: "The party fell out of the light.\n\n- **Dip** took the big one" },
  { title: "Next time…", md: "Sable has not spoken yet." },
];
const overlay = () => document.querySelector<HTMLElement>(".sr-slides");
const title = () => overlay()!.querySelector(".sr-slide-title")!.textContent;
const slide = (d: DeckSlide[], i: number, label: string) =>
  render(<Slide deck={d} i={i} label={label} onClose={() => {}} />).container;

// Open until closed, as the runner holds it.
function Host({ d }: { d: DeckSlide[] }) {
  const [open, setOpen] = useState(true);
  return open ? <Slides deck={d} label="Session 8" onClose={() => setOpen(false)} /> : null;
}

afterEach(cleanup);

describe("Slide", () => {
  it("renders the headline, markdown body and the counter", () => {
    const el = slide(deck, 1, "Session 8");
    expect(el.querySelector(".sr-slide-title")!.textContent).toBe("Previously on…");
    expect(el.querySelector(".sr-slide-body li strong")!.textContent).toBe("Dip");
    expect(el.querySelector(".sr-slides-count")!.textContent).toBe("2 / 3");
  });

  it("uses a generated slide’s body in place of its markdown", () => {
    const el = slide(
      [{ title: "Stats", md: "ignored", body: <div className="st-cards" /> }],
      0,
      "",
    );
    expect(el.querySelector(".sr-slide-body .st-cards")).not.toBeNull();
    expect(el.querySelector(".sr-slide-body")!.textContent).not.toContain("ignored");
  });

  it("drops the headline on a bare slide and labels the stage instead", () => {
    const el = slide([{ title: "As the sky stood", md: "", body: <svg />, bare: true }], 0, "");
    expect(el.querySelector(".sr-slide-title")).toBeNull();
    const stage = el.querySelector(".sr-slides-stage")!;
    expect(stage.classList.contains("is-bare")).toBe(true);
    expect(stage.getAttribute("aria-label")).toBe("As the sky stood");
  });

  it("shows wikilinks as plain text, never entity links", () => {
    const el = slide([{ title: "T", md: "Met [[Sable Wren]] at [[Ashford|the ford]]" }], 0, "");
    expect(el.querySelector("a")).toBeNull();
    expect(el.querySelector(".sr-slide-body")!.textContent!.trim()).toBe(
      "Met Sable Wren at the ford",
    );
  });
});

describe("Slides", () => {
  it("does nothing for an empty deck", () => {
    render(<Slides deck={[]} label="none" onClose={() => {}} />);
    expect(overlay()).toBeNull();
  });

  it("steps with the arrow keys, clamped at both ends, and Home / End jump", async () => {
    const user = userEvent.setup();
    render(<Host d={deck} />);
    expect(title()).toBe("Session 8 The Raid");
    await user.keyboard("{ArrowLeft}");
    expect(title()).toBe("Session 8 The Raid");
    await user.keyboard("{ArrowRight}[Space]");
    expect(title()).toBe("Next time…");
    await user.keyboard("{ArrowRight}");
    expect(overlay()!.querySelector(".sr-slides-count")!.textContent).toBe("3 / 3");
    await user.keyboard("{Home}");
    expect(title()).toBe("Session 8 The Raid");
    await user.keyboard("{End}");
    expect(title()).toBe("Next time…");
  });

  it("keeps its keys from reaching the page underneath", async () => {
    const user = userEvent.setup();
    const onPage = vi.fn();
    document.addEventListener("keydown", onPage);
    const { unmount } = render(<Host d={deck} />);
    await user.keyboard("{ArrowRight}");
    expect(onPage).not.toHaveBeenCalled();
    unmount();
    await user.keyboard("{ArrowRight}");
    expect(onPage).toHaveBeenCalledTimes(1);
    document.removeEventListener("keydown", onPage);
  });

  it("closes on Esc and on the close button", async () => {
    const user = userEvent.setup();
    render(<Host d={deck} />);
    await user.keyboard("{Escape}");
    expect(overlay()).toBeNull();
    cleanup();
    render(<Host d={deck} />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(overlay()).toBeNull();
  });
});

describe("stepScroll", () => {
  const start = { phase: "down" as const, wait: 0, pos: 0 };

  it("creeps down, holds at the bottom, then heads back up", () => {
    let s = stepScroll(start, 1, 100);
    expect(s.pos).toBe(SCROLL.speed);
    s = stepScroll(s, 10, 100);
    expect(s).toEqual({ phase: "up", wait: SCROLL.hold, pos: 100 });
    s = stepScroll(s, SCROLL.hold, 100);
    expect(s.pos).toBe(100);
    s = stepScroll(s, 1, 100);
    expect(s).toEqual({ phase: "down", wait: SCROLL.hold, pos: 0 });
  });

  it("waits out a hold before moving", () => {
    expect(stepScroll({ ...start, wait: 2 }, 0.5, 100)).toEqual({ ...start, wait: 1.5 });
  });

  it("does nothing when the slide fits", () => {
    expect(stepScroll(start, 1, 0)).toBe(start);
  });
});
