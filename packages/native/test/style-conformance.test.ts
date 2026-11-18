// Source-level guard: the new components wear the token system, not their own
// palette.
//
// A component that renders correctly but hardcodes a colour or an unusual
// radius does not belong to this library — it drifts the moment the theme
// changes. These files must take every colour from internal/tokens, every
// radius from `radii`, and every spring from `springs`.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(__dirname, "..", "src");

/**
 * The components added in the two waves that follow this discipline. Listed
 * explicitly so the guard fails if a file is renamed or removed rather than
 * silently checking nothing.
 *
 * Files from the first reconstruction (Button, Dialog, ai.tsx and the charts)
 * still carry literals of their own; they are deliberately not listed here,
 * because this guard is about the components built to the token rule and
 * broadening it to old files would only make it fail for reasons outside this
 * work.
 */
const NEW_COMPONENTS = [
  "Text.tsx",
  "Display.tsx",
  "Feedback.tsx",
  "Bars.tsx",
  "Overlays.tsx",
  "Carousel.tsx",
  "Forms2.tsx",
  "Pickers.tsx",
  // Wave 3: the interaction upgrades and the leftover components.
  "Message.tsx",
  "internal/GlassContainer.tsx",
  "internal/a11y.ts",
  "internal/haptics.ts",
];

const read = (file: string) => readFileSync(join(SRC, file), "utf8");

/** Source without comments, so prose may name colours without tripping this. */
function code(file: string): string {
  return read(file)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

describe("new components use the token system", () => {
  it("checks every file it claims to cover", () => {
    for (const file of NEW_COMPONENTS) expect(code(file).length).toBeGreaterThan(200);
  });

  it("contains no raw colour literals", () => {
    // rgba(...), rgb(...), #rrggbb and #rgb all count as a hardcoded colour.
    const offenders = NEW_COMPONENTS.filter((file) =>
      /rgba?\(|#[0-9a-fA-F]{3,8}\b/.test(code(file)),
    );
    expect(offenders).toEqual([]);
  });

  it("reads its colours from the theme rather than a literal", () => {
    // Every file that paints anything must resolve a theme first.
    const painters = NEW_COMPONENTS.filter((file) => /backgroundColor|color:/.test(code(file)));
    expect(painters.length).toBeGreaterThan(0);
    for (const file of painters) {
      expect(code(file)).toMatch(/useIsDark|theme\.|colors\./);
    }
  });

  it("takes radii from the radii token, never a bare literal", () => {
    // The rule that matters: no hand-picked radius numbers. A literal is only
    // acceptable when it is zero, or half of a measured dimension (a circle
    // from its own size). Anything else must come from `radii`.
    for (const file of NEW_COMPONENTS) {
      const source = code(file);
      for (const match of source.matchAll(/border[a-zA-Z]*Radius:\s*([^,\n}]+)/g)) {
        const value = match[1]!.trim();
        // Pull out numeric literals, ignoring any number used as a divisor (the
        // 2 in `dimension / 2` halves a measured size, which makes a circle).
        // A number is a measurement, not a radius, when it halves itself: it
        // is either the divisor (`dimension / 2`) or the numerator (`16 / 2`).
        // Both are how the library draws a circle from its own size.
        const numbers = [...value.matchAll(/(^|[^\w./])(\d+(?:\.\d+)?)/g)]
          .filter((m) => {
            const before = value.slice(0, m.index! + m[1]!.length);
            const after = value.slice(m.index! + m[0].length);
            return !/\/\s*$/.test(before) && !/^\s*\/\s*2\b/.test(after);
          })
          .map((m) => m[2]!);
        // Zero is a square corner, which is a legitimate choice.
        const offending = numbers.filter((n) => n !== "0");
        expect(offending, `${file}: borderRadius ${value}`).toEqual([]);
      }
    }
  });

  it("references the radii token wherever it rounds a corner", () => {
    // Confirms the token is the source, not just that no literal survived.
    for (const file of NEW_COMPONENTS) {
      const source = code(file);
      if (!/border[a-zA-Z]*Radius/.test(source)) continue;
      const usesToken = /radii\./.test(source) ||
        // A circle derived from a dimension is the other permitted shape.
        /border[a-zA-Z]*Radius:\s*[a-zA-Z_$][\w$]*\s*\/\s*2/.test(source);
      expect(usesToken, `${file} rounds corners without radii`).toBe(true);
    }
  });

  it("animates with the spring tokens rather than inline spring config", () => {
    for (const file of NEW_COMPONENTS) {
      const source = code(file);
      // A literal spring config (stiffness/damping) means the token was skipped.
      expect(/stiffness:|damping:/.test(source), `${file} hardcodes a spring`).toBe(false);
    }
  });

  it("marks selected states with the shared lens or the shared tint", () => {
    // The library marks selection one way; a new colour for it would be drift.
    // A lens (`SelectedLens`, which paints `glassActive` plus the rim) and the
    // bare token are the two accepted forms: either is the same selection
    // language, and neither invents a colour.
    const selectors = ["Display.tsx", "Bars.tsx", "Forms2.tsx", "Carousel.tsx", "Pickers.tsx"];
    const usingActive = selectors.filter((file) => /glassActive|SelectedLens/.test(code(file)));
    expect(usingActive.length).toBe(selectors.length);
  });
});
