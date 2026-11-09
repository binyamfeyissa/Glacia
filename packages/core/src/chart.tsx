import {
  forwardRef,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartProps {
  data: ChartDataPoint[];
  type?: "bar" | "line" | "area";
  height?: number;
  color?: string;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export const Chart: ForwardRefExoticComponent<
  ChartProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, ChartProps>(
  function Chart(
    {
      data,
      type = "bar",
      height = 180,
      color = "#0088ff",
      className,
      valuePrefix = "",
      valueSuffix = "",
    },
    ref
  ) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const chartWidth = 400;
    const paddingX = 24;
    const paddingY = 24;
    const plotWidth = chartWidth - paddingX * 2;
    const plotHeight = height - paddingY * 2;

    const points = data.map((d, i) => {
      const x = paddingX + (i / Math.max(1, data.length - 1)) * plotWidth;
      const y = height - paddingY - (d.value / maxValue) * plotHeight;
      return { x, y, ...d };
    });

    const linePath = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${height - paddingY} L ${points[0]?.x || 0} ${height - paddingY} Z`;

    return (
      <div ref={ref} className={cx("gl-glass gl-chart-card", className)}>
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div className="gl-chart-tooltip">
            <span className="gl-chart-tooltip-label">{data[hoveredIdx].label}</span>
            <span className="gl-chart-tooltip-value">
              {valuePrefix}{data[hoveredIdx].value}{valueSuffix}
            </span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="gl-chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gl-chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={chartWidth - paddingX}
            y2={height - paddingY}
            stroke="var(--gl-edge)"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={chartWidth - paddingX}
            y2={height / 2}
            stroke="var(--gl-edge)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {type === "area" && (
            <path d={areaPath} fill="url(#gl-chart-grad)" />
          )}

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
              const barWidth = Math.max(8, (plotWidth / data.length) * 0.6);
              const barHeight = (d.value / maxValue) * plotHeight;
              const x =
                paddingX +
                i * (plotWidth / data.length) +
                (plotWidth / data.length - barWidth) / 2;
              const y = height - paddingY - barHeight;
              const isHovered = hoveredIdx === i;

              return (
                <rect
                  key={d.label}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={barWidth / 2}
                  fill={color}
                  fillOpacity={isHovered ? 1 : 0.75}
                  className="gl-chart-bar"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}

          {(type === "line" || type === "area") &&
            points.map((p, i) => (
              <circle
                key={p.label}
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 5 : 3.5}
                fill={color}
                stroke="var(--gl-glass)"
                strokeWidth="2"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="gl-chart-point"
              />
            ))}
        </svg>

        {/* Labels row */}
        <div className="gl-chart-labels">
          {data.map((d, i) => (
            <span
              key={d.label}
              className="gl-chart-label"
              data-hovered={hoveredIdx === i ? "" : undefined}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    );
  }
);
