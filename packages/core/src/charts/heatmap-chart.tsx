"use client";

import { useState } from "react";

import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { formatValue } from "./scales";

export interface HeatmapCell {
  /** Column index, 0-based. */
  x: number;
  /** Row index, 0-based. */
  y: number;
  value: number;
}

export interface HeatmapChartProps {
  rows: string[];
  columns: string[];
  cells: HeatmapCell[];
  /** Cell size in pixels. */
  cellSize?: number;
  /** Gap between cells. */
  gap?: number;
  /** Colour for the lowest value. */
  minColor?: string;
  /** Colour for the highest value. */
  maxColor?: string;
  format?: (value: number) => string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Intensity across a grid.
 *
 * Emphasises density rather than precision, so cells are drawn from a colour
 * ramp and the exact value is available on hover instead of being printed in
 * every cell.
 */
export function HeatmapChart({
  rows,
  columns,
  cells,
  cellSize = 26,
  gap = 3,
  minColor = "var(--gl-chart-heat-min, rgb(0 136 255 / 0.08))",
  maxColor = "var(--gl-chart-1, #0088ff)",
  format,
  className,
  ariaLabel,
}: HeatmapChartProps) {
  const [hover, setHover] = useState<HeatmapCell | null>(null);

  if (cells.length === 0 || rows.length === 0 || columns.length === 0) {
    return <ChartEmpty label="No cells to display" />;
  }

  const values = cells.map((c) => c.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const width = columns.length * (cellSize + gap) - gap;
  const height = rows.length * (cellSize + gap) - gap;

  const fmt = (value: number) => (format ? format(value) : formatValue(value));

  // The ramp is mixed in CSS so a theme can recolour it with one variable.
  const shade = (value: number) => {
    const t = (value - min) / span;
    return `color-mix(in srgb, ${maxColor} ${Math.round(12 + t * 88)}%, ${minColor})`;
  };

  return (
    <div className={className}>
      <div className="gl-chart-heatmap">
        <div className="gl-chart-heatmap-rows" style={{ width: height ? undefined : undefined }}>
          {rows.map((row) => (
            <span key={row} className="gl-chart-heatmap-row-label" style={{ height: cellSize, lineHeight: `${cellSize}px` }}>
              {row}
            </span>
          ))}
        </div>

        <div className="gl-chart-wrap">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={
              ariaLabel ?? `Heatmap of ${rows.length} rows by ${columns.length} columns`
            }
          >
            {cells.map((cell) => (
              <rect
                key={`${cell.x}-${cell.y}`}
                x={cell.x * (cellSize + gap)}
                y={cell.y * (cellSize + gap)}
                width={cellSize}
                height={cellSize}
                rx={5}
                fill={shade(cell.value)}
                stroke={hover === cell ? "var(--gl-foreground)" : "transparent"}
                strokeWidth={1.5}
                onPointerEnter={() => setHover(cell)}
                onPointerLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </svg>

          <ChartTooltip
            visible={hover !== null}
            x={hover ? hover.x * (cellSize + gap) + cellSize / 2 : 0}
            y={hover ? Math.max(0, hover.y * (cellSize + gap) - 44) : 0}
          >
            {hover && (
              <>
                <span className="gl-chart-tooltip-title">
                  {rows[hover.y]} · {columns[hover.x]}
                </span>
                <TooltipRow label="value" value={fmt(hover.value)} />
              </>
            )}
          </ChartTooltip>
        </div>
      </div>

      <div className="gl-chart-heatmap-columns">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
    </div>
  );
}
