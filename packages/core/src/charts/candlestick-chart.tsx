"use client";

import { useState } from "react";

import { ChartEmpty, ChartFrame } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { bandScale, formatValue, linearScale, niceDomain, plotArea, ticks } from "./scales";
import { useChartWidth } from "./use-chart-width";

export interface Candle {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps {
  candles: Candle[];
  height?: number;
  upColor?: string;
  downColor?: string;
  format?: (value: number) => string;
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 16, right: 12, bottom: 26, left: 48 };

/**
 * Open, high, low and close for each period.
 *
 * A candle whose close is above its open is drawn in the up colour; below, in
 * the down colour. Wicks show the full range so volatility stays visible.
 */
export function CandlestickChart({
  candles,
  height = 260,
  upColor = "var(--gl-chart-2, #34c759)",
  downColor = "var(--gl-chart-4, #ff375f)",
  format,
  className,
  ariaLabel,
}: CandlestickChartProps) {
  const { ref, width } = useChartWidth();
  const [hover, setHover] = useState<number | null>(null);
  const plot = plotArea(width, height, PADDING);

  if (candles.length === 0) {
    return (
      <div ref={ref} className={className}>
        <ChartEmpty label="No candles to display" />
      </div>
    );
  }

  const low = Math.min(...candles.map((c) => c.low));
  const high = Math.max(...candles.map((c) => c.high));
  const domain = niceDomain(low, high, 4);
  const y = linearScale(domain, [plot.bottom, plot.y], { nice: false });
  const bands = bandScale(candles.length, [plot.x, plot.right], 0.42);
  const bodyWidth = Math.max(2, Math.min(14, bands.width));

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
          xLabels={candles.map((c, i) => ({ x: bands.center(i), label: c.label }))}
          ariaLabel={ariaLabel ?? `Candlestick chart with ${candles.length} periods`}
        >
          {candles.map((candle, i) => {
            const up = candle.close >= candle.open;
            const color = up ? upColor : downColor;
            const cx = bands.center(i);
            const bodyTop = y(Math.max(candle.open, candle.close));
            const bodyBottom = y(Math.min(candle.open, candle.close));
            const isHovered = hover === i;

            return (
              <g key={candle.label + i} opacity={hover === null || isHovered ? 1 : 0.5}>
                <line
                  x1={cx}
                  x2={cx}
                  y1={y(candle.high)}
                  y2={y(candle.low)}
                  stroke={color}
                  strokeWidth={1.25}
                />
                <rect
                  x={cx - bodyWidth / 2}
                  y={bodyTop}
                  width={bodyWidth}
                  height={Math.max(1.5, bodyBottom - bodyTop)}
                  rx={1.5}
                  fill={color}
                />
                <rect
                  x={cx - bands.bandWidth / 2}
                  y={plot.y}
                  width={bands.bandWidth}
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
          x={hover !== null ? Math.min(Math.max(bands.center(hover), 74), width - 74) : 0}
          y={PADDING.top}
        >
          {hover !== null && (
            <>
              <span className="gl-chart-tooltip-title">{candles[hover]!.label}</span>
              <TooltipRow label="open" value={fmt(candles[hover]!.open)} />
              <TooltipRow label="high" value={fmt(candles[hover]!.high)} />
              <TooltipRow label="low" value={fmt(candles[hover]!.low)} />
              <TooltipRow label="close" value={fmt(candles[hover]!.close)} />
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}
