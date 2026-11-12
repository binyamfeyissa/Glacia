// Native chart scales.
//
// This mirrors the web package's chart maths so a series drawn on a phone and
// the same series drawn in a browser land on the same axis values. It is
// deliberately duplicated rather than imported from `glacia`: glacia-native is
// a standalone package with no dependency on the web build.

/** Maps a value into pixel space along one axis. */
export interface Scale {
  (value: number): number;
  invert(pixel: number): number;
  domain: [number, number];
  range: [number, number];
}

export function linearScale(
  domain: [number, number],
  range: [number, number],
  options: { nice?: boolean; ticks?: number } = {},
): Scale {
  let [d0, d1] = domain;
  if (d0 === d1) {
    d0 = d0 === 0 ? 0 : d0 * 0.9;
    d1 = d1 === 0 ? 1 : d1 * 1.1;
  }

  const base: [number, number] =
    options.nice === false ? [d0, d1] : niceDomain(d0, d1, options.ticks ?? 5);
  const [a, b] = base;
  const [r0, r1] = range;
  const span = b - a || 1;

  const scale = ((value: number) => r0 + ((value - a) / span) * (r1 - r0)) as Scale;
  scale.invert = (pixel: number) => a + ((pixel - r0) / (r1 - r0)) * span;
  scale.domain = [a, b];
  scale.range = range;
  return scale;
}

/** Rounds a domain outward to values that read cleanly on an axis. */
export function niceDomain(min: number, max: number, tickCount = 5): [number, number] {
  if (min === max) return [min === 0 ? 0 : min * 0.9, max === 0 ? 1 : max * 1.1];
  const span = max - min;
  const step = Math.pow(10, Math.floor(Math.log10(span / tickCount)));
  const error = span / tickCount / step;
  const factor = error >= 7.5 ? 10 : error >= 3.5 ? 5 : error >= 1.5 ? 2 : 1;
  const niceStep = step * factor;
  return [Math.floor(min / niceStep) * niceStep, Math.ceil(max / niceStep) * niceStep];
}

export function ticks(domain: [number, number], count = 4): number[] {
  const [d0, d1] = domain;
  if (d0 === d1) return [d0];
  return Array.from({ length: count + 1 }, (_, i) => d0 + ((d1 - d0) * i) / count);
}

/** Evenly divided bands; returns the centre and width of each. */
export function bandScale(count: number, range: [number, number], padding = 0.2) {
  const [r0, r1] = range;
  const step = (r1 - r0) / Math.max(1, count);
  const width = step * (1 - padding);
  return {
    bandWidth: step,
    width,
    start: (i: number) => r0 + i * step + (step - width) / 2,
    center: (i: number) => r0 + i * step + step / 2,
  };
}

/** Compact number formatting, matching the web charts. */
export function formatValue(
  value: number,
  options: { compact?: boolean; decimals?: number } = {},
): string {
  if (Number.isNaN(value)) return "—";
  if (options.compact) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return trim(value / 1_000_000_000) + "B";
    if (abs >= 1_000_000) return trim(value / 1_000_000) + "M";
    if (abs >= 1_000) return trim(value / 1_000) + "k";
  }
  const fixed = options.decimals ?? (Number.isInteger(value) ? 0 : 2);
  return value
    .toFixed(fixed)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}

function trim(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

/** Points along a smooth (monotone) path, as SVG path segments. */
export function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;
  if (points.length === 2) return `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}`;

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

    // Clamp so the curve cannot overshoot the segment's own y-range.
    const lo = Math.min(p1.y, p2.y);
    const hi = Math.max(p1.y, p2.y);
    d += ` C ${c1x} ${Math.min(hi, Math.max(lo, c1y))} ${c2x} ${Math.min(hi, Math.max(lo, c2y))} ${p2.x} ${p2.y}`;
  }
  return d;
}

/** A pie/donut arc, with an optional inner radius. */
export function arcPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;
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

export const SERIES_COLORS = [
  "#0088ff",
  "#34c759",
  "#ff9f0a",
  "#ff375f",
  "#bf5af2",
  "#64d2ff",
  "#ffd60a",
] as const;

export const seriesColor = (index: number, palette?: readonly string[]): string =>
  (palette ?? SERIES_COLORS)[index % (palette ?? SERIES_COLORS).length]!;
