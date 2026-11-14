"use client";

import {
  AreaChart,
  BarChart,
  BumpChart,
  CandlestickChart,
  FunnelChart,
  HeatmapChart,
  HexChart,
  LineChart,
  LiveLineChart,
  MirrorAreaChart,
  PieChart,
  PlotChart,
  PolarAreaChart,
  RadarChart,
  WaterfallChart,
} from "glacia";

// One real, hand-checked dataset per chart so the docs show the shape each
// chart is actually good at rather than repeating the same mock numbers.
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const spend = [42, 58, 51, 74, 66, 88];
const revenue = [58, 61, 70, 79, 88, 104];

const chartCases: Record<string, () => React.ReactNode> = {
  "line-chart": () => (
    <LineChart
      labels={months}
      height={200}
      series={[
        { name: "Spend", values: spend },
        { name: "Revenue", values: revenue },
      ]}
    />
  ),
  "area-chart": () => (
    <AreaChart
      labels={months}
      height={200}
      series={[{ name: "Revenue", values: revenue }]}
    />
  ),
  "mirror-area-chart": () => (
    <MirrorAreaChart
      labels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
      height={200}
      series={{ name: "Traffic", above: [32, 48, 41, 56, 62], below: [18, 24, 30, 21, 27] }}
    />
  ),
  "bar-chart": () => (
    <BarChart
      labels={months}
      height={200}
      series={[{ name: "Spend", values: spend }]}
    />
  ),
  "bar-stacked": () => (
    <BarChart
      labels={months}
      height={200}
      stacked
      series={[
        { name: "Spend", values: spend },
        { name: "Revenue", values: revenue },
      ]}
    />
  ),
  "pie-chart": () => (
    <PieChart
      size={180}
      data={[
        { label: "Direct", value: 38 },
        { label: "Search", value: 27 },
        { label: "Social", value: 20 },
        { label: "Email", value: 15 },
      ]}
    />
  ),
  "radar-chart": () => (
    <RadarChart
      size={220}
      axes={["Speed", "Quality", "Cost", "Support", "Uptime", "Docs"]}
      series={[
        { name: "Current", values: [78, 84, 66, 72, 94, 58] },
        { name: "Competitor", values: [62, 70, 82, 55, 88, 70] },
      ]}
    />
  ),
  "funnel-chart": () => (
    <FunnelChart
      stages={[
        { label: "Visited", value: 12400 },
        { label: "Signed up", value: 4210 },
        { label: "Activated", value: 1980 },
        { label: "Paid", value: 640 },
      ]}
    />
  ),
  "waterfall-chart": () => (
    <WaterfallChart
      height={200}
      steps={[
        { label: "Start", total: true },
        { label: "New", value: 480 },
        { label: "Expansion", value: 210 },
        { label: "Churn", value: -160 },
        { label: "Downgrade", value: -90 },
        { label: "End", total: true },
      ]}
    />
  ),
  "candlestick-chart": () => (
    <CandlestickChart
      height={200}
      candles={[
        { label: "Mon", open: 100, high: 112, low: 96, close: 108 },
        { label: "Tue", open: 108, high: 115, low: 102, close: 104 },
        { label: "Wed", open: 104, high: 99, low: 88, close: 92 },
        { label: "Thu", open: 92, high: 106, low: 90, close: 102 },
        { label: "Fri", open: 102, high: 118, low: 100, close: 115 },
      ]}
    />
  ),
  "heatmap-chart": () => (
    <HeatmapChart
      rows={["Mon", "Tue", "Wed", "Thu", "Fri"]}
      columns={["9a", "11a", "1p", "3p", "5p", "7p"]}
      cells={["Mon", "Tue", "Wed", "Thu", "Fri"].flatMap((_, y) =>
        ["9a", "11a", "1p", "3p", "5p", "7p"].map((_, x) => ({
          x,
          y,
          value: Math.round(20 + Math.sin(x * 1.3 + y) * 14 + x * 6),
        })),
      )}
    />
  ),
  "hex-chart": () => (
    <HexChart
      radius={13}
      points={Array.from({ length: 48 }, (_, i) => ({
        q: i % 8,
        r: Math.floor(i / 8),
        value: Math.round(30 + Math.cos(i * 0.9) * 22),
      }))}
    />
  ),
  "bump-chart": () => (
    <BumpChart
      height={200}
      labels={["W1", "W2", "W3", "W4", "W5", "W6"]}
      series={[
        { name: "Alpha", ranks: [1, 2, 2, 3, 2, 1] },
        { name: "Beta", ranks: [2, 1, 3, 2, 1, 2] },
        { name: "Gamma", ranks: [3, 3, 1, 1, 3, 3] },
      ]}
    />
  ),
  "polar-area-chart": () => (
    <PolarAreaChart
      size={200}
      segments={[
        { label: "North", value: 62 },
        { label: "East", value: 48 },
        { label: "South", value: 74 },
        { label: "West", value: 39 },
      ]}
    />
  ),
  "live-line-chart": () => <LiveLineChart height={180} />,
  "plot-chart": () => (
    <PlotChart
      height={200}
      marks={[
        { category: "Mon", value: 32, color: "var(--gl-chart-1)" },
        { category: "Tue", value: 58, color: "var(--gl-chart-2)" },
        { category: "Wed", value: 44, color: "var(--gl-chart-3)" },
        { category: "Thu", value: 71, color: "var(--gl-chart-4)" },
      ]}
    />
  ),
};

export function ChartDemo({ slug }: { slug: string }) {
  const render = chartCases[slug];
  if (!render) {
    return <p className="doc-note">No preview is wired for “{slug}”.</p>;
  }
  return <div className="chart-demo">{render()}</div>;
}

// Only keys that correspond to a catalog slug; `bar-stacked` is an extra
// variant shown inside the Bar Chart docs rather than its own page.
export const CHART_SLUGS = Object.keys(chartCases).filter((key) => key !== "bar-stacked");
