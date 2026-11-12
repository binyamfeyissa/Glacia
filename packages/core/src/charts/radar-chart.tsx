"use client";

import { useState } from "react";

import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { formatValue, seriesColor } from "./scales";

export interface RadarSeries {
  name: string;
  /** One value per axis, in the same order as `axes`. */
  values: number[];
  color?: string;
}

export interface RadarChartProps {
  axes: string[];
  series: RadarSeries[];
  size?: number;
  /** Number of concentric rings behind the data. */
  rings?: number;
  /** Fixed maximum; defaults to the largest value across series. */
  max?: number;
  format?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

const TAU = Math.PI * 2;

/**
 * Several axes arranged around a circle, with each series as a closed shape.
 *
 * Useful when comparing profiles across many dimensions, where a bar chart
 * would force the reader to hold a dozen values in memory.
 */
export function RadarChart({
  axes,
  series,
  size = 240,
  rings = 4,
  max,
  format,
  palette,
  className,
  ariaLabel,
}: RadarChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  if (axes.length < 3 || series.length === 0) {
    return <ChartEmpty label="A radar chart needs at least three axes" />;
  }

  const centre = size / 2;
  const radius = centre - 28;

  const highest = series.flatMap((s) => s.values).reduce((a, b) => Math.max(a, b), 0);
  const scaleMax = max ?? (highest || 1);

  const point = (index: number, value: number) => {
    // Start at the top (12 o'clock) and go clockwise.
    const angle = (index / axes.length) * TAU - Math.PI / 2;
    const r = Math.max(0, Math.min(1, value / scaleMax)) * radius;
    return { x: centre + Math.cos(angle) * r, y: centre + Math.sin(angle) * r };
  };

  const fmt = (value: number) => (format ? format(value) : formatValue(value));

  return (
    <div className={className}>
      <div className="gl-chart-wrap" style={{ width: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={
            ariaLabel ?? `Radar chart across ${axes.length} axes: ${series.map((s) => s.name).join(", ")}`
          }
        >
          {/* Rings */}
          {Array.from({ length: rings }, (_, i) => {
            const r = (radius * (i + 1)) / rings;
            const ringPoints = axes
              .map((_, ai) => {
                const angle = (ai / axes.length) * TAU - Math.PI / 2;
                return `${centre + Math.cos(angle) * r},${centre + Math.sin(angle) * r}`;
              })
              .join(" ");
            return (
              <polygon
                key={i}
                points={ringPoints}
                fill="none"
                stroke="var(--gl-chart-axis, currentColor)"
                strokeOpacity={0.14}
                strokeWidth={1}
              />
            );
          })}

          {/* Spokes */}
          {axes.map((_, i) => {
            const outer = point(i, scaleMax);
            return (
              <line
                key={`spoke-${i}`}
                x1={centre}
                y1={centre}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--gl-chart-axis, currentColor)"
                strokeOpacity={0.12}
                strokeWidth={1}
              />
            );
          })}

          {/* Data */}
          {series.map((s, si) => {
            const color = s.color ?? seriesColor(si, palette);
            const polygon = s.values.map((value, ai) => point(ai, value));
            return (
              <g
                key={s.name}
                opacity={hover === null || hover === si ? 1 : 0.35}
                style={{ transition: "opacity 140ms ease" }}
                onPointerEnter={() => setHover(si)}
                onPointerLeave={() => setHover(null)}
              >
                <polygon
                  points={polygon.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill={color}
                  fillOpacity={0.18}
                  stroke={color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                {polygon.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />
                ))}
              </g>
            );
          })}
        </svg>

        <ChartTooltip visible={hover !== null} x={centre} y={8}>
          {hover !== null && (
            <>
              <span className="gl-chart-tooltip-title">{series[hover]!.name}</span>
              {axes.map((axis, ai) => (
                <TooltipRow
                  key={axis}
                  color={series[hover]!.color ?? seriesColor(hover, palette)}
                  label={axis}
                  value={fmt(series[hover]!.values[ai] ?? 0)}
                />
              ))}
            </>
          )}
        </ChartTooltip>
      </div>

      <ul className="gl-chart-axis-labels">
        {axes.map((axis) => (
          <li key={axis}>{axis}</li>
        ))}
      </ul>
    </div>
  );
}
