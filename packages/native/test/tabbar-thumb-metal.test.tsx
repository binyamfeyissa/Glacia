// TabBar tint + pill/thumb rest lens (0.6.5).
//
// On the owner's iPhone (iOS 17, Metal tier) two things read wrong:
// - the bar was uniformly dark — Glacia passed its own opaque theme glass
//   (`rgba(40, 40, 40, 0.62)` dark) as the engine TabBar's `tint`, flattening
//   the engine's own 0.4 surface;
// - the active pill and the Switch/Slider thumbs were solid chips / dark
//   blobs: blur-only glass (refraction 0 at rest) under solid fills.
// The fixes: the engine TabBar gets its own surface (`tabBarSurface`) resolved
// from the template theme (its default follows the phone's OS scheme, so
// omitting `tint` would give a light-mode template on a dark phone a dark
// bar), the pill and thumbs carry a mild rest lens, the pressed thumb lenses
// are wider and lightened, and the dark pill wash comes down 0.30 -> 0.20 now
// that the lens carries the pill's edge.
// Each test fails on the old code.

// The metal constants import `Platform` from `react-native`, and this
// package deliberately never imports `react-native` statically anywhere
// else: its Flow-typed sources cannot be parsed by the jsdom test runner.
// So this file stubs the two bindings the constants and theme actually
// read. The stub has no `View`, so the package's primitive resolver still
// falls back to its DOM stand-ins exactly as it does unmocked; the stubbed
// `react-native-svg` keeps the resolver from logging its missing-charts
// error.
vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
  useColorScheme: () => "dark",
}));
vi.mock("react-native-svg", () => ({}));

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { TabBar } from "../src";
import { resetGlassRouter } from "../src/internal/GlassView";
import {
  GLASS_PILL_METAL,
  GLASS_PILL_DRAGGED_METAL,
  GLASS_SLIDER_THUMB_METAL,
  GLASS_SLIDER_THUMB_PRESSED_METAL,
  GLASS_THUMB_METAL,
  GLASS_THUMB_PRESSED_METAL,
} from "../src/engine/src/constants/metal.constants";
import { GLASS_UI_PALETTE } from "../src/engine/src/theme/glass-ui-theme";

/**
 * Which branch the components take.
 *
 * vi.mock is hoisted above every top-level binding, so the flag lives on the
 * global object: the factory reads it at call time, and a test can flip it
 * between renders. The fake engine control captures the props the library
 * hands over, on the global object for the same reason.
 */
declare global {
  // eslint-disable-next-line no-var
  var __glaciaTabBarSupported: boolean;
  // eslint-disable-next-line no-var
  var __lastEngineTabBarProps: any;
}
globalThis.__glaciaTabBarSupported = false;
globalThis.__lastEngineTabBarProps = null;

/** The fake engine TabBar: captures the props, renders a plain host. */
function FakeEngineTabBar(props: any) {
  globalThis.__lastEngineTabBarProps = props;
  return createElement("div", { "data-engine-tabbar": "true" });
}

vi.mock("../src/internal/glass-routing", async () => {
  const actual = await vi.importActual<any>("../src/internal/glass-routing");
  return {
    ...actual,
    defaultRouter: () =>
      globalThis.__glaciaTabBarSupported
        ? { supported: true, LiquidGlassView: null }
        : { supported: false, LiquidGlassView: null },
    loadEngineControl: () => FakeEngineTabBar,
  };
});

beforeEach(() => {
  globalThis.__glaciaTabBarSupported = true;
  globalThis.__lastEngineTabBarProps = null;
  resetGlassRouter();
});

const ITEMS = [
  { id: "home", label: "Home" },
  { id: "search", label: "Search" },
  { id: "profile", label: "Profile" },
];

describe("TabBar — the neutral engine surface, resolved from the template theme", () => {
  it("passes the neutral glass tint in dark mode, not Glacia's opaque glass", () => {
    render(createElement(TabBar, { items: ITEMS, defaultActiveId: "home", isDark: true }));
    expect(globalThis.__lastEngineTabBarProps).not.toBeNull();
    // 0.6.8: the 0.6.6 light-blue tint was reverted — the owner reported the
    // bar "just looks blue" on device. Neutral wash; the blur ~1 clarity stays.
    expect(globalThis.__lastEngineTabBarProps.tint).toBe("rgba(18,18,18,0.4)");
  });

  it("passes the neutral glass tint in light mode, not the phone's dark scheme", () => {
    render(createElement(TabBar, { items: ITEMS, defaultActiveId: "home", isDark: false }));
    expect(globalThis.__lastEngineTabBarProps).not.toBeNull();
    expect(globalThis.__lastEngineTabBarProps.tint).toBe("rgba(250,250,250,0.42)");
  });

  it("still hands the bar its tabs, selection and colours", () => {
    render(createElement(TabBar, { items: ITEMS, defaultActiveId: "search", isDark: true }));
    const props = globalThis.__lastEngineTabBarProps;
    expect(props.tabs.map((t: any) => t.key)).toEqual(["home", "search", "profile"]);
    expect(props.selectedIndex).toBe(1);
    expect(props.accentColor).toBeTruthy();
    expect(props.inactiveColor).toBeTruthy();
  });
});

describe("GLASS_PILL_METAL — a mild rest lens, matching the dragged metal", () => {
  it("refracts at rest instead of being effect-off", () => {
    // 0.6.6: the rest lens is stronger (5/14 -> 8/18) — the target pill bends
    // the background visibly at rest.
    expect(GLASS_PILL_METAL.refraction?.amount).toBe(8);
    expect(GLASS_PILL_METAL.refraction?.width).toBe(18);
    expect(GLASS_PILL_METAL.refraction?.height).toBe(18);
  });

  it("shares the dragged metal's depth and cubic curve, so the blend stays smooth", () => {
    expect(GLASS_PILL_METAL.refraction?.depth).toBe(GLASS_PILL_DRAGGED_METAL.refraction?.depth);
    expect(GLASS_PILL_METAL.refraction?.curve).toEqual(
      GLASS_PILL_DRAGGED_METAL.refraction?.curve,
    );
    expect(GLASS_PILL_METAL.refraction?.curve?.power).toBe(3);
  });

  it("carries a small dispersion riding the lens's own band", () => {
    expect(GLASS_PILL_METAL.dispersion?.amount).toBeGreaterThan(0);
    expect(GLASS_PILL_METAL.dispersion?.reach).toBe(GLASS_PILL_METAL.refraction?.width);
  });

  it("keeps the bar's blur on iOS, so the pill is not a sharp hole in the bar", () => {
    // jsdom runs the iOS branch of the Platform check in this package's tests.
    // 0.6.6: the bar's blur is 1dp now, so the pill carries 1dp.
    expect(GLASS_PILL_METAL.blurRadius).toBe(1);
  });
});

describe("thumb metals — a mild rest lens, a wider lightened pressed lens", () => {
  it("the switch thumb refracts at rest", () => {
    expect(GLASS_THUMB_METAL.refraction?.amount).toBeGreaterThan(0);
    // 0.6.7: was 10 — the rest lens widened so it covers the 24dp-tall thumb face.
    expect(GLASS_THUMB_METAL.refraction?.width).toBe(12);
  });

  it("the slider thumb refracts at rest", () => {
    expect(GLASS_SLIDER_THUMB_METAL.refraction?.amount).toBeGreaterThan(0);
    // 0.6.7: was 12.
    expect(GLASS_SLIDER_THUMB_METAL.refraction?.width).toBe(14);
  });

  it("the pressed switch lens is wider and stronger than rest", () => {
    expect(GLASS_THUMB_PRESSED_METAL.refraction?.width).toBeGreaterThan(
      GLASS_THUMB_METAL.refraction?.width ?? 0,
    );
    expect(GLASS_THUMB_PRESSED_METAL.refraction?.amount).toBeGreaterThan(
      GLASS_THUMB_METAL.refraction?.amount ?? 0,
    );
  });

  it("the pressed slider lens is wider and stronger than rest", () => {
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.refraction?.width).toBeGreaterThan(
      GLASS_SLIDER_THUMB_METAL.refraction?.width ?? 0,
    );
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.refraction?.amount).toBeGreaterThan(
      GLASS_SLIDER_THUMB_METAL.refraction?.amount ?? 0,
    );
  });

  it("the pressed lenses are lightened, so they do not read as dark blobs", () => {
    expect(GLASS_THUMB_PRESSED_METAL.light).toBeGreaterThan(0);
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.light).toBeGreaterThan(0);
    expect(GLASS_THUMB_PRESSED_METAL.highlight?.intensity).toBeGreaterThan(
      GLASS_THUMB_METAL.highlight?.intensity ?? 0,
    );
  });

  it("the pressed dispersion reach follows the widened band", () => {
    expect(GLASS_THUMB_PRESSED_METAL.dispersion?.reach).toBe(
      GLASS_THUMB_PRESSED_METAL.refraction?.width,
    );
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.dispersion?.reach).toBe(
      GLASS_SLIDER_THUMB_PRESSED_METAL.refraction?.width,
    );
  });
});

describe("tabIndicatorSurface — the dark pill wash comes down now the lens carries the edge", () => {
  it("is 0.12 white in dark mode", () => {
    // 0.6.6: 0.20 still read as a solid grey oval on device; the stronger rest
    // lens + glossy highlight carry the selection now, so the wash comes down.
    expect(GLASS_UI_PALETTE.dark.tabIndicatorSurface).toBe("rgba(255,255,255,0.12)");
  });

  it("is unchanged in light mode", () => {
    expect(GLASS_UI_PALETTE.light.tabIndicatorSurface).toBe("rgba(255,255,255,0.55)");
  });
});
