// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { PromptBook } from "./PromptBook.js";
import { Markdown } from "./MarkdownView.js";
import { promptBlocks } from "./prompt-blocks.js";

const voices = (md: string) => promptBlocks(md).map((b) => `${b.voice}:${b.label}`);

afterEach(cleanup);

describe("promptBlocks", () => {
  it("tags each bullet by its label, in plan order", () => {
    const md = [
      "- **What happens:** riders on the road.",
      "- **Tokens:** four riders at M27.",
      "- **Music:** cue 3.",
      '- **Read aloud, as she says it:** *"Tithe. Hunt."*',
      "- **When the wings open:**",
      "  - **The voice.** Every crystal speaks.",
      "- **Choice (Iggy):** cut her off or stay.",
      "- **What stays hidden:** what Sah is.",
    ].join("\n");
    expect(voices(md)).toEqual([
      "you:What happens",
      "do:Tokens",
      "do:Music",
      "say:Read aloud, as she says it",
      "watch:When the wings open",
      "choice:Iggy",
      "you:What stays hidden",
    ]);
    expect(promptBlocks(md)[4].md).toBe("- **The voice.** Every crystal speaks.");
  });

  it("reads a spoken line, a quote, and a bold condition by their shape", () => {
    const md = [
      '- **Vey, riding in:** *"Off the horses."*',
      "- **If they bring prisoners home** (Sennet), she lets them in.",
      "- **This also triggers `S2_ESCAPE`.**",
      "",
      '> *"Hoofbeats on the south road."*',
    ].join("\n");
    expect(voices(md)).toEqual([
      "say:Vey, riding in",
      "watch:If they bring prisoners home",
      "watch:",
      "say:",
    ]);
  });

  it("tags the clock moving as Time, so the DM says out loud that the day ends", () => {
    const md = [
      "- **Time passes:** the sun goes down on the road home. It's evening.",
      "- **Time:** a scene header field, not a clock change.",
    ].join("\n");
    expect(voices(md)).toEqual(["time:Time passes", "you:Time"]);
    expect(promptBlocks(md)[0].md).toBe("The sun goes down on the road home. It's evening.");
  });

  it("gives each speaker's quote its own Say block, named for who it's to", () => {
    const md = [
      "- **Say (Dip):**",
      "",
      '> *"Dip. One."*',
      ">",
      '> *"Two."*',
      "",
      "- **Say (Luci):**",
      "",
      '> *"Luci. Three."*',
    ].join("\n");
    expect(voices(md)).toEqual(["say:Dip", "say:Luci"]);
    expect(promptBlocks(md)[0].md).toBe('> *"Dip. One."*\n>\n> *"Two."*');
  });

  it("keeps a blank line between quotes that run together, so they stay two paragraphs", () => {
    expect(promptBlocks('> *"One."*\n\n> *"Two."*')[0].md).toBe('> *"One."*\n\n> *"Two."*');
  });

  it("runs plain bullets on into the DM block before them, and drops provenance", () => {
    const md = [
      "- **Committed 2026-11-11 (Jeff 2026-11-10).** Nella's next turn.",
      "- **The floor:** Sennet on Halsby.",
      "- Clatter on the roof.",
      "- Brask on the cart.",
    ].join("\n");
    const blocks = promptBlocks(md);
    expect(blocks.map((b) => `${b.voice}:${b.label}`)).toEqual(["you:", "you:The floor"]);
    expect(blocks[0].md).toBe("- Nella's next turn.");
    expect(blocks[1].md).toBe("Sennet on Halsby.\n- Clatter on the roof.\n- Brask on the cart.");
  });

  it("marks where a fight or a boss fight starts and ends, with or without a note", () => {
    expect(
      voices("- **Combat starts:** mid-fight\n- **Boss fight ends.**\n- **Fight ends:** the rout"),
    ).toEqual(["fight:Combat starts", "fight:Boss fight ends", "fight:Fight ends"]);
  });

  it("keeps Introduce and Private callouts whole, where the plan put them", () => {
    const md = [
      "- **Introduce:** Mara, sheriff",
      "  - **Look:** a star.",
      "- **Private (Dip):** Insight",
      "  - **15+:** You see it.",
    ].join("\n");
    expect(voices(md)).toEqual(["intro:", "private:"]);
  });
});

describe("PromptBook", () => {
  it("prints the voice in the gutter with the plan label under it, and Copy for a private message", () => {
    const el = render(
      <PromptBook
        prose={
          "- **Private (Dip):** Insight\n  - **15+:** You see it.\n- **Tokens:** Mara at the door."
        }
      />,
    ).container;
    const gut = [...el.querySelectorAll(".sr-pb-gut")].map((g) => g.textContent);
    expect(gut).toEqual(["Private→ Dip", "DoTokens"]);
    expect(el.querySelector<HTMLButtonElement>(".sr-copy")!.dataset.copy).toBe("You see it.");
  });

  it("gives a quoted line inside a DM note the read-aloud face", () => {
    const el = render(<Markdown md={'She says *"Hunt."* and *leaves*.'} spoken />).container;
    expect([...el.querySelectorAll("em")].map((e) => e.className)).toEqual(["sr-say", ""]);
  });
});
