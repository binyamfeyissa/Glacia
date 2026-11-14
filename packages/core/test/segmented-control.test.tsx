import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { SegmentedControl, TabBar } from "../src";

afterEach(() => vi.restoreAllMocks());

const items = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

test("is a group of radios, one checked, chosen by click", () => {
  const onValueChange = vi.fn();
  render(<SegmentedControl aria-label="Range" items={items} defaultValue="day" onValueChange={onValueChange} />);
  expect(screen.getByRole("radiogroup", { name: "Range" })).toBeTruthy();
  expect(screen.getAllByRole("radio").map((radio) => radio.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);

  fireEvent.click(screen.getByRole("radio", { name: "Month" }));
  expect(onValueChange).toHaveBeenLastCalledWith("month");
  expect(screen.getByRole("radio", { name: "Month" }).getAttribute("aria-checked")).toBe("true");
});

test("moves the choice with arrow keys, keeping one segment in the tab order", () => {
  render(<SegmentedControl aria-label="Range" items={items} defaultValue="week" />);
  expect(screen.getAllByRole("radio").map((radio) => radio.tabIndex)).toEqual([-1, 0, -1]);

  fireEvent.keyDown(screen.getByRole("radio", { name: "Week" }), { key: "ArrowRight" });
  expect(screen.getByRole("radio", { name: "Month" }).getAttribute("aria-checked")).toBe("true");
  expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Month" }));
  expect(screen.getAllByRole("radio").map((radio) => radio.tabIndex)).toEqual([-1, -1, 0]);
});

test("sits on the tab bar's glass, with a thumb a tab bar doesn't have", () => {
  const { container } = render(
    <>
      <SegmentedControl aria-label="Range" items={items} defaultValue="day" />
      <TabBar aria-label="Tabs" items={items} defaultValue="day" />
    </>,
  );
  const control = container.querySelector(".gl-segmented")!;
  expect(control.querySelector(":scope > .gl-glass.gl-tab-bar-glass")).not.toBeNull();
  expect(control.querySelector(".gl-segmented-thumb")).not.toBeNull();
  const bar = container.querySelector(".gl-tab-bar")!;
  expect(bar.querySelector(":scope > .gl-glass.gl-tab-bar-glass")).not.toBeNull();
  expect(bar.querySelector(".gl-segmented-thumb")).toBeNull();
});

test("boxes each label, and its copies, to centre it by its letters", () => {
  const { container } = render(<SegmentedControl aria-label="Range" items={items} defaultValue="day" />);
  // The label, the lens's copy and the tint's copy: the same box, so they line up.
  expect(container.querySelectorAll(".gl-tab-text")).toHaveLength(items.length * 3);
  expect(screen.getByRole("radio", { name: "Week" }).querySelector(".gl-tab-text")!.textContent).toBe("Week");
});

test("held, the thumb lifts with the lens, and the tint's labels stay in line through its inset", async () => {
  render(<SegmentedControl aria-label="Range" items={items} defaultValue="week" />);
  const control = screen.getByRole("radiogroup");
  const thumb = control.querySelector<HTMLElement>(".gl-segmented-thumb")!;
  const lens = control.querySelector<HTMLElement>(".gl-tab-lens")!;
  const row = control.querySelector<HTMLElement>(".gl-tab-row")!;
  // Three 84px segments with no padding, the thumb 2px in from each: 80 by 28.
  control.style.padding = "0px";
  control.style.setProperty("--gl-thumb-inset", "2px");
  control.style.setProperty("--gl-lens-grow-x", "24px");
  control.style.setProperty("--gl-lens-grow-y", "16px");
  vi.spyOn(lens, "offsetHeight", "get").mockReturnValue(28);
  vi.spyOn(control, "clientWidth", "get").mockReturnValue(252);
  vi.spyOn(control, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 252, 32));
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
  const pointer = { pointerId: 3, pointerType: "touch", isPrimary: true, button: 0, clientX: 126, clientY: 16 };

  fireEvent.pointerDown(screen.getByRole("radio", { name: "Week" }), pointer);
  expect(control.hasAttribute("data-lifted")).toBe(true);
  // 80 + 24 wide and 28 + 16 tall.
  expect(lens.style.transform).toBe("translateX(84px) scale(1.3, 1.5714285714285714)");
  expect(thumb.style.transform).toBe(lens.style.transform);
  // Undo the scale about the tint's centre, which sits 2px in from the row.
  const [, sx, sy, tx, ty] = /scale\(([\d.]+), ([\d.]+)\) translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(row.style.transform)!.map(Number);
  expect(sx).toBeCloseTo(1 / 1.3);
  expect(sy).toBeCloseTo(1 / (1 + 16 / 28));
  expect(tx).toBeCloseTo(-84 + 0.3 * (2 + 40));
  expect(ty).toBeCloseTo((16 / 28) * (2 + 14));

  fireEvent.pointerUp(screen.getByRole("radio", { name: "Week" }), pointer);
  await act(async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
  expect(control.hasAttribute("data-lifted")).toBe(false);
  expect(thumb.style.transform).toBe("translateX(84px) scale(1, 1)");
});

describe("Segmented control layout", () => {
  const css = readFileSync(resolve(__dirname, "../src/styles.css"), "utf-8");

  it("lets segments share the track instead of a fixed width", () => {
    // A fixed 84px per segment gave a short label the same width as a long one.
    const block = css.slice(
      css.indexOf("\n.gl-segmented > .gl-tab {"),
      css.indexOf("}", css.indexOf("\n.gl-segmented > .gl-tab {")),
    );
    expect(block).toContain("flex: 1 1 0");
    expect(block).toContain("min-width: 0");
  });

  it("is a capsule and can shrink inside a narrow container", () => {
    const block = css.slice(
      css.indexOf("\n.gl-segmented {"),
      css.indexOf("}", css.indexOf("\n.gl-segmented {")),
    );
    expect(block).toContain("border-radius: var(--gl-pill)");
    expect(block).toContain("max-width: 100%");
  });

  it("ellipsises a label too long for its segment", () => {
    expect(css).toMatch(
      /\.gl-segmented > \.gl-tab[\s\S]{0,200}text-overflow: ellipsis/,
    );
  });
});
