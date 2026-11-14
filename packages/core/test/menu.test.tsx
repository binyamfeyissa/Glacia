import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, test, vi } from "vitest";

import { Menu } from "../src";

const open = () => fireEvent.click(screen.getByRole("button", { name: "Options" }));

test("opens, focuses the first item and selects", () => {
  const onPin = vi.fn();
  render(
    <Menu
      aria-label="Options"
      items={[{ label: "Pin", onSelect: onPin }, "separator", { label: "Delete", destructive: true }]}
    />,
  );
  open();

  expect(screen.getByRole("menu", { name: "Options" })).toBeTruthy();
  expect(screen.getByRole("separator")).toBeTruthy();
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Pin" }));
  expect(screen.getByRole("menuitem", { name: "Delete" }).hasAttribute("data-destructive")).toBe(true);

  fireEvent.click(screen.getByRole("menuitem", { name: "Pin" }));
  expect(onPin).toHaveBeenCalledOnce();
});

test("closes on Escape and returns focus to the trigger", async () => {
  vi.useFakeTimers();
  render(<Menu aria-label="Options" items={[{ label: "Pin" }]} />);
  open();

  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Pin" }), { key: "Escape" });
  await act(() => vi.runAllTimersAsync());
  expect(screen.queryByRole("menu")).toBeNull();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Options" }));
  vi.useRealTimers();
});

test("skips disabled items with the arrow keys", () => {
  render(<Menu aria-label="Options" items={[{ label: "Pin" }, { label: "Rename", disabled: true }, { label: "Delete" }]} />);
  open();

  fireEvent.keyDown(screen.getByRole("menuitem", { name: "Pin" }), { key: "ArrowDown" });
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Delete" }));
});

describe("Menu stays on screen", () => {
  // jsdom reports a 0x0 viewport, so the geometry the component measures is
  // supplied here: a trigger near the bottom of a 800px-tall window.
  function stubGeometry({ top, left, menuHeight = 200, menuWidth = 200 }: {
    top: number; left: number; menuHeight?: number; menuWidth?: number;
  }) {
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1200);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top, bottom: top + 34, left, right: left + 34, width: 34, height: 34,
      x: left, y: top, toJSON: () => ({}),
    } as DOMRect);
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(menuWidth);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(menuHeight);
  }

  afterEach(() => vi.restoreAllMocks());

  it("flips upward when there is no room below", async () => {
    stubGeometry({ top: 740, left: 900 });
    const { container } = render(
      <Menu aria-label="Options" items={[{ label: "Copy" }, { label: "Delete", destructive: true }]} />,
    );
    await act(async () => {
      fireEvent.click(container.querySelector(".gl-button")!);
    });
    const card = container.querySelector(".gl-menu-card") as HTMLElement;
    expect(card.dataset.flip).toBeDefined();
  });

  it("does not flip when there is plenty of room below", async () => {
    stubGeometry({ top: 40, left: 900 });
    const { container } = render(
      <Menu aria-label="Options" items={[{ label: "Copy" }]} />,
    );
    await act(async () => {
      fireEvent.click(container.querySelector(".gl-button")!);
    });
    const card = container.querySelector(".gl-menu-card") as HTMLElement;
    expect(card.dataset.flip).toBeUndefined();
  });

  it("shifts left instead of overflowing the right edge", async () => {
    stubGeometry({ top: 40, left: 1170 });
    const { container } = render(
      <Menu aria-label="Options" items={[{ label: "Copy" }]} />,
    );
    await act(async () => {
      fireEvent.click(container.querySelector(".gl-button")!);
    });
    const card = container.querySelector(".gl-menu-card") as HTMLElement;
    const shift = parseFloat(card.style.getPropertyValue("--gl-menu-shift") || "0");
    expect(shift).toBeLessThan(0);
  });
});
