// Part A: GlassContainer routing, Reduce Transparency, Reduce Motion.
//
// These three are the accessibility-facing behaviours of the glass system, so
// each is driven through the real component rather than a helper:
//
// - GlassContainer must render Apple's container on iOS 26 and a plain wrapper
//   everywhere else, with the same layout either way.
// - Reduce Transparency must swap the fallback's translucent tint for the solid
//   theme colour, keeping the shape.
// - Reduce Motion must make the named animations settle instead of playing.
//
// The routing fake lives on the global object because vi.mock is hoisted above
// every top-level binding.

import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
});

const CONTAINER_ATTR = "data-liquid-glass-container";
const GLASS_ATTR = "data-liquid-glass";

declare global {
  // eslint-disable-next-line no-var
  var __glaciaSupported2: boolean;
  // eslint-disable-next-line no-var
  var __glaciaTransparencyReduced: boolean;
  // eslint-disable-next-line no-var
  var __glaciaMotionReduced: boolean;
}
globalThis.__glaciaSupported2 = false;
globalThis.__glaciaTransparencyReduced = false;
globalThis.__glaciaMotionReduced = false;

/** Apple's container, standing in for the real native one. */
function FakeContainer(props: any) {
  const { children, testID, spacing, style, ...rest } = props;
  return createElement(
    "div",
    { [CONTAINER_ATTR]: "true", "data-testid": testID, "data-spacing": String(spacing), style, ...rest },
    children,
  );
}

function FakeGlassView(props: any) {
  const { children, testID, effect, style, ...rest } = props;
  return createElement(
    "div",
    { [GLASS_ATTR]: "true", "data-testid": testID, "data-effect": effect, style, ...rest },
    children,
  );
}

vi.mock("../src/internal/glass-routing", async () => {
  const actual = await vi.importActual<any>("../src/internal/glass-routing");
  return {
    ...actual,
    // GlassContainer resolves its own router lazily, so the flag is read per
    // render and a test can flip the branch without re-importing the module.
    defaultRouter: () =>
      globalThis.__glaciaSupported2
        ? {
            supported: true,
            LiquidGlassView: FakeGlassView,
            LiquidGlassContainerView: FakeContainer,
          }
        : { supported: false, LiquidGlassView: null, LiquidGlassContainerView: null },
  };
});

// The accessibility preferences are read through the primitives resolver, so a
// fake AccessibilityInfo is what a phone with the settings enabled reports.
vi.mock("../src/internal/primitives", async () => {
  const actual = await vi.importActual<any>("../src/internal/primitives");
  return {
    ...actual,
    primitives: () => {
      const base = actual.primitives();
      if (!base.isNative) {
        // Off-device the real resolver has no AccessibilityInfo at all, so the
        // fake supplies one; that is what a device provides.
        return {
          ...base,
          AccessibilityInfo: {
            isReduceTransparencyEnabled: () => Promise.resolve(globalThis.__glaciaTransparencyReduced),
            isReduceMotionEnabled: () => Promise.resolve(globalThis.__glaciaMotionReduced),
            addEventListener: () => ({ remove: () => {} }),
          },
        };
      }
      return {
        ...base,
        AccessibilityInfo: {
          isReduceTransparencyEnabled: () => Promise.resolve(globalThis.__glaciaTransparencyReduced),
          isReduceMotionEnabled: () => Promise.resolve(globalThis.__glaciaMotionReduced),
          addEventListener: () => ({ remove: () => {} }),
        },
      };
    },
  };
});

import { GlassContainer, resetGlassContainerRouter } from "../src/internal/GlassContainer";
import { primitives } from "../src/internal/primitives";
import { useSpring } from "../src/internal/motion";
import { colors as tokenColors } from "../src/internal/tokens";
import { GlassView, resetGlassRouter } from "../src/internal/GlassView";
import * as indexExports from "../src/index";
import { Sheet, TabBar } from "../src/index";

beforeEach(() => {
  globalThis.__glaciaSupported2 = false;
  globalThis.__glaciaTransparencyReduced = false;
  globalThis.__glaciaMotionReduced = false;
  resetGlassContainerRouter();
  resetGlassRouter();
});

afterEach(() => {
  resetGlassContainerRouter();
  resetGlassRouter();
});

describe("GlassContainer (#79) — the merging surface", () => {
  it("renders Apple's container on the supported branch, with the spacing", () => {
    globalThis.__glaciaSupported2 = true;
    resetGlassContainerRouter();
    const { container } = render(
      createElement(
        GlassContainer,
        { spacing: 12, testID: "group" },
        createElement(GlassView, { effect: "regular" }, createElement("span", null, "Compose")),
      ),
    );

    const node = container.querySelector(`[${CONTAINER_ATTR}]`);
    expect(node).not.toBeNull();
    // The spacing is what tells the system how far apart merging begins.
    expect(node!.getAttribute("data-spacing")).toBe("12");
    expect(node!.getAttribute("data-testid")).toBe("group");
    // Its children are real glass surfaces, so there is something to merge.
    expect(container.querySelector(`[${GLASS_ATTR}]`)).not.toBeNull();
  });

  it("renders a plain wrapper on the unsupported branch, with identical layout", () => {
    globalThis.__glaciaSupported2 = false;
    resetGlassContainerRouter();
    const { container } = render(
      createElement(
        GlassContainer,
        { spacing: 12, testID: "group", style: { flexDirection: "row" } },
        createElement(GlassView, { effect: "regular" }, createElement("span", null, "Compose")),
      ),
    );

    // No Apple container: the fallback is a plain view.
    expect(container.querySelector(`[${CONTAINER_ATTR}]`)).toBeNull();
    const node = container.querySelector('[data-testid="group"]');
    expect(node).not.toBeNull();
    // The same style is applied, so nothing shifts between branches.
    expect((node as HTMLElement).style.flexDirection).toBe("row");
    // The child still renders, and still on its own fallback glass.
    expect(container.querySelector(`[${GLASS_ATTR}]`)).toBeNull();
  });

  it("keeps both branches rendering the same children", () => {
    const children = createElement("span", null, "content");

    globalThis.__glaciaSupported2 = false;
    resetGlassContainerRouter();
    const fallback = render(createElement(GlassContainer, null, children));
    expect(fallback.getByText("content")).toBeTruthy();
    fallback.unmount();

    globalThis.__glaciaSupported2 = true;
    resetGlassContainerRouter();
    const supported = render(createElement(GlassContainer, null, children));
    expect(supported.getByText("content")).toBeTruthy();
  });
});

/**
 * Normalises a colour the way a browser reports it.
 *
 * jsdom expands `#F2F2F7` to `rgb(242, 242, 247)`, so comparing against the
 * token's hex would fail on formatting rather than on behaviour. The token is
 * still the source of the expected value.
 */
function asRgb(hex: string): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return hex;
  const raw = match[1]!;
  return `rgb(${parseInt(raw.slice(0, 2), 16)}, ${parseInt(raw.slice(2, 4), 16)}, ${parseInt(raw.slice(4, 6), 16)})`;
}

describe("Reduce Transparency — the fallback goes solid", () => {
  /** The solid colour the fallback should use when transparency is reduced. */
  // Read from the token module so the test fails if the token is renamed or
  // removed, rather than passing against a copied literal.
  const solidHex = tokenColors.light.glassSolid;
  const solidRgb = asRgb(solidHex);

  it("renders the translucent tint when the preference is off", async () => {
    const { container } = render(
      createElement(GlassView, { effect: "regular", isDark: false, testID: "surface" }),
    );
    await waitFor(() => {
      const node = container.querySelector('[data-testid="surface"]');
      expect(node).not.toBeNull();
    });
    const node = container.querySelector('[data-testid="surface"]') as HTMLElement;
    expect(node.style.backgroundColor).not.toBe(solidRgb);
  });

  it("renders the solid theme background when the preference is on", async () => {
    globalThis.__glaciaTransparencyReduced = true;
    const { container } = render(
      createElement(GlassView, { effect: "regular", isDark: false, testID: "surface" }),
    );
    // The preference is read asynchronously, as the platform reports it.
    await waitFor(() => {
      const node = container.querySelector('[data-testid="surface"]') as HTMLElement | null;
      expect(node?.style.backgroundColor).toBe(solidRgb);
    });
  });

  it("keeps the same shape — the radius is unchanged by the preference", async () => {
    globalThis.__glaciaTransparencyReduced = true;
    const { container } = render(
      createElement(GlassView, {
        effect: "regular",
        isDark: false,
        testID: "surface",
        style: { borderRadius: 14 },
      }),
    );
    await waitFor(() => {
      const node = container.querySelector('[data-testid="surface"]') as HTMLElement | null;
      expect(node?.style.borderRadius).toBe("14px");
    });
  });

  it("is a no-op on the supported branch: the system owns real glass", () => {
    globalThis.__glaciaTransparencyReduced = true;
    globalThis.__glaciaSupported2 = true;
    resetGlassRouter();
    // On iOS 26 the surface is Apple's, which applies its own treatment; the
    // package must not override it with a flat colour of its own choosing.
    const { container } = render(
      createElement(GlassView, { effect: "regular", isDark: false, testID: "surface" }),
    );
    const node = container.querySelector(`[${GLASS_ATTR}]`);
    expect(node).not.toBeNull();
    expect((node as HTMLElement).style.backgroundColor ?? "").not.toBe(solidRgb);
  });
});

describe("Reduce Motion — named animations settle instead of animating", () => {
  // Off-device `isNative` is false, so `animated` is false for that reason
  // alone and a test here would pass no matter what the preference does. This
  // probe presents Animated and isNative the way a device does, which makes the
  // Reduce Motion decision the only variable that can change the answer.
  it("useSpring animates with motion on and settles with motion reduced", async () => {
    const FakeValue = class {
      v: number;
      constructor(v: number) { this.v = v; }
      interpolate() { return { interpolated: true }; }
    };
    const fakePrimitives = {
      ...primitives(),
      isNative: true,
      Animated: { Value: FakeValue, spring: () => ({ start() {}, stop() {} }) },
      AccessibilityInfo: {
        isReduceTransparencyEnabled: () => Promise.resolve(false),
        isReduceMotionEnabled: () => Promise.resolve(globalThis.__glaciaMotionReduced),
        addEventListener: () => ({ remove() {} }),
      },
    };

    const probe = vi.spyOn(await import("../src/internal/primitives"), "primitives");
    probe.mockReturnValue(fakePrimitives);

    let observed: { animated: boolean } | null = null;
    function Probe() {
      observed = useSpring(1, "snappy");
      return createElement("span", null, "probe");
    }

    globalThis.__glaciaMotionReduced = false;
    const first = render(createElement(Probe));
    await waitFor(() => expect(observed?.animated).toBe(true));
    first.unmount();

    globalThis.__glaciaMotionReduced = true;
    render(createElement(Probe));
    // The preference is read asynchronously; once it lands the spring settles.
    await waitFor(() => expect(observed?.animated).toBe(false));
    probe.mockRestore();
  });

  it("TabBar still changes tabs with motion reduced", () => {
    globalThis.__glaciaMotionReduced = true;
    const changes: string[] = [];
    const { getByLabelText } = render(
      createElement(TabBar, {
        items: [
          { id: "a", label: "A", icon: () => createElement("span", null, "A") },
          { id: "b", label: "B", icon: () => createElement("span", null, "B") },
        ],
        onTabChange: (id: string) => changes.push(id),
      }),
    );
    fireEvent.click(getByLabelText("B"));
    expect(changes).toEqual(["b"]);
  });

});
