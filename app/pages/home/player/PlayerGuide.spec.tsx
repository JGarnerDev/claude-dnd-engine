// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PlayerGuide } from "./PlayerGuide.js";
import type { GuideFile } from "./guide-file.js";

afterEach(cleanup);

function guide(
  pc: string,
  level: number,
  pcLevel: number | null,
  sessionsPlayed: number[] = [],
): GuideFile {
  const text = [
    "---",
    `pc: "${pc}"`,
    `level: ${level}`,
    "guide_confirmed: 35",
    "---",
    `${pc} intro.`,
    "",
    "## Turn",
    "",
    "### Ask",
    "",
    "1. **Ally down?** Heal them.",
    "2. **Nothing urgent?** Inspire.",
    "",
    "### Action",
    "",
    `- **Attack:** ${pc} attacks with the rapier.`,
    "- **Bless (concentration):** three allies.",
    "- Move first.",
    "",
    "## Strategies",
    "",
    "### Flyers",
    "",
    "- **Team:** ground them.",
    "- **Me:** Command prone.",
    "",
    "### Casters",
    "",
    "- **Team:** close fast.",
    "- **Me:** Bless saves.",
    "",
    "## Build",
    "",
    `- **Next:** ${pc} levels`,
    "",
    "## Notes",
    "",
    "### To do",
    "",
    "- **Ask the DM (at the table):** about the sword.",
    "- **Fix the sheet:** Roll20 is behind.",
    "",
    "## Roleplay",
    "",
    "### Shaw",
    "",
    "- **Kneel to talk:** never joke about his height.",
  ].join("\n");
  return { file: `${pc}.md`, text, pcLevel, sessionsPlayed };
}

describe("PlayerGuide", () => {
  it("shows an empty state with no guides", () => {
    render(<PlayerGuide files={[]} />);
    expect(screen.getByText(/No player guides yet/)).toBeTruthy();
  });

  it("shows the first section's plays, not the text before it, and switches tabs", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    expect(screen.queryByText("Iggy intro.")).toBeNull();
    expect(screen.getByRole("button", { name: "Attack" })).toBeTruthy();
    expect(screen.getByText("Move first.")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: /Build/ }));
    expect(screen.getByRole("button", { name: "Next" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Attack" })).toBeNull();
  });

  it("opens a play's text in place and closes it on a second tap", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    const attack = screen.getByRole("button", { name: "Attack" });
    expect(screen.queryByText(/attacks with the rapier/)).toBeNull();
    fireEvent.click(attack);
    expect(attack.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(/attacks with the rapier/)).toBeTruthy();
    fireEvent.click(attack);
    expect(screen.queryByText(/attacks with the rapier/)).toBeNull();
  });

  it("keeps one play open at a time", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    fireEvent.click(screen.getByRole("button", { name: "Attack" }));
    fireEvent.click(screen.getByRole("button", { name: "Bless C" }));
    expect(screen.queryByText(/attacks with the rapier/)).toBeNull();
    expect(screen.getByText(/three allies/)).toBeTruthy();
  });

  it("marks a spell that needs concentration on its tile and in its open text", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    const bless = screen.getByRole("button", { name: "Bless C" });
    expect(screen.queryByRole("button", { name: /Attack C/ })).toBeNull();
    fireEvent.click(bless);
    expect(screen.getByText("concentration")).toBeTruthy();
    expect(screen.queryByText(/\(concentration\)/)).toBeNull();
  });

  it("walks the yes/no checklist", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    expect(screen.getByText("Ally down?")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "No" }));
    expect(screen.getByText("Nothing urgent?")).toBeTruthy();
    expect(screen.getByText("Inspire.")).toBeTruthy();
  });

  it("shows one tile per enemy type when groups share their leads", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    fireEvent.click(screen.getByRole("tab", { name: /Strategies/ }));
    fireEvent.click(screen.getByRole("button", { name: "Flyers" }));
    expect(screen.getByText("ground them.")).toBeTruthy();
    expect(screen.getByText("Command prone.")).toBeTruthy();
  });

  it("searches every section and hides the tabs while searching", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    fireEvent.change(screen.getByLabelText("Find a play"), { target: { value: "bless" } });
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.getByText("Turn › Action")).toBeTruthy();
    expect(screen.getByText("Strategies › Casters")).toBeTruthy();
    expect(screen.queryByText("Strategies › Flyers")).toBeNull();
  });

  it("opens the play by itself when a search finds only one", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    fireEvent.change(screen.getByLabelText("Find a play"), { target: { value: "rapier" } });
    expect(screen.getByRole("button", { name: "Attack" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
    expect(screen.getByText("Iggy attacks with the rapier.")).toBeTruthy();
  });

  it("leaves plays shut when a search finds several", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    fireEvent.change(screen.getByLabelText("Find a play"), { target: { value: "bless" } });
    expect(screen.queryByText("three allies.")).toBeNull();
  });

  it("says so when a search finds nothing", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    fireEvent.change(screen.getByLabelText("Find a play"), { target: { value: "zzz" } });
    expect(screen.getByText(/Nothing matches/)).toBeTruthy();
  });

  it("warns when the PC file's level is past the guide's", () => {
    const { container } = render(<PlayerGuide files={[guide("Iggy", 5, 6)]} />);
    expect(container.querySelector(".pg-stale")?.textContent).toMatch(/level 6.*level 5/);
  });

  it("warns when the PC has played two or more sessions since guide_confirmed", () => {
    const { container } = render(<PlayerGuide files={[guide("Iggy", 5, 5, [35, 36, 37])]} />);
    const text = container.querySelector(".pg-stale")?.textContent ?? "";
    expect(text).toMatch(/session 35.*played 2 since \(36, 37\)/);
    expect(text).not.toMatch(/is level/);
  });

  it("shows no warning when the guide is current", () => {
    const { container } = render(<PlayerGuide files={[guide("Iggy", 5, 5, [35, 36])]} />);
    expect(container.querySelector(".pg-stale")).toBeNull();
  });

  it("picks between guides when there are several", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5), guide("Shaw", 5, 5)]} />);
    fireEvent.change(screen.getByLabelText("Character"), { target: { value: "Shaw" } });
    expect(screen.getByRole("button", { name: "Attack" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Attack" }));
    expect(screen.getByText(/Shaw attacks/)).toBeTruthy();
  });

  it("keeps Notes out of the tabs and shows them as panels", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    expect(screen.queryByRole("tab", { name: "Notes" })).toBeNull();
    // Once folded above the search (phone), once in the side column (wide).
    expect(screen.getAllByRole("checkbox", { name: "Ask the DM", hidden: true })).toHaveLength(2);
    expect(screen.getAllByText("at the table")).toHaveLength(2);
  });

  it("starts each Notes panel open and folds it from its heading", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    const todo = screen.getAllByRole("button", { name: "To do", hidden: true });
    expect(todo.map((b) => b.getAttribute("aria-expanded"))).toEqual(["true", "true"]);
    fireEvent.click(todo[1]);
    expect(todo[1].getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps Roleplay out of the tabs and the search, and shows it as panels", () => {
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    expect(screen.queryByRole("tab", { name: "Roleplay" })).toBeNull();
    expect(screen.getByRole("complementary", { name: "Roleplay" })).toBeTruthy();
    // Once folded above the search (phone), once in the side column (wide).
    // Each character's panel starts folded; its heading unfolds it.
    const shaw = screen.getAllByRole("button", { name: "Shaw", hidden: true });
    expect(shaw.map((b) => b.getAttribute("aria-expanded"))).toEqual(["false", "false"]);
    expect(screen.getAllByText("Kneel to talk")).toHaveLength(2);
    fireEvent.click(shaw[1]);
    expect(shaw[1].getAttribute("aria-expanded")).toBe("true");
    fireEvent.change(screen.getByLabelText("Find a play"), { target: { value: "kneel" } });
    expect(screen.getByText(/Nothing matches/)).toBeTruthy();
  });

  it("remembers a ticked to-do in this browser", () => {
    localStorage.clear();
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Fix the sheet", hidden: true })[0]);
    expect(localStorage.getItem("player-guide/Iggy/done")).toBe('["fix-the-sheet"]');
    cleanup();
    render(<PlayerGuide files={[guide("Iggy", 5, 5)]} />);
    const boxes = screen.getAllByRole("checkbox", { name: "Fix the sheet", hidden: true });
    expect(boxes.every((b) => (b as HTMLInputElement).checked)).toBe(true);
  });
});
