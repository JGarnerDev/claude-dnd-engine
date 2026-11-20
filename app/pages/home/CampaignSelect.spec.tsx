// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { CampaignSelect } from "./CampaignSelect.js";

describe("CampaignSelect", () => {
  const campaigns = [
    { slug: "strahd", label: "Curse of Strahd" },
    { slug: "homebrew", label: "Homebrew Campaign" },
  ];
  const mount = (current: string, onChange = vi.fn(), hidden?: boolean) =>
    render(
      <CampaignSelect
        campaigns={campaigns}
        current={current}
        onChange={onChange}
        hidden={hidden}
      />,
    ).container.querySelector<HTMLSelectElement>(".chart-campaign-select")!;

  it('renders one option per campaign, in order, with no "all" option', () => {
    const sel = mount("strahd");
    expect([...sel.options].map((o) => o.value)).toEqual(["strahd", "homebrew"]);
    expect([...sel.options].map((o) => o.textContent)).toEqual([
      "Curse of Strahd",
      "Homebrew Campaign",
    ]);
    expect(sel.getAttribute("aria-label")).toBe("Campaign");
  });

  it("reflects the current selection", () => {
    expect(mount("homebrew").value).toBe("homebrew");
  });

  it("emits the chosen slug on change", () => {
    const onChange = vi.fn();
    fireEvent.change(mount("strahd", onChange), { target: { value: "homebrew" } });
    expect(onChange).toHaveBeenCalledWith("homebrew");
  });

  it("can be hidden", () => {
    expect(mount("strahd", vi.fn(), true).hidden).toBe(true);
    expect(mount("strahd").hidden).toBe(false);
  });
});
