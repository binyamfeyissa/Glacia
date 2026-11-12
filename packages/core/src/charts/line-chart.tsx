"use client";

import { useMemo, useState } from "react";

import { ChartFrame, ChartEmpty } from "./chart-frame";
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
  type Value,
} from "./scales";
import { useChartWidth } from "./use-chart-width";

export interface LineSeries {
  /** Names the series in the tooltip and legend. */
  name: string;
  values: Value[];
  color?: string;
}

export interface LineChartProps {
  /** One entry per data point along the x axis. */
  labels: string[];
  series: LineSeries[];
  height?: number;
  /** Fill beneath each line with a soft gradient. */
  area?: boolean;
  /** Round the line's joints. Off draws straight segments. */
  smooth?: boolean;
  /** Draw dots at every point. Defaults to showing them only on hover. */
  dots?: boolean;
  /** Format values in the axis and tooltip. */
  format?: (value: Value) => string;
  /** Colour palette used when a series has no colour. */
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 16, right: 12, bottom: 26, left: 40 };

/**
 * A continuous series over ordered categories.
 *
 * Draws in real pixels (not a scaled viewBox) so strokes stay 2px and labels
 * stay legible at any container width.
 */
export function LineChart({
  labels,
  series,
  height = 220,
  area = false,
  smooth = true,
  dots = false,
  format,
  palette,
  className,
  ariaLabel,
}: LineChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<number | null>(null);

  const plot = plotArea(width, height, PADDING);

  const allValues = series.flatMap((s) => s.values).filter((v) => Number.isFinite(v));
  const max = allValues.length ? Math.max(...allValues) : 1;
  const min = allValues.length ? Math.min(...allValues) : 0;
  // Keep zero in view for area charts so the fill has a meaningful baseline.
  const domain = niceDomain(area ? Math.min(0, min) : min, max, 4);

  const y = linearScale(domain, [plot.bottom, plot.y], { nice: false });
  const x = bandScale(labels.length, [plot.x, plot.right], 0);

  const yTicks = useMemo(
    () =>
      ticks(domain, 4).map((v) => ({
        value: y(v),
        label: format ? format(v) : formatValue(v, { compact: true }),
      })),
    [domain, format, y],
  );

  const pointAt = (values: Value[], i: number) => {
    const value = values[i];
    return {
      x: x.center(i),
      y: value == null || !Number.isFinite(value) ? plot.bottom : y(value),
    };
  };

  if (labels.length === 0 || series.length === 0) {
    return (
      <div ref={ref} className={className}>
        <ChartEmpty label="No series to display" />
      </div>
    );
  }

  const fmt = (value: Value) => (format ? format(value) : formatValue(value, { compact: true }));

  return (
    <div ref={ref} className={className}>
      <div className="gl-chart-wrap">
        <ChartFrame
          width={width}
          height={height}
          plot={plot}
          yTicks={yTicks}
          xLabels={labels.map((label, i) => ({ x: x.center(i), label }))}
          ariaLabel={
            ariaLabel ??
            `Line chart with ${labels.length} points across ${series.length} series: ${series
              .map((s) => s.name)
              .join(", ")}`
          }
        >
          {series.map((s, si) => {
            const color = s.color ?? seriesColor(si, palette);
            const points = s.values.map((_, i) => pointAt(s.values, i));
            const line = smooth ? smoothPath(points) : `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;

            return (
              <g key={s.name}>
                {area && (
                  <path
                    d={`${line} L ${points[points.length - 1]!.x} ${plot.bottom} L ${points[0]!.x} ${plot.bottom} Z`}
                    fill={color}
                    opacity={0.16}
                  />
                )}
                <path
                  d={line}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {(dots || hover !== null) &&
                  points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={hover === i ? 4.5 : 3}
                      fill={color}
                      stroke="var(--gl-chart-dot-ring, transparent)"
                      strokeWidth={1.5}
                      opacity={hover === null || hover === i ? 1 : 0.45}
                    />
                  ))}
              </g>
            );
          })}

          {/* Hover bands: wide invisible targets make the tooltip easy to hit
              without hunting for a 3px dot. */}
          {labels.map((_, i) => (
            <rect
              key={`hit-${i}`}
              x={x.start(i) - x.bandWidth / 2}
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
          x={hover !== null ? Math.min(Math.max(x.center(hover), 60), width - 60) : 0}
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
                  value={fmt(s.values[hover] ?? 0)}
                />
              ))}
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}
