import { describe, expect, it } from "vitest";
import { fieldLine, splitFieldLines } from "./field-lines.js";

describe("fieldLine", () => {
  it("reads a whole line of fields, trailing pipe or not", () => {
    expect(fieldLine("Campaign: [[Curse of Strahd]] | Player: [[Ben]] |")).toEqual([
      ["Campaign", "[[Curse of Strahd]]"],
      ["Player", "[[Ben]]"],
    ]);
    expect(fieldLine("Race: Orc | Background: [[Sage]]")).toEqual([
      ["Race", "Orc"],
      ["Background", "[[Sage]]"],
    ]);
  });

  it("rejects a line with any part that is not a field", () => {
    expect(fieldLine("Class: Barbarian | and then some prose")).toBeNull();
    expect(fieldLine("Note: one field only")).toBeNull();
    expect(fieldLine("| a | b |")).toBeNull();
    expect(fieldLine("> **Reliability:** x | y: z")).toBeNull();
  });
});

describe("splitFieldLines", () => {
  it("cuts a body into markdown and field blocks, joining adjacent field lines", () => {
    const body = [
      "Campaign: CoS | Player: Ben |",
      "",
      "> quote",
      "",
      "Class: Barbarian | Race: Orc |",
      "Alignment: Good | Age: 46",
      "",
      "## Appearance",
    ].join("\n");
    const parts = splitFieldLines(body);
    expect(parts.map((p) => p.kind)).toEqual(["fields", "md", "fields", "md"]);
    expect(parts[2]).toEqual({
      kind: "fields",
      items: [
        ["Class", "Barbarian"],
        ["Race", "Orc"],
        ["Alignment", "Good"],
        ["Age", "46"],
      ],
    });
  });

  it("leaves fenced code alone", () => {
    const body = "```\nA: b | C: d\n```";
    expect(splitFieldLines(body)).toEqual([{ kind: "md", md: body }]);
  });
});
