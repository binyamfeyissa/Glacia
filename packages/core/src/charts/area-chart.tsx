"use client";

import { LineChart, type LineSeries } from "./line-chart";
import { ChartEmpty } from "./chart-frame";
import type { Value } from "./scales";

export interface AreaChartProps {
  labels: string[];
  series: LineSeries[];
  height?: number;
  smooth?: boolean;
  format?: (value: Value) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

/**
 * A continuous series with its area filled.
 *
 * This is the LineChart drawing filled instead of stroked — the same scales,
 * axis ticks and tooltip — so the two stay consistent when used side by side.
 */
export function AreaChart({ area: _unused, ...props }: AreaChartProps & { area?: boolean }) {
  void _unused;
  return <LineChart {...props} area />;
}

export interface MirrorAreaSeries {
  name: string;
  /** Positive values drawn upward. */
  above: Value[];
  /** Positive values drawn downward. */
  below: Value[];
}

export interface MirrorAreaChartProps {
  labels: string[];
  series: MirrorAreaSeries;
  height?: number;
  aboveColor?: string;
  belowColor?: string;
  format?: (value: Value) => string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Two series mirrored across a shared centre line — the shape used to compare
 * opposing flows, such as inflow against outflow at each point in time.
 *
 * Implemented by rendering an above series and a below series whose values are
 * negated, so one axis covers both directions honestly rather than stacking
 * two separate charts that could be scaled differently.
 */
export function MirrorAreaChart({
  labels,
  series,
  height = 220,
  aboveColor,
  belowColor,
  format,
  className,
  ariaLabel,
}: MirrorAreaChartProps) {
  if (labels.length === 0) {
    return <ChartEmpty label="No series to display" />;
  }

  return (
    <LineChart
      className={className}
      labels={labels}
      height={height}
      area
      smooth
      dots={false}
      format={format}
      ariaLabel={ariaLabel ?? `Mirrored area chart: ${series.name}`}
      series={[
        { name: `${series.name} (above)`, values: series.above, color: aboveColor ?? "var(--gl-chart-1, #0088ff)" },
        {
          name: `${series.name} (below)`,
          values: series.below.map((v) => -Math.abs(v)),
          color: belowColor ?? "var(--gl-chart-4, #ff375f)",
        },
      ]}
    />
  );
}
