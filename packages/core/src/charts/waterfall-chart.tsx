"use client";

import { useState } from "react";

import { ChartEmpty, ChartFrame } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { bandScale, formatValue, linearScale, niceDomain, plotArea, seriesColor, ticks } from "./scales";
import { useChartWidth } from "./use-chart-width";

export interface WaterfallStep {
  label: string;
  /** Positive increases, negative decreases. Ignored when `total` is set. */
  value?: number;
  /** Marks this step as a running total anchored to the axis. */
  total?: boolean;
}

export interface WaterfallChartProps {
  steps: WaterfallStep[];
  height?: number;
  increaseColor?: string;
  decreaseColor?: string;
  totalColor?: string;
  format?: (value: number) => string;
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 16, right: 12, bottom: 26, left: 44 };

/**
 * How a starting value moves to an ending one through a series of changes.
 *
 * Each bar starts where the previous ended, so the reader can see both the
 * size of every change and the running balance it produces.
 */
export function WaterfallChart({
  steps,
  height = 240,
  increaseColor = "var(--gl-chart-2, #34c759)",
  decreaseColor = "var(--gl-chart-4, #ff375f)",
  totalColor = "var(--gl-chart-1, #0088ff)",
  format,
  className,
  ariaLabel,
}: WaterfallChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<number | null>(null);
  const plot = plotArea(width, height, PADDING);

  // Resolve each step to its bar's start and end values.
  let running = 0;
  const resolved = steps.map((step) => {
    if (step.total) {
      const from = 0;
      const to = running;
      return { ...step, from, to, delta: to };
    }
    const from = running;
    const to = running + (step.value ?? 0);
    running = to;
    return { ...step, from, to, delta: step.value ?? 0 };
  });

  if (steps.length === 0) {
    return (
      <div ref={ref} className={className}>
        <ChartEmpty label="No steps to display" />
      </div>
    );
  }

  const extremes = resolved.flatMap((s) => [s.from, s.to, 0]);
  const domain = niceDomain(Math.min(...extremes), Math.max(...extremes), 4);
  const y = linearScale(domain, [plot.bottom, plot.y], { nice: false });
  const bands = bandScale(steps.length, [plot.x, plot.right], 0.34);

  const yTicks = ticks(domain, 4).map((v) => ({
    value: y(v),
    label: format ? format(v) : formatValue(v, { compact: true }),
  }));

  const fmt = (value: number) => (format ? format(value) : formatValue(value));

  return (
    <div ref={ref} className={className}>
      <div className="gl-chart-wrap">
        <ChartFrame
          width={width}
          height={height}
          plot={plot}
          yTicks={yTicks}
          xLabels={steps.map((step, i) => ({ x: bands.center(i), label: step.label }))}
          ariaLabel={ariaLabel ?? `Waterfall of ${steps.length} steps`}
        >
          {resolved.map((step, i) => {
            const top = y(Math.max(step.from, step.to));
            const bottom = y(Math.min(step.from, step.to));
            const barHeight = Math.max(2, bottom - top);
            const color = step.total ? totalColor : step.delta >= 0 ? increaseColor : decreaseColor;

            return (
              <g key={step.label + i}>
                <rect
                  x={bands.start(i)}
                  y={top}
                  width={bands.width}
                  height={barHeight}
                  rx={4}
                  fill={color}
                  opacity={hover === null || hover === i ? 1 : 0.5}
                  style={{ transition: "opacity 140ms ease" }}
                />
                {/* Connector to the next bar shows where the balance carried to. */}
                {i < resolved.length - 1 && (
                  <line
                    x1={bands.start(i) + bands.width}
                    x2={bands.start(i + 1)}
                    y1={y(step.to)}
                    y2={y(step.to)}
                    stroke="var(--gl-chart-axis, currentColor)"
                    strokeOpacity={0.3}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                )}
                <rect
                  x={bands.start(i) - 2}
                  y={plot.y}
                  width={bands.width + 4}
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
          x={hover !== null ? Math.min(Math.max(bands.center(hover), 64), width - 64) : 0}
          y={PADDING.top}
        >
          {hover !== null && (
            <>
              <span className="gl-chart-tooltip-title">{resolved[hover]!.label}</span>
              <TooltipRow
                color={
                  resolved[hover]!.total
                    ? totalColor
                    : resolved[hover]!.delta >= 0
                      ? increaseColor
                      : decreaseColor
                }
                label={resolved[hover]!.total ? "total" : "change"}
                value={`${resolved[hover]!.delta >= 0 && !resolved[hover]!.total ? "+" : ""}${fmt(
                  resolved[hover]!.delta,
                )}`}
              />
              <TooltipRow label="balance" value={fmt(resolved[hover]!.to)} />
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}
