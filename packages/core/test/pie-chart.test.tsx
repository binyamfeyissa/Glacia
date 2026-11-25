import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PieChart } from "../src/charts/radial-chart";

// Regression test for commit 12c84bf: PieChart used to pass thickness={0},
// which Radial read as a ring whose hole equalled the full radius — the
// <path> elements existed but every slice had zero area and the pie was
// invisible. charts.test.tsx already pins the wedge shape (paths start at
// the centre); this file pins the consequence that matters: each slice
// covers real, non-zero area on the page.

/** Bounding-box area of every (x, y) pair in a path's `d` attribute. */
function pathBBoxArea(d: string): number {
  const numbers = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i + 1 < numbers.length; i += 2) {
    xs.push(numbers[i]!);
    ys.push(numbers[i + 1]!);
  }
  if (xs.length < 3) return 0;
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
}

function distinctPoints(d: string): number {
  const numbers = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const points = new Set<string>();
  for (let i = 0; i + 1 < numbers.length; i += 2) {
    points.add(`${numbers[i]},${numbers[i + 1]}`);
  }
  return points.size;
}

describe("PieChart regression (12c84bf): slices have non-zero area", () => {
  it("renders every slice as a wedge covering real area", () => {
    const { container } = render(
      <PieChart
        data={[
          { label: "A", value: 30 },
          { label: "B", value: 20 },
          { label: "C", value: 50 },
        ]}
      />,
    );
    const paths = [...container.querySelectorAll("svg path")];
    expect(paths).toHaveLength(3);
    for (const path of paths) {
      const d = path.getAttribute("d") ?? "";
      // A pie wedge starts at the centre (default size 200 → 100,100),
      // not on a ring: a zero-area sliver cannot start there and spread.
      expect(d.startsWith("M 100 100 L")).toBe(true);
      expect(d).not.toContain("NaN");
      expect(distinctPoints(d)).toBeGreaterThanOrEqual(3);
      expect(pathBBoxArea(d)).toBeGreaterThan(0);
    }
  });

  it("a single slice fills the whole disc, not a sliver", () => {
    const { container } = render(<PieChart data={[{ label: "Only", value: 100 }]} />);
    const paths = [...container.querySelectorAll("svg path")];
    expect(paths).toHaveLength(1);
    const d = paths[0]!.getAttribute("d") ?? "";
    expect(d.startsWith("M 100 100 L")).toBe(true);
    // A full disc spans the whole 200x200 viewBox.
    expect(pathBBoxArea(d)).toBeGreaterThan(100 * 100);
  });

  it("a tiny slice is still a visible wedge, not a collapsed line", () => {
    const { container } = render(
      <PieChart
        data={[
          { label: "Big", value: 99 },
          { label: "Small", value: 1 },
        ]}
      />,
    );
    const paths = [...container.querySelectorAll("svg path")];
    expect(paths).toHaveLength(2);
    for (const path of paths) {
      const d = path.getAttribute("d") ?? "";
      expect(pathBBoxArea(d)).toBeGreaterThan(0);
      expect(distinctPoints(d)).toBeGreaterThanOrEqual(3);
    }
  });
});
