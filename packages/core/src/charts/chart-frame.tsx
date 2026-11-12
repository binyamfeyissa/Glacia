import { useId, type ReactNode } from "react";

import { cx } from "../internal/cx";
import { formatValue, type Plot } from "./scales";

// The frame every chart shares: the plot area, grid lines, axes, and the
// empty/loading states. Charts supply their own marks as children, drawn in
// the same coordinate space, so a LineChart and a BarChart align their axes
// exactly without either reimplementing them.

export interface ChartFrameProps {
  width: number;
  height: number;
  plot: Plot;
  /** Horizontal grid lines with their labels. */
  yTicks?: { value: number; label?: string }[];
  /** Category labels along the bottom. */
  xLabels?: { x: number; label: string }[];
  /** Draw a baseline under the plot. */
  baseline?: boolean;
  /** Suppress the grid for charts that don't want it (pie, radar). */
  grid?: boolean;
  /** The data layer. */
  children: ReactNode;
  className?: string;
  /** Announced to assistive technology. */
  ariaLabel?: string;
  /** Short description shown beneath the chart. */
  caption?: string;
}

export function ChartFrame({
  width,
  height,
  plot,
  yTicks = [],
  xLabels = [],
  baseline = true,
  grid = true,
  children,
  className,
  ariaLabel,
  caption,
}: ChartFrameProps) {
  const gridId = useId();
  const gradientId = `${gridId}-grid`;

  return (
    <div className={cx("gl-chart-frame", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={ariaLabel}
        className="gl-chart-svg"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* The grid fades toward the top so it never competes with the data. */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gl-chart-grid, currentColor)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--gl-chart-grid, currentColor)" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        {grid &&
          yTicks.map((tick, i) => (
            <line
              key={`grid-${i}`}
              x1={plot.x}
              x2={plot.right}
              y1={tick.value}
              y2={tick.value}
              stroke={`url(#${gradientId})`}
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
          ))}

        {children}

        {baseline && (
          <line
            x1={plot.x}
            x2={plot.right}
            y1={plot.bottom}
            y2={plot.bottom}
            stroke="var(--gl-chart-axis, currentColor)"
            strokeOpacity={0.22}
            strokeWidth={1}
            shapeRendering="crispEdges"
          />
        )}
      </svg>

      {/* Axis text lives in HTML so it inherits the page's font and stays
          selectable and legible at any zoom, unlike SVG text in a scaled box. */}
      <div className="gl-chart-axis gl-chart-axis-y" aria-hidden>
        {yTicks.map((tick, i) => (
          <span key={i} style={{ top: `${tick.value}px` }}>
            {tick.label ?? formatValue(tick.value, { compact: true })}
          </span>
        ))}
      </div>

      <div className="gl-chart-axis gl-chart-axis-x" aria-hidden>
        {xLabels.map((label, i) => (
          /* Positioned inline: a data attribute alone would need a CSS rule
             that cannot compute a per-point left offset. */
          <span key={i} style={{ left: label.x }}>
            {label.label}
          </span>
        ))}
      </div>

      {caption && <p className="gl-chart-caption">{caption}</p>}
    </div>
  );
}

/** Shown when a chart has no data, so it never draws a broken empty plot. */
export function ChartEmpty({ label = "No data" }: { label?: string }) {
  return (
    <div className="gl-chart-empty" role="status">
      <span>{label}</span>
    </div>
  );
}

/** Shown while a chart's data is loading; matches the skeleton material. */
export function ChartLoading({ label = "Loading chart" }: { label?: string }) {
  return (
    <div className="gl-chart-loading" role="status" aria-label={label}>
      <span className="gl-chart-skeleton" />
    </div>
  );
}
