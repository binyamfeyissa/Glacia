import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger, Button } from "../src";

const css = readFileSync(resolve(__dirname, "../src/styles.css"), "utf-8");

// The reported bug was "two arrows": Radix's Anchor renders a real element, so
// exporting it raw put a second marker beside the trigger.

describe("Popover", () => {
  it("hides the anchor so it cannot draw a second marker", () => {
    const block = css.slice(
      css.indexOf("\n.gl-popover-anchor"),
      css.indexOf("}", css.indexOf("\n.gl-popover-anchor")),
    );
    expect(block).toContain("display: none");
  });

  it("renders the anchor into the tree without a visible box", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverAnchor>anchor</PopoverAnchor>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    );
    const anchor = container.querySelector(".gl-popover-anchor");
    expect(anchor).not.toBeNull();
    expect(anchor!.className).toContain("gl-popover-anchor");
  });

  it("renders exactly one trigger and one content node", () => {
    const { container } = render(
      <Popover open>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    );
    expect(container.querySelectorAll(".gl-button")).toHaveLength(1);
    expect(document.querySelectorAll(".gl-popover-content")).toHaveLength(1);
  });

  it("defines the entrance animation it refers to", () => {
    // It referenced `gl-popover-in` without defining it, so the animation
    // silently did nothing.
    expect(css).toContain("@keyframes gl-popover-in");
  });
});
