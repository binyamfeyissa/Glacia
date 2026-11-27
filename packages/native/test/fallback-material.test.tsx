// The fallback material, layer by layer.
//
// The brief for this wave is that the fallback on iOS below 26 and on Android
// must read as the same Liquid Glass as the web: a blurred backdrop, a tint, a
// painted rim light, an edge and a shadow — not one flat rectangle. These tests
// pin that stack at the source level:
//
// - the six web surface profiles resolve to visibly different materials,
// - the fallback really renders the tint and rim layers (and their gradients),
// - Reduce Transparency and `effect="none"` still paint nothing but the flat
//   surface / nothing at all,
// - and the new `surface` / `pressed` props never reach Apple's iOS 26 view.

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { Glass } from "../src";
import { FallbackGlassView } from "../src/internal/fallback";
import { resetGlassRouter } from "../src/internal/GlassView";
import { materialFor, type SurfaceProfile } from "../src/internal/material";
import { colors } from "../src/internal/tokens";

declare global {
  // eslint-disable-next-line no-var
  var __glaciaMaterialSupported: boolean;
}
globalThis.__glaciaMaterialSupported = false;

/**
 * Apple's view, standing in for the real one, and deliberately noisy: any prop
 * the package forwards lands on the host element as an attribute, so a test can
 * see exactly what crossed the branch.
 */
function FakeLiquidGlassView(props: any) {
  const { children, testID, style, ...rest } = props;
  return createElement(
    "div",
    { "data-liquid-glass": "true", "data-testid": testID, style, ...rest },
    children,
  );
}

vi.mock("../src/internal/glass-routing", async () => {
  const actual = await vi.importActual<any>("../src/internal/glass-routing");
  return {
    ...actual,
    defaultRouter: () =>
      globalThis.__glaciaMaterialSupported
        ? { supported: true, LiquidGlassView: FakeLiquidGlassView }
        : { supported: false, LiquidGlassView: null },
  };
});

const PROFILES: SurfaceProfile[] = ["panel", "control", "field", "overlay", "hint", "rail"];

beforeEach(() => {
  globalThis.__glaciaMaterialSupported = false;
  resetGlassRouter();
});

describe("surface profiles — the web's lens table, in fallback terms", () => {
  it("resolves every profile, and they are not all the same", () => {
    const resolved = PROFILES.map((profile) => materialFor(profile, "regular", false));
    // The point of the profiles is that a dialog and a badge stop sharing one
    // recipe. If these collapsed to a single material, the layer table would be
    // decorative rather than real.
    // 0.6.6: the blur is 1 on every profile now (the owner wants the glass
    // almost clear, "like 1 px"), so the profiles separate on the rim, not
    // on the blur.
    const distinctRim = new Set(resolved.map((material) => material.rim));
    expect(resolved.every((material) => material.blur === 1)).toBe(true);
    expect(distinctRim.size).toBeGreaterThan(1);
  });

  it("blurs every family at ~1 now, and the rim still separates control from hint", () => {
    const control = materialFor("control", "regular", false);
    const hint = materialFor("hint", "regular", false);
    // 0.6.6: blur is 1 everywhere — the families separate on the rim now.
    expect(control.blur).toBe(1);
    expect(hint.blur).toBe(1);
    expect(control.rim).toBeGreaterThan(hint.rim);
  });

  it("thins the lens on the clear effect, as the web does", () => {
    const regular = materialFor("overlay", "regular", false);
    const clear = materialFor("overlay", "clear", false);
    // 0.6.6: blur is 1 on both now (clamped at 1) — the clear effect thins
    // the rim instead.
    expect(clear.blur).toBe(1);
    expect(clear.blur).toBeLessThanOrEqual(regular.blur);
    expect(clear.rim).toBeLessThan(regular.rim);
  });

  it("uses the theme's light rim shine and drops the shadow in dark mode", () => {
    const light = materialFor("panel", "regular", false);
    const dark = materialFor("panel", "regular", true);
    expect(light.rim).toBeGreaterThan(dark.rim);
    expect(light.shadowOpacity).toBeGreaterThan(0);
    expect(dark.shadowOpacity).toBe(0);
  });
});

describe("the fallback renders the material as layers", () => {
  it("carries a tint layer, a clipped material layer and a painted rim", () => {
    const { container } = render(
      createElement(FallbackGlassView, { testID: "g", surface: "panel" }, "content"),
    );

    const tint = container.querySelector('[data-testid="g-tint"]') as HTMLElement | null;
    expect(tint).not.toBeNull();
    expect(tint?.style.backgroundColor).toBeTruthy();

    // The rim is an SVG rounded rect stroked with a gradient, inside the
    // clipped layer behind the children.
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    // Two gradients: the rim's falloff and the inner top highlight.
    expect(container.querySelector('[id^="rim-"]')).not.toBeNull();
    expect(container.querySelector('[id^="top-"]')).not.toBeNull();
    const stroked = Array.from(container.querySelectorAll("rect")).find((rect) =>
      (rect.getAttribute("stroke") ?? "").startsWith("url(#"),
    );
    expect(stroked).toBeTruthy();

    // The children render above the material, unchanged.
    expect(container.textContent).toContain("content");
  });

  it("paints the caller's tint into the material, not onto the layout box", () => {
    const { container } = render(
      createElement(FallbackGlassView, { testID: "g", tintColor: "rgb(1, 2, 3)" }, "x"),
    );
    const tint = container.querySelector('[data-testid="g-tint"]') as HTMLElement;
    expect(tint.style.backgroundColor).toBe("rgb(1, 2, 3)");
  });

  it("keeps Reduce Transparency solid: one flat colour, no material layers", async () => {
    const { container } = render(
      createElement(FallbackGlassView, {
        testID: "g",
        effect: "regular",
        reducedTransparency: true,
      }),
    );
    const root = container.querySelector('[data-testid="g"]') as HTMLElement;
    const solid = colors.light.glassSolid;
    const rgb = `rgb(${parseInt(solid.slice(1, 3), 16)}, ${parseInt(solid.slice(3, 5), 16)}, ${parseInt(solid.slice(5, 7), 16)})`;
    expect(root.style.backgroundColor).toBe(rgb);
    expect(container.querySelector('[data-testid="g-tint"]')).toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });

  it("paints nothing at all for effect=\"none\"", () => {
    const { container } = render(
      createElement(FallbackGlassView, { testID: "g", effect: "none" }, "ghost"),
    );
    expect(container.querySelector('[data-testid="g-tint"]')).toBeNull();
    expect(container.querySelector("svg")).toBeNull();
    expect(container.textContent).toContain("ghost");
  });
});

describe("the iOS 26 branch is untouched by this work", () => {
  it("never forwards surface or pressed to Apple's view", () => {
    globalThis.__glaciaMaterialSupported = true;
    resetGlassRouter();

    const { container } = render(
      createElement(
        Glass,
        { surface: "overlay", pressed: true, testID: "g" },
        "native glass",
      ),
    );

    const apple = container.querySelector("[data-liquid-glass]") as HTMLElement | null;
    expect(apple).not.toBeNull();
    // The fallback's props stop at the branch: Apple's material replaces the
    // whole stack, so it must not receive parameters it has no meaning for.
    expect(apple?.hasAttribute("surface")).toBe(false);
    expect(apple?.hasAttribute("pressed")).toBe(false);
    // And none of the fallback's extra layers are rendered under it.
    expect(container.querySelector('[data-testid="g-tint"]')).toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });
});
