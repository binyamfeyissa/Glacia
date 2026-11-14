import {
  forwardRef,
  useId,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { useChartWidth } from "./charts/use-chart-width";

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartProps {
  /** The series. Re-renders with whatever data is passed, so it tracks state. */
  data: ChartDataPoint[];
  type?: "bar" | "line" | "area";
  height?: number;
  color?: string;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  /** Accessible name for the chart. Defaults to "Chart". */
  label?: string;
}

const PADDING_X = 24;
const PADDING_Y = 24;

/**
 * A compact chart for a single series.
 *
 * It draws only the plot: no card, no glass panel. The chart is a data
 * readout, so it sits on whatever surface the caller already has rather than
 * stacking another material on top.
 */
export const Chart: ForwardRefExoticComponent<
  ChartProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, ChartProps>(function Chart(
  {
    data,
    type = "bar",
    height = 180,
    color = "#0088ff",
    className,
    valuePrefix = "",
    valueSuffix = "",
    label = "Chart",
  },
  ref,
) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  // Two charts on one page would share a gradient id and paint the first one's
  // colours into the second, so each instance names its own.
  const gradientId = `gl-chart-grad-${useId().replace(/:/g, "")}`;
  // The plot is measured rather than assumed to be 400px wide, so the marks
  // stay proportional at any container size.
  const { ref: measureRef, width } = useChartWidth(400);

  // Defensive: an empty series must draw nothing rather than NaN geometry.
  const values = data.map((d) => (Number.isFinite(d.value) ? d.value : 0));
  const maxValue = Math.max(...values, 0) || 1;
  const chartWidth = Math.max(1, width);
  const plotWidth = Math.max(1, chartWidth - PADDING_X * 2);
  const plotHeight = Math.max(1, height - PADDING_Y * 2);
  const baseline = height - PADDING_Y;

  const points = data.map((d, i) => {
    const value = Number.isFinite(d.value) ? d.value : 0;
    const x =
      data.length === 1
        ? PADDING_X + plotWidth / 2
        : PADDING_X + (i / (data.length - 1)) * plotWidth;
    const y = baseline - (value / maxValue) * plotHeight;
    return { x, y, label: d.label, value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath =
    points.length === 0
      ? ""
      : `${linePath} L ${points[points.length - 1]!.x} ${baseline} L ${points[0]!.x} ${baseline} Z`;

  const hovered = hoveredIdx === null ? null : data[hoveredIdx] ?? null;

  return (
    <div ref={measureRef} className="gl-chart-measure">
      <div
        ref={ref}
        className={cx("gl-chart", className)}
        data-type={type}
        role="img"
        aria-label={`${label}, ${data.length} points`}
      >
        {hovered && (
          <div className="gl-chart-tooltip" aria-hidden>
            <span className="gl-chart-tooltip-label">{hovered.label}</span>
            <span className="gl-chart-tooltip-value">
              {valuePrefix}
              {hovered.value}
              {valueSuffix}
            </span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="gl-chart-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1={PADDING_X}
            y1={baseline}
            x2={chartWidth - PADDING_X}
            y2={baseline}
            stroke="var(--gl-edge)"
            strokeWidth="1"
          />
          <line
            x1={PADDING_X}
            y1={height / 2}
            x2={chartWidth - PADDING_X}
            y2={height / 2}
            stroke="var(--gl-edge)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {type === "area" && <path d={areaPath} fill={`url(#${gradientId})`} />}

          {(type === "line" || type === "area") && (
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {type === "bar" &&
            data.map((d, i) => {
              const value = Number.isFinite(d.value) ? d.value : 0;
              const slot = plotWidth / Math.max(1, data.length);
              const barWidth = Math.max(8, slot * 0.6);
              const barHeight = (value / maxValue) * plotHeight;
              const x = PADDING_X + i * slot + (slot - barWidth) / 2;
              const y = baseline - barHeight;

              return (
                <rect
                  key={`${d.label}-${i}`}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(0, barHeight)}
                  rx={barWidth / 2}
                  fill={color}
                  fillOpacity={hoveredIdx === i ? 1 : 0.75}
                  className="gl-chart-bar"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}

          {(type === "line" || type === "area") &&
            points.map((p, i) => (
              <circle
                key={`${p.label}-${i}`}
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 5 : 3.5}
                fill={color}
                className="gl-chart-point"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
        </svg>

        <div className="gl-chart-labels">
          {data.map((d, i) => (
            <span
              key={`${d.label}-${i}`}
              className="gl-chart-label"
              data-hovered={hoveredIdx === i ? "" : undefined}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});
