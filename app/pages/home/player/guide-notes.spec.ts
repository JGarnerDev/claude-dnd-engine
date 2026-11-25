import { describe, expect, it } from "vitest";
import { splitNotes } from "./guide-notes.js";
import { splitSections } from "./guide-sections.js";

const BODY = `
## Turn

- **Attack:** with the rapier.

## Notes

### To do

- **Pick a Fighting Style:** Defense or Blessed Warrior.
- **Ask Ben (at the table):** does Oathcaller count as a rapier?

### Remember

- **One slot per turn.** A cantrip is still fine.
- Short rests take an hour.

## Roleplay

### Shaw

- **Kneel to talk:** never joke about his height.
`;

describe("splitNotes", () => {
  const { sections, panels, roleplay } = splitNotes(splitSections(BODY).sections);

  it("takes Notes out of the tabs", () => {
    expect(sections.map((s) => s.title)).toEqual(["Turn"]);
  });

  it("makes one Roleplay panel per character, never a checklist", () => {
    expect(roleplay.map((p) => [p.title, p.checklist])).toEqual([["Shaw", false]]);
    expect(roleplay[0].notes[0]).toEqual({
      id: "kneel-to-talk",
      lead: "Kneel to talk",
      detail: "never joke about his height.",
      atTable: false,
    });
  });

  it("makes one panel per group, and only To do a checklist", () => {
    expect(panels.map((p) => [p.title, p.checklist])).toEqual([
      ["To do", true],
      ["Remember", false],
    ]);
  });

  it("strips the at-the-table mark from the lead and flags it", () => {
    expect(panels[0].notes[1]).toEqual({
      id: "ask-ben",
      lead: "Ask Ben",
      detail: "does Oathcaller count as a rapier?",
      atTable: true,
    });
    expect(panels[0].notes[0].atTable).toBe(false);
  });

  it("keeps a bullet with no lead as a lead with no detail", () => {
    expect(panels[1].notes[1]).toMatchObject({ lead: "Short rests take an hour.", detail: "" });
  });

  it("has no panels when the guide has no Notes or Roleplay", () => {
    const none = splitNotes(splitSections("## Turn\n\n- **A:** b").sections);
    expect([none.panels, none.roleplay]).toEqual([[], []]);
  });
});
