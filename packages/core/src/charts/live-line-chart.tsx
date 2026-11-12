"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChartEmpty, ChartFrame } from "./chart-frame";
import { formatValue, linearScale, niceDomain, plotArea, ticks } from "./scales";
import { useChartWidth } from "./use-chart-width";

export interface LiveLineChartProps {
  /** Initial values, oldest first. */
  initialValues?: number[];
  /** How many values to keep in the window. */
  window?: number;
  /** Sample interval in milliseconds. */
  interval?: number;
  /**
   * Produces the next sample. Called with the previous value so a caller can
   * build a random walk or replay a real series.
   */
  sample?: (previous: number, index: number) => number;
  /** External values to plot instead of generating. */
  values?: number[];
  /** Start sampling automatically. */
  running?: boolean;
  height?: number;
  color?: string;
  /** Draw the newest sample's value above the line. */
  showValue?: boolean;
  format?: (value: number) => string;
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 24, right: 12, bottom: 20, left: 40 };

/**
 * A line that keeps sampling while mounted.
 *
 * This is a genuinely streaming chart: state advances on a real timer and the
 * window slides, so it can be wired to a polling endpoint by passing `values`
 * or to a local generator with `sample`.
 */
export function LiveLineChart({
  initialValues = [12, 18, 14, 22, 19, 26, 24],
  window: windowSize = 40,
  interval = 900,
  sample,
  values,
  running = true,
  height = 180,
  color = "var(--gl-chart-1, #0088ff)",
  showValue = true,
  format,
  className,
  ariaLabel,
}: LiveLineChartProps) {
  const { ref, width } = useChartWidth();
  const [series, setSeries] = useState<number[]>(initialValues.slice(-windowSize));
  const [paused, setPaused] = useState(!running);
  const index = useRef(series.length);

  // When the caller supplies values, they own the data entirely.
  useEffect(() => {
    if (values) setSeries(values.slice(-windowSize));
  }, [values, windowSize]);

  useEffect(() => {
    if (values || paused) return;

    const id = setInterval(() => {
      setSeries((previous) => {
        const last = previous[previous.length - 1] ?? 0;
        const next = sample
          ? sample(last, index.current)
          : // A bounded random walk keeps the default demo readable and plausible.
            Math.max(2, Math.min(100, last + (Math.random() - 0.45) * 12));
        index.current += 1;
        return [...previous, next].slice(-windowSize);
      });
    }, interval);

    return () => clearInterval(id);
  }, [values, paused, sample, interval, windowSize]);

  const plot = plotArea(width, height, PADDING);

  const domain = useMemo(() => {
    if (series.length === 0) return [0, 1] as [number, number];
    return niceDomain(Math.min(...series), Math.max(...series), 3);
  }, [series]);

  const y = linearScale(domain, [plot.bottom, plot.y], { nice: false });
  const xAt = (i: number) =>
    series.length <= 1 ? plot.x : plot.x + (i / (series.length - 1)) * plot.width;

  const yTicks = ticks(domain, 3).map((v) => ({
    value: y(v),
    label: format ? format(v) : formatValue(v, { compact: true }),
  }));

  if (series.length === 0) {
    return (
      <div ref={ref} className={className}>
        <ChartEmpty label="Waiting for the first sample" />
      </div>
    );
  }

  const points = series.map((value, i) => ({ x: xAt(i), y: y(value) }));
  const path = `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
  const latest = series[series.length - 1] ?? 0;
  const latestPoint = points[points.length - 1]!;
  const fmt = (value: number) => (format ? format(value) : formatValue(value));

  return (
    <div ref={ref} className={className}>
      <div className="gl-chart-wrap">
        <ChartFrame
          width={width}
          height={height}
          plot={plot}
          yTicks={yTicks}
          baseline={false}
          xLabels={[]}
          ariaLabel={ariaLabel ?? `Live line chart, ${series.length} samples, latest ${fmt(latest)}`}
        >
          <path
            d={`${path} L ${latestPoint.x} ${plot.bottom} L ${points[0]!.x} ${plot.bottom} Z`}
            fill={color}
            opacity={0.12}
          />
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* A pulsing marker at the newest sample makes "live" legible. */}
          <circle cx={latestPoint.x} cy={latestPoint.y} r={6} fill={color} opacity={0.18} />
          <circle cx={latestPoint.x} cy={latestPoint.y} r={3} fill={color} />
        </ChartFrame>

        {showValue && (
          <span className="gl-chart-live-value" style={{ color }}>
            {fmt(latest)}
          </span>
        )}

        <button
          type="button"
          className="gl-chart-live-toggle"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          disabled={Boolean(values)}
          aria-label={paused ? "Resume live sampling" : "Pause live sampling"}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
