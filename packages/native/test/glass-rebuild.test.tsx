// The engine-backed pieces of the rebuild: the capability verdicts the mount
// gate reads, the backdrop provider, the stacked-glass primitive, and the
// TabBar safe-area fix from the device-evidence bug list.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createElement } from "react";

import { Glass, GlassProvider, GlassStack, TabBar } from "../src";
import { readCapabilities, supportsGlass, supportsNativeGlass } from "../src/internal/glass-routing";
import { resetGlassRouter } from "../src/internal/GlassView";

describe("capability verdicts — never hang, never invent glass", () => {
  it("resolve to unsupported when the engine cannot be loaded here", async () => {
    // This environment has no engine module behind the resolver, so the verdict
    // must be a decided `false` — the fallback floor — and the promise must
    // resolve rather than sit pending forever.
    await expect(supportsGlass()).resolves.toBe(false);
    expect(supportsNativeGlass()).toBe(false);
    expect(readCapabilities().supported).toBe(false);
  });

  it("readCapabilities accepts an explicit module", () => {
    const verdict = readCapabilities({
      LiquidGlassView: () => null,
      supportsGlass: true,
      supportsNativeGlass: true,
    });
    expect(verdict.supported).toBe(true);
    expect(verdict.native).toBe(true);
  });
});

describe("GlassProvider", () => {
  it("renders the content it wraps, so a fallback build is unaffected", () => {
    const { container } = render(
      createElement(
        GlassProvider,
        { testID: "provider" },
        createElement(Glass, { testID: "g" }, "provider content"),
      ),
    );
    expect(container.textContent).toContain("provider content");
  });
});

describe("GlassStack", () => {
  it("renders its layers", () => {
    const { container } = render(
      createElement(GlassStack, { testID: "stack" }, createElement(Glass, { testID: "layer-1" }, "layer")),
    );
    expect(container.textContent).toContain("layer");
  });
});

describe("TabBar — safe-area fix (#7.1)", () => {
  it("floats the bar fully above the safe-area inset", () => {
    const { container } = render(
      <TabBar
        items={[
          { id: "home", label: "Home" },
          { id: "search", label: "Search" },
        ]}
        testID="bar"
        bottomInset={34}
      />,
    );
    const bar = container.querySelector('[data-testid="bar"]') as HTMLElement;
    expect(bar).toBeTruthy();
    // The design height (40) plus the safe-area inset the bar must clear, so
    // the glass ends above the home indicator / nav bar rather than sinking in.
    expect(Number.parseFloat(bar.style.height)).toBe(40 + 34);
  });
});

describe("GlassStack — the layer fix (#7.2)", () => {
  it("exposes a Layer marker even when the engine is unavailable", () => {
    expect(typeof (GlassStack as any).Layer).toBe("function");
  });

  it("renders every layer once, bottom to top, and never duplicates content", () => {
    const { container } = render(
      <GlassStack testID="stack">
        <GlassStack.Layer testID="base">Base Stack Layer Content</GlassStack.Layer>
        <GlassStack.Layer testID="middle">Middle</GlassStack.Layer>
        <GlassStack.Layer testID="top">Top</GlassStack.Layer>
      </GlassStack>,
    );
    const text = container.textContent ?? "";
    expect(text.match(/Base Stack Layer Content/g) ?? []).toHaveLength(1);
    expect(text.indexOf("Base")).toBeLessThan(text.indexOf("Middle"));
    expect(text.indexOf("Middle")).toBeLessThan(text.indexOf("Top"));
  });

  it("treats a bare child as a layer instead of dropping it", () => {
    const { container } = render(<GlassStack testID="stack">bare child</GlassStack>);
    expect(container.textContent).toContain("bare child");
  });
});
