// The backdrop scope: a hint, never a layout change.
//
// `GlassBackdrop` exists for one tier (iOS 16.4–25 Metal) and must be free everywhere else. The
// tests pin both halves: with no native scope it renders a plain wrapper with the same layout,
// and on the native tier it renders the engine's `NativeGlassBackdropView` with its children.
//
// The scope is memoised per process, so each test resets it — the same pattern the container and
// router tests use, and for the same reason: a cached route would make the second assertion read
// the first test's verdict.

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createElement } from "react";

import { GlassBackdrop } from "../src/index";
import { loadBackdropScope, resetBackdropScope } from "../src/internal/glass-routing";

afterEach(() => {
  resetBackdropScope();
});

describe("GlassBackdrop", () => {
  it("renders a plain wrapper when no native scope exists", () => {
    resetBackdropScope();
    const { container, getByText } = render(
      createElement(GlassBackdrop, { testID: "scope", style: { flex: 1 } }, "content"),
    );
    expect(getByText("content")).toBeTruthy();
    // No native host was required, and the wrapper kept its layout props.
    const node = container.querySelector('[data-testid="scope"]');
    expect(node).not.toBeNull();
    expect((node as HTMLElement).style.flexGrow).toBe("1");
  });

  it("routes the scope to the Metal tier and nowhere else", () => {
    const metal = {
      LiquidGlassView: () => null,
      NativeGlassBackdropView: () => null,
      supportsGlass: true,
      supportsNativeGlass: false,
    };
    // iOS 16.4–25: the strip cache needs a scope.
    expect(loadBackdropScope(metal)).toBe(metal.NativeGlassBackdropView);

    // iOS 26: Apple's glass reads the live window; a scope would only add a view.
    expect(loadBackdropScope({ ...metal, supportsNativeGlass: true })).toBeNull();

    // Below the floor / no renderer: nothing to scope.
    expect(loadBackdropScope({ ...metal, supportsGlass: false })).toBeNull();
  });
});
