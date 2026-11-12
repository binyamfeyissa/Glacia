import { useMemo, useState } from "react";

import { colors, radii } from "../internal/tokens";
import { primitives } from "./primitives";
import {
  bandScale,
  formatValue,
  linearScale,
  niceDomain,
  seriesColor,
  smoothPath,
  ticks,
} from "./scales";

export interface NativeLineSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface NativeLineChartProps {
  labels: string[];
  series: NativeLineSeries[];
  width?: number;
  height?: number;
  /** Fill beneath each line. */
  area?: boolean;
  smooth?: boolean;
  showDots?: boolean;
  isDark?: boolean;
  palette?: readonly string[];
  style?: StyleProps;
  /** Called with the index of the touched point. */
  onPointPress?: (index: number) => void;
}

const PADDING = { top: 12, right: 10, bottom: 24, left: 38 };

type StyleProps = any;

/**
 * A line chart drawn with react-native-svg.
 *
 * Uses the same scale maths as the web LineChart, so the same series produces
 * the same axis values on both platforms. Touching a column selects that
 * point, which is the touch equivalent of hovering on the web.
 */
export function NativeLineChart({
  labels,
  series,
  width = 320,
  height = 200,
  area = false,
  smooth = true,
  showDots = false,
  isDark = false,
  palette,
  style,
  onPointPress,
}: NativeLineChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Svg, G, Line, Path, Circle, SvgText } = primitives();

  const plot = {
    x: PADDING.left,
    y: PADDING.top,
    width: Math.max(0, width - PADDING.left - PADDING.right),
    height: Math.max(0, height - PADDING.top - PADDING.bottom),
  };
  const bottom = plot.y + plot.height;
  const right = plot.x + plot.width;

  const all = series.flatMap((s) => s.values).filter(Number.isFinite);

  const domain = useMemo(() => {
    if (all.length === 0) return [0, 1] as [number, number];
    const min = Math.min(...all);
    const max = Math.max(...all);
    return niceDomain(area ? Math.min(0, min) : min, max, 4);
  }, [all.join(","), area]);

  const y = linearScale(domain, [bottom, plot.y], { nice: false });
  const x = bandScale(labels.length, [plot.x, right], 0);
  const yTicks = ticks(domain, 4);

  if (labels.length === 0 || series.length === 0) {
    return (
      <View style={[{ width, height, alignItems: "center", justifyContent: "center" }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No series to display</Text>
      </View>
    );
  }

  return (
    <View style={style}>
      <Svg width={width} height={height}>
        {/* Grid */}
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
          const points = s.values.map((value, i) => ({
            x: x.center(i),
            y: Number.isFinite(value) ? y(value) : bottom,
          }));
          const line = smooth
            ? smoothPath(points)
            : `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;

          return (
            <G key={s.name}>
              {area && (
                <Path
                  d={`${line} L ${points[points.length - 1]!.x} ${bottom} L ${points[0]!.x} ${bottom} Z`}
                  fill={color}
                  fillOpacity={0.16}
                />
              )}
              <Path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
              {(showDots || active !== null) &&
                points.map((p, i) => (
                  <Circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={active === i ? 4 : 2.5}
                    fill={color}
                    opacity={active === null || active === i ? 1 : 0.4}
                  />
                ))}
            </G>
          );
        })}

        {/* Selected guide line */}
        {active !== null && (
          <Line
            x1={x.center(active)}
            x2={x.center(active)}
            y1={plot.y}
            y2={bottom}
            stroke={theme.foreground}
            strokeOpacity={0.24}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}

        {/* Axis labels */}
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

        {labels.map((label, i) => (
          <SvgText
            key={`x-${i}`}
            x={x.center(i)}
            y={height - 8}
            fill={theme.muted}
            fontSize={9}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
      </Svg>

      {/* Touch targets: one column per point, as wide as the band. */}
      <View
        style={{
          position: "absolute",
          left: plot.x,
          top: plot.y,
          width: plot.width,
          height: plot.height,
          flexDirection: "row",
        }}
      >
        {labels.map((label, i) => (
          <Pressable
            key={label + i}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${series
              .map((s) => `${s.name} ${formatValue(s.values[i] ?? 0)}`)
              .join(", ")}`}
            style={{ flex: 1 }}
            onPress={() => {
              setActive((current) => (current === i ? null : i));
              onPointPress?.(i);
            }}
          />
        ))}
      </View>

      {active !== null && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: PADDING.left,
            right: PADDING.right,
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: radii.sm,
            backgroundColor: theme.glass,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
          pointerEvents="none"
        >
          <Text style={{ color: theme.foreground, fontSize: 10, fontWeight: "600" }}>
            {labels[active]}
          </Text>
          {series.map((s, si) => (
            <Text key={s.name} style={{ color: s.color ?? seriesColor(si, palette), fontSize: 10 }}>
              {s.name} {formatValue(s.values[active] ?? 0)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
