import { describe, expect, it } from "vitest";
import {
  entityMatch,
  excerptAround,
  findMentions,
  makeResolver,
  mentionIndex,
  searchEntities,
} from "./entities.js";
import type { EntityRef } from "./types.js";
import { fixture } from "./fixture-data.js";

const ents = fixture().entities;
const ent = (name: string, path: string, extra: Partial<EntityRef> = {}): EntityRef => ({
  name,
  type: "character",
  subtype: "",
  description: "",
  campaign: "",
  aliases: [],
  path,
  ...extra,
});

describe("makeResolver", () => {
  it("resolves by name, alias and file stem, case-insensitively", () => {
    const r = makeResolver(ents);
    expect(r("sable wren")?.name).toBe("Sable Wren");
    expect(r("Iggadron Wallaed")?.name).toBe("Iggy");
    expect(r("Strahd")?.name).toBe("Strahd von Zarovich");
    expect(r("Nobody")).toBeUndefined();
  });

  it("prefers historian over data when names collide", () => {
    const r = makeResolver([ent("Mara", "data/x/Mara.md"), ent("Mara", "historian/x/Mara.md")]);
    expect(r("Mara")?.path).toBe("historian/x/Mara.md");
  });
});

describe("findMentions", () => {
  const idx = mentionIndex(ents, (e) => e.campaign === "strahd");

  it("finds full names and unambiguous first names, in order", () => {
    expect(findMentions("Ashford burns. Sable's eyes keep score.", idx).map((e) => e.name)).toEqual(
      ["Ashford", "Sable Wren"],
    );
  });

  it("ignores lowercase words and excluded entities", () => {
    expect(findMentions("the ashford road; Strahd von Zarovich waits", idx)).toEqual([]);
  });

  it("never surfaces rules vocabulary from a plain mention", () => {
    const rules = mentionIndex(
      [ent("Wizard", "data/classes/Wizard.md", { type: "class" })],
      () => false,
    );
    expect(findMentions("Gnome Wizard", rules)).toEqual([]);
  });

  it("drops a first name shared by two characters", () => {
    const two = mentionIndex(
      [ent("Mara Tull", "data/a.md"), ent("Mara Vess", "data/b.md")],
      () => false,
    );
    expect(findMentions("Mara arrives", two)).toEqual([]);
    expect(findMentions("Mara Tull arrives", two).map((e) => e.name)).toEqual(["Mara Tull"]);
  });
});

describe("searchEntities", () => {
  it("ranks name prefix over description hits", () => {
    expect(searchEntities("a", ents)[0].name).toBe("Ashford");
    expect(searchEntities("lioness", ents).map((e) => e.name)).toEqual(["Sable Wren"]);
    expect(searchEntities("  ", ents)).toEqual([]);
  });
});

describe("entityMatch", () => {
  const e = ent("Nella", "historian/characters/Nella.md", {
    aliases: ["The Bowwoman"],
    description: "Bandit lieutenant, a human ranger who rides with the griffon",
  });
  it("names the field that matched, in searchEntities' order", () => {
    expect(entityMatch(e, "nel")).toEqual({ field: "name" });
    expect(entityMatch(e, "bowwoman")).toEqual({ field: "alias", text: "The Bowwoman" });
    expect(entityMatch(e, "griffon")).toEqual({ field: "description", text: e.description });
    expect(entityMatch(e, "dragon")).toBeNull();
  });
});

describe("excerptAround", () => {
  it("keeps short leads whole and cuts long ones at a word", () => {
    expect(excerptAround("A griffon", "griffon")).toBe("A griffon");
    expect(
      excerptAround("Bandit lieutenant, a human ranger who rides with the griffon", "griffon", {
        beforeChars: 10,
      }),
    ).toBe("…with the griffon");
  });
});
