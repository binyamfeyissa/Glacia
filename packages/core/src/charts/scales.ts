// Shared chart primitives.
//
// Every specialized chart in Glacia is built from these rather than repeating
// scale maths, axis drawing and formatting. Keeping them here means a
// LineChart, a BarChart and a ScatterChart place marks with the same rules, so
// tick counts, padding and baselines agree across the library.

/** A number in the data's own units. */
export type Value = number;

export type ScaleType = "linear" | "log";

/** Maps a value into pixel space along one axis. */
export interface Scale {
  /** value → pixel */
  (value: Value): number;
  /** pixel → value */
  invert(pixel: number): number;
  domain: [number, number];
  range: [number, number];
}

/**
 * A linear scale. When `nice` is set the domain is expanded outward to round
 * numbers, which is what stops axis labels reading like 0.0003 and 17,412.
 */
export function linearScale(
  domain: [number, number],
  range: [number, number],
  options: { nice?: boolean; ticks?: number } = {},
): Scale {
  let [d0, d1] = domain;
  if (d0 === d1) {
    // A flat series still needs a band to draw in.
    d0 = d0 === 0 ? 0 : d0 * 0.9;
    d1 = d1 === 0 ? 1 : d1 * 1.1;
  }
  const [r0, r1] = range;
  const span = d1 - d0;
  const scale = ((value: number) => r0 + ((value - d0) / span) * (r1 - r0)) as Scale;
  scale.invert = (pixel: number) => d0 + ((pixel - r0) / (r1 - r0)) * span;
  scale.domain = [d0, d1];
  scale.range = range;

  if (options.nice !== false) {
    const nice = niceDomain(d0, d1, options.ticks ?? 5);
    const nspan = nice[1] - nice[0] || 1;
    const shim = ((value: number) => r0 + ((value - nice[0]) / nspan) * (r1 - r0)) as Scale;
    shim.invert = (pixel: number) => nice[0] + ((pixel - r0) / (r1 - r0)) * nspan;
    shim.domain = nice;
    shim.range = range;
    return shim;
  }
  return scale;
}

/** Rounds a domain outward to values that read cleanly on an axis. */
export function niceDomain(min: number, max: number, tickCount = 5): [number, number] {
  if (min === max) return [min === 0 ? 0 : min * 0.9, max === 0 ? 1 : max * 1.1];
  const span = max - min;
  const step = Math.pow(10, Math.floor(Math.log10(span / tickCount)));
  const error = (span / tickCount) / step;
  const factor = error >= 7.5 ? 10 : error >= 3.5 ? 5 : error >= 1.5 ? 2 : 1;
  const niceStep = step * factor;
  const start = Math.floor(min / niceStep) * niceStep;
  const end = Math.ceil(max / niceStep) * niceStep;
  return [start, end];
}

/** Evenly spaced tick values across a domain. */
export function ticks(domain: [number, number], count = 5): number[] {
  const [d0, d1] = domain;
  if (d0 === d1) return [d0];
  return Array.from({ length: count + 1 }, (_, i) => d0 + ((d1 - d0) * i) / count);
}

/** Maps an index into an evenly divided band, returning its centre and width. */
export function bandScale(count: number, range: [number, number], padding = 0.2) {
  const [r0, r1] = range;
  const step = (r1 - r0) / Math.max(1, count);
  const width = step * (1 - padding);
  return {
    bandWidth: step,
    width,
    /** Left edge of band i. */
    start: (i: number) => r0 + i * step + (step - width) / 2,
    /** Centre of band i. */
    center: (i: number) => r0 + i * step + step / 2,
  };
}

/**
 * Builds the `d` attribute of a smooth path through points, using a monotone
 * cubic so the curve never overshoots the data (a cubic spline through noisy
 * values can invent peaks that aren't in the series).
 */
export function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;
  if (points.length === 2) {
    return `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}`;
  }

  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;

    const t = 0.2;
    const c1x = p1.x + (p2.x - p0.x) * t;
    const c1y = p1.y + (p2.y - p0.y) * t;
    const c2x = p2.x - (p3.x - p1.x) * t;
    const c2y = p2.y - (p3.y - p1.y) * t;

    // Clamp control points so the curve stays within the segment's y-range.
    const lo = Math.min(p1.y, p2.y);
    const hi = Math.max(p1.y, p2.y);
    const cy1 = Math.min(hi, Math.max(lo, c1y));
    const cy2 = Math.min(hi, Math.max(lo, c2y));

    d += ` C ${c1x} ${cy1} ${c2x} ${cy2} ${p2.x} ${p2.y}`;
  }
  return d;
}

/** Closed area beneath a line path. */
export function areaPath(points: { x: number; y: number }[], baseline: number, smooth = true): string {
  if (points.length === 0) return "";
  const top = smooth ? smoothPath(points) : `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
  const last = points[points.length - 1]!;
  const first = points[0]!;
  return `${top} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

/** A pie/donut arc as a path, with optional inner radius. */
export function arcPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;
  // A full circle cannot be drawn as one arc; split it in two halves.
  if (sweep >= Math.PI * 2 - 1e-6) {
    const mid = startAngle + Math.PI;
    return (
      arcPath(cx, cy, outer, inner, startAngle, mid) +
      " " +
      arcPath(cx, cy, outer, inner, mid, endAngle - 1e-6)
    );
  }
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  const large = sweep > Math.PI ? 1 : 0;
  const [x1, y1] = p(outer, startAngle);
  const [x2, y2] = p(outer, endAngle);

  if (inner <= 0) {
    return `M ${cx} ${cy} L ${x1} ${y1} A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  const [x3, y3] = p(inner, endAngle);
  const [x4, y4] = p(inner, startAngle);
  return `M ${x1} ${y1} A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`;
}

/** Compact number formatting: 1.2k, 3.4M, and so on. */
export function formatValue(value: number, options: { compact?: boolean; decimals?: number } = {}): string {
  const { compact = false, decimals } = options;
  if (Number.isNaN(value)) return "—";
  if (compact) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return trim(value / 1_000_000_000) + "B";
    if (abs >= 1_000_000) return trim(value / 1_000_000) + "M";
    if (abs >= 1_000) return trim(value / 1_000) + "k";
  }
  const fixed = decimals ?? (Number.isInteger(value) ? 0 : 2);
  // Strip filler zeroes from the fractional part only: 42.50 → 42.5,
  // 42.00 → 42. A plain /\.0+$/ would leave 42.50 untouched.
  return value
    .toFixed(fixed)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}

function trim(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

/** The plot area inside a chart's padding, in chart units. */
export interface Plot {
  x: number;
  y: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export function plotArea(
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
): Plot {
  return {
    x: padding.left,
    y: padding.top,
    width: Math.max(0, width - padding.left - padding.right),
    height: Math.max(0, height - padding.top - padding.bottom),
    right: width - padding.right,
    bottom: height - padding.bottom,
  };
}

/** Pillow-soft series of colours used when a caller gives no palette. */
export const SERIES_COLORS = [
  "var(--gl-chart-1, #0088ff)",
  "var(--gl-chart-2, #34c759)",
  "var(--gl-chart-3, #ff9f0a)",
  "var(--gl-chart-4, #ff375f)",
  "var(--gl-chart-5, #bf5af2)",
  "var(--gl-chart-6, #64d2ff)",
  "var(--gl-chart-7, #ffd60a)",
] as const;

export const seriesColor = (index: number, palette?: readonly string[]): string =>
  (palette ?? SERIES_COLORS)[index % (palette ?? SERIES_COLORS).length]!;
