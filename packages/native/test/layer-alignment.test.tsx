// Layer alignment: every layer of a glass surface shares one shape.
//
// The owner found the search field's layers mismatched on his iPhone 14 Pro
// (iOS 17) and on iOS 26+ phones: one layer drew a wide flat oval, another a
// pill. Two separate breaks, one symptom:
// - the fallback rim drew its shape in SVG, and SVG clamps rx to half the
//   WIDTH and ry to half the HEIGHT independently, so a pill radius (9999)
//   became a wide flat ellipse instead of a pill;
// - the engine branch never passed a `cornerRadius` to the native view, so
//   the shader refracted as a rectangle (radius 0) inside a pill container.
// These tests pin both halves: the effective radius the rim uses, and the
// cornerRadius the engine branch forwards.

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { Glass } from "../src";
import { resetGlassRouter } from "../src/internal/GlassView";
import { effectiveGlassRadius } from "../src/internal/rim";

declare global {
  // eslint-disable-next-line no-var
  var __glaciaMaterialSupported: boolean;
}
globalThis.__glaciaMaterialSupported = false;

/** The props the last engine-branch render received, captured by the fake. */
let lastEngineProps: any = null;
function FakeLiquidGlassView(props: any) {
  lastEngineProps = props;
  const { children, testID, style } = props;
  return createElement("div", { "data-liquid-glass": "true", "data-testid": testID, style }, children);
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

beforeEach(() => {
  globalThis.__glaciaMaterialSupported = false;
  lastEngineProps = null;
  resetGlassRouter();
});

describe("effectiveGlassRadius — the one shape every layer shares", () => {
  it("clamps a pill radius to half the shorter side", () => {
    // The search field: 350 wide, 34 tall, pill radius 9999 -> 17.
    expect(effectiveGlassRadius(9999, 350, 34)).toBe(17);
  });

  it("leaves a radius that already fits untouched", () => {
    expect(effectiveGlassRadius(24, 200, 100)).toBe(24);
    expect(effectiveGlassRadius(14, 300, 44)).toBe(14);
  });

  it("clamps to half the height on a short surface and half the width on a narrow one", () => {
    expect(effectiveGlassRadius(28, 40, 30)).toBe(15);
    expect(effectiveGlassRadius(28, 30, 40)).toBe(15);
  });

  it("returns zero for a square surface", () => {
    expect(effectiveGlassRadius(0, 100, 100)).toBe(0);
  });
});

describe("the engine branch forwards the container's corner radius", () => {
  it("passes the style borderRadius as cornerRadius", () => {
    globalThis.__glaciaMaterialSupported = true;
    render(createElement(Glass, { testID: "g", style: { borderRadius: 9999 } }, "x"));
    expect(lastEngineProps).not.toBeNull();
    expect(lastEngineProps.cornerRadius).toBe(9999);
  });

  it("passes a fixed radius through unchanged", () => {
    globalThis.__glaciaMaterialSupported = true;
    render(createElement(Glass, { testID: "g", style: { borderRadius: 24 } }, "x"));
    expect(lastEngineProps.cornerRadius).toBe(24);
  });

  it("passes per-corner radii as an object", () => {
    globalThis.__glaciaMaterialSupported = true;
    render(
      createElement(
        Glass,
        { testID: "g", style: { borderTopLeftRadius: 28, borderTopRightRadius: 28 } },
        "x",
      ),
    );
    expect(lastEngineProps.cornerRadius).toEqual({
      topLeft: 28,
      topRight: 28,
      bottomRight: 0,
      bottomLeft: 0,
    });
  });

  it("lets an explicit cornerRadius prop win over the style", () => {
    globalThis.__glaciaMaterialSupported = true;
    render(
      createElement(
        Glass,
        { testID: "g", style: { borderRadius: 9999 }, cornerRadius: 12 } as any,
        "x",
      ),
    );
    expect(lastEngineProps.cornerRadius).toBe(12);
  });

  it("passes nothing when the style carries no radius", () => {
    globalThis.__glaciaMaterialSupported = true;
    render(createElement(Glass, { testID: "g", style: { padding: 8 } }, "x"));
    expect(lastEngineProps.cornerRadius).toBeUndefined();
  });
});
