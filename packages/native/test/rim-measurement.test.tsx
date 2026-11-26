// The rim measures its box and clamps its radius to it.
//
// SVG clamps rx to half the WIDTH and ry to half the HEIGHT independently, so
// a pill radius (9999) on a wide short surface drew a wide flat ellipse.
// GlassRim measures its layout on a phone and uses
// effectiveGlassRadius(radius, width, height) — half the shorter side — so
// the rim and the container agree on one shape. This test drives the
// measurement path: it fakes a native layout event and checks the rim's
// rect radius follows it.

import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { GlassRim } from "../src/internal/rim";

/** Every props object the mock View received, in render order. */
const viewProps: any[] = [];
function RecordingView(props: any) {
  viewProps.push(props);
  const { children, style } = props;
  return createElement("div", { style }, children);
}

vi.mock("../src/internal/primitives", async () => {
  const actual = await vi.importActual<any>("../src/internal/primitives");
  return {
    ...actual,
    primitives: () => {
      const base = actual.primitives();
      return {
        ...base,
        isNative: true,
        View: RecordingView,
      };
    },
  };
});

beforeEach(() => {
  viewProps.length = 0;
});

function fireLayout(width: number, height: number) {
  const measured = viewProps.find((props) => typeof props.onLayout === "function");
  expect(measured).toBeDefined();
  act(() => {
    measured.onLayout({ nativeEvent: { layout: { width, height, x: 0, y: 0 } } });
  });
}

function rimRx(container: HTMLElement): string | null {
  const stroked = Array.from(container.querySelectorAll("rect")).find((rect) =>
    (rect.getAttribute("stroke") ?? "").startsWith("url(#"),
  );
  return stroked?.getAttribute("rx") ?? null;
}

describe("GlassRim measures its box", () => {
  it("uses the raw radius before any layout, then clamps to the box", () => {
    const { container } = render(
      createElement(GlassRim, { radius: 9999, rim: 0.5, highlight: 0.3 }),
    );
    // Before a layout event there is no box to clamp to, so the raw radius
    // is used (a device fires onLayout on mount; this is the first paint).
    expect(rimRx(container)).toBe("9998.5");
    // The search field: 350 wide, 34 tall. A pill is 17, not 9999.
    fireLayout(350, 34);
    expect(rimRx(container)).toBe("16.5");
  });

  it("keeps a radius that already fits, even after layout", () => {
    const { container } = render(
      createElement(GlassRim, { radius: 24, rim: 0.5, highlight: 0.3 }),
    );
    expect(rimRx(container)).toBe("23.5");
    fireLayout(200, 100);
    expect(rimRx(container)).toBe("23.5");
  });

  it("clamps to half the width on a narrow surface", () => {
    const { container } = render(
      createElement(GlassRim, { radius: 28, rim: 0.5, highlight: 0.3 }),
    );
    fireLayout(30, 40);
    expect(rimRx(container)).toBe("14.5");
  });
});
