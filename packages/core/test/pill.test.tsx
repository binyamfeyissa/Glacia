import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Input, Item } from "../src";

// jsdom does not lay out, so the computed radius and height cannot be read
// from an element. Instead the stylesheet is parsed: for each control the test
// asserts the declared radius is the shared pill token, and that the token's
// value is large enough to exceed half of any control height. Together those
// two facts mean the ends are semicircles, not rounded corners.
const css = readFileSync(resolve(__dirname, "../src/styles.css"), "utf-8");

function rule(selector: string): string {
  const start = css.indexOf(`\n${selector} {`);
  if (start === -1) throw new Error(`No rule for ${selector}`);
  const end = css.indexOf("}", start);
  return css.slice(start, end);
}

const PILL_CONTROLS = [
  ".gl-input",
  ".gl-combobox-trigger",
  ".gl-combobox-search",
  ".gl-item",
  ".gl-menubar",
  ".gl-menubar-trigger",
  ".gl-toggle-group",
  ".gl-toggle-group-sm",
  ".gl-toggle-group-sm .gl-toggle-group-item",
  ".gl-toggle-group-lg .gl-toggle-group-item",
  ".gl-questionnaire-btn",
  ".gl-color-hex-field",
];

describe("pill geometry", () => {
  it("keeps a pill token large enough to read as a capsule", () => {
    expect(css).toMatch(/--gl-pill:\s*999px;/);
  });

  for (const selector of PILL_CONTROLS) {
    it(`gives ${selector} a fully curved edge`, () => {
      expect(rule(selector)).toMatch(/border-radius:\s*var\(--gl-pill\);/);
    });
  }

  it("gives the accordion stack a generous but capped radius", () => {
    // A tall capsule bulges at the waist, so stacks cap their radius.
    expect(css).toMatch(/--gl-stack-radius:\s*26px;/);
    expect(rule(".gl-accordion-item")).toMatch(/border-radius:\s*var\(--gl-stack-radius\);/);
  });

  it("curves a textarea more without making a multi-line capsule", () => {
    const radius = /border-radius:\s*(\d+)px;/.exec(rule(".gl-textarea"))?.[1];
    expect(Number(radius)).toBeGreaterThanOrEqual(16);
    expect(Number(radius)).toBeLessThan(999);
  });

  it("makes every control inside a form a pill", () => {
    const start = css.indexOf("\n.gl-form :is(");
    expect(start).toBeGreaterThan(-1);
    const block = css.slice(start, css.indexOf("}", start));
    expect(block).toContain("border-radius: var(--gl-pill)");
  });
});

describe("pill controls still render", () => {
  it("renders an input and an item", () => {
    const { container } = render(
      <div>
        <Input placeholder="Name" />
        <Item title="Row" />
      </div>,
    );
    expect(container.querySelector(".gl-input")).not.toBeNull();
    expect(container.querySelector(".gl-item")).not.toBeNull();
  });
});
