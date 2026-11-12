"use client";

import { useState } from "react";

import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { formatValue, seriesColor } from "./scales";

export interface FunnelStage {
  label: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  /** Height of each stage bar in pixels. */
  stageHeight?: number;
  /** Gap between stages. */
  gap?: number;
  /**
   * Value the first stage is measured against. Defaults to the first stage's
   * own value, which makes the first conversion 100%.
   */
  baseline?: number;
  format?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

/**
 * A sequence of stages where each narrows the one before it.
 *
 * Each row shows its own value, its share of the entry point, and the step's
 * conversion from the previous stage — the three numbers a funnel is actually
 * read for.
 */
export function FunnelChart({
  stages,
  stageHeight = 44,
  gap = 8,
  baseline,
  format,
  palette,
  className,
  ariaLabel,
}: FunnelChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  if (stages.length === 0) {
    return <ChartEmpty label="No stages to display" />;
  }

  const entry = baseline ?? stages[0]!.value ?? 1;
  const widest = Math.max(entry, ...stages.map((s) => s.value)) || 1;
  const fmt = (value: number) => (format ? format(value) : formatValue(value, { compact: true }));

  return (
    <div className={className}>
      <ol className="gl-chart-funnel">
        {stages.map((stage, i) => {
          const previous = i === 0 ? null : stages[i - 1]!.value;
          const stepRate = previous && previous > 0 ? stage.value / previous : null;
          const share = entry > 0 ? stage.value / entry : 0;
          const color = stage.color ?? seriesColor(i, palette);

          return (
            <li
              key={stage.label}
              className="gl-chart-funnel-stage"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
            >
              <div className="gl-chart-funnel-meta">
                <span className="gl-chart-funnel-label">{stage.label}</span>
                <span className="gl-chart-funnel-value">{fmt(stage.value)}</span>
              </div>

              <div className="gl-chart-funnel-track" style={{ height: stageHeight }}>
                <div
                  className="gl-chart-funnel-bar"
                  style={{
                    width: `${Math.max(2, (stage.value / widest) * 100)}%`,
                    background: color,
                    opacity: hover === null || hover === i ? 1 : 0.5,
                  }}
                />
              </div>

              <div className="gl-chart-funnel-rates">
                <span>{Math.round(share * 100)}% of entry</span>
                {stepRate !== null && <span>{Math.round(stepRate * 100)}% from previous</span>}
              </div>

              {gap > 0 && i < stages.length - 1 && <span style={{ height: gap, display: "block" }} />}
            </li>
          );
        })}
      </ol>

      <ChartTooltip visible={hover !== null} x={0} y={0} align="left">
        {hover !== null && (
          <TooltipRow
            color={stages[hover]!.color ?? seriesColor(hover, palette)}
            label={stages[hover]!.label}
            value={fmt(stages[hover]!.value)}
          />
        )}
      </ChartTooltip>
    </div>
  );
}
