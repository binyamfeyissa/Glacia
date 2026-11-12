"use client";

import { useMemo, useState } from "react";

import { ChartEmpty, ChartFrame } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { formatValue, linearScale, niceDomain, plotArea, seriesColor, ticks } from "./scales";
import { useChartWidth } from "./use-chart-width";

export interface ScatterPoint {
  x: number;
  y: number;
  /** Optional label shown in the tooltip. */
  label?: string;
  /** Bubble radius driver; ignored by ScatterChart. */
  size?: number;
}

export interface ScatterSeries {
  name: string;
  points: ScatterPoint[];
  color?: string;
}

export interface ScatterChartProps {
  series: ScatterSeries[];
  height?: number;
  /** Fixed radius for scatter dots. */
  radius?: number;
  /** Treat `size` as the bubble radius, scaling between min and max. */
  bubble?: boolean;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 16, right: 16, bottom: 30, left: 44 };

/**
 * Two numeric axes.
 *
 * Both ScatterChart and BubbleChart are this component: a bubble chart is a
 * scatter whose marks are sized by a third value. Sharing the implementation
 * keeps the axes, padding and tooltip identical between them.
 */
function NumericPlot({
  series,
  height = 240,
  radius = 4,
  bubble = false,
  formatX,
  formatY,
  palette,
  className,
  ariaLabel,
}: ScatterChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<{ si: number; pi: number } | null>(null);

  const plot = plotArea(width, height, PADDING);
  const all = series.flatMap((s) => s.points);

  const xs = all.map((p) => p.x).filter(Number.isFinite);
  const ys = all.map((p) => p.y).filter(Number.isFinite);
  const sizes = all.map((p) => p.size ?? 1).filter(Number.isFinite);

  const xDomain = niceDomain(xs.length ? Math.min(...xs) : 0, xs.length ? Math.max(...xs) : 1, 4);
  const yDomain = niceDomain(ys.length ? Math.min(...ys) : 0, ys.length ? Math.max(...ys) : 1, 4);

  const x = linearScale(xDomain, [plot.x, plot.right], { nice: false });
  const y = linearScale(yDomain, [plot.bottom, plot.y], { nice: false });

  const maxSize = sizes.length ? Math.max(...sizes) : 1;
  const minSize = sizes.length ? Math.min(...sizes) : 0;
  const maxRadius = Math.min(plot.width, plot.height) / 7;

  const radiusFor = (point: ScatterPoint) => {
    if (!bubble) return radius;
    const s = point.size ?? minSize;
    const t = maxSize === minSize ? 1 : (s - minSize) / (maxSize - minSize);
    return 3 + t * (maxRadius - 3);
  };

  const yTicks = useMemo(
    () =>
      ticks(yDomain, 4).map((v) => ({
        value: y(v),
        label: formatY ? formatY(v) : formatValue(v, { compact: true }),
      })),
    [yDomain, formatY, y],
  );

  if (all.length === 0) {
    return (
      <div ref={ref} className={className}>
        <ChartEmpty label="No points to display" />
      </div>
    );
  }

  const fx = (v: number) => (formatX ? formatX(v) : formatValue(v, { compact: true }));
  const fy = (v: number) => (formatY ? formatY(v) : formatValue(v, { compact: true }));

  return (
    <div ref={ref} className={className}>
      <div className="gl-chart-wrap">
        <ChartFrame
          width={width}
          height={height}
          plot={plot}
          yTicks={yTicks}
          xLabels={ticks(xDomain, 4).map((v) => ({ x: x(v), label: fx(v) }))}
          ariaLabel={
            ariaLabel ?? `Scatter plot with ${all.length} points across ${series.length} series`
          }
        >
          {series.map((s, si) => {
            const color = s.color ?? seriesColor(si, palette);
            return (
              <g key={s.name}>
                {s.points.map((point, pi) => {
                  const isHovered = hover?.si === si && hover?.pi === pi;
                  return (
                    <circle
                      key={pi}
                      cx={x(point.x)}
                      cy={y(point.y)}
                      r={radiusFor(point) + (isHovered ? 2 : 0)}
                      fill={color}
                      opacity={isHovered ? 0.95 : bubble ? 0.55 : 0.8}
                      stroke={isHovered ? color : "transparent"}
                      strokeWidth={1.5}
                      onPointerEnter={() => setHover({ si, pi })}
                      onPointerLeave={() => setHover(null)}
                      style={{ transition: "r 120ms ease, opacity 120ms ease", cursor: "pointer" }}
                    />
                  );
                })}
              </g>
            );
          })}
        </ChartFrame>

        <ChartTooltip
          visible={hover !== null}
          x={
            hover
              ? Math.min(Math.max(x(series[hover.si]!.points[hover.pi]!.x), 70), width - 70)
              : 0
          }
          y={PADDING.top}
        >
          {hover && (
            <>
              <span className="gl-chart-tooltip-title">
                {series[hover.si]!.points[hover.pi]!.label ?? series[hover.si]!.name}
              </span>
              <TooltipRow
                color={series[hover.si]!.color ?? seriesColor(hover.si, palette)}
                label="x"
                value={fx(series[hover.si]!.points[hover.pi]!.x)}
              />
              <TooltipRow label="y" value={fy(series[hover.si]!.points[hover.pi]!.y)} />
              {bubble && series[hover.si]!.points[hover.pi]!.size != null && (
                <TooltipRow label="size" value={formatValue(series[hover.si]!.points[hover.pi]!.size!)} />
              )}
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}

export interface BubbleChartProps extends Omit<ScatterChartProps, "bubble" | "radius"> {}

/** Correlation between two values, with a third shown as bubble size. */
export function BubbleChart(props: BubbleChartProps) {
  return <NumericPlot {...props} bubble />;
}

/** Correlation between two numeric values. */
export function ScatterChart(props: ScatterChartProps) {
  return <NumericPlot {...props} />;
}
