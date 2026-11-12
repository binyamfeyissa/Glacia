"use client";

import { useState, type ReactNode } from "react";

import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { bandScale, formatValue, linearScale, niceDomain, plotArea, ticks } from "./scales";
import { useChartWidth } from "./use-chart-width";

export interface PlotMark {
  /** Position along the category axis. */
  category: string;
  /** Position along the value axis. */
  value: number;
  /** Optional second value for marks that encode size. */
  size?: number;
  color?: string;
  label?: string;
}

export interface PlotChartProps {
  marks: PlotMark[];
  /** Category order; defaults to first-seen order in `marks`. */
  categories?: string[];
  height?: number;
  /** Radius of a neutral mark. */
  radius?: number;
  /**
   * Renders each mark. Receives computed geometry in chart pixels, so a caller
   * can draw any shape (icon, glyph, custom SVG) inside a correctly scaled
   * plot without rebuilding axes.
   */
  renderMark?: (mark: PlotMark, geometry: { x: number; y: number; radius: number }) => ReactNode;
  format?: (value: number) => string;
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 16, right: 16, bottom: 30, left: 44 };

/**
 * A bare plotting surface.
 *
 * Unlike the named charts, this makes no assumption about the mark: the caller
 * supplies a renderer and gets pixel-accurate positions inside a real axis
 * system. It is the escape hatch for chart types the library does not ship.
 */
export function PlotChart({
  marks,
  categories,
  height = 220,
  radius = 5,
  renderMark,
  format,
  className,
  ariaLabel,
}: PlotChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<number | null>(null);
  const plot = plotArea(width, height, PADDING);

  if (marks.length === 0) {
    return (
      <div ref={ref} className={className}>
        <ChartEmpty label="No marks to plot" />
      </div>
    );
  }

  const cats = categories ?? Array.from(new Set(marks.map((m) => m.category)));
  const values = marks.map((m) => m.value).filter(Number.isFinite);
  const domain = niceDomain(Math.min(...values, 0), Math.max(...values), 4);

  const y = linearScale(domain, [plot.bottom, plot.y], { nice: false });
  const bands = bandScale(cats.length, [plot.x, plot.right], 0.5);
  const fmt = (value: number) => (format ? format(value) : formatValue(value, { compact: true }));

  const yTicks = ticks(domain, 4).map((v) => ({ value: y(v), label: fmt(v) }));

  return (
    <div ref={ref} className={className}>
      <div className="gl-chart-wrap">
        <div className="gl-chart-frame">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            height={height}
            role="img"
            aria-label={ariaLabel ?? `Plot with ${marks.length} marks`}
          >
            {yTicks.map((tick, i) => (
              <line
                key={i}
                x1={plot.x}
                x2={plot.right}
                y1={tick.value}
                y2={tick.value}
                stroke="var(--gl-chart-grid, currentColor)"
                strokeOpacity={0.1}
                strokeWidth={1}
              />
            ))}

            {marks.map((mark, i) => {
              const cx = bands.center(cats.indexOf(mark.category));
              const cy = y(mark.value);
              return (
                <g
                  key={`${mark.category}-${i}`}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  style={{ cursor: "pointer" }}
                >
                  {renderMark ? (
                    renderMark(mark, { x: cx, y: cy, radius })
                  ) : (
                    <circle cx={cx} cy={cy} r={radius} fill={mark.color ?? "var(--gl-chart-1, #0088ff)"} />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="gl-chart-axis gl-chart-axis-y" aria-hidden>
            {yTicks.map((tick, i) => (
              <span key={i} style={{ top: `${tick.value}px` }}>
                {tick.label}
              </span>
            ))}
          </div>
          <div className="gl-chart-axis gl-chart-axis-x" aria-hidden>
            {cats.map((cat, i) => (
              <span key={cat} style={{ left: bands.center(i) }}>
                {cat}
              </span>
            ))}
          </div>
        </div>

        <ChartTooltip
          visible={hover !== null}
          x={hover !== null ? Math.min(Math.max(bands.center(cats.indexOf(marks[hover]!.category)), 64), width - 64) : 0}
          y={PADDING.top}
        >
          {hover !== null && (
            <>
              <span className="gl-chart-tooltip-title">{marks[hover]!.label ?? marks[hover]!.category}</span>
              <TooltipRow color={marks[hover]!.color} label={marks[hover]!.category} value={fmt(marks[hover]!.value)} />
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}
