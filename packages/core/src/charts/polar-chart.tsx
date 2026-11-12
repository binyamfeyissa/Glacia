"use client";

import { useState } from "react";

import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { formatValue, seriesColor } from "./scales";

export interface PolarSegment {
  label: string;
  value: number;
  color?: string;
}

export interface PolarAreaChartProps {
  segments: PolarSegment[];
  size?: number;
  /** Value mapped to the full radius. Defaults to the largest segment. */
  max?: number;
  format?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

const TAU = Math.PI * 2;

/**
 * Equal-angle segments whose radius encodes the value.
 *
 * Unlike a pie, which encodes share of a total through angle, this encodes
 * magnitude through distance from the centre, so two large values are not
 * forced to look like fractions of one whole.
 */
export function PolarAreaChart({
  segments,
  size = 240,
  max,
  format,
  palette,
  className,
  ariaLabel,
}: PolarAreaChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  if (segments.length === 0) {
    return <ChartEmpty label="No segments to display" />;
  }

  const centre = size / 2;
  const outer = centre - 8;
  const highest = Math.max(...segments.map((s) => s.value));
  const scaleMax = max ?? (highest || 1);
  const step = TAU / segments.length;

  const wedge = (index: number, value: number) => {
    const start = index * step - Math.PI / 2;
    const end = start + step;
    const r = Math.max(2, Math.min(1, value / scaleMax) * outer);
    const x1 = centre + Math.cos(start) * r;
    const y1 = centre + Math.sin(start) * r;
    const x2 = centre + Math.cos(end) * r;
    const y2 = centre + Math.sin(end) * r;
    return `M ${centre} ${centre} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
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
            ariaLabel ?? `Polar area chart: ${segments.map((s) => `${s.label} ${fmt(s.value)}`).join(", ")}`
          }
        >
          {/* Reference rings */}
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <circle
              key={t}
              cx={centre}
              cy={centre}
              r={outer * t}
              fill="none"
              stroke="var(--gl-chart-axis, currentColor)"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          ))}

          {segments.map((segment, i) => (
            <path
              key={segment.label}
              d={wedge(i, segment.value)}
              fill={segment.color ?? seriesColor(i, palette)}
              opacity={hover === null || hover === i ? 0.82 : 0.3}
              stroke={hover === i ? "var(--gl-foreground)" : "transparent"}
              strokeWidth={1.5}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              style={{ transition: "opacity 140ms ease", cursor: "pointer" }}
            />
          ))}
        </svg>

        <ChartTooltip visible={hover !== null} x={centre} y={8}>
          {hover !== null && (
            <TooltipRow
              color={segments[hover]!.color ?? seriesColor(hover, palette)}
              label={segments[hover]!.label}
              value={fmt(segments[hover]!.value)}
            />
          )}
        </ChartTooltip>
      </div>

      <ul className="gl-chart-legend">
        {segments.map((segment, i) => (
          <li key={segment.label}>
            <span
              className="gl-chart-legend-swatch"
              style={{ background: segment.color ?? seriesColor(i, palette) }}
            />
            <span className="gl-chart-legend-label">{segment.label}</span>
            <span className="gl-chart-legend-value">{fmt(segment.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface PyramidLevel {
  label: string;
  value: number;
  color?: string;
}

export interface PyramidChartProps {
  levels: PyramidLevel[];
  /** Height of each level band. */
  levelHeight?: number;
  format?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

/**
 * Stacked bands where width encodes magnitude, widest at the base.
 *
 * Levels are ordered as given, so the first entry becomes the apex. Each band
 * is centred, which is what makes the outline read as a pyramid rather than a
 * series of bars.
 */
export function PyramidChart({
  levels,
  levelHeight = 40,
  format,
  palette,
  className,
  ariaLabel,
}: PyramidChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  if (levels.length === 0) {
    return <ChartEmpty label="No levels to display" />;
  }

  const widest = Math.max(...levels.map((l) => l.value)) || 1;
  const fmt = (value: number) => (format ? format(value) : formatValue(value, { compact: true }));
  const total = levels.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className={className}>
      <div
        className="gl-chart-pyramid"
        role="img"
        aria-label={
          ariaLabel ?? `Pyramid with ${levels.length} levels: ${levels.map((l) => l.label).join(", ")}`
        }
      >
        {levels.map((level, i) => {
          const share = widest > 0 ? Math.max(0.06, level.value / widest) : 1;
          const color = level.color ?? seriesColor(i, palette);

          return (
            <div
              key={level.label}
              className="gl-chart-pyramid-level"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              style={{ height: levelHeight }}
            >
              <div
                className="gl-chart-pyramid-band"
                style={{
                  width: `${share * 100}%`,
                  background: color,
                  opacity: hover === null || hover === i ? 1 : 0.5,
                }}
              >
                <span className="gl-chart-pyramid-label">{level.label}</span>
                <span className="gl-chart-pyramid-value">{fmt(level.value)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <ChartTooltip visible={hover !== null} x={0} y={0} align="left">
        {hover !== null && (
          <TooltipRow
            color={levels[hover]!.color ?? seriesColor(hover, palette)}
            label={levels[hover]!.label}
            value={`${fmt(levels[hover]!.value)} · ${Math.round((levels[hover]!.value / (total || 1)) * 100)}%`}
          />
        )}
      </ChartTooltip>
    </div>
  );
}
