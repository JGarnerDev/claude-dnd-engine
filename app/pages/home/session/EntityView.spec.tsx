// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { EntityBody, EntityHeader } from "./EntityView.js";
import { fetchEntity } from "./entity-fetch.js";
import { fixture } from "./fixture-data.js";

const sable = fixture().entities[0];

afterEach(cleanup);

describe("EntityHeader", () => {
  it("shows layer, tags, description, quick-ref and an editor link", () => {
    const el = render(
      <EntityHeader e={sable} root="C:/repo" quickRef="- **Voice:** warm" />,
    ).container;
    expect(el.querySelector(".sr-layer")!.textContent).toBe("pool");
    expect([...el.querySelectorAll(".sr-chiptag")].map((c) => c.textContent)).toEqual([
      "character",
      "npc",
    ]);
    expect(el.querySelector(".sr-quickref strong")!.textContent).toBe("Voice:");
    expect(el.querySelector(".sr-openfile")!.getAttribute("href")).toBe(
      "vscode://file/C:/repo/data/characters/Sable%20Wren.md",
    );
  });
});

describe("EntityBody", () => {
  it("renders fields and body markdown", () => {
    const el = render(
      <EntityBody text={"---\nname: x\nstate: active\n---\nShe keeps **score**."} />,
    ).container;
    expect(el.querySelector(".sr-fields dd")!.textContent).toBe("active");
    expect(el.querySelector(".sr-md strong")!.textContent).toBe("score");
  });
});

describe("fetchEntity", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches once per path and caches", async () => {
    const f = vi.fn(async () => new Response("body", { status: 200 }));
    vi.stubGlobal("fetch", f);
    expect(await fetchEntity("data/a.md")).toBe("body");
    expect(await fetchEntity("data/a.md")).toBe("body");
    expect(f).toHaveBeenCalledTimes(1);
    expect(f).toHaveBeenCalledWith("/__entity?path=data%2Fa.md");
  });
});
