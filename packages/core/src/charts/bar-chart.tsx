"use client";

import { useMemo, useState } from "react";

import { ChartEmpty, ChartFrame } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import {
  bandScale,
  formatValue,
  linearScale,
  niceDomain,
  plotArea,
  seriesColor,
  ticks,
  type Value,
} from "./scales";
import { useChartWidth } from "./use-chart-width";

export interface BarSeries {
  name: string;
  values: Value[];
  color?: string;
}

export interface BarChartProps {
  labels: string[];
  /** One series per set of bars. A single series draws simple bars. */
  series: BarSeries[];
  height?: number;
  /** Stack series on top of each other instead of grouping them. */
  stacked?: boolean;
  /** Corner radius of each bar. */
  radius?: number;
  format?: (value: Value) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 16, right: 12, bottom: 26, left: 40 };

/** Values compared across categories, as grouped or stacked bars. */
export function BarChart({
  labels,
  series,
  height = 220,
  stacked = false,
  radius = 5,
  format,
  palette,
  className,
  ariaLabel,
}: BarChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<number | null>(null);

  const plot = plotArea(width, height, PADDING);

  const totals = stacked
    ? labels.map((_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0))
    : series.flatMap((s) => s.values);

  const max = totals.length ? Math.max(...totals) : 1;
  const domain = niceDomain(0, max, 4);
  const y = linearScale(domain, [plot.bottom, plot.y], { nice: false });

  const bands = bandScale(labels.length, [plot.x, plot.right], 0.32);
  const groupWidth = bands.width;
  const barWidth = stacked ? groupWidth : groupWidth / Math.max(1, series.length);

  const yTicks = useMemo(
    () =>
      ticks(domain, 4).map((v) => ({
        value: y(v),
        label: format ? format(v) : formatValue(v, { compact: true }),
      })),
    [domain, format, y],
  );

  if (labels.length === 0 || series.length === 0) {
    return (
      <div ref={ref} className={className}>
        <ChartEmpty label="No bars to display" />
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
          xLabels={labels.map((label, i) => ({ x: bands.center(i), label }))}
          ariaLabel={
            ariaLabel ??
            `Bar chart with ${labels.length} categories: ${series.map((s) => s.name).join(", ")}`
          }
        >
          {labels.map((label, i) => {
            const isHovered = hover === i;
            let stackTop = plot.bottom;

            return (
              <g key={label + i}>
                {series.map((s, si) => {
                  const value = s.values[i] ?? 0;
                  const color = s.color ?? seriesColor(si, palette);
                  const barHeight = Math.max(0, plot.bottom - y(value));

                  const barX = stacked
                    ? bands.start(i)
                    : bands.start(i) + si * barWidth + (si > 0 ? 1 : 0);
                  const barY = stacked ? stackTop - barHeight : y(value);
                  const w = stacked ? groupWidth : Math.max(1, barWidth - (si > 0 ? 1 : 0));

                  if (stacked) stackTop -= barHeight;

                  return (
                    <rect
                      key={s.name}
                      x={barX}
                      y={barY}
                      width={w}
                      height={barHeight}
                      rx={Math.min(radius, w / 2)}
                      fill={color}
                      opacity={hover === null || isHovered ? 1 : 0.45}
                      style={{ transition: "opacity 140ms ease" }}
                    />
                  );
                })}

                <rect
                  x={bands.start(i) - 2}
                  y={plot.y}
                  width={groupWidth + 4}
                  height={plot.height}
                  fill="transparent"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                />
              </g>
            );
          })}
        </ChartFrame>

        <ChartTooltip
          visible={hover !== null}
          x={hover !== null ? Math.min(Math.max(bands.center(hover), 60), width - 60) : 0}
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
