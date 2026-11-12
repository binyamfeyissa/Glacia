import { useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { formatValue, seriesColor } from "./scales";

export interface NativeRadarSeries {
  name: string;
  /** One value per axis, in the same order as `axes`. */
  values: number[];
  color?: string;
}

export interface NativeRadarChartProps {
  axes: string[];
  series: NativeRadarSeries[];
  size?: number;
  /** Number of concentric rings behind the data. */
  rings?: number;
  /** Fixed maximum; defaults to the largest value across series. */
  max?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onAxisPress?: (index: number) => void;
}

const TAU = Math.PI * 2;

/** Point on a circle at `index` of `count`, starting at 12 o'clock. */
function vertex(index: number, count: number, radius: number, cx: number, cy: number) {
  const angle = (index / count) * TAU - Math.PI / 2;
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

/**
 * Several axes around a circle, one closed shape per series.
 *
 * Reading many dimensions off a phone is hard, so every axis label is also a
 * touch target: tapping one lists that axis's values for all series instead of
 * relying on a hover tooltip.
 */
export function NativeRadarChart({
  axes,
  series,
  size = 260,
  rings = 4,
  max,
  isDark = false,
  palette,
  style,
  onAxisPress,
}: NativeRadarChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Svg, G, Line, Polygon, Circle, SvgText } = primitives();

  if (axes.length < 3 || series.length === 0) {
    return (
      <View style={[{ width: size, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>
          {axes.length < 3 ? "A radar chart needs at least 3 axes" : "No series to display"}
        </Text>
      </View>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  // Leave room for the axis labels, which sit outside the outer ring.
  const radius = size / 2 - 26;

  const allValues = series.flatMap((s) => s.values).filter(Number.isFinite);
  const highest = max ?? (allValues.length ? Math.max(...allValues) : 1);
  const ceiling = highest > 0 ? highest : 1;

  const ringPolygons = Array.from({ length: rings }, (_, i) => {
    const r = (radius * (i + 1)) / rings;
    return axes
      .map((_, a) => {
        const p = vertex(a, axes.length, r, cx, cy);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  });

  return (
    <View style={[{ width: size }, style]}>
      <Svg width={size} height={size}>
        {ringPolygons.map((points, i) => (
          <Polygon
            key={`ring-${i}`}
            points={points}
            fill="none"
            stroke={theme.axis}
            strokeOpacity={0.22}
            strokeWidth={1}
          />
        ))}

        {axes.map((_, a) => {
          const p = vertex(a, axes.length, radius, cx, cy);
          return (
            <Line
              key={`spoke-${a}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke={theme.axis}
              strokeOpacity={0.22}
              strokeWidth={1}
            />
          );
        })}

        {series.map((s, si) => {
          const color = s.color ?? seriesColor(si, palette);
          const points = s.values
            .map((value, a) => {
              const ratio = Math.max(0, Math.min(1, value / ceiling));
              const p = vertex(a, axes.length, radius * ratio, cx, cy);
              return `${p.x},${p.y}`;
            })
            .join(" ");

          return (
            <G key={s.name}>
              <Polygon
                points={points}
                fill={color}
                fillOpacity={active === null ? 0.18 : 0.1}
                stroke={color}
                strokeWidth={2}
              />
              {s.values.map((value, a) => {
                const ratio = Math.max(0, Math.min(1, value / ceiling));
                const p = vertex(a, axes.length, radius * ratio, cx, cy);
                return (
                  <Circle
                    key={a}
                    cx={p.x}
                    cy={p.y}
                    r={active === a ? 4 : 2.5}
                    fill={color}
                  />
                );
              })}
            </G>
          );
        })}

        {axes.map((axis, a) => {
          const p = vertex(a, axes.length, radius + 13, cx, cy);
          // Labels on the left half should end at the axis, not start from it.
          const anchor = p.x < cx - 1 ? "end" : p.x > cx + 1 ? "start" : "middle";
          return (
            <SvgText
              key={`label-${a}`}
              x={p.x}
              y={p.y + 3}
              fill={active === a ? theme.foreground : theme.muted}
              fontSize={9}
              textAnchor={anchor}
            >
              {axis}
            </SvgText>
          );
        })}
      </Svg>

      {/* Axis pickers: a phone has no hover, so each axis is separately tappable. */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {axes.map((axis, a) => (
          <Pressable
            key={axis}
            accessibilityRole="button"
            accessibilityLabel={`${axis} axis`}
            onPress={() => {
              setActive((current) => (current === a ? null : a));
              onAxisPress?.(a);
            }}
            style={{
              paddingVertical: 3,
              paddingHorizontal: 8,
              borderRadius: 7,
              backgroundColor: active === a ? theme.glassActive : theme.glass,
            }}
          >
            <Text style={{ color: theme.foreground, fontSize: 10 }}>{axis}</Text>
          </Pressable>
        ))}
      </View>

      {active !== null && (
        <View style={{ marginTop: 8 }}>
          {series.map((s, si) => (
            <Text key={s.name} style={{ color: theme.muted, fontSize: 10, marginTop: 2 }}>
              {s.name}: {formatValue(s.values[active] ?? 0)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
