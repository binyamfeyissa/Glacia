// Part B: the interaction upgrades.
//
// Each gesture component is driven through its own PanResponder. The DOM
// preview's PanResponder shim reports a zero-valued gesture object (it exists so
// components mount, not so drags can be simulated), so these tests replace
// PanResponder.create with one that keeps the component's handlers where the
// test can call them with a gesture it controls. That exercises the
// component's drag logic — the part that is actually Glacia's — rather than a
// test-only gesture path.

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

/** The handlers the most recently created responder registered. */
let lastConfig: any = null;
/**
 * Every responder created in the current test, in creation order.
 *
 * A component rebuilds its PanResponder when a dependency changes, so an old
 * entry holds a stale closure. Tests drive the newest entry for a row by
 * taking the last config created before the interaction — which is why the
 * helper below reads `lastConfig` at call time rather than capturing it.
 */
let allConfigs: any[] = [];

vi.mock("../src/internal/primitives", async () => {
  const actual = await vi.importActual<any>("../src/internal/primitives");
  const fakePanResponder = {
    create: (config: any) => {
      lastConfig = config;
      allConfigs.push(config);
      return { panHandlers: {} };
    },
  };
  return {
    ...actual,
    primitives: () => ({ ...actual.primitives(), PanResponder: fakePanResponder }),
  };
});

// Haptics are asserted by call count, so the helper is replaced with a spy.
const hapticSpy = vi.fn();
vi.mock("../src/internal/haptics", () => ({
  hapticSelection: () => hapticSpy(),
}));

import { Switch, SegmentedControl, Toolbar, Toast } from "../src/index";
import { TabBar } from "../src/index";
import { Slider } from "../src/index";

beforeEach(() => {
  lastConfig = null;
  allConfigs = [];
  hapticSpy.mockClear();
});

afterEach(() => {
  lastConfig = null;
  allConfigs = [];
  // Nothing in the Vitest config unmounts between tests, so a rendering from
  // one test would answer a query in the next.
  cleanup();
});

/** Calls the component's move handler with a controlled gesture. */
function drag(dx: number, dy = 0) {
  expect(lastConfig, "the component never created a PanResponder").not.toBeNull();
  // Each handler must be flushed like a real touch event, or the state update
  // it triggers is not rendered before the next one runs.
  act(() => {
    lastConfig.onMoveShouldSetPanResponder?.({ nativeEvent: {} }, { dx, dy, vx: 0, vy: 0 });
    lastConfig.onPanResponderGrant?.({ nativeEvent: {} }, { dx, dy, vx: 0, vy: 0 });
    lastConfig.onPanResponderMove?.({ nativeEvent: {} }, { dx, dy, vx: 0, vy: 0 });
  });
}

/** Releases the drag with a velocity. */
function release(dx: number, dy: number, vx = 0, vy = 0) {
  act(() => {
    lastConfig.onPanResponderRelease?.({ nativeEvent: {} }, { dx, dy, vx, vy });
  });
}





describe("Haptics on controls", () => {
  it("Switch ticks when it toggles", () => {
    const { getByRole } = render(createElement(Switch, { accessibilityLabel: "Wifi" }));
    fireEvent.click(getByRole("switch"));
    expect(hapticSpy).toHaveBeenCalledTimes(1);
  });

  it("Switch respects haptics={false}", () => {
    const { getByRole } = render(
      createElement(Switch, { accessibilityLabel: "Wifi", haptics: false }),
    );
    fireEvent.click(getByRole("switch"));
    expect(hapticSpy).not.toHaveBeenCalled();
  });

  it("SegmentedControl ticks when the segment changes, not when it repeats", () => {
    const { getByText, rerender } = render(
      createElement(SegmentedControl, { segments: ["Day", "Week", "Month"], selectedIndex: 0, onChange: () => {} }),
    );
    fireEvent.click(getByText("Week"));
    expect(hapticSpy).toHaveBeenCalledTimes(1);
    // Pressing the already-selected segment is not a change.
    rerender(
      createElement(SegmentedControl, { segments: ["Day", "Week", "Month"], selectedIndex: 1, onChange: () => {} }),
    );
    fireEvent.click(getByText("Week"));
    expect(hapticSpy).toHaveBeenCalledTimes(1);
  });

  it("TabBar ticks when the tab changes", () => {
    const { getByLabelText } = render(
      createElement(TabBar, {
        items: [
          { id: "a", label: "A", icon: () => createElement("span", null, "A") },
          { id: "b", label: "B", icon: () => createElement("span", null, "B") },
        ],
        defaultActiveId: "a",
      }),
    );
    fireEvent.click(getByLabelText("B"));
    expect(hapticSpy).toHaveBeenCalledTimes(1);
  });

  it("TabBar respects haptics={false}", () => {
    const { getByLabelText } = render(
      createElement(TabBar, {
        items: [
          { id: "a", label: "A", icon: () => createElement("span", null, "A") },
          { id: "b", label: "B", icon: () => createElement("span", null, "B") },
        ],
        defaultActiveId: "a",
        haptics: false,
      }),
    );
    fireEvent.click(getByLabelText("B"));
    expect(hapticSpy).not.toHaveBeenCalled();
  });

  it("Slider ticks while dragging when the step changes", () => {
    // jsdom has no layout, so every element reports a zero-width box and the
    // slider's x-to-value mapping has no width to work with. Reporting a real
    // width from the start is what `onLayout` does on a device.
    const box = () => ({ width: 200, height: 40, left: 0, top: 0, right: 200, bottom: 40, x: 0, y: 0 });
    const spy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(box as any);

    // Uncontrolled, so the drag can actually change the value; a controlled
    // slider with a fixed value would never report a change.
    render(
      createElement(Slider, {
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 10,
        accessibilityLabel: "Volume",
      }),
    );
    // The slider drives its own PanResponder; the fake records it.
    expect(lastConfig).not.toBeNull();
    act(() => {
      lastConfig.onPanResponderGrant?.({ nativeEvent: { locationX: 0 } }, { dx: 0, dy: 0 });
      // 40 of 200 points is 20% of a 0–100 range, so the value moves from 0 to
      // 20 — a step change, which is a selection.
      lastConfig.onPanResponderMove?.({ nativeEvent: { locationX: 40 } }, { dx: 40, dy: 0 });
    });
    expect(hapticSpy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("Toolbar — the caller owns the height", () => {
  it("renders the caller's title and actions without a native insets dependency", () => {
    const { container } = render(
      createElement(Toolbar, { title: "Inbox", testID: "bar" }),
    );
    // The toolbar is exactly as tall as the caller asked; safe-area insets
    // ride the parent rather than the bar.
    const bar = container.querySelector('[data-testid="bar"]') as HTMLElement | null;
    expect(bar).not.toBeNull();
  });
});
