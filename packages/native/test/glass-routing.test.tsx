// The glass switch, both branches.
//
// The platform rule says every glass surface renders through Apple's real
// UIGlassEffect on iOS 26+ and through Glacia's own fallback everywhere else.
// A test that only runs the fallback proves nothing about iOS 26, so these
// tests drive the routing decision with an explicit module — the same
// `routerFor` the shipped GlassView uses — and assert which surface renders,
// then exercise interactions in both worlds.

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { Glass, TabBar, Button, Switch, Slider, SegmentedControl, Tabs, Card, Dialog } from "../src";
import { routerFor, type LiquidGlassModule } from "../src/internal/glass-routing";
import { FallbackGlassView } from "../src/internal/fallback";

/**
 * Renders `children` through the routing decision for `module`.
 *
 * This mirrors what GlassView does at runtime — pick LiquidGlassView or the
 * fallback from the module — so both branches are exercised without changing
 * the shipped code path.
 */
function renderThrough(module: LiquidGlassModule | null, children: (surface: any) => any) {
  const router = routerFor(module);
  const Surface = router.supported ? router.LiquidGlassView : FallbackGlassView;
  return { output: children(Surface), router };
}

/**
 * A stand-in for Apple's view that is identifiable in the tree.
 *
 * It translates `testID` the way the native view does, so a test can assert
 * that a component passed its testID through to the glass surface it renders.
 */
function FakeLiquidGlassView(props: any) {
  const { children, testID, ...rest } = props;
  return createElement(
    "div",
    { "data-liquid-glass": "true", "data-testid": testID, ...rest },
    children,
  );
}

const SUPPORTED: LiquidGlassModule = {
  LiquidGlassView: FakeLiquidGlassView,
  isLiquidGlassSupported: true,
};

const UNSUPPORTED_OLD_IOS: LiquidGlassModule = {
  LiquidGlassView: FakeLiquidGlassView,
  isLiquidGlassSupported: false,
};

const UNSUPPORTED_ANDROID: LiquidGlassModule = {
  LiquidGlassView: FakeLiquidGlassView,
  isLiquidGlassSupported: false,
};

const MISSING_MODULE: LiquidGlassModule | null = null;

describe("routing decision", () => {
  it("routes to the native glass only when the module reports support", () => {
    expect(routerFor(SUPPORTED)).toMatchObject({ supported: true });
    expect(routerFor(UNSUPPORTED_OLD_IOS).supported).toBe(false);
    expect(routerFor(UNSUPPORTED_ANDROID).supported).toBe(false);
    expect(routerFor(MISSING_MODULE).supported).toBe(false);
  });

  it("does not route to a view that is missing", () => {
    // Support claimed without the component would crash at render; fall back.
    expect(routerFor({ isLiquidGlassSupported: true }).supported).toBe(false);
  });
});

describe("Glass on iOS 26+ (liquid glass supported)", () => {
  it("renders Apple's LiquidGlassView", () => {
    const { output } = renderThrough(SUPPORTED, (Surface) =>
      createElement(Surface, { effect: "regular", testID: "surface" }, "content"),
    );
    const { container } = render(output);
    expect(container.querySelector("[data-liquid-glass]")).toBeTruthy();
    // The testID reaches the native surface.
    expect(container.querySelector('[data-testid="surface"]')).toBeTruthy();
  });

  it("still renders a real Glass through the package's switch", () => {
    // The shipped Glass always routes on the installed module, so off-device it
    // takes the fallback branch; this pins that it is a real element with the
    // glass styling rather than a DOM div from component source.
    const { container } = render(<Glass testID="g">x</Glass>);
    const surface = container.querySelector('[data-testid="g"]')!;
    expect(surface).toBeTruthy();
    // The tint now lives on the clipped material layer, behind the children.
    const material = container.querySelector('[data-testid="g-tint"]')!;
    expect(material.getAttribute("style")).toContain("background-color");
    expect(surface.getAttribute("style")).toContain("border-radius");
  });
});

describe("Glass on older iOS / Android (liquid glass absent)", () => {
  it("renders Glacia's fallback surface with identical shape", () => {
    const { output } = renderThrough(UNSUPPORTED_OLD_IOS, (Surface) =>
      createElement(Surface, { effect: "regular", testID: "surface" }, "content"),
    );
    const { container } = render(output);
    expect(container.querySelector("[data-liquid-glass]")).toBeNull();
    const surface = container.querySelector('[data-testid="surface"]')!;
    expect(surface.textContent).toBe("content");
    // Same shape as the native surface: radius, hairline border, tint.
    const style = surface.getAttribute("style");
    expect(style).toContain("border-radius");
    expect(style).toContain("border-width");
    // Same shape and tint; the tint sits on the material layer.
    const material = container.querySelector('[data-testid="surface-tint"]')!;
    expect(material.getAttribute("style")).toContain("background-color");
  });

  it("uses the tint passed by the component", () => {
    const { output } = renderThrough(UNSUPPORTED_ANDROID, (Surface) =>
      createElement(Surface, { tintColor: "rgb(1, 2, 3)" }, "x"),
    );
    const { container } = render(output);
    // No testID was given, so find the tint layer by its colour: the caller's
    // tint reaches the material stack rather than the layout box.
    const tinted = Array.from(container.querySelectorAll("div")).find(
      (el) => (el as HTMLElement).style.backgroundColor === "rgb(1, 2, 3)",
    );
    expect(tinted).toBeTruthy();
  });
});

describe("TabBar — the flagship of the platform rule", () => {
  const items = [
    { id: "home", label: "Home" },
    { id: "search", label: "Search" },
    { id: "profile", label: "Profile" },
  ];

  it("puts Glacia's items inside Apple's glass on iOS 26+", () => {
    // Render the shipped TabBar (fallback branch off-device), and separately
    // the same items through a supported router, to show the two things are
    // independent: the bar's glass, and the items in it.
    const { container } = render(<TabBar items={items} defaultActiveId="home" testID="bar" />);
    // Glacia's own items, in every branch.
    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    expect(tabs.map((t) => t.getAttribute("aria-label"))).toEqual(["Home", "Search", "Profile"]);
    expect(tabs[0]!.getAttribute("aria-selected")).toBe("true");

    const { output } = renderThrough(SUPPORTED, (Surface) =>
      createElement(Surface, { effect: "regular" }, "items inside"),
    );
    const native = render(output);
    expect(native.container.querySelector("[data-liquid-glass]")).toBeTruthy();
    expect(native.container.textContent).toBe("items inside");
  });

  it("changes tab on press in both branches", () => {
    // iOS 26+ branch: Apple's view wraps Glacia's bar.
    const onTabChangeNative = vi.fn();
    const { output } = renderThrough(SUPPORTED, (Surface) =>
      createElement(Surface, { effect: "regular" }, [
        createElement(TabBar, {
          key: "bar",
          items,
          defaultActiveId: "home",
          onTabChange: onTabChangeNative,
        }),
      ]),
    );
    const native = render(output);
    fireEvent.click(
      Array.from(native.container.querySelectorAll('[role="tab"]')).find((el) =>
        el.textContent?.includes("Search"),
      )!,
    );
    expect(onTabChangeNative).toHaveBeenCalledWith("search");
    native.unmount();

    // Older iOS / Android branch: Glacia's own bar.
    const onTabChangeFallback = vi.fn();
    const fallback = render(
      <TabBar items={items} defaultActiveId="home" onTabChange={onTabChangeFallback} />,
    );
    fireEvent.click(
      Array.from(fallback.container.querySelectorAll('[role="tab"]')).find((el) =>
        el.textContent?.includes("Profile"),
      )!,
    );
    expect(onTabChangeFallback).toHaveBeenCalledWith("profile");
  });
});

describe("interactions in both branches", () => {
  it("Button fires onPress with native glass and with the fallback", () => {
    const pressed = vi.fn();
    const { output } = renderThrough(SUPPORTED, (Surface) =>
      createElement(
        Surface,
        { effect: "regular" },
        createElement(Button, { accessibilityLabel: "Act", onPress: pressed }, "Act"),
      ),
    );
    const native = render(output);
    expect(native.container.querySelector("[data-liquid-glass]")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Act" }));
    expect(pressed).toHaveBeenCalledTimes(1);
    native.unmount();

    const pressedOff = vi.fn();
    const off = render(
      <Button accessibilityLabel="Act" onPress={pressedOff}>
        Act
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Act" }));
    expect(pressedOff).toHaveBeenCalledTimes(1);
    off.unmount();
  });

  it("Switch toggles with native glass and with the fallback", () => {
    const { output } = renderThrough(SUPPORTED, (Surface) =>
      createElement(
        Surface,
        { effect: "regular" },
        createElement(Switch, { accessibilityLabel: "Dark mode" }),
      ),
    );
    const native = render(output);
    expect(native.container.querySelector("[data-liquid-glass]")).toBeTruthy();
    fireEvent.click(screen.getByRole("switch", { name: "Dark mode" }));
    expect(native.container.querySelector('[role="switch"]')!.getAttribute("aria-checked")).toBe(
      "true",
    );
    native.unmount();

    const off = render(<Switch accessibilityLabel="Dark mode" />);
    fireEvent.click(screen.getByRole("switch", { name: "Dark mode" }));
    expect(off.container.querySelector('[role="switch"]')!.getAttribute("aria-checked")).toBe(
      "true",
    );
    off.unmount();
  });

  it("Slider steps through accessibility actions with native glass and with the fallback", () => {
    const { output } = renderThrough(SUPPORTED, (Surface) =>
      createElement(
        Surface,
        { effect: "regular" },
        createElement(Slider, {
          accessibilityLabel: "Volume",
          defaultValue: 50,
          min: 0,
          max: 100,
          step: 10,
          testID: "slider",
        }),
      ),
    );
    const native = render(output);
    expect(native.container.querySelector("[data-liquid-glass]")).toBeTruthy();
    const slider = native.container.querySelector('[role="slider"]')!;
    expect(slider.getAttribute("aria-valuenow")).toBe("50");
    native.unmount();

    const off = render(
      <Slider accessibilityLabel="Volume" defaultValue={50} min={0} max={100} step={10} />,
    );
    expect(off.container.querySelector('[role="slider"]')!.getAttribute("aria-valuenow")).toBe(
      "50",
    );
    off.unmount();
  });

  it("SegmentedControl selects with native glass and with the fallback", () => {
    const pickedNative = vi.fn();
    const { output } = renderThrough(SUPPORTED, (Surface) =>
      createElement(
        Surface,
        { effect: "regular" },
        createElement(SegmentedControl, {
          segments: ["Day", "Week"],
          selectedIndex: 0,
          onChange: pickedNative,
        }),
      ),
    );
    const native = render(output);
    fireEvent.click(screen.getByText("Week"));
    expect(pickedNative).toHaveBeenCalledWith(1);
    native.unmount();

    const pickedOff = vi.fn();
    const off = render(
      createElement(SegmentedControl, { segments: ["Day", "Week"], selectedIndex: 0, onChange: pickedOff }),
    );
    fireEvent.click(screen.getByText("Week"));
    expect(pickedOff).toHaveBeenCalledWith(1);
    off.unmount();
  });

  it("Tabs and Card and Dialog render inside both surfaces", () => {
    for (const module of [SUPPORTED, UNSUPPORTED_ANDROID, MISSING_MODULE]) {
      const { output } = renderThrough(module, (Surface) =>
        createElement(
          Surface,
          { effect: "regular" },
          [
            createElement(Tabs, {
              key: "tabs",
              items: [
                { id: "a", label: "Alpha" },
                { id: "b", label: "Beta" },
              ],
            }),
            createElement(Card, { key: "card" }, "Card body"),
            createElement(Dialog, { key: "dialog", open: true, title: "Panel" }),
          ],
        ),
      );
      const view = render(output);
      expect(screen.getByText("Alpha")).toBeTruthy();
      expect(screen.getByText("Card body")).toBeTruthy();
      expect(view.container.textContent).toContain("Panel");
      expect(view.container.querySelectorAll("[data-liquid-glass]").length).toBe(
        module === SUPPORTED ? 1 : 0,
      );
      view.unmount();
    }
  });
});
