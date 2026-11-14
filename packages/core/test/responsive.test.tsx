import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(__dirname, "../src/styles.css"), "utf-8");

function rule(selector: string, from = 0): string {
  const start = css.indexOf(`\n${selector} {`, from);
  if (start === -1) throw new Error(`no rule for ${selector}`);
  return css.slice(start, css.indexOf("}", start) + 1);
}

function inMedia(query: string, selector: string): boolean {
  const start = css.indexOf(`@media ${query}`);
  expect(start, query).toBeGreaterThan(-1);
  // Scan to the end of that media block.
  let depth = 0;
  let end = start;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return css.slice(start, end).includes(selector);
}

// Each of these five had no responsive rule at all, so a narrow screen simply
// cut them off.
describe("Responsive behaviour", () => {
  describe("tabs", () => {
    it("lets a long tab list scroll instead of clipping", () => {
      const list = rule(".gl-tabs-list");
      expect(list).toContain("max-width: 100%");
      expect(list).toContain("overflow-x: auto");
    });

    it("keeps every trigger on one line", () => {
      const trigger = rule(".gl-tabs-trigger");
      expect(trigger).toContain("white-space: nowrap");
      expect(trigger).toContain("flex: none");
    });
  });

  describe("tab bar", () => {
    it("never grows past the viewport", () => {
      const bar = rule(".gl-tab-bar");
      expect(bar).toContain("max-width: 100%");
    });
  });

  describe("panelside", () => {
    it("is a capped sidebar on a wide screen", () => {
      expect(rule(".gl-panelside")).toContain("max-width: 220px");
    });

    it("stacks and scrolls sideways on a phone", () => {
      expect(inMedia("(max-width: 720px)", ".gl-panelside")).toBe(true);
      const block = css.slice(css.indexOf("@media (max-width: 720px)"));
      expect(block).toContain("flex-direction: row");
      expect(block).toContain("border-bottom");
    });
  });

  describe("message", () => {
    it("does not leave a phone's bubbles at 82% of a narrow screen", () => {
      expect(inMedia("(max-width: 560px)", ".gl-message")).toBe(true);
      expect(css).toContain("overflow-wrap: anywhere");
    });

    it("is capped on a wide screen too", () => {
      expect(rule(".gl-message")).toContain("max-width: min(82%, 42rem)");
    });
  });

  describe("menu", () => {
    it("cannot be wider than the screen", () => {
      expect(rule(".gl-menu-card")).toContain("max-width: calc(100vw - 16px)");
    });
  });
});
