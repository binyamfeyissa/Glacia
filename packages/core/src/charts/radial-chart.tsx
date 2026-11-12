"use client";

import { useState } from "react";

import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { arcPath, formatValue, seriesColor } from "./scales";

export interface Slice {
  label: string;
  value: number;
  color?: string;
}

interface RadialProps {
  data: Slice[];
  /** Outer diameter in pixels. */
  size?: number;
  /** Ring thickness. 0 draws a full pie; greater than 0 leaves a hole. */
  thickness?: number;
  format?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

const TAU = Math.PI * 2;

/**
 * Proportional slices around a circle.
 *
 * PieChart is this with no hole and RingChart with one, so the two are
 * guaranteed to place slices identically instead of drifting apart as
 * separate implementations.
 */
function Radial({
  data,
  size = 200,
  thickness,
  format,
  palette,
  className,
  ariaLabel,
}: RadialProps) {
  const [hover, setHover] = useState<number | null>(null);

  const total = data.reduce((sum, slice) => sum + Math.max(0, slice.value), 0);
  if (data.length === 0 || total <= 0) {
    return <ChartEmpty label="No slices to display" />;
  }

  const outer = size / 2;
  const hole = thickness == null ? 0 : Math.max(0, outer - thickness);
  const fmt = (value: number) => (format ? format(value) : formatValue(value, { compact: true }));

  let cursor = -Math.PI / 2;

  return (
    <div className={className}>
      <div className="gl-chart-radial" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          role="img"
          aria-label={
            ariaLabel ??
            `Proportional chart: ${data.map((d) => `${d.label} ${fmt(d.value)}`).join(", ")}`
          }
        >
          {data.map((slice, i) => {
            const share = Math.max(0, slice.value) / total;
            const start = cursor;
            const end = cursor + share * TAU;
            cursor = end;

            return (
              <path
                key={slice.label}
                d={arcPath(outer, outer, outer, hole, start, end)}
                fill={slice.color ?? seriesColor(i, palette)}
                opacity={hover === null || hover === i ? 1 : 0.4}
                stroke="transparent"
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                style={{ transition: "opacity 140ms ease", cursor: "pointer" }}
              />
            );
          })}
        </svg>

        <ChartTooltip visible={hover !== null} x={outer} y={outer} align="auto">
          {hover !== null && (
            <TooltipRow
              color={data[hover]!.color ?? seriesColor(hover, palette)}
              label={data[hover]!.label}
              value={`${fmt(data[hover]!.value)} · ${Math.round((data[hover]!.value / total) * 100)}%`}
            />
          )}
        </ChartTooltip>
      </div>

      {/* A legend is not optional for a proportional chart: slices alone force
          the reader to match colours by eye. */}
      <ul className="gl-chart-legend">
        {data.map((slice, i) => (
          <li key={slice.label}>
            <span
              className="gl-chart-legend-swatch"
              style={{ background: slice.color ?? seriesColor(i, palette) }}
            />
            <span className="gl-chart-legend-label">{slice.label}</span>
            <span className="gl-chart-legend-value">{fmt(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface PieChartProps extends Omit<RadialProps, "thickness"> {}

/** Proportional slices with no hole. */
export function PieChart(props: PieChartProps) {
  return <Radial {...props} thickness={0} />;
}

export interface RingChartProps extends RadialProps {}

/** Proportional slices as a ring, optionally with a value in the centre. */
export function RingChart({ thickness = 22, ...props }: RingChartProps) {
  return <Radial {...props} thickness={thickness} />;
}
