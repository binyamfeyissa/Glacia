// Glacia's chart layer.
//
// Charts share one set of primitives (scales, frame, tooltip) so axes, tick
// counts, formatting and hover behaviour agree across the library. Each chart
// exposes an API shaped to its own data rather than a generic bag of options.

export {
  linearScale,
  niceDomain,
  ticks,
  bandScale,
  smoothPath,
  areaPath,
  arcPath,
  formatValue,
  plotArea,
  seriesColor,
  SERIES_COLORS,
  type Scale,
  type Plot,
  type Value,
} from "./scales";

export { ChartFrame, ChartEmpty, ChartLoading, type ChartFrameProps } from "./chart-frame";
export { ChartTooltip, TooltipRow } from "./chart-tooltip";
export { useChartWidth } from "./use-chart-width";

export { LineChart, type LineChartProps, type LineSeries } from "./line-chart";
export { BarChart, type BarChartProps, type BarSeries } from "./bar-chart";
export {
  AreaChart,
  MirrorAreaChart,
  type AreaChartProps,
  type MirrorAreaChartProps,
  type MirrorAreaSeries,
} from "./area-chart";

export { PieChart, RingChart, type PieChartProps, type RingChartProps, type Slice } from "./radial-chart";
export {
  ScatterChart,
  BubbleChart,
  type ScatterChartProps,
  type BubbleChartProps,
  type ScatterPoint,
  type ScatterSeries,
} from "./scatter-chart";
export { HeatmapChart, type HeatmapChartProps, type HeatmapCell } from "./heatmap-chart";
export { RadarChart, type RadarChartProps, type RadarSeries } from "./radar-chart";
export { FunnelChart, type FunnelChartProps, type FunnelStage } from "./funnel-chart";
export { WaterfallChart, type WaterfallChartProps, type WaterfallStep } from "./waterfall-chart";
export { CandlestickChart, type CandlestickChartProps, type Candle } from "./candlestick-chart";
export { TreemapChart, type TreemapChartProps, type TreemapItem } from "./treemap-chart";
export { SankeyChart, type SankeyChartProps, type SankeyNode, type SankeyLink } from "./sankey-chart";
export { BumpChart, HexChart, type BumpChartProps, type BumpSeries, type HexChartProps, type HexPoint } from "./bump-chart";
export { PolarAreaChart, PyramidChart, type PolarAreaChartProps, type PolarSegment, type PyramidChartProps, type PyramidLevel } from "./polar-chart";
export { LiveLineChart, type LiveLineChartProps } from "./live-line-chart";
export { PlotChart, type PlotChartProps, type PlotMark } from "./plot-chart";
