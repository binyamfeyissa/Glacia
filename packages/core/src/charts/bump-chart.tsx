"use client";

import { useState } from "react";

import { ChartEmpty, ChartFrame } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import {
  bandScale,
  formatValue,
  linearScale,
  niceDomain,
  plotArea,
  seriesColor,
  smoothPath,
  ticks,
} from "./scales";
import { useChartWidth } from "./use-chart-width";

export interface BumpSeries {
  name: string;
  /** Rank per period, 1 = top. */
  ranks: (number | null)[];
  color?: string;
}

export interface BumpChartProps {
  labels: string[];
  series: BumpSeries[];
  height?: number;
  format?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 16, right: 60, bottom: 26, left: 26 };

/**
 * Position over time, where position is what matters rather than magnitude.
 *
 * Ranks are mapped so 1 sits at the top. Crossings are the signal this chart
 * exists for, so lines are drawn at full opacity and labelled at both ends.
 */
export function BumpChart({
  labels,
  series,
  height = 240,
  format,
  palette,
  className,
  ariaLabel,
}: BumpChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<number | null>(null);
  const plot = plotArea(width, height, PADDING);

  if (labels.length === 0 || series.length === 0) {
    return (
      <div ref={ref} className={className}>
        <ChartEmpty label="No series to display" />
      </div>
    );
  }

  const allRanks = series.flatMap((s) => s.ranks.filter((r): r is number => r != null));
  const maxRank = Math.max(...allRanks, series.length);
  const y = linearScale([1, maxRank], [plot.y, plot.bottom], { nice: false });
  const x = bandScale(labels.length, [plot.x, plot.right], 0);

  const yTicks = ticks([1, maxRank], Math.min(4, maxRank - 1 || 1)).map((v) => ({
    value: y(v),
    label: format ? format(v) : `#${formatValue(v)}`,
  }));

  return (
    <div ref={ref} className={className}>
      <div className="gl-chart-wrap">
        <ChartFrame
          width={width}
          height={height}
          plot={plot}
          yTicks={yTicks}
          xLabels={labels.map((label, i) => ({ x: x.center(i), label }))}
          ariaLabel={ariaLabel ?? `Rank over ${labels.length} periods for ${series.length} series`}
        >
          {series.map((s, si) => {
            const color = s.color ?? seriesColor(si, palette);
            const points = s.ranks.map((rank, i) => ({
              x: x.center(i),
              y: rank == null ? plot.bottom : y(rank),
            }));
            const line = smoothPath(points);

            return (
              <g key={s.name} opacity={hover === null || hover === si ? 1 : 0.35} style={{ transition: "opacity 140ms ease" }}>
                <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
                {points.map((p, i) =>
                  s.ranks[i] == null ? null : (
                    <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
                  ),
                )}
                {/* End label: with crossing lines, colour alone is not enough. */}
                <text
                  x={plot.right + 6}
                  y={points[points.length - 1]!.y + 3.5}
                  className="gl-chart-bump-label"
                  fill={color}
                >
                  {s.name}
                </text>
              </g>
            );
          })}

          {labels.map((_, i) => (
            <rect
              key={`hit-${i}`}
              x={x.center(i) - x.bandWidth / 2}
              y={plot.y}
              width={x.bandWidth}
              height={plot.height}
              fill="transparent"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
            />
          ))}
        </ChartFrame>

        <ChartTooltip
          visible={hover !== null}
          x={hover !== null ? Math.min(Math.max(x.center(hover), 64), width - 64) : 0}
          y={PADDING.top}
        >
          {hover !== null && (
            <>
              <span className="gl-chart-tooltip-title">{labels[hover]}</span>
              {series.map((s, si) => (
                <TooltipRow
                  key={s.name}
                  color={s.color ?? seriesColor(si, palette)}
                  label={s.name}
                  value={s.ranks[hover] == null ? "—" : `#${s.ranks[hover]}`}
                />
              ))}
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}

export interface HexPoint {
  /** Position in a hex grid: column and row. */
  q: number;
  r: number;
  value: number;
  label?: string;
}

export interface HexChartProps {
  points: HexPoint[];
  /** Hex radius in pixels. */
  radius?: number;
  minColor?: string;
  maxColor?: string;
  format?: (value: number) => string;
  className?: string;
  ariaLabel?: string;
}

/**
 * A tessellated grid of hexagons shaded by value.
 *
 * Rows are offset by half a cell so neighbours touch on all six sides, which
 * is the property that makes a hex grid read as continuous.
 */
export function HexChart({
  points,
  radius = 14,
  minColor = "var(--gl-chart-heat-min, rgb(0 136 255 / 0.08))",
  maxColor = "var(--gl-chart-1, #0088ff)",
  format,
  className,
  ariaLabel,
}: HexChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  if (points.length === 0) {
    return <ChartEmpty label="No cells to display" />;
  }

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const hexWidth = Math.sqrt(3) * radius;
  const vertical = radius * 1.5;

  const cols = Math.max(...points.map((p) => p.q)) + 1;
  const rows = Math.max(...points.map((p) => p.r)) + 1;
  const width = cols * hexWidth + hexWidth;
  const height = rows * vertical + radius * 2;

  const centerOf = (p: HexPoint) => ({
    x: hexWidth + p.q * hexWidth + (p.r % 2 ? hexWidth / 2 : 0),
    y: radius + p.r * vertical,
  });

  const hexPoints = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
    }).join(" ");

  const fmt = (value: number) => (format ? format(value) : formatValue(value));
  const shade = (value: number) =>
    `color-mix(in srgb, ${maxColor} ${Math.round(10 + ((value - min) / span) * 90)}%, ${minColor})`;

  return (
    <div className={className}>
      <div className="gl-chart-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          role="img"
          aria-label={ariaLabel ?? `Hexagonal grid with ${points.length} cells`}
          preserveAspectRatio="xMidYMid meet"
        >
          {points.map((point, i) => {
            const { x, y } = centerOf(point);
            return (
              <polygon
                key={`${point.q}-${point.r}`}
                points={hexPoints(x, y)}
                fill={shade(point.value)}
                stroke={hover === i ? "var(--gl-foreground)" : "transparent"}
                strokeWidth={1.5}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>

        <ChartTooltip
          visible={hover !== null}
          x={hover !== null ? centerOf(points[hover]!).x : 0}
          y={hover !== null ? centerOf(points[hover]!).y : 0}
        >
          {hover !== null && (
            <>
              <span className="gl-chart-tooltip-title">
                {points[hover]!.label ?? `${points[hover]!.q}, ${points[hover]!.r}`}
              </span>
              <TooltipRow label="value" value={fmt(points[hover]!.value)} />
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}
