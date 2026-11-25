import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadGuides } from "./player-guide-plugin.js";

let root = "";
afterEach(() => rmSync(root, { recursive: true, force: true }));

function repo(files: Record<string, string>): string {
  root = mkdtempSync(join(tmpdir(), "pg-"));
  for (const [rel, text] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(join(abs, ".."), { recursive: true });
    writeFileSync(abs, text);
  }
  return root;
}

describe("loadGuides", () => {
  it("reads guides, skips templates and attaches the PC file's level", () => {
    const r = repo({
      "meta/player-guides/_template.md": "---\npc: x\n---\n",
      "meta/player-guides/Iggy.md": '---\npc: "Iggy"\nlevel: 5\n---\nbody',
      "historian/characters/pcs/Iggy.md": "---\nlevel: 6\n---\n",
    });
    const guides = loadGuides(r);
    expect(guides.map((g) => [g.file, g.pcLevel])).toEqual([["Iggy.md", 6]]);
    expect(guides[0].text).toContain("body");
  });

  it("attaches the completed sessions the PC was present for, flat or in a folder", () => {
    const session = (n: number, state: string, pcs: string[]) =>
      [
        "---",
        `state: ${state}`,
        `session_number: ${n}`,
        "pcs_present:",
        ...pcs.map((p) => `  - "${p}"`),
        "---",
        "",
      ].join("\n");
    const r = repo({
      "meta/player-guides/Iggy.md": '---\npc: "Iggy"\n---\n',
      "historian/sessions/Session 02 B.md": session(2, "completed", ["Luci"]),
      "historian/sessions/Session 03 C/Session 03 C.md": session(3, "completed", ["Iggy"]),
      "historian/sessions/Session 01 A.md": session(1, "completed", ["Iggy", "Luci"]),
      "historian/sessions/Session 04 D.md": session(4, "planned", ["Iggy"]),
      "historian/sessions/_stats.md": "---\n---\n",
    });
    expect(loadGuides(r)[0].sessionsPlayed).toEqual([1, 3]);
  });

  it("gives a null level when the PC file is missing", () => {
    const r = repo({ "meta/player-guides/Shaw.md": "---\npc: Shaw\n---\n" });
    expect(loadGuides(r)[0].pcLevel).toBeNull();
  });

  it("returns no guides when the folder is missing", () => {
    expect(loadGuides(repo({ "x.md": "" }))).toEqual([]);
  });
});
