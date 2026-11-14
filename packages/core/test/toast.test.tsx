import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Toaster, toast } from "../src";
import { act, render } from "@testing-library/react";

const css = readFileSync(resolve(__dirname, "../src/styles.css"), "utf-8");

function rule(selector: string): string {
  const start = css.indexOf(`\n${selector} {`);
  if (start === -1) throw new Error(`no rule for ${selector}`);
  return css.slice(start, css.indexOf("}", start));
}

// The reported bug: toasts appeared in the wrong place. The cause was a fixed
// box at `bottom: 0` with the inset applied as padding, so the first toast drew
// flush against the screen edge.
describe("Toast placement", () => {
  it("insets the stack from the edge instead of padding inside it", () => {
    const toaster = rule(".gl-toaster");
    expect(toaster).toContain("padding: 0");
    expect(rule(".gl-toaster-bottom-right")).toContain("bottom: 20px");
    expect(rule(".gl-toaster-bottom-right")).toContain("right: 20px");
    expect(rule(".gl-toaster-top-left")).toContain("top: 20px");
  });

  it("keeps a centred stack centred", () => {
    expect(rule(".gl-toaster-bottom-center")).toContain("translateX(-50%)");
    expect(rule(".gl-toaster-top-center")).toContain("translateX(-50%)");
  });

  it("does not define the entrance keyframes twice", () => {
    // Two definitions with one name meant the later silently won.
    const names = [...css.matchAll(/@keyframes (gl-toast[\w-]*)/g)].map((m) => m[1]);
    expect(new Set(names).size).toBe(names.length);
  });

  it("renders every supported position under its own class", async () => {
    for (const position of [
      "bottom-right",
      "bottom-left",
      "top-right",
      "top-left",
      "bottom-center",
      "top-center",
    ] as const) {
      const { container, unmount } = render(<Toaster position={position} />);
      // A toaster with nothing to say renders nothing at all.
      await act(async () => {
        toast(`Hello from ${position}`);
      });
      expect(
        container.querySelector(`.gl-toaster-${position}`),
        position,
      ).not.toBeNull();
      unmount();
    }
  });
});
