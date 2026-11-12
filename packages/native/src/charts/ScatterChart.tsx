import { useMemo, useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { formatValue, linearScale, niceDomain, seriesColor, ticks } from "./scales";

export interface NativeScatterPoint {
  x: number;
  y: number;
  label?: string;
  /** Bubble radius driver; ignored when `bubble` is not set. */
  size?: number;
}

export interface NativeScatterSeries {
  name: string;
  points: NativeScatterPoint[];
  color?: string;
}

export interface NativeScatterChartProps {
  series: NativeScatterSeries[];
  width?: number;
  height?: number;
  /** Fixed dot radius. */
  radius?: number;
  /** Size each mark by its `size` value instead of a fixed radius. */
  bubble?: boolean;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onPointPress?: (seriesIndex: number, pointIndex: number) => void;
}

const PADDING = { top: 12, right: 12, bottom: 24, left: 40 };

/**
 * Two numeric axes, drawn with react-native-svg.
 *
 * BubbleChart is this component with `bubble` set, so the two share their
 * axes, padding and touch behaviour instead of drifting apart.
 */
export function NativeScatterChart({
  series,
  width = 320,
  height = 200,
  radius = 4,
  bubble = false,
  isDark = false,
  palette,
  style,
  onPointPress,
}: NativeScatterChartProps) {
  const [active, setActive] = useState<{ s: number; p: number } | null>(null);
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

  const all = series.flatMap((s) => s.points);

  const xDomain = useMemo(() => {
    const xs = all.map((p) => p.x).filter(Number.isFinite);
    return niceDomain(xs.length ? Math.min(...xs) : 0, xs.length ? Math.max(...xs) : 1, 4);
  }, [all.map((p) => p.x).join(",")]);

  const yDomain = useMemo(() => {
    const ys = all.map((p) => p.y).filter(Number.isFinite);
    return niceDomain(ys.length ? Math.min(...ys) : 0, ys.length ? Math.max(...ys) : 1, 4);
  }, [all.map((p) => p.y).join(",")]);

  const x = linearScale(xDomain, [plot.x, right], { nice: false });
  const y = linearScale(yDomain, [bottom, plot.y], { nice: false });

  const sizes = all.map((p) => p.size ?? 1);
  const maxSize = sizes.length ? Math.max(...sizes) : 1;
  const minSize = sizes.length ? Math.min(...sizes) : 0;
  const maxRadius = Math.min(plot.width, plot.height) / 7;

  const radiusFor = (point: NativeScatterPoint) => {
    if (!bubble) return radius;
    const size = point.size ?? minSize;
    const t = maxSize === minSize ? 1 : (size - minSize) / (maxSize - minSize);
    return 3 + t * (maxRadius - 3);
  };

  if (all.length === 0) {
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
            strokeOpacity={0.24}
            strokeWidth={1}
          />
        ))}

        {series.map((s, si) => {
          const color = s.color ?? seriesColor(si, palette);
          return (
            <G key={s.name}>
              {s.points.map((point, pi) => {
                const isActive = active?.s === si && active?.p === pi;
                return (
                  <Circle
                    key={pi}
                    cx={x(point.x)}
                    cy={y(point.y)}
                    r={radiusFor(point) + (isActive ? 2 : 0)}
                    fill={color}
                    fillOpacity={isActive ? 0.95 : bubble ? 0.55 : 0.8}
                    onPress={() => {
                      setActive(isActive ? null : { s: si, p: pi });
                      onPointPress?.(si, pi);
                    }}
                  />
                );
              })}
            </G>
          );
        })}

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

      {active !== null && series[active.s]?.points[active.p] && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: PADDING.left,
            paddingVertical: 3,
            paddingHorizontal: 7,
            borderRadius: 8,
            backgroundColor: theme.glass,
          }}
          pointerEvents="none"
        >
          <Text style={{ color: theme.foreground, fontSize: 10, fontWeight: "600" }}>
            {series[active.s]!.points[active.p]!.label ?? series[active.s]!.name}
          </Text>
          <Text style={{ color: theme.muted, fontSize: 10 }}>
            x {formatValue(series[active.s]!.points[active.p]!.x)} · y{" "}
            {formatValue(series[active.s]!.points[active.p]!.y)}
          </Text>
        </View>
      )}
    </View>
  );
}

/** Scatter marks sized by a third value. */
export function NativeBubbleChart(props: Omit<NativeScatterChartProps, "bubble" | "radius">) {
  return <NativeScatterChart {...props} bubble />;
}
