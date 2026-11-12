import { useMemo, useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { bandScale, formatValue, linearScale, niceDomain, seriesColor, ticks } from "./scales";

export interface NativeBarSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface NativeBarChartProps {
  labels: string[];
  series: NativeBarSeries[];
  width?: number;
  height?: number;
  stacked?: boolean;
  radius?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onBarPress?: (index: number) => void;
}

const PADDING = { top: 12, right: 10, bottom: 24, left: 38 };

/** Grouped or stacked bars, drawn with react-native-svg. */
export function NativeBarChart({
  labels,
  series,
  width = 320,
  height = 200,
  stacked = false,
  radius = 4,
  isDark = false,
  palette,
  style,
  onBarPress,
}: NativeBarChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Svg, G, Line, Rect, SvgText } = primitives();

  const plot = {
    x: PADDING.left,
    y: PADDING.top,
    width: Math.max(0, width - PADDING.left - PADDING.right),
    height: Math.max(0, height - PADDING.top - PADDING.bottom),
  };
  const bottom = plot.y + plot.height;
  const right = plot.x + plot.width;

  const totals = stacked
    ? labels.map((_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0))
    : series.flatMap((s) => s.values);

  const domain = useMemo(() => {
    const max = totals.length ? Math.max(...totals) : 1;
    return niceDomain(0, max, 4);
  }, [totals.join(",")]);

  const y = linearScale(domain, [bottom, plot.y], { nice: false });
  const bands = bandScale(labels.length, [plot.x, right], 0.32);
  const barWidth = stacked ? bands.width : bands.width / Math.max(1, series.length);
  const yTicks = ticks(domain, 4);

  if (labels.length === 0 || series.length === 0) {
    return (
      <View style={[{ width, height, alignItems: "center", justifyContent: "center" }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No bars to display</Text>
      </View>
    );
  }

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

        {labels.map((label, i) => {
          let stackTop = bottom;

          return (
            <G key={label + i}>
              {series.map((s, si) => {
                const value = s.values[i] ?? 0;
                const color = s.color ?? seriesColor(si, palette);
                const barHeight = Math.max(0, bottom - y(value));

                const barX = stacked
                  ? bands.start(i)
                  : bands.start(i) + si * barWidth + (si > 0 ? 1 : 0);
                const barY = stacked ? stackTop - barHeight : y(value);
                const w = stacked ? bands.width : Math.max(1, barWidth - (si > 0 ? 1 : 0));

                if (stacked) stackTop -= barHeight;

                return (
                  <Rect
                    key={s.name}
                    x={barX}
                    y={barY}
                    width={w}
                    height={barHeight}
                    rx={Math.min(radius, w / 2)}
                    fill={color}
                    opacity={active === null || active === i ? 1 : 0.45}
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

        {labels.map((label, i) => (
          <SvgText
            key={`x-${i}`}
            x={bands.center(i)}
            y={height - 8}
            fill={theme.muted}
            fontSize={9}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
      </Svg>

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
              onBarPress?.(i);
            }}
          />
        ))}
      </View>
    </View>
  );
}
