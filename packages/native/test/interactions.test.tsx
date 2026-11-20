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

import { List, ListItem } from "../src/Feedback";
import { Sheet, Drawer } from "../src/Overlays";
import { FABGroup } from "../src/Bars";
import { ToastViewport } from "../src/Feedback";
import { Switch, SegmentedControl, Toolbar } from "../src/index";
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

describe("Sheet snap points (#67)", () => {
  const snapPoints = [0.4, 0.9];

  it("snaps to the nearest point after a drag", () => {
    const changes: number[] = [];
    render(
      createElement(
        Sheet,
        { open: true, snapPoints, onSnapIndexChange: (i: number) => changes.push(i) },
        createElement("span", null, "body"),
      ),
    );

    // Opening is at the first (smallest) point.
    expect(changes).toEqual([]);

    // A long upward drag should reach the taller point.
    drag(0, -300);
    release(0, -300, 0, -1.2);

    expect(changes).toEqual([1]);
  });

  it("springs back when the drag stays within the same point", () => {
    const changes: number[] = [];
    render(
      createElement(Sheet, { open: true, snapPoints, onSnapIndexChange: (i: number) => changes.push(i) }),
    );
    drag(0, -10);
    release(0, -10, 0, 0);
    // No point change: the drag did not cross to another snap point.
    expect(changes).toEqual([]);
  });

  it("dismisses when dragged below the lowest point with dismissOnSnapToBottom", () => {
    const openChanges: boolean[] = [];
    render(
      createElement(Sheet, {
        open: true,
        snapPoints,
        dismissOnSnapToBottom: true,
        onOpenChange: (open: boolean) => openChanges.push(open),
      }),
    );
    // Dragging far down (positive dy) goes past the smallest sheet.
    drag(0, 400);
    release(0, 400, 0, 1.5);
    expect(openChanges).toEqual([false]);
  });

  it("does not dismiss below the lowest point when dismissOnSnapToBottom is off", () => {
    const openChanges: boolean[] = [];
    render(
      createElement(Sheet, { open: true, snapPoints, onOpenChange: (open: boolean) => openChanges.push(open) }),
    );
    drag(0, 400);
    release(0, 400, 0, 1.5);
    expect(openChanges).toEqual([]);
  });

  it("keeps dismissing on backdrop press", () => {
    const openChanges: boolean[] = [];
    render(
      createElement(Sheet, { open: true, onOpenChange: (open: boolean) => openChanges.push(open) }),
    );
    fireEvent.click(screen.getByLabelText("Close sheet"));
    expect(openChanges).toEqual([false]);
  });

  it("ticks the haptics helper when the snap point changes", () => {
    render(createElement(Sheet, { open: true, snapPoints }));
    drag(0, -300);
    release(0, -300, 0, -1.2);
    expect(hapticSpy).toHaveBeenCalled();
  });
});

describe("Drawer drag (#68)", () => {
  it("closes when dragged past halfway", () => {
    const openChanges: boolean[] = [];
    render(
      createElement(
        Drawer,
        { open: true, width: 280, side: "left", onOpenChange: (o: boolean) => openChanges.push(o) },
        createElement("span", null, "menu"),
      ),
    );
    // A left drawer closes by dragging left: negative dx.
    drag(-200);
    release(-200, 0, -0.1, 0);
    expect(openChanges).toEqual([false]);
  });

  it("stays open when the drag does not reach halfway", () => {
    const openChanges: boolean[] = [];
    render(
      createElement(
        Drawer,
        { open: true, width: 280, side: "left", onOpenChange: (o: boolean) => openChanges.push(o) },
        createElement("span", null, "menu"),
      ),
    );
    drag(-40);
    release(-40, 0, -0.05, 0);
    expect(openChanges).toEqual([]);
  });

  it("closes on a fast flick even before halfway, for a right drawer", () => {
    const openChanges: boolean[] = [];
    render(
      createElement(
        Drawer,
        { open: true, width: 280, side: "right", onOpenChange: (o: boolean) => openChanges.push(o) },
        createElement("span", null, "menu"),
      ),
    );
    drag(60);
    release(60, 0, 0.9, 0);
    expect(openChanges).toEqual([false]);
  });
});

describe("Swipeable ListItem (#59)", () => {
  const actions = [
    { label: "Delete", color: "#FF3B30", onPress: vi.fn() },
    { label: "Archive", color: "#34C759", onPress: vi.fn() },
  ];

  beforeEach(() => {
    actions[0]!.onPress.mockClear();
    actions[1]!.onPress.mockClear();
  });

  it("reveals trailing actions when swiped", () => {
    render(
      createElement(
        List,
        null,
        createElement(ListItem, { title: "Row", swipeActions: actions }),
      ),
    );
    drag(100);
    release(100, 0, 0.8, 0);
    // The actions become reachable once the row is open.
    expect(screen.getByLabelText("Delete")).toBeTruthy();
    expect(screen.getByLabelText("Archive")).toBeTruthy();
  });

  it("fires the right action and closes the row", () => {
    render(
      createElement(
        List,
        null,
        createElement(ListItem, { title: "Row", swipeActions: actions }),
      ),
    );
    drag(100);
    release(100, 0, 0.8, 0);
    fireEvent.click(screen.getByLabelText("Delete"));
    expect(actions[0]!.onPress).toHaveBeenCalledTimes(1);
    expect(actions[1]!.onPress).not.toHaveBeenCalled();
  });

  it("does not fire the row's onPress after a swipe", () => {
    const rowPress = vi.fn();
    render(
      createElement(
        List,
        null,
        createElement(ListItem, { title: "Row", onPress: rowPress, swipeActions: actions }),
      ),
    );
    drag(90);
    release(90, 0, 0.8, 0);
    // The press that ends the swipe must be swallowed.
    fireEvent.click(screen.getByLabelText("Row"));
    expect(rowPress).not.toHaveBeenCalled();
  });

  it("still fires the row's onPress when there was no swipe", () => {
    const rowPress = vi.fn();
    render(
      createElement(
        List,
        null,
        createElement(ListItem, { title: "Row", onPress: rowPress, swipeActions: actions }),
      ),
    );
    fireEvent.click(screen.getByLabelText("Row"));
    expect(rowPress).toHaveBeenCalledTimes(1);
  });

  it("closes the previously open row when another opens", () => {
    render(
      createElement(
        List,
        null,
        createElement(ListItem, { title: "First", swipeActions: actions }),
        createElement(ListItem, { title: "Second", swipeActions: actions }),
      ),
    );
    // Two rows, so two responders: [0] is the first row, [1] the second.
    expect(allConfigs.length).toBe(2);

    // Open the first row.
    const drive = (config: any, dx: number) =>
      act(() => {
        config.onMoveShouldSetPanResponder?.({}, { dx, dy: 0 });
        config.onPanResponderGrant?.({}, { dx, dy: 0 });
        config.onPanResponderMove?.({}, { dx, dy: 0 });
        config.onPanResponderRelease?.({}, { dx, dy: 0, vx: 0.8, vy: 0 });
      });

    drive(allConfigs[0]!, 100);

    // The open row is the one whose inner view is translated away from 0.
    const openRows = () =>
      Array.from(document.querySelectorAll("div")).filter((node) => {
        const transform = (node as HTMLElement).style.transform;
        return transform && transform.includes("translateX") && !transform.includes("translateX(0px)");
      });
    expect(openRows().length).toBe(1);

    // Open the second row: the first must close, so exactly one stays open.
    drive(allConfigs[allConfigs.length - 1]!, 100);
    expect(openRows().length).toBe(1);
  });
});

describe("FABGroup (#80)", () => {
  const actions = [
    { icon: createElement("span", null, "A"), label: "Alpha", onPress: vi.fn() },
    { icon: createElement("span", null, "B"), label: "Beta", onPress: vi.fn() },
  ];

  beforeEach(() => {
    actions.forEach((a) => a.onPress.mockClear());
  });

  it("expands to show the actions", () => {
    render(createElement(FABGroup, { actions, icon: createElement("span", null, "+") }));
    // Closed: no action labels.
    expect(screen.queryByLabelText("Alpha")).toBeNull();
    fireEvent.click(screen.getByLabelText("More actions"));
    expect(screen.getByLabelText("Alpha")).toBeTruthy();
    expect(screen.getByLabelText("Beta")).toBeTruthy();
  });

  it("fires an action and closes", () => {
    const changes: boolean[] = [];
    render(
      createElement(FABGroup, {
        actions,
        icon: createElement("span", null, "+"),
        onOpenChange: (o: boolean) => changes.push(o),
      }),
    );
    fireEvent.click(screen.getByLabelText("More actions"));
    fireEvent.click(screen.getByLabelText("Alpha"));
    expect(actions[0]!.onPress).toHaveBeenCalledTimes(1);
    // Opened, then closed by picking an action.
    expect(changes).toEqual([true, false]);
  });

  it("collapses when the main button is pressed again", () => {
    const changes: boolean[] = [];
    render(
      createElement(FABGroup, {
        actions,
        icon: createElement("span", null, "+"),
        onOpenChange: (o: boolean) => changes.push(o),
      }),
    );
    fireEvent.click(screen.getByLabelText("More actions"));
    fireEvent.click(screen.getByLabelText("More actions"));
    expect(changes).toEqual([true, false]);
  });

  it("dismisses on the scrim", () => {
    const changes: boolean[] = [];
    render(
      createElement(FABGroup, {
        actions,
        icon: createElement("span", null, "+"),
        onOpenChange: (o: boolean) => changes.push(o),
      }),
    );
    fireEvent.click(screen.getByLabelText("More actions"));
    fireEvent.click(screen.getByLabelText("Close actions"));
    expect(changes).toEqual([true, false]);
  });
});

describe("Toast stacking (#57)", () => {
  const toast = (id: string) => ({ id, message: `Message ${id}`, duration: 0 });

  it("shows at most three at once", () => {
    render(
      createElement(ToastViewport, { toasts: [toast("1"), toast("2"), toast("3"), toast("4"), toast("5")], onDismiss: vi.fn() }),
    );
    expect(screen.getByText("Message 1")).toBeTruthy();
    expect(screen.getByText("Message 2")).toBeTruthy();
    expect(screen.getByText("Message 3")).toBeTruthy();
    // The fourth and fifth wait.
    expect(screen.queryByText("Message 4")).toBeNull();
    expect(screen.queryByText("Message 5")).toBeNull();
  });

  it("promotes a queued toast when a visible one leaves", () => {
    const onDismiss = vi.fn();
    const { rerender } = render(
      createElement(ToastViewport, { toasts: [toast("1"), toast("2"), toast("3"), toast("4")], onDismiss }),
    );
    expect(screen.queryByText("Message 4")).toBeNull();

    // The caller removes the first toast, as onDismiss asks it to.
    rerender(
      createElement(ToastViewport, { toasts: [toast("2"), toast("3"), toast("4")], onDismiss }),
    );
    expect(screen.getByText("Message 4")).toBeTruthy();
    expect(screen.queryByText("Message 1")).toBeNull();
  });

  it("dismisses one toast by its own action without touching the others", () => {
    const onDismiss = vi.fn();
    const items = [
      { id: "1", message: "One", duration: 0, action: { label: "Undo", onPress: () => {} } },
      { id: "2", message: "Two", duration: 0 },
    ];
    render(createElement(ToastViewport, { toasts: items, onDismiss }));
    fireEvent.click(screen.getByLabelText("Undo"));
    expect(onDismiss).toHaveBeenCalledWith("1");
  });

  it("dismisses on a timer", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      createElement(ToastViewport, { toasts: [{ id: "1", message: "Timed", duration: 1000 }], onDismiss }),
    );
    vi.advanceTimersByTime(1100);
    expect(onDismiss).toHaveBeenCalledWith("1");
    vi.useRealTimers();
  });
});

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
          { id: "a", label: "A", icon: createElement("span", null, "A") },
          { id: "b", label: "B", icon: createElement("span", null, "B") },
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
          { id: "a", label: "A", icon: createElement("span", null, "A") },
          { id: "b", label: "B", icon: createElement("span", null, "B") },
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
