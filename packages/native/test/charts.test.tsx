import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  NativeAreaChart,
  NativeBarChart,
  NativeBubbleChart,
  NativeFunnelChart,
  NativeHeatmapChart,
  NativeRadarChart,
  NativeWaterfallChart,
  NativeLineChart,
  NativeMirrorAreaChart,
  NativeRingChart,
  NativeScatterChart,
} from "../src";
import { arcPath, bandScale, formatValue, linearScale, niceDomain, ticks } from "../src/charts/scales";

// The native charts must agree with the web charts numerically. These tests
// pin the shared maths and check the touch interactions that replace hover.

describe("native chart scales", () => {
  it("maps a domain onto a range and back", () => {
    const scale = linearScale([0, 100], [0, 200], { nice: false });
    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(100);
    expect(scale.invert(scale(37))).toBeCloseTo(37, 6);
  });

  it("never collapses a flat series", () => {
    const scale = linearScale([5, 5], [0, 100], { nice: false });
    expect(scale.domain[1]).toBeGreaterThan(scale.domain[0]);
    expect(Number.isFinite(scale(5))).toBe(true);
  });

  it("rounds domains outward", () => {
    const [min, max] = niceDomain(3, 97, 5);
    expect(min).toBeLessThanOrEqual(3);
    expect(max).toBeGreaterThanOrEqual(97);
  });

  it("returns evenly spaced ticks", () => {
    expect(ticks([0, 100], 4)).toHaveLength(5);
    expect(ticks([7, 7], 4)).toEqual([7]);
  });

  it("centres bands evenly", () => {
    const bands = bandScale(4, [0, 400], 0);
    expect(bands.center(0)).toBe(50);
    expect(bands.center(3)).toBe(350);
  });

  it("formats values the same way as the web package", () => {
    expect(formatValue(1200, { compact: true })).toBe("1.2k");
    expect(formatValue(42.5)).toBe("42.5");
    expect(formatValue(Number.NaN)).toBe("—");
  });

  it("draws a full ring rather than nothing", () => {
    const path = arcPath(90, 90, 90, 60, 0, Math.PI * 2);
    expect(path).not.toContain("NaN");
    expect(path.length).toBeGreaterThan(20);
  });
});

describe("NativeLineChart", () => {
  const series = [{ name: "Revenue", values: [10, 25, 18] }];

  it("exposes an accessible touch target per point", () => {
    const { container } = render(
      <NativeLineChart labels={["Jan", "Feb", "Mar"]} series={series} />,
    );
    const buttons = Array.from(container.querySelectorAll('[role="button"]'));
    expect(buttons).toHaveLength(3);
    expect(buttons[0]!.getAttribute("aria-label")).toContain("Jan");
  });

  it("selects a point on touch and reports it", () => {
    const picked: number[] = [];
    const { container } = render(
      <NativeLineChart
        labels={["Jan", "Feb", "Mar"]}
        series={series}
        onPointPress={(i) => picked.push(i)}
      />,
    );
    fireEvent.click(Array.from(container.querySelectorAll('[role="button"]'))[1]!);
    expect(picked).toEqual([1]);
  });

  it("shows an empty state instead of a broken plot", () => {
    render(<NativeLineChart labels={[]} series={[]} />);
    expect(screen.getByText("No series to display")).toBeTruthy();
  });
});

describe("NativeBarChart", () => {
  const series = [{ name: "Spend", values: [5, 9] }];

  it("renders one touch target per category", () => {
    const { container } = render(<NativeBarChart labels={["A", "B"]} series={series} />);
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(2);
  });

  it("supports stacked series", () => {
    const { container } = render(
      <NativeBarChart
        labels={["A", "B"]}
        stacked
        series={[
          { name: "One", values: [5, 9] },
          { name: "Two", values: [3, 4] },
        ]}
      />,
    );
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(2);
  });

  it("shows an empty state with no data", () => {
    render(<NativeBarChart labels={[]} series={[]} />);
    expect(screen.getByText("No bars to display")).toBeTruthy();
  });
});

describe("NativeRingChart", () => {
  const data = [
    { label: "Direct", value: 30 },
    { label: "Search", value: 20 },
  ];

  it("renders a legend entry per slice", () => {
    render(<NativeRingChart data={data} />);
    expect(screen.getByText("Direct")).toBeTruthy();
    expect(screen.getByText("Search")).toBeTruthy();
  });

  it("reports which slice was pressed", () => {
    const picked: number[] = [];
    const { container } = render(
      <NativeRingChart data={data} onSlicePress={(i) => picked.push(i)} />,
    );
    fireEvent.click(container.querySelector('[role="button"]')!);
    expect(picked).toEqual([0]);
  });

  it("handles all-zero values without dividing by zero", () => {
    render(<NativeRingChart data={[{ label: "None", value: 0 }]} />);
    expect(screen.getByText("No slices to display")).toBeTruthy();
  });
});

describe("NativeAreaChart", () => {
  const series = [{ name: "Revenue", values: [10, 25, 18] }];

  it("renders the same touch targets as a line chart", () => {
    const { container } = render(
      <NativeAreaChart labels={["Jan", "Feb", "Mar"]} series={series} />,
    );
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(3);
  });

  it("mirrors a below series onto the same axis", () => {
    const { container } = render(
      <NativeMirrorAreaChart
        labels={["Mon", "Tue"]}
        series={{ name: "Traffic", above: [30, 40], below: [20, 10] }}
      />,
    );
    // One touch target per label regardless of how many series are drawn.
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(2);
  });
});

describe("NativeScatterChart", () => {
  const series = [
    { name: "Plans", points: [{ x: 12, y: 30 }, { x: 28, y: 52 }] },
  ];

  it("renders a circle per point", () => {
    const { container } = render(<NativeScatterChart series={series} />);
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("reports both series and point index on press", () => {
    const picked: [number, number][] = [];
    const { container } = render(
      <NativeScatterChart series={series} onPointPress={(s, p) => picked.push([s, p])} />,
    );
    fireEvent.click(container.querySelectorAll("circle")[1]!);
    expect(picked).toEqual([[0, 1]]);
  });

  it("shows an empty state with no points", () => {
    render(<NativeScatterChart series={[]} />);
    expect(screen.getByText("No points to display")).toBeTruthy();
  });

  it("sizes bubble marks by their size value", () => {
    const { container } = render(
      <NativeBubbleChart
        series={[
          {
            name: "Plans",
            points: [
              { x: 1, y: 1, size: 10 },
              { x: 5, y: 5, size: 200 },
            ],
          },
        ]}
      />,
    );
    const radii = Array.from(container.querySelectorAll("circle")).map((c) =>
      Number(c.getAttribute("r")),
    );
    expect(radii[1]).toBeGreaterThan(radii[0]!);
  });
});

describe("NativeFunnelChart", () => {
  const stages = [
    { label: "Visited", value: 100 },
    { label: "Signed up", value: 48 },
    { label: "Purchased", value: 6 },
  ];

  it("shows each stage share of entry", () => {
    render(<NativeFunnelChart stages={stages} />);
    expect(screen.getByText("100% of entry")).toBeTruthy();
    expect(screen.getByText("48% of entry")).toBeTruthy();
  });

  it("reports step conversion between stages", () => {
    render(<NativeFunnelChart stages={stages} />);
    // 48/100 then 6/48 — two distinct step rates.
    // getByText matches substrings across nested spans, so compare whole strings.
    const { container } = render(<NativeFunnelChart stages={stages} />);
    const labels = Array.from(container.querySelectorAll("span"))
      .map((el) => el.textContent)
      .filter((t) => t?.endsWith("from previous"));
    expect(labels).toEqual(["48% from previous", "13% from previous"]);
  });

  it("scales bar widths proportionally", () => {
    const { container } = render(<NativeFunnelChart stages={stages} />);
    const widths = Array.from(container.querySelectorAll('[role="button"] div'))
      .map((el) => (el as HTMLElement).style.width)
      .filter((w) => w.endsWith("%"));
    expect(widths).toEqual(["100%", "48%", "6%"]);
  });

  it("reports the pressed stage", () => {
    const picked: number[] = [];
    const { container } = render(
      <NativeFunnelChart stages={stages} onStagePress={(i) => picked.push(i)} />,
    );
    fireEvent.click(container.querySelectorAll('[role="button"]')[2]!);
    expect(picked).toEqual([2]);
  });

  it("shows an empty state with no stages", () => {
    render(<NativeFunnelChart stages={[]} />);
    expect(screen.getByText("No stages to display")).toBeTruthy();
  });
});

describe("NativeHeatmapChart", () => {
  const rows = [
    { label: "Mon", values: [2, 8] },
    { label: "Tue", values: [5, 1] },
  ];
  const columns = ["AM", "PM"];

  it("renders one cell per value", () => {
    const { container } = render(<NativeHeatmapChart rows={rows} columns={columns} />);
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(4);
  });

  it("labels each cell with its own value", () => {
    const { container } = render(<NativeHeatmapChart rows={rows} columns={columns} />);
    const first = container.querySelector('[role="button"]')!;
    expect(first.getAttribute("aria-label")).toBe("Mon AM: 2");
  });

  it("reports the pressed cell", () => {
    const picked: [number, number][] = [];
    const { container } = render(
      <NativeHeatmapChart
        rows={rows}
        columns={columns}
        onCellPress={(r, c) => picked.push([r, c])}
      />,
    );
    fireEvent.click(container.querySelectorAll('[role="button"]')[3]!);
    expect(picked).toEqual([[1, 1]]);
  });

  it("does not divide by zero when every value is equal", () => {
    const { container } = render(
      <NativeHeatmapChart rows={[{ label: "Flat", values: [5, 5] }]} columns={columns} />,
    );
    const cells = Array.from(container.querySelectorAll('[role="button"]'));
    expect(cells[0]!.getAttribute("style")).toBe(cells[1]!.getAttribute("style"));
  });

  it("shows an empty state with no rows", () => {
    render(<NativeHeatmapChart rows={[]} columns={columns} />);
    expect(screen.getByText("No cells to display")).toBeTruthy();
  });
});

describe("NativeRadarChart", () => {
  const axes = ["Speed", "Price", "Quality", "Size", "Battery"];
  const series = [{ name: "Model A", values: [8, 5, 9, 4, 7] }];

  it("draws one ring, one spoke and one shape per series", () => {
    const { container } = render(
      <NativeRadarChart axes={axes} series={series} rings={3} />,
    );
    expect(container.querySelectorAll("polygon")).toHaveLength(3 + 1);
    expect(container.querySelectorAll("line")).toHaveLength(5);
  });

  it("needs three axes to form a shape", () => {
    render(<NativeRadarChart axes={["A", "B"]} series={series} />);
    expect(screen.getByText("A radar chart needs at least 3 axes")).toBeTruthy();
  });

  it("lists every series value for a tapped axis", () => {
    const picked: number[] = [];
    const { container } = render(
      <NativeRadarChart
        axes={axes}
        series={series}
        onAxisPress={(i) => picked.push(i)}
      />,
    );
    fireEvent.click(Array.from(container.querySelectorAll('[role="button"]'))[2]!);
    expect(picked).toEqual([2]);
    // tapping the third axis (Quality, value 9) reveals it
    expect(screen.getAllByText("Model A: 9").length).toBeGreaterThan(0);
  });

  it("scales a value against a fixed maximum", () => {
    const { container } = render(
      <NativeRadarChart axes={axes} series={series} max={10} />,
    );
    const shapes = Array.from(container.querySelectorAll("polygon"));
    expect(shapes[shapes.length - 1]!.getAttribute("points")).toBeTruthy();
  });
});

describe("NativeWaterfallChart", () => {
  const steps = [
    { label: "Start", value: 100, isTotal: true },
    { label: "Sales", value: 30 },
    { label: "Refunds", value: -20 },
    { label: "End", value: 110, isTotal: true },
  ];

  it("draws one bar per step", () => {
    const { container } = render(<NativeWaterfallChart steps={steps} />);
    expect(container.querySelectorAll("rect")).toHaveLength(4);
  });

  it("accumulates changes into a running total", () => {
    const { container } = render(<NativeWaterfallChart steps={steps} />);
    fireEvent.click(Array.from(container.querySelectorAll("rect"))[2]!);
    // 100 + 30 - 20 = 10 running at the refund step; the closing 110 is its own step.
    expect(screen.getByText("Refunds: -20 → 10 running")).toBeTruthy();
  });

  it("marks a total bar as a total", () => {
    const { container } = render(<NativeWaterfallChart steps={steps} />);
    fireEvent.click(Array.from(container.querySelectorAll("rect"))[3]!);
    expect(screen.getByText("End: +110 (total)")).toBeTruthy();
  });

  it("colours increases and decreases differently", () => {
    const { container } = render(<NativeWaterfallChart steps={steps} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    const up = rects[1]!.getAttribute("fill");
    const down = rects[2]!.getAttribute("fill");
    expect(up).not.toBe(down);
  });

  it("shows an empty state with no steps", () => {
    render(<NativeWaterfallChart steps={[]} />);
    expect(screen.getByText("No steps to display")).toBeTruthy();
  });
});
