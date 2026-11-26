// The rim measures its box in the web mirror too — not just on a device.
//
// On a phone GlassRim measures through onLayout. Off-device there is no
// layout event (the DOM stand-in drops onLayout), so the rim measures its
// own box through a DOM ref + getBoundingClientRect. Without this the mirror
// would keep the percentage rects — and the double line on the right side —
// forever, because the mirror never fires a layout event. This test drives
// that path: a real DOM box (mocked, jsdom has no layout) must turn the
// rects absolute, exactly as a layout event does on a device.

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { GlassRim } from "../src/internal/rim";

afterEach(() => {
  vi.restoreAllMocks();
});

function rectSize(container: HTMLElement): { rim: string[]; highlight: string[] } {
  const rects = Array.from(container.querySelectorAll("rect"));
  const rim = rects.find((rect) => (rect.getAttribute("stroke") ?? "").startsWith("url(#"));
  const highlight = rects.find((rect) =>
    (rect.getAttribute("fill") ?? "").startsWith("url(#"),
  );
  return {
    rim: [rim?.getAttribute("width") ?? "", rim?.getAttribute("height") ?? ""],
    highlight: [highlight?.getAttribute("width") ?? "", highlight?.getAttribute("height") ?? ""],
  };
}

describe("GlassRim measures its box in the web preview", () => {
  it("turns the rects absolute from a DOM rect (the accounts card)", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      width: 342,
      height: 230,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 342,
      bottom: 230,
      toJSON: () => ({}),
    } as DOMRect);
    const { container } = render(
      createElement(GlassRim, { radius: 24, rim: 0.5, highlight: 0.3 }),
    );
    expect(rectSize(container)).toEqual({
      rim: ["341", "229"],
      highlight: ["340", "92"],
    });
  });

  it("keeps the percentage rects when the DOM reports no box (jsdom default)", () => {
    const { container } = render(
      createElement(GlassRim, { radius: 24, rim: 0.5, highlight: 0.3 }),
    );
    expect(rectSize(container)).toEqual({
      rim: ["99%", "99%"],
      highlight: ["98%", "40%"],
    });
  });
});
