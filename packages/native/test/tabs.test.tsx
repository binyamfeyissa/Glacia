import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Tabs } from "../src";

const ITEMS = [
  { id: "components", label: "Components" },
  { id: "blocks", label: "Blocks" },
  { id: "docs", label: "Docs" },
];

afterEach(() => cleanup());

describe("Native Tabs", () => {
  it("renders one tab per item", () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getByText("Components")).toBeTruthy();
    expect(screen.getByText("Blocks")).toBeTruthy();
    expect(screen.getByText("Docs")).toBeTruthy();
  });

  it("marks the first tab active by default", () => {
    const { container } = render(<Tabs items={ITEMS} />);
    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    expect(tabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
  });

  it("reports the chosen value", () => {
    const onValueChange = vi.fn();
    render(<Tabs items={ITEMS} onTabChange={onValueChange} />);
    fireEvent.click(screen.getByText("Blocks"));
    expect(onValueChange).toHaveBeenCalledWith("blocks");
  });

  it("follows a controlled value", () => {
    const { container } = render(<Tabs items={ITEMS} activeId="docs" />);
    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    expect(tabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["false", "false", "true"]);
  });

  it("carries tab semantics for screen readers", () => {
    const { container } = render(<Tabs items={ITEMS} />);
    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    expect(tabs).toHaveLength(3);
    // Every tab is named, so a screen reader can announce which is selected.
    expect(tabs.map((t) => t.getAttribute("aria-label"))).toEqual([
      "Components",
      "Blocks",
      "Docs",
    ]);
  });
});
