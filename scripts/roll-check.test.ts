// Tests for roll-check.ts. Run: node --test scripts/roll-check.test.ts
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { checkRolls, isSay, resolvePlan, RollCheckError, tableLines } from "./roll-check.ts";

const plan = [
  "---",
  "name: Test",
  "---",
  "## Combatants",
  "- **Shortsword** +4 to hit, 1d6+2 piercing",
  "## Scenes",
  "- **The thorns:** 2d4 for every 5 ft. Nella makes a CON save",
  "  (+1), DC 10.",
  "- **Fetch it:** she makes a DEX save to grab it.",
  '- **Say:** *"Roll 2d4 for the damage."*',
  "> *She takes 1d6 damage.*",
  "- **Odibli:** death saves as normal, no damage from the water.",
  "## Engine notes",
  "- 3d6 damage from the old draft",
].join("\n");

describe("checkRolls", () => {
  const report = checkRolls(plan);
  test("buttons a roll split across a wrapped line, numbered where the bullet starts", () => {
    assert.deepEqual(
      report.buttons.map((l) => [l.line_no, l.rolls.map((r) => r.expr)]),
      [[7, ["2d4", "1d20+1"]]],
    );
  });
  test("reports a named roll with no dice, but not death saves or 'no damage'", () => {
    assert.deepEqual(
      report.no_dice.map((l) => l.line_no),
      [9],
    );
  });
  test("skips Combatants (already buttoned), Engine notes and read-aloud text", () => {
    const seen = tableLines(plan).map((l) => l.line_no);
    assert.ok(!seen.includes(5) && !seen.includes(14));
  });
});

describe("isSay", () => {
  test("matches what the prompt book reads aloud", () => {
    assert.ok(isSay("> *quote*"));
    assert.ok(isSay('- **Say (Nella):** *"Go."*'));
    assert.ok(isSay("- **Read aloud:** the grass"));
    assert.ok(isSay('- *"Hold the line!"*'));
    assert.ok(!isSay("- **The thorns:** 2d4"));
  });
});

describe("resolvePlan", () => {
  const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
  test("rejects a bad session number or a missing file with the usage", () => {
    assert.throws(() => resolvePlan({ args: ["--session", "3x"], root }), RollCheckError);
    assert.throws(() => resolvePlan({ args: ["nope.md"], root }), RollCheckError);
    assert.throws(() => resolvePlan({ args: [], root }), RollCheckError);
  });
});
