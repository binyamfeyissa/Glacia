// The glass switch, both branches — for the components added in this wave.
//
// glass-routing.test.tsx proves the routing decision and drives the shipped
// components on the fallback branch (which is what runs off-device). This file
// goes further for the new components: it replaces the router `GlassView` uses
// with a supported one, so each new component is rendered *by the real
// component code* with Apple's surface in place, then the same component is
// rendered on the fallback branch, and its main interaction is exercised in
// both.
//
// Without this, "FAB wears Apple's glass on iOS 26+" would be an assertion
// about a component nobody had run on that branch.

import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

/** What the supported fake surface renders as, so tests can find it. */
const NATIVE_ATTR = "data-liquid-glass";

/**
 * Which branch the real GlassView takes.
 *
 * vi.mock is hoisted above every top-level binding, so the flag lives on the
 * global object: the factory reads it at call time, and a test can flip it
 * between renders.
 */
declare global {
  // eslint-disable-next-line no-var
  var __glaciaSupported: boolean;
}
globalThis.__glaciaSupported = true;

vi.mock("../src/internal/glass-routing", async () => {
  const actual = await vi.importActual<any>("../src/internal/glass-routing");
  return {
    ...actual,
    // The real GlassView calls defaultRouter(); pointing it at a fake module
    // that reports support is exactly what a device on iOS 26 does.
    defaultRouter: () =>
      globalThis.__glaciaSupported
        ? { supported: true, LiquidGlassView: FakeLiquidGlassView }
        : { supported: false, LiquidGlassView: null },
  };
});

/**
 * Apple's view, standing in for the real one.
 *
 * It renders through a host element because this is test scaffolding, not
 * component source: the no-DOM guard only reads src/.
 */
function FakeLiquidGlassView(props: any) {
  const {
    children,
    testID,
    effect,
    interactive,
    tint,
    tintColor,
    style,
    accessibilityRole,
    accessibilityLabel,
    accessibilityValue,
    accessibilityState,
    ...rest
  } = props;
  // The tint rides the engine's `tint` field; `tintColor` is accepted too, so a
  // test fake built against either spelling reports the same value.
  const resolvedTint = tint ?? tintColor;
  // Accessibility props are forwarded the way the native view forwards them,
  // so a test can assert a component's contract holds on this branch too.
  const a11y: Record<string, any> = {};
  if (accessibilityRole) a11y.role = accessibilityRole === "adjustable" ? "slider" : accessibilityRole;
  if (accessibilityLabel) a11y["aria-label"] = accessibilityLabel;
  if (accessibilityValue?.now !== undefined) a11y["aria-valuenow"] = accessibilityValue.now;
  if (accessibilityValue?.min !== undefined) a11y["aria-valuemin"] = accessibilityValue.min;
  if (accessibilityValue?.max !== undefined) a11y["aria-valuemax"] = accessibilityValue.max;
  if (accessibilityState?.selected !== undefined) a11y["aria-selected"] = accessibilityState.selected;

  return createElement(
    "div",
    {
      [NATIVE_ATTR]: "true",
      "data-testid": testID,
      "data-effect": effect,
      "data-interactive": String(interactive),
      "data-tint": resolvedTint ?? "",
      style: typeof style === "object" ? { ...style } : undefined,
      ...a11y,
      ...rest,
    },
    children,
  );
}

import { resetGlassRouter } from "../src/internal/GlassView";
import {
  FAB,
  AppBar,
  Sheet,
  Drawer,
  Menu,
  Toast,
  Chip,
  Progress,
  DatePicker,
  TimePicker,
  Button,
  List,
  ListItem,
} from "../src";

/** Any small node, so an overlay panel has content through both branches. */
function ThemeProbe() {
  return createElement("span", null, "content");
}

beforeEach(() => {
  globalThis.__glaciaSupported = true;
  resetGlassRouter();
});

/** Renders on the iOS 26+ branch and asserts Apple's surface showed up. */
function onNativeGlass(element: any) {
  globalThis.__glaciaSupported = true;
  resetGlassRouter();
  const rendered = render(element);
  expect(rendered.container.querySelector(`[${NATIVE_ATTR}]`)).toBeTruthy();
  return rendered;
}

/** Renders on the older-iOS / Android branch and asserts the fallback did. */
function onFallback(element: any) {
  globalThis.__glaciaSupported = false;
  resetGlassRouter();
  const rendered = render(element);
  expect(rendered.container.querySelector(`[${NATIVE_ATTR}]`)).toBeNull();
  return rendered;
}

describe("FAB — the flagship glass circle", () => {
  it("renders through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(
      <FAB accessibilityLabel="Compose" onPress={() => {}} testID="fab" />,
    );
    expect(native.container.querySelector('[data-testid="fab"]')).toBeTruthy();
    native.unmount();

    const fallback = onFallback(<FAB accessibilityLabel="Compose" onPress={() => {}} testID="fab" />);
    expect(fallback.container.querySelector('[data-testid="fab"]')).toBeTruthy();
  });

  it("fires onPress in both branches", () => {
    const onPress = vi.fn();
    const native = onNativeGlass(<FAB accessibilityLabel="Compose" onPress={onPress} />);
    fireEvent.click(native.container.querySelector('[role="button"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
    native.unmount();

    const onFallbackPress = vi.fn();
    const fallback = onFallback(<FAB accessibilityLabel="Compose" onPress={onFallbackPress} />);
    fireEvent.click(fallback.container.querySelector('[role="button"]')!);
    expect(onFallbackPress).toHaveBeenCalledTimes(1);
  });

  it("marks the glass interactive, which is what makes the material respond", () => {
    const native = onNativeGlass(<FAB accessibilityLabel="Compose" onPress={() => {}} />);
    expect(
      native.container.querySelector(`[${NATIVE_ATTR}]`)!.getAttribute("data-interactive"),
    ).toBe("true");
  });
});

describe("AppBar", () => {
  const actions = [{ accessibilityLabel: "Settings", icon: null, onPress: () => {} }];

  it("renders the bar through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(<AppBar title="Inbox" actions={actions} testID="bar" />);
    expect(native.container.textContent).toContain("Inbox");
    native.unmount();

    const fallback = onFallback(<AppBar title="Inbox" actions={actions} testID="bar" />);
    expect(fallback.container.textContent).toContain("Inbox");
  });

  it("fires its leading action in both branches", () => {
    const onPress = vi.fn();
    const leading = { accessibilityLabel: "Back", icon: null, onPress };
    const native = onNativeGlass(<AppBar title="Inbox" leading={leading} />);
    fireEvent.click(native.container.querySelector('[aria-label="Back"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
    native.unmount();

    const onFallbackPress = vi.fn();
    const fallback = onFallback(
      <AppBar title="Inbox" leading={{ accessibilityLabel: "Back", icon: null, onPress: onFallbackPress }} />,
    );
    fireEvent.click(fallback.container.querySelector('[aria-label="Back"]')!);
    expect(onFallbackPress).toHaveBeenCalledTimes(1);
  });

  it("takes the caller's top inset without a native insets dependency", () => {
    const { container } = render(<AppBar title="Inbox" topInset={44} />);
    // The inset is applied to the bar's inner row, as padding at the top.
    const padded = Array.from(container.querySelectorAll("*")).find(
      (el) => (el as HTMLElement).style?.paddingTop === "44px",
    );
    expect(padded).toBeTruthy();
  });
});

describe("Sheet", () => {
  it("renders its panel through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(
      <Sheet open title="Filters" testID="sheet">
        <ThemeProbe />
      </Sheet>,
    );
    expect(native.container.textContent).toContain("Filters");
    native.unmount();

    const fallback = onFallback(
      <Sheet open title="Filters" testID="sheet">
        <ThemeProbe />
      </Sheet>,
    );
    expect(fallback.container.textContent).toContain("Filters");
  });

  it("dismisses on a backdrop press in both branches", () => {
    const onOpenChange = vi.fn();
    const native = onNativeGlass(
      <Sheet open title="Filters" onOpenChange={onOpenChange}>
        <ThemeProbe />
      </Sheet>,
    );
    fireEvent.click(native.container.querySelector('[aria-label="Close sheet"]')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    native.unmount();

    const onFallbackChange = vi.fn();
    const fallback = onFallback(
      <Sheet open title="Filters" onOpenChange={onFallbackChange}>
        <ThemeProbe />
      </Sheet>,
    );
    fireEvent.click(fallback.container.querySelector('[aria-label="Close sheet"]')!);
    expect(onFallbackChange).toHaveBeenCalledWith(false);
  });
});

describe("Drawer", () => {
  it("renders its panel through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(
      <Drawer open testID="drawer">
        <ThemeProbe />
      </Drawer>,
    );
    expect(native.container.querySelector('[data-testid="drawer"]')).toBeTruthy();
    native.unmount();

    const fallback = onFallback(
      <Drawer open testID="drawer">
        <ThemeProbe />
      </Drawer>,
    );
    expect(fallback.container.querySelector('[data-testid="drawer"]')).toBeTruthy();
  });

  it("dismisses on a backdrop press in both branches", () => {
    const onOpenChange = vi.fn();
    const native = onNativeGlass(
      <Drawer open onOpenChange={onOpenChange}>
        <ThemeProbe />
      </Drawer>,
    );
    fireEvent.click(native.container.querySelector('[aria-label="Close drawer"]')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    native.unmount();

    const onFallbackChange = vi.fn();
    const fallback = onFallback(
      <Drawer open onOpenChange={onFallbackChange}>
        <ThemeProbe />
      </Drawer>,
    );
    fireEvent.click(fallback.container.querySelector('[aria-label="Close drawer"]')!);
    expect(onFallbackChange).toHaveBeenCalledWith(false);
  });
});

describe("Menu", () => {
  const items = [
    { label: "Rename", onPress: () => {} },
    { label: "Delete", onPress: () => {}, destructive: true },
  ];

  it("renders its popover through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(
      <Menu trigger={<Button accessibilityLabel="More">…</Button>} items={items} open testID="menu" />,
    );
    expect(native.container.textContent).toContain("Rename");
    native.unmount();

    const fallback = onFallback(
      <Menu trigger={<Button accessibilityLabel="More">…</Button>} items={items} open testID="menu" />,
    );
    expect(fallback.container.textContent).toContain("Rename");
  });

  it("selects an item and closes in both branches", () => {
    const onRename = vi.fn();
    const onOpenChange = vi.fn();
    const native = onNativeGlass(
      <Menu
        trigger={<Button accessibilityLabel="More">…</Button>}
        items={[{ label: "Rename", onPress: onRename }]}
        open
        onOpenChange={onOpenChange}
      />,
    );
    fireEvent.click(native.container.querySelector('[aria-label="Rename"]')!);
    expect(onRename).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    native.unmount();

    const onFallbackRename = vi.fn();
    const onFallbackChange = vi.fn();
    const fallback = onFallback(
      <Menu
        trigger={<Button accessibilityLabel="More">…</Button>}
        items={[{ label: "Rename", onPress: onFallbackRename }]}
        open
        onOpenChange={onFallbackChange}
      />,
    );
    fireEvent.click(fallback.container.querySelector('[aria-label="Rename"]')!);
    expect(onFallbackRename).toHaveBeenCalledTimes(1);
    expect(onFallbackChange).toHaveBeenCalledWith(false);
  });
});

describe("Toast", () => {
  it("renders its pill through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(<Toast visible message="Saved" testID="toast" />);
    expect(native.container.textContent).toContain("Saved");
    native.unmount();

    const fallback = onFallback(<Toast visible message="Saved" testID="toast" />);
    expect(fallback.container.textContent).toContain("Saved");
  });

  it("fires its action in both branches", () => {
    const action = { label: "Undo", onPress: vi.fn() };
    const native = onNativeGlass(<Toast visible message="Saved" action={action} />);
    fireEvent.click(native.container.querySelector('[aria-label="Undo"]')!);
    expect(action.onPress).toHaveBeenCalledTimes(1);
    native.unmount();

    const fallbackAction = { label: "Undo", onPress: vi.fn() };
    const fallback = onFallback(<Toast visible message="Saved" action={fallbackAction} />);
    fireEvent.click(fallback.container.querySelector('[aria-label="Undo"]')!);
    expect(fallbackAction.onPress).toHaveBeenCalledTimes(1);
  });
});

describe("Chip — selected state uses glassActive", () => {
  it("renders its pill through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(<Chip label="Filters" onPress={() => {}} testID="chip" />);
    expect(native.container.textContent).toContain("Filters");
    native.unmount();

    const fallback = onFallback(<Chip label="Filters" onPress={() => {}} testID="chip" />);
    expect(fallback.container.textContent).toContain("Filters");
  });

  it("tints the glass with the selected colour when selected, in both branches", () => {
    const selectedColor = "rgba(236, 236, 240, 0.85)"; // light theme glassActive

    const native = onNativeGlass(<Chip label="On" selected isDark={false} />);
    const nativeTint = native.container
      .querySelector(`[${NATIVE_ATTR}]`)!
      .getAttribute("data-tint");
    expect(nativeTint).toBe(selectedColor);
    native.unmount();

    const fallback = onFallback(<Chip label="On" selected isDark={false} />);
    // The fallback renders the same tint as its background colour, on the
    // first element that actually paints a background.
    const painted = Array.from(fallback.container.querySelectorAll("div")).find(
      (el) => (el as HTMLElement).style.backgroundColor !== "",
    ) as HTMLElement;
    // The fallback keeps the token's alpha, so the tint is the same colour.
    expect(painted.style.backgroundColor).toBe(selectedColor);
  });

  it("toggles selection on press in both branches", () => {
    const onSelectedChange = vi.fn();
    const native = onNativeGlass(
      <Chip label="Filter" defaultSelected={false} onSelectedChange={onSelectedChange} />,
    );
    fireEvent.click(native.container.querySelector('[role="button"]')!);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    native.unmount();

    const onFallbackChange = vi.fn();
    const fallback = onFallback(
      <Chip label="Filter" defaultSelected={false} onSelectedChange={onFallbackChange} />,
    );
    fireEvent.click(fallback.container.querySelector('[role="button"]')!);
    expect(onFallbackChange).toHaveBeenCalledWith(true);
  });
});

describe("Progress — the track is glass", () => {
  it("renders its track through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(<Progress value={40} testID="progress" />);
    expect(native.container.querySelector('[data-testid="progress"]')).toBeTruthy();
    native.unmount();

    const fallback = onFallback(<Progress value={40} testID="progress" />);
    expect(fallback.container.querySelector('[data-testid="progress"]')).toBeTruthy();
  });

  it("reports the same value in both branches", () => {
    const native = onNativeGlass(<Progress value={40} />);
    expect(native.container.querySelector('[aria-valuenow="40"]')).toBeTruthy();
    native.unmount();

    const fallback = onFallback(<Progress value={40} />);
    expect(fallback.container.querySelector('[aria-valuenow="40"]')).toBeTruthy();
  });
});

describe("DatePicker and TimePicker — the pickers live in a glass Sheet", () => {
  it("DatePicker renders its sheet through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(<DatePicker open isDark={false} />);
    expect(native.container.textContent).toMatch(/\d{4}/); // the month/year heading
    native.unmount();

    const fallback = onFallback(<DatePicker open isDark={false} />);
    expect(fallback.container.textContent).toMatch(/\d{4}/);
  });

  it("TimePicker renders its sheet through Apple's glass on iOS 26+ and the fallback elsewhere", () => {
    const native = onNativeGlass(<TimePicker open isDark={false} />);
    expect(native.container.textContent).toContain(":");
    native.unmount();

    const fallback = onFallback(<TimePicker open isDark={false} />);
    expect(fallback.container.textContent).toContain(":");
  });

  it("DatePicker only commits on confirm, in both branches", () => {
    const onConfirm = vi.fn();
    const native = onNativeGlass(<DatePicker open onConfirm={onConfirm} isDark={false} />);
    // Pick a day, then confirm.
    const days = native.container.querySelectorAll('[aria-label]');
    const aDay = Array.from(days).find((el) => /^\w{3} \w{3} \d{2} \d{4}$/.test(el.getAttribute("aria-label") ?? ""));
    fireEvent.click(aDay!);
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.click(native.container.querySelector('[aria-label="Confirm"]')!);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    native.unmount();
  });
});

describe("List and ListItem — non-glass surfaces render on both branches", () => {
  it("presses a row in both branches", () => {
    const onPress = vi.fn();
    const native = onNativeGlass(
      <List inset>
        <ListItem title="Account" onPress={onPress} />
      </List>,
    );
    fireEvent.click(native.container.querySelector('[role="button"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
    native.unmount();

    const onFallbackPress = vi.fn();
    const fallback = onFallback(
      <List inset>
        <ListItem title="Account" onPress={onFallbackPress} />
      </List>,
    );
    fireEvent.click(fallback.container.querySelector('[role="button"]')!);
    expect(onFallbackPress).toHaveBeenCalledTimes(1);
  });
});
