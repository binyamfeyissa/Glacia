import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  NativeBumpChart,
  NativeCandlestickChart,
  NativeHexChart,
  NativeLiveLineChart,
  NativePlotChart,
  NativePolarAreaChart,
  NativePyramidChart,
  NativeSankeyChart,
  NativeTreemapChart,
} from "../src";

describe("NativePolarAreaChart", () => {
  const segments = [
    { label: "A", value: 10 },
    { label: "B", value: 25 },
    { label: "C", value: 5 },
  ];

  it("draws one wedge per segment", () => {
    const { container } = render(<NativePolarAreaChart segments={segments} />);
    expect(container.querySelectorAll("path")).toHaveLength(3);
  });

  it("reports a pressed segment", () => {
    const picked: number[] = [];
    const { container } = render(
      <NativePolarAreaChart segments={segments} onSegmentPress={(i) => picked.push(i)} />,
    );
    fireEvent.click(container.querySelectorAll("path")[1]!);
    expect(picked).toEqual([1]);
  });

  it("shows an empty state", () => {
    render(<NativePolarAreaChart segments={[]} />);
    expect(screen.getByText("No segments to display")).toBeTruthy();
  });
});

describe("NativePyramidChart", () => {
  const levels = [
    { label: "Base", value: 100 },
    { label: "Mid", value: 60 },
    { label: "Top", value: 25 },
  ];

  it("scales each band by its share of the widest", () => {
    const { container } = render(<NativePyramidChart levels={levels} />);
    const widths = Array.from(container.querySelectorAll('[role="button"] div'))
      .map((el) => (el as HTMLElement).style.width)
      .filter((w) => w.endsWith("%"));
    expect(widths).toEqual(["100%", "60%", "25%"]);
  });

  it("reports a pressed level", () => {
    const picked: number[] = [];
    const { container } = render(
      <NativePyramidChart levels={levels} onLevelPress={(i) => picked.push(i)} />,
    );
    fireEvent.click(container.querySelectorAll('[role="button"]')[2]!);
    expect(picked).toEqual([2]);
  });

  it("shows an empty state", () => {
    render(<NativePyramidChart levels={[]} />);
    expect(screen.getByText("No levels to display")).toBeTruthy();
  });
});

describe("NativeLiveLineChart", () => {
  it("renders a line for the current window", () => {
    const { container } = render(
      <NativeLiveLineChart
        labels={["a", "b", "c"]}
        series={[{ name: "Rate", values: [1, 2, 3] }]}
      />,
    );
    expect(container.querySelectorAll('[role="button"]').length).toBeGreaterThan(0);
  });
});

describe("NativeCandlestickChart", () => {
  const candles = [
    { label: "Mon", open: 10, high: 14, low: 9, close: 13 },
    { label: "Tue", open: 13, high: 15, low: 8, close: 9 },
  ];

  it("draws a wick and a body per candle", () => {
    const { container } = render(<NativeCandlestickChart candles={candles} />);
    expect(container.querySelectorAll("rect")).toHaveLength(2);
    expect(container.querySelectorAll("line").length).toBeGreaterThanOrEqual(2);
  });

  it("reveals the four prices on press", () => {
    const { container } = render(<NativeCandlestickChart candles={candles} />);
    fireEvent.click(container.querySelectorAll("rect")[1]!);
    expect(container.textContent).toContain("Tue");
    expect(container.textContent).toContain("H 15");
  });

  it("shows an empty state", () => {
    render(<NativeCandlestickChart candles={[]} />);
    expect(screen.getByText("No candles to display")).toBeTruthy();
  });
});

describe("NativeTreemapChart", () => {
  const items = [
    { label: "Alpha", value: 60 },
    { label: "Beta", value: 30 },
    { label: "Gamma", value: 10 },
  ];

  it("renders one tile per item", () => {
    const { container } = render(<NativeTreemapChart items={items} />);
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(3);
  });

  it("gives the largest item the most area", () => {
    const { container } = render(<NativeTreemapChart items={items} width={300} height={200} />);
    const tiles = Array.from(container.querySelectorAll('[role="button"]')).map((el) => {
      const style = (el as HTMLElement).style;
      return parseFloat(style.width) * parseFloat(style.height);
    });
    // Sorted largest first, so the first tile has the greatest area.
    expect(tiles[0]).toBeGreaterThan(tiles[2]!);
  });

  it("reports the pressed tile by its original index", () => {
    const picked: number[] = [];
    const { container } = render(
      <NativeTreemapChart items={items} onItemPress={(i) => picked.push(i)} />,
    );
    // Tiles are laid out largest-first; the last tile is Gamma, original index 2.
    fireEvent.click(container.querySelectorAll('[role="button"]')[2]!);
    expect(picked).toEqual([2]);
  });

  it("shows an empty state", () => {
    render(<NativeTreemapChart items={[]} />);
    expect(screen.getByText("No items to display")).toBeTruthy();
  });
});

describe("NativeSankeyChart", () => {
  const nodes = [
    { id: "a", label: "Visit" },
    { id: "b", label: "Sign up" },
    { id: "c", label: "Buy" },
  ];
  const links = [
    { from: "a", to: "b", value: 50 },
    { from: "b", to: "c", value: 20 },
  ];

  it("assigns columns by longest path", () => {
    const { container } = render(<NativeSankeyChart nodes={nodes} links={links} />);
    // Three stages produce three stage captions.
    expect(container.textContent).toContain("Start");
    expect(container.textContent).toContain("End");
  });

  it("shows an empty state without links", () => {
    render(<NativeSankeyChart nodes={nodes} links={[]} />);
    expect(screen.getByText("No flows to display")).toBeTruthy();
  });
});

describe("NativeBumpChart", () => {
  const labels = ["Q1", "Q2", "Q3"];
  const series = [
    { name: "Alpha", ranks: [1, 2, 1] },
    { name: "Beta", ranks: [2, 1, 3] },
  ];

  it("draws a circle per ranked point", () => {
    const { container } = render(<NativeBumpChart labels={labels} series={series} />);
    expect(container.querySelectorAll("circle")).toHaveLength(6);
  });

  it("puts rank 1 highest on the canvas", () => {
    const { container } = render(<NativeBumpChart labels={labels} series={series} width={300} height={200} />);
    const circles = Array.from(container.querySelectorAll("circle"));
    const alphaQ1 = Number(circles[0]!.getAttribute("cy"));
    const alphaQ2 = Number(circles[1]!.getAttribute("cy"));
    // Rank 1 (Q1) must sit above rank 2 (Q2), so a smaller cy.
    expect(alphaQ1).toBeLessThan(alphaQ2);
  });

  it("shows an empty state", () => {
    render(<NativeBumpChart labels={[]} series={[]} />);
    expect(screen.getByText("No rankings to display")).toBeTruthy();
  });
});

describe("NativeHexChart", () => {
  const points = [
    { x: 1, y: 2, value: 5 },
    { x: 2, y: 3, value: 9 },
    { x: 8, y: 9, value: 2 },
  ];

  it("bins points into hexagons", () => {
    const { container } = render(<NativeHexChart points={points} />);
    const bins = container.querySelectorAll("path");
    expect(bins.length).toBeGreaterThan(0);
    expect(bins.length).toBeLessThanOrEqual(3);
  });

  it("shows an empty state", () => {
    render(<NativeHexChart points={[]} />);
    expect(screen.getByText("No points to display")).toBeTruthy();
  });
});

describe("NativePlotChart", () => {
  const points = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
  ];

  it("draws a default mark per point", () => {
    const { container } = render(<NativePlotChart points={points} />);
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("hands real pixel scales to a custom renderer", () => {
    const seen: number[] = [];
    render(
      <NativePlotChart
        points={points}
        width={300}
        height={200}
        renderMark={({ x, y, points: pts }) => {
          seen.push(x(pts[0]!.x), y(pts[0]!.y));
          return null;
        }}
      />,
    );
    // The first point sits at the left edge and the bottom of the plot area.
    expect(seen[0]).toBeGreaterThan(0);
    expect(seen[0]).toBeLessThan(300);
    expect(seen[1]).toBeGreaterThan(0);
    expect(seen[1]).toBeLessThan(200);
  });

  it("shows an empty state", () => {
    // NativeScatterChart uses the same wording, so scope to this render.
    const { container } = render(<NativePlotChart points={[]} />);
    expect(container.textContent).toContain("No points to display");
  });
});
