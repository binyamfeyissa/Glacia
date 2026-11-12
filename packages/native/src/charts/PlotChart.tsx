import { useMemo, useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { formatValue, linearScale, niceDomain, ticks } from "./scales";

export interface NativePlotPoint {
  x: number;
  y: number;
  label?: string;
}

export interface NativePlotRenderArgs {
  x: (value: number) => number;
  y: (value: number) => number;
  points: NativePlotPoint[];
  width: number;
  height: number;
}

export interface NativePlotChartProps {
  points: NativePlotPoint[];
  /** Draws the marks. Receives real pixel scales, not a fabricated viewBox. */
  renderMark?: (args: NativePlotRenderArgs) => any;
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  isDark?: boolean;
  style?: any;
}

const PADDING = { top: 12, right: 12, bottom: 26, left: 44 };

/**
 * A numeric plot you supply the marks for.
 *
 * The axes, ticks and padding are handled here and the caller receives real
 * pixel scales. That keeps stroke widths and text sizes honest regardless of
 * the chart's width, instead of a scaled viewBox that would distort them.
 */
export function NativePlotChart({
  points,
  renderMark,
  width = 320,
  height = 200,
  xLabel,
  yLabel,
  isDark = false,
  style,
}: NativePlotChartProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Svg, G, Line, Circle, SvgText } = primitives();

  const plot = {
    x: PADDING.left,
    y: PADDING.top,
    width: Math.max(0, width - PADDING.left - PADDING.right),
    height: Math.max(0, height - PADDING.top - PADDING.bottom),
  };
  const right = plot.x + plot.width;
  const bottom = plot.y + plot.height;

  const xDomain = useMemo(() => {
    const values = points.map((point) => point.x).filter(Number.isFinite);
    return niceDomain(values.length ? Math.min(...values) : 0, values.length ? Math.max(...values) : 1, 4);
  }, [points.map((point) => point.x).join(",")]);

  const yDomain = useMemo(() => {
    const values = points.map((point) => point.y).filter(Number.isFinite);
    return niceDomain(values.length ? Math.min(...values) : 0, values.length ? Math.max(...values) : 1, 4);
  }, [points.map((point) => point.y).join(",")]);

  const x = linearScale(xDomain, [plot.x, right], { nice: false });
  const y = linearScale(yDomain, [bottom, plot.y], { nice: false });

  if (points.length === 0) {
    return (
      <View style={[{ width, height, alignItems: "center", justifyContent: "center" }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No points to display</Text>
      </View>
    );
  }

  const yTicks = ticks(yDomain, 4);
  const xTicks = ticks(xDomain, 4);

  return (
    <View style={style}>
      <Svg width={width} height={height}>
        {yTicks.map((tick, i) => (
          <Line
            key={`grid-${i}`}
            x1={plot.x}
            x2={right}
            y1={y(tick)}
            y2={y(tick)}
            stroke={theme.axis}
            strokeOpacity={0.22}
            strokeWidth={1}
          />
        ))}

        {renderMark ? (
          renderMark({ x, y, points, width: plot.width, height: plot.height })
        ) : (
          <G>
            {points.map((point, index) => (
              <Circle key={index} cx={x(point.x)} cy={y(point.y)} r={3.5} fill={theme.fill} />
            ))}
          </G>
        )}

        {yTicks.map((tick, i) => (
          <SvgText
            key={`y-${i}`}
            x={plot.x - 6}
            y={y(tick) + 3}
            fill={theme.muted}
            fontSize={9}
            textAnchor="end"
          >
            {formatValue(tick, { compact: true })}
          </SvgText>
        ))}

        {xTicks.map((tick, i) => (
          <SvgText
            key={`x-${i}`}
            x={x(tick)}
            y={height - 8}
            fill={theme.muted}
            fontSize={9}
            textAnchor="middle"
          >
            {formatValue(tick, { compact: true })}
          </SvgText>
        ))}
      </Svg>

      {(xLabel || yLabel) && (
        <Text style={{ fontSize: 9, color: theme.muted, marginTop: 2 }}>
          {[xLabel, yLabel].filter(Boolean).join(" · ")}
        </Text>
      )}
    </View>
  );
}
