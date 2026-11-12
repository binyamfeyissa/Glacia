import { describe, expect, it } from "vitest";

import {
  arcPath,
  bandScale,
  formatValue,
  linearScale,
  niceDomain,
  plotArea,
  seriesColor,
  smoothPath,
  ticks,
} from "../src/charts/scales";
import { LineChart } from "../src/charts/line-chart";
import { BarChart } from "../src/charts/bar-chart";
import { PieChart } from "../src/charts/radial-chart";
import { render, screen } from "@testing-library/react";

// These tests cover the arithmetic every chart depends on. A wrong scale or a
// NaN in a path string does not throw — it silently draws nothing — so the
// maths is pinned down here rather than only checked through screenshots.

describe("linearScale", () => {
  it("maps the domain onto the range", () => {
    const scale = linearScale([0, 100], [0, 200], { nice: false });
    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(100);
    expect(scale(100)).toBe(200);
  });

  it("inverts back to the original value", () => {
    const scale = linearScale([10, 90], [40, 240], { nice: false });
    for (const value of [10, 35, 55, 90]) {
      expect(scale.invert(scale(value))).toBeCloseTo(value, 6);
    }
  });

  it("never collapses a flat series into a zero-width band", () => {
    const scale = linearScale([5, 5], [0, 100], { nice: false });
    expect(scale.domain[1]).toBeGreaterThan(scale.domain[0]);
    expect(Number.isFinite(scale(5))).toBe(true);
  });

  it("still maps zero correctly when the domain is a single point", () => {
    const scale = linearScale([0, 0], [100, 0], { nice: false });
    expect(Number.isFinite(scale(0))).toBe(true);
    expect(scale.domain[1]).toBeGreaterThan(0);
  });
});

describe("niceDomain", () => {
  it("expands outward to round numbers", () => {
    const [min, max] = niceDomain(3, 97, 5);
    expect(min).toBeLessThanOrEqual(3);
    expect(max).toBeGreaterThanOrEqual(97);
    expect(Number.isInteger(min)).toBe(true);
    expect(Number.isInteger(max)).toBe(true);
  });

  it("handles negative ranges", () => {
    const [min, max] = niceDomain(-40, 60, 5);
    expect(min).toBeLessThanOrEqual(-40);
    expect(max).toBeGreaterThanOrEqual(60);
  });

  it("produces a non-degenerate domain for identical values", () => {
    const [min, max] = niceDomain(10, 10, 5);
    expect(max).toBeGreaterThan(min);
  });
});

describe("ticks", () => {
  it("returns count + 1 evenly spaced values spanning the domain", () => {
    const result = ticks([0, 100], 4);
    expect(result).toHaveLength(5);
    expect(result[0]).toBe(0);
    expect(result[result.length - 1]).toBe(100);
  });

  it("collapses a zero-width domain to a single tick instead of NaN", () => {
    expect(ticks([7, 7], 4)).toEqual([7]);
  });
});

describe("bandScale", () => {
  it("centres bands evenly across the range", () => {
    const bands = bandScale(4, [0, 400], 0);
    expect(bands.center(0)).toBe(50);
    expect(bands.center(1)).toBe(150);
    expect(bands.center(3)).toBe(350);
  });

  it("never returns a negative or zero bar width", () => {
    const bands = bandScale(3, [0, 300], 0.4);
    expect(bands.width).toBeGreaterThan(0);
    expect(bands.width).toBeLessThan(bands.bandWidth);
  });

  it("survives a single category", () => {
    const bands = bandScale(1, [0, 100], 0.2);
    expect(Number.isFinite(bands.center(0))).toBe(true);
    expect(bands.width).toBeGreaterThan(0);
  });
});

describe("smoothPath", () => {
  it("starts at the first point and ends at the last", () => {
    const points = [
      { x: 0, y: 10 },
      { x: 10, y: 20 },
      { x: 20, y: 5 },
    ];
    const path = smoothPath(points);
    expect(path.startsWith("M 0 10")).toBe(true);
    expect(path).toContain("20 5");
    expect(path).not.toContain("NaN");
  });

  it("does not overshoot the data's vertical range", () => {
    // A naive spline dips below the minimum here; the clamped control points
    // must keep every curve within the points' own bounds.
    const points = [
      { x: 0, y: 100 },
      { x: 10, y: 100 },
      { x: 20, y: 0 },
      { x: 30, y: 100 },
      { x: 40, y: 100 },
    ];
    const path = smoothPath(points);
    const numbers = path.match(/-?\d+(\.\d+)?/g)!.map(Number);
    const ys = numbers.filter((_, i) => i % 2 === 1);
    expect(Math.max(...ys)).toBeLessThanOrEqual(100.001);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(-0.001);
  });

  it("handles one and two point series", () => {
    expect(smoothPath([{ x: 5, y: 5 }])).toBe("M 5 5");
    expect(smoothPath([])).toBe("");
    expect(smoothPath([{ x: 0, y: 0 }, { x: 10, y: 10 }])).toContain("L 10 10");
  });
});

describe("arcPath", () => {
  it("produces a donut arc with an inner radius", () => {
    const path = arcPath(100, 100, 80, 50, 0, Math.PI / 2);
    expect(path).not.toContain("NaN");
    expect(path.match(/A /g)!.length).toBe(2);
  });

  it("splits a full circle rather than drawing nothing", () => {
    const path = arcPath(100, 100, 80, 50, 0, Math.PI * 2);
    expect(path).not.toContain("NaN");
    expect(path.length).toBeGreaterThan(20);
  });

  it("draws a solid wedge from the centre when the inner radius is zero", () => {
    const path = arcPath(50, 50, 40, 0, 0, Math.PI / 3);
    // Starts at the centre, so the slice is a filled wedge rather than a ring.
    expect(path.startsWith("M 50 50 L ")).toBe(true);
    expect(path.endsWith("Z")).toBe(true);
  });
});

describe("formatValue", () => {
  it("compacts large numbers", () => {
    expect(formatValue(1200, { compact: true })).toBe("1.2k");
    expect(formatValue(3_400_000, { compact: true })).toBe("3.4M");
  });

  it("drops trailing zeroes on integers", () => {
    expect(formatValue(42)).toBe("42");
    expect(formatValue(42.5)).toBe("42.5");
  });

  it("returns a placeholder for NaN instead of printing NaN", () => {
    expect(formatValue(Number.NaN)).toBe("—");
  });
});

describe("plotArea", () => {
  it("subtracts padding on each side", () => {
    const plot = plotArea(400, 300, { top: 10, right: 20, bottom: 30, left: 40 });
    expect(plot.x).toBe(40);
    expect(plot.y).toBe(10);
    expect(plot.width).toBe(340);
    expect(plot.height).toBe(260);
    expect(plot.right).toBe(380);
    expect(plot.bottom).toBe(270);
  });
});

describe("seriesColor", () => {
  it("cycles through the palette", () => {
    expect(seriesColor(0)).toBe(seriesColor(7));
  });

  it("uses a supplied palette", () => {
    const palette = ["red", "green"] as const;
    expect(seriesColor(0, palette)).toBe("red");
    expect(seriesColor(3, palette)).toBe("green");
  });
});

describe("charts render without NaN geometry", () => {
  const hasNaN = (element: HTMLElement) =>
    [...element.querySelectorAll("path,rect,circle,line,polygon")].some((node) => {
      const attrs = ["d", "points", "x", "y", "cx", "cy", "x1", "y1", "x2", "y2", "width", "height"];
      return attrs.some((attr) => (node.getAttribute(attr) ?? "").includes("NaN"));
    });

  it("renders a line chart with an accessible label", () => {
    const { container } = render(
      <LineChart
        labels={["Jan", "Feb", "Mar"]}
        series={[{ name: "Revenue", values: [10, 25, 18] }]}
      />,
    );
    expect(screen.getByRole("img")).toBeTruthy();
    expect(hasNaN(container)).toBe(false);
  });

  it("renders stacked bars without NaN", () => {
    const { container } = render(
      <BarChart
        labels={["A", "B"]}
        stacked
        series={[
          { name: "One", values: [5, 9] },
          { name: "Two", values: [3, 4] },
        ]}
      />,
    );
    expect(hasNaN(container)).toBe(false);
  });

  it("shows an empty state instead of a broken plot", () => {
    render(<LineChart labels={[]} series={[]} />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("draws a pie chart with one slice per entry", () => {
    const { container } = render(
      <PieChart
        data={[
          { label: "A", value: 30 },
          { label: "B", value: 20 },
        ]}
      />,
    );
    expect(container.querySelectorAll("svg path").length).toBe(2);
    expect(hasNaN(container)).toBe(false);
  });

  it("does not divide by zero when all slices are zero", () => {
    render(<PieChart data={[{ label: "A", value: 0 }]} />);
    expect(screen.getByRole("status")).toBeTruthy();
  });
});
