import { useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { arcPath, formatValue, seriesColor } from "./scales";

export interface NativeRingSlice {
  label: string;
  value: number;
  color?: string;
}

export interface NativeRingChartProps {
  data: NativeRingSlice[];
  size?: number;
  /**
   * Ring thickness. Larger leaves a bigger hole.
   * A pie is the same shape with no hole: pass `size` to fill it.
   */
  thickness?: number;
  isDark?: boolean;
  palette?: readonly string[];
  /** Show the slice list beneath the ring. */
  showLegend?: boolean;
  style?: any;
  onSlicePress?: (index: number) => void;
}

const TAU = Math.PI * 2;

/**
 * Proportional slices as a ring, drawn with react-native-svg.
 *
 * Shares the arc maths with the web RingChart, so slices land in the same
 * places on both platforms. A legend is on by default: on a phone there is no
 * hover, so colour alone cannot identify a slice.
 */
export function NativeRingChart({
  data,
  size = 180,
  thickness = 22,
  isDark = false,
  palette,
  showLegend = true,
  style,
  onSlicePress,
}: NativeRingChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Svg, Path } = primitives();

  const total = data.reduce((sum, slice) => sum + Math.max(0, slice.value), 0);

  if (data.length === 0 || total <= 0) {
    return (
      <View style={[{ width: size, alignItems: "center" }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No slices to display</Text>
      </View>
    );
  }

  const outer = size / 2;
  const inner = Math.max(0, outer - thickness);
  let cursor = -Math.PI / 2;

  return (
    <View style={[{ alignItems: "center" }, style]}>
      <Svg width={size} height={size}>
        {data.map((slice, i) => {
          const share = Math.max(0, slice.value) / total;
          const start = cursor;
          const end = cursor + share * TAU;
          cursor = end;

          return (
            <Path
              key={slice.label}
              d={arcPath(outer, outer, outer, inner, start, end)}
              fill={slice.color ?? seriesColor(i, palette)}
              opacity={active === null || active === i ? 1 : 0.4}
              onPress={() => {
                setActive((current) => (current === i ? null : i));
                onSlicePress?.(i);
              }}
            />
          );
        })}
      </Svg>

      {showLegend && (
        <View style={{ marginTop: 12, width: "100%", maxWidth: 260, gap: 6 }}>
          {data.map((slice, i) => (
            <Pressable
              key={slice.label}
              accessibilityRole="button"
              accessibilityLabel={`${slice.label}: ${formatValue(slice.value)}, ${Math.round(
                (slice.value / total) * 100,
              )} percent`}
              onPress={() => {
                setActive((current) => (current === i ? null : i));
                onSlicePress?.(i);
              }}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 3,
                  backgroundColor: slice.color ?? seriesColor(i, palette),
                }}
              />
              <Text style={{ color: theme.muted, fontSize: 12, flex: 1 }} numberOfLines={1}>
                {slice.label}
              </Text>
              <Text
                style={{
                  color: theme.foreground,
                  fontSize: 12,
                  fontWeight: active === i ? "700" : "600",
                }}
              >
                {formatValue(slice.value)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
