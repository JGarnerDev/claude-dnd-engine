// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Scene, type SceneProps } from "./Scene.js";
import { RefContext } from "./RefChips.js";
import { parseCombatants } from "./combatants.js";
import { recordHit, recordReset, type HpState } from "./hp-log.js";
import { buildRefIndex } from "./ref-index.js";
import type { FlowNode } from "./types.js";

const n = (id: string, kind = "social", title = id): FlowNode => ({
  id,
  marker: "committed",
  kind,
  scene: "SC1",
  title,
  lines: [],
  notes: [],
});
const ask = n("S1_ASK", "decision", "Mara asks");
const fight = n("S1_FIGHT", "combat", "The fork");
const md = [
  "- **Summary:** The night closes out.",
  "- **Cast:** [[Sable Wren]] · Dunny",
  "- **Enemies:** Archer Rider (Ilsa Hask)",
  "- **DCs:** Arcana 13 — read it",
  "- **Time:** ~30 min",
  "",
  "> Read this aloud.",
  "",
  "- **Location:** the inn",
  "- **Roll20:** use the indoors map.",
  "",
  "#### S1_ASK — Mara asks",
  "",
  "- **Tokens:** Mara at the door.",
  "- **Introduce:** Mara, sheriff",
  "  - **Look:** a star.",
  "- **Choice (party):** go or stay.",
  "- **Engine, 2026-10-09; committed 2026-10-13.** A small choice (Jeff, 2026-10-07).",
  "",
  "#### S1_FIGHT — The fork",
  "",
  "- **Tokens:** riders by the tree.",
].join("\n");
const combatants = parseCombatants(
  "### Scout — Ilsa Hask\n\n- AC 13 · HP 16\n- **Longbow** +4 to hit, 1d8+2",
);
const ix = buildRefIndex(
  [n("S1_OPEN", "social", "Open"), ask, fight],
  [{ id: "SC1", key: "1", title: "Scene 1 · The Night", md }],
  "S1_ASK",
);

function props(over: Partial<SceneProps> = {}): SceneProps {
  return {
    node: ask,
    scene: { id: "SC1", key: "1", title: "Scene 1 · The Night", md },
    sceneNodes: [n("S1_OPEN", "social", "Open"), ask, fight],
    visited: new Set(["S1_OPEN", "S1_ASK"]),
    position: "step 2 of 3",
    options: [
      { to: "S1_FIGHT", label: "go", kind: "edge" },
      { to: "S1_OPEN", label: "stay", kind: "edge" },
    ],
    titleOf: (id) => `title of ${id}`,
    closingHook: "The end.",
    combatants,
    hp: {},
    hpLog: [],
    tokensOpen: false,
    onGo: vi.fn(),
    onTokensToggle: vi.fn(),
    onHpHit: vi.fn(),
    onHpReset: vi.fn(),
    onHpUndo: vi.fn(),
    round: 1,
    onRound: vi.fn(),
    ...over,
  };
}

// The runner's side of the scene: it keeps HP and the round, and calls the
// spies. With `logged`, it also keeps the HP log; without, the log stays what was passed.
function Host({ v, logged = false }: { v: SceneProps; logged?: boolean }) {
  const [s, set] = useState<HpState & { round: number }>(() => ({
    hp: { ...v.hp },
    hpLog: [...v.hpLog],
    round: v.round,
  }));
  const change = (f: (x: HpState & { round: number }) => void) =>
    set((old) => {
      const x = structuredClone(old);
      f(x);
      return x;
    });
  const p: SceneProps = {
    ...v,
    hp: s.hp,
    hpLog: logged ? s.hpLog : v.hpLog,
    round: s.round,
    onHpHit: (e, input, before, after, start) => {
      v.onHpHit(e, input, before, after, start);
      change((x) => recordHit(x, e, input, before, after, start));
    },
    onHpReset: (before) => {
      v.onHpReset(before);
      change((x) => recordReset(x, "Reset HP", before));
    },
    onRound: (r) => {
      v.onRound(r);
      change((x) => {
        x.round = r;
      });
    },
  };
  return (
    <main>
      <RefContext.Provider value={{ ix, onBeat: () => {}, onScene: () => {} }}>
        <Scene {...p} />
      </RefContext.Provider>
    </main>
  );
}

const mount = (v: SceneProps, logged = false) => {
  const r = render(<Host v={v} logged={logged} />);
  const main = r.container.querySelector("main")!;
  const q = <T extends Element = HTMLElement>(s: string) => main.querySelector<T>(s)!;
  return { main, q, rerender: (w: SceneProps) => r.rerender(<Host v={w} logged={logged} />) };
};
const enter = (input: Element, typed: string) => userEvent.type(input, `${typed}{Enter}`);

describe("Scene", () => {
  afterEach(cleanup);

  it("shows the header: summary, cast chips, a DC line, time, and enemies matched to stat blocks", () => {
    const { main, q } = mount(props());
    expect(q(".sr-sh-summary").textContent).toBe("The night closes out.");
    expect([...main.querySelectorAll(".sr-sh-chip")].map((c) => c.textContent)).toEqual([
      "Sable Wren",
      "Dunny",
    ]);
    expect(q(".sr-sh-quiet").textContent).toBe("Arcana 13 — read it"); // DCs: one quiet line
    expect(q(".sr-scene-pos").textContent).toBe("~30 minstep 2 of 3");
    expect(q(".sr-enemy-stats").textContent).toBe("AC 13 · HP 16");
    expect(q(".sr-aloud blockquote").textContent).toContain("Read this aloud.");
    expect(q(".sr-sh-val").textContent).toBe("the inn");
    expect(q(".sr-setup").textContent).toContain("Use the indoors map");
  });

  it("tracks enemy HP in place: damage, down at 0, saved per entry, and reset", async () => {
    const v = props({ hp: { "Archer Rider (Ilsa Hask)": 9 } });
    const { q } = mount(v);
    expect(q(".sr-hp .sr-hp-val").textContent).toBe("9/16");
    expect(q(".sr-enemy-atk").textContent).toContain("+4 to hit");
    await enter(q(".sr-hp .sr-hp-in"), "11");
    expect(q(".sr-hp .sr-hp-val b").textContent).toBe("0");
    expect(q(".sr-enemy").classList.contains("is-down")).toBe(true);
    expect(v.onHpHit).toHaveBeenLastCalledWith("Archer Rider (Ilsa Hask)", "11", 9, 0, 16);
    await userEvent.click(q(".sr-hp-reset"));
    expect(q(".sr-hp .sr-hp-val b").textContent).toBe("16");
    expect(q(".sr-enemy").classList.contains("is-down")).toBe(false);
    expect(v.onHpReset).toHaveBeenLastCalledWith({ "Archer Rider (Ilsa Hask)": 0 });
  });

  it("starts and resets each enemy at its known HP, not full, when the plan carries damage", async () => {
    const hurt = parseCombatants(
      "### Scout — Ilsa Hask\n\n- AC 13 · HP 5/16\n- **Longbow** +4 to hit, 1d8+2",
    );
    const v = props({ combatants: hurt });
    const { q } = mount(v);
    expect(q(".sr-hp .sr-hp-val").textContent).toBe("5/16");
    await enter(q(".sr-hp .sr-hp-in"), "3");
    expect(v.onHpHit).toHaveBeenLastCalledWith("Archer Rider (Ilsa Hask)", "3", 5, 2, 5);
    await userEvent.click(q(".sr-hp-reset"));
    expect(q(".sr-hp .sr-hp-val b").textContent).toBe("5");
    expect(v.onHpReset).toHaveBeenLastCalledWith({ "Archer Rider (Ilsa Hask)": 2 });
  });

  it("logs every HP entry under the enemies, redraws the log in place, and offers undo", async () => {
    const v = props();
    const { q } = mount(v, true);
    expect(q(".sr-hplog summary").textContent).toBe("HP log (0)");
    expect(q<HTMLButtonElement>(".sr-hp-undo-reset").hidden).toBe(true);
    await enter(q(".sr-hp-in"), "4");
    expect(q(".sr-hplog summary").textContent).toBe("HP log (1)");
    expect(q(".sr-hplog li").textContent).toContain("16 → 12");
    await userEvent.click(q(".sr-hp-reset"));
    expect(q(".sr-hplog summary").textContent).toBe("HP log (2)");
    expect(q(".sr-hplog li").textContent).toContain("was 12");
    // The hit sits under the reset, so it waits until the reset is undone.
    expect(q<HTMLButtonElement>(".sr-hplog li:last-child .sr-hplog-undo").disabled).toBe(true);
    const undoReset = q<HTMLButtonElement>(".sr-hp-undo-reset");
    expect(undoReset.hidden).toBe(false);
    await userEvent.click(undoReset);
    expect(v.onHpUndo).toHaveBeenCalledWith(1);
  });

  it("mirrors enemy HP in the strip, where damage goes in without scrolling back to the box", async () => {
    const v = props();
    const { main, q, rerender } = mount(v);
    expect(main.querySelector(".sr-strip")).toBeNull(); // step 2 is before the fight
    rerender({ ...v, node: fight });
    const chip = () => q(".sr-strip .sr-hpchip");
    expect(chip().textContent!.replace(/\s+/g, " ").trim()).toBe("Ilsa Hask 16/16");
    await userEvent.click(chip());
    await enter(q(".sr-strip-in"), "10");
    expect(v.onHpHit).toHaveBeenLastCalledWith("Archer Rider (Ilsa Hask)", "10", 16, 6, 16);
    expect(q(".sr-enemies .sr-hp-val b").textContent).toBe("6");
    expect(chip().classList.contains("is-hurt")).toBe(true);
    expect(q(".sr-hplog summary").textContent).toBe("HP log (0)"); // the log is the runner's
    // Damage typed in the box shows on the chip too.
    await enter(q(".sr-enemies .sr-hp-in"), "6");
    expect(chip().classList.contains("is-down")).toBe(true);
  });

  it("drives the notes from the fight bar: rounds, arrivals, Watch items and When pills", async () => {
    const fmd = [
      "- **Enemies:** Archer Rider (Ilsa Hask) · Relief Captain (Garran Vey) arrives round 2",
      "",
      "#### S1_HOLD — Hold the yard",
      "",
      "- **Combat starts:** mid-fight",
      "- **If they hurt her:**",
      "  - **If Ilsa drops to half (8 HP):** she runs.",
      "  - **Garran Vey drops:** the riders break.",
      "",
      "#### S1_RIDE — Riders",
      "",
      "- **When:** round 2",
    ].join("\n");
    const hold = n("S1_HOLD", "combat", "Hold the yard");
    const ride = n("S1_RIDE", "combat", "Riders");
    const blocks = parseCombatants(
      "### Scout — Ilsa Hask\n\n- AC 13 · HP 16\n- **Longbow** +4 to hit, 1d8+2\n\n### Veteran — Garran Vey\n\n- AC 17 · HP 58\n- **Longsword** +5 to hit, 1d8+3",
    );
    const v = props({
      node: hold,
      sceneNodes: [hold, ride],
      visited: new Set(["S1_HOLD"]),
      combatants: blocks,
      scene: { id: "SC1", key: "1", title: "Scene 1", md: fmd },
    });
    const { main, q } = mount(v);
    const bar = q(".sr-strip");
    expect(bar.querySelector(".sr-strip-mode")!.textContent).toBe("Fight");
    expect(main.querySelector('.sr-step[data-id="S1_HOLD"] .sr-edge')).toBeNull(); // starts at the top: nothing to mark
    // Vey waits for round 2.
    const vey = () => q('.sr-enemy[data-arrives="2"]');
    expect(vey().querySelector(".sr-arrives")!.textContent).toBe("arrives round 2");
    expect(vey().classList.contains("is-coming")).toBe(true);
    expect(bar.querySelectorAll(".sr-hpchip.is-coming")).toHaveLength(1);
    const pill = () => q('.sr-step[data-id="S1_RIDE"] .sr-when');
    expect(pill().classList.contains("is-ready")).toBe(false);
    await userEvent.click(q('.sr-strip [data-round="1"]'));
    expect(v.onRound).toHaveBeenLastCalledWith(2);
    expect(q(".sr-strip .sr-round output").textContent).toBe("2");
    expect(vey().classList.contains("is-coming")).toBe(false);
    expect(pill().classList.contains("is-ready")).toBe(true);
    const alerts = () =>
      [...q(".sr-strip").querySelectorAll(".sr-alert")].map((a) => a.textContent);
    expect(alerts()).toEqual(["Garran Vey arrives this round", "Ready: 2 · Riders"]);
    await userEvent.click(q(".sr-strip .sr-alert[data-to]"));
    expect(v.onGo).toHaveBeenCalledWith("S1_RIDE");
    // Ilsa to 8 lights her Watch item; the block's label carries no cue of its own.
    const items = () =>
      [...main.querySelectorAll(".sr-pb-watch li")].map((li) => li.classList.contains("is-now"));
    expect(items()).toEqual([false, false]);
    await enter(q('.sr-hp[data-entry="Archer Rider (Ilsa Hask)"] .sr-hp-in'), "8");
    expect(items()).toEqual([true, false]);
    expect(alerts()).toContain("If Ilsa drops to half (8 HP): she runs.");
  });

  it("opens an enemy card under the damage box: stats, dice that roll, and the full block", async () => {
    const { main, q } = mount(props({ node: fight }));
    expect(main.querySelector(".sr-strip-card")).toBeNull();
    await userEvent.click(q(".sr-strip .sr-hpchip"));
    const card = () => q(".sr-strip-card");
    expect(card().querySelector(".sr-strip-card-stats")!.textContent).toBe("AC 13 · HP 16");
    expect(card().querySelector(".sr-strip-card-more summary")!.textContent).toBe("Full block");
    await userEvent.click(card().querySelector<HTMLButtonElement>(".sr-strip-card-atk .sr-roll")!);
    expect(card().querySelector(".sr-roll-log li")!.textContent).toContain("Ilsa Hask");
    expect(main.querySelector(".sr-enemies .sr-roll-log li")).not.toBeNull(); // the Enemies box logs it too
    const clear = () => card().querySelector<HTMLButtonElement>(".sr-roll-clear")!;
    expect(clear().hidden).toBe(false);
    await userEvent.click(clear());
    expect(card().querySelector(".sr-roll-log li")).toBeNull();
    expect(main.querySelector(".sr-enemies .sr-roll-log li")).toBeNull();
    expect(clear().hidden).toBe(true);
    expect(q<HTMLButtonElement>(".sr-enemies .sr-roll-clear").hidden).toBe(true);
    await userEvent.click(q(".sr-strip .sr-hpchip")); // the same chip closes it
    expect(main.querySelector(".sr-strip-card")).toBeNull();
  });

  it("gives a boss chip its phase ticks and legendary pips, and counts the crew for morale", async () => {
    const fmd = [
      "- **Enemies:** Archer Rider (Ilsa Hask) · Griffon (Tithe) · Relief Captain (Garran Vey) arrives round 2",
      "",
      "#### S1_HUNT — It hunts",
      "",
      "- **Boss fight starts:** on the scream.",
      "",
      "#### S1_BREAK — They break",
      "",
      "- **When:** Vey drops, or the crew (everyone but Tithe) is down to zero.",
    ].join("\n");
    const hunt = n("S1_HUNT", "combat", "It hunts");
    const brk = n("S1_BREAK", "combat", "They break");
    const blocks = parseCombatants(
      [
        "### Scout — Ilsa Hask",
        "",
        "- AC 13 · HP 16",
        "",
        "### Griffon — Tithe",
        "",
        "- AC 12 · **HP 95** · fly 80 ft",
        "- **Boss.** Legendary actions below.",
        "  - **Legendary actions: 2 a round,** one at a time.",
        "  - **Bloodied, at 47 HP or less: the second phase.** It lands.",
        "",
        "### Veteran — Garran Vey",
        "",
        "- AC 17 · HP 58",
      ].join("\n"),
    );
    const { q } = mount(
      props({
        node: hunt,
        sceneNodes: [hunt, brk],
        visited: new Set(["S1_HUNT"]),
        combatants: blocks,
        scene: { id: "SC1", key: "1", title: "Scene 1", md: fmd },
      }),
    );
    const bar = () => q(".sr-strip");
    expect(bar().classList.contains("is-boss")).toBe(true);
    const tithe = () =>
      bar().querySelector<HTMLElement>('.sr-hpchip[data-entry="Griffon (Tithe)"]')!;
    expect(tithe().querySelector<HTMLElement>(".sr-meter-tick")!.style.left).toMatch(/^49\.4/);
    expect(tithe().querySelector(".sr-phase")).toBeNull();
    const pip = (i: number) => bar().querySelectorAll<HTMLButtonElement>(".ui-pip")[i];
    const pips = () =>
      [...bar().querySelectorAll<HTMLButtonElement>(".sr-legend .ui-pip")].map(
        (p) => p.getAttribute("aria-pressed") === "true",
      );
    expect(pips()).toEqual([false, false]);
    await userEvent.click(pip(1)); // a 2-cost action spends both
    expect(pips()).toEqual([true, true]);
    await userEvent.click(pip(1)); // give one back
    expect(pips()).toEqual([true, false]);
    await userEvent.click(q('.sr-strip [data-round="1"]')); // a new round refills
    expect(pips()).toEqual([false, false]);
    const hp = (entry: string, typed: string) =>
      enter(q(`.sr-hp[data-entry="${entry}"] .sr-hp-in`), typed);
    await hp("Griffon (Tithe)", "=40");
    expect(tithe().classList.contains("is-phase")).toBe(true);
    expect(tithe().querySelector(".sr-phase")!.textContent).toBe("Bloodied");
    // Round 2: Vey is on the field, so the crew isn't down to zero until Ilsa and Vey are.
    const ready = () => q('.sr-step[data-id="S1_BREAK"] .sr-when').classList.contains("is-ready");
    await hp("Archer Rider (Ilsa Hask)", "=0");
    expect(ready()).toBe(false);
    await hp("Relief Captain (Garran Vey)", "=1");
    expect(ready()).toBe(false);
    await hp("Relief Captain (Garran Vey)", "=0");
    expect(ready()).toBe(true);
    // A dead boss loses its pips.
    await hp("Griffon (Tithe)", "=0");
    expect(bar().querySelector(".sr-legend")).toBeNull();
  });

  it("links beat ids in the notes to their steps", () => {
    const { q } = mount(
      props({
        scene: {
          id: "SC1",
          key: "1",
          title: "Scene 1 · The Night",
          md: md.replace("go or stay.", "go (`S1_FIGHT`) or stay."),
        },
      }),
    );
    const chip = q(".sr-pb-choice .sr-bref");
    expect(chip.dataset.beat).toBe("S1_FIGHT");
    expect(chip.querySelector(".sr-bref-n")!.textContent).toBe("3");
  });

  it("rolls an enemy attack into the log without opening its stat block, and keeps the log across renders", async () => {
    const v = props();
    const { main, q, rerender } = mount(v);
    const hit = q('.sr-enemy-atk .sr-roll[data-kind="hit"]');
    expect(hit.textContent).toBe("+4 to hit");
    // The click is cancelled, so the browser leaves the <summary> shut. (happy-dom
    // toggles <details> mid-dispatch, before React's listener can cancel it.)
    let toggled = true;
    act(() => {
      toggled = fireEvent.click(hit);
    });
    expect(toggled).toBe(false);
    const entry = q(".sr-roll-log .sr-roll-entry");
    expect(entry.querySelector(".sr-roll-what")!.textContent).toBe(
      "Archer Rider (Ilsa Hask) · Longbow · to hit",
    );
    const total = Number(entry.querySelector(".sr-roll-total")!.textContent);
    expect(total).toBeGreaterThanOrEqual(5);
    expect(total).toBeLessThanOrEqual(24);
    rerender({ ...v });
    expect(main.querySelectorAll(".sr-roll-log .sr-roll-entry").length).toBeGreaterThanOrEqual(1);
    const clear = () => q<HTMLButtonElement>(".sr-roll-clear");
    expect(clear().hidden).toBe(false);
    await userEvent.click(clear());
    expect(main.querySelectorAll(".sr-roll-log .sr-roll-entry").length).toBe(0);
    expect(clear().hidden).toBe(true);
  });

  it("opens only the current step as a prompt book, in plan order, without provenance", () => {
    const { main } = mount(props());
    const steps = [...main.querySelectorAll<HTMLElement>(".sr-step")];
    expect(steps.map((s) => s.className)).toEqual([
      "sr-step is-done",
      "sr-step is-current",
      "sr-step is-todo",
    ]);
    expect(steps[0].querySelector(".sr-step-num")!.textContent).toBe("✓");
    const body = steps[1].querySelector(".sr-step-body")!;
    expect([...body.querySelectorAll(".sr-pb")].map((b) => b.className)).toEqual([
      "sr-pb sr-pb-do",
      "sr-pb sr-pb-intro",
      "sr-pb sr-pb-choice",
      "sr-pb sr-pb-you",
    ]);
    expect(body.querySelector(".sr-pb-do")!.textContent).toContain("Mara at the door");
    expect(body.querySelector(".sr-intro-name")!.textContent).toContain("Mara, sheriff");
    expect(body.querySelector(".sr-pb-choice .sr-pb-text")!.textContent).toBe("Go or stay.");
    expect(body.querySelector(".sr-pb-choice small")!.textContent).toBe("party");
    expect(body.textContent).not.toContain("2026");
    expect(body.textContent).toContain("A small choice.");
    expect(steps[2].querySelector(".sr-mark")!.textContent).toBe("⚔");
    expect(steps[1].querySelector(".sr-mark")!.textContent).toBe("◆ choice");
  });

  it("puts fork buttons under the open step and wires clicks; step rows jump", async () => {
    const v = props();
    const { main, q } = mount(v);
    const btns = [...main.querySelectorAll<HTMLButtonElement>(".sr-step.is-current .sr-opt")];
    expect(btns.map((b) => b.querySelector("kbd")!.textContent)).toEqual(["1", "2"]);
    await userEvent.click(btns[1]);
    expect(v.onGo).toHaveBeenCalledWith("S1_OPEN");
    await userEvent.click(q(".sr-step.is-todo .sr-step-head"));
    expect(v.onGo).toHaveBeenCalledWith("S1_FIGHT");
  });

  it("labels a single way on as Next, and shows the closing hook at the end", () => {
    const v = props({ options: [{ to: "S1_FIGHT", label: "The fork", kind: "edge" }] });
    const { q, rerender } = mount(v);
    expect(q(".sr-opt-label").textContent).toBe("Next — title of S1_FIGHT");
    rerender({ ...v, options: [] });
    expect(q(".sr-end").textContent).toContain("The end.");
  });

  it("gathers the scene's token cues behind one toggle, numbered by step", () => {
    const box = mount(props()).q<HTMLDetailsElement>(".sr-tokens-box");
    expect(box.open).toBe(false);
    expect([...box.querySelectorAll("li")].map((l) => l.textContent!.trim())).toEqual([
      "2 Mara at the door.",
      "3 riders by the tree.",
    ]);
  });

  it("renders the recap body in place of steps", () => {
    const { main } = mount(props({ body: <p className="x">Recap.</p>, sceneNodes: [ask] }));
    expect(main.querySelector(".sr-card-body .x")).not.toBeNull();
    expect(main.querySelector(".sr-steps")).toBeNull();
  });
});
