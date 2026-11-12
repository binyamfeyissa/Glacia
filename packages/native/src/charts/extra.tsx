import { useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { NativeLineChart, type NativeLineSeries } from "./LineChart";
import { formatValue, seriesColor } from "./scales";

export interface NativePolarSegment {
  label: string;
  value: number;
  color?: string;
}

export interface NativePolarAreaChartProps {
  segments: NativePolarSegment[];
  size?: number;
  /** Value mapped to the full radius. Defaults to the largest segment. */
  max?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onSegmentPress?: (index: number) => void;
}

const TAU = Math.PI * 2;

/** Point on a circle at `angle` radians, measured from 12 o'clock. */
function polar(angle: number, radius: number, cx: number, cy: number) {
  return { x: cx + Math.sin(angle) * radius, y: cy - Math.cos(angle) * radius };
}

/**
 * Equal-angle wedges whose radius encodes value.
 *
 * Unlike a pie chart, every wedge uses the same angle, so the reader compares
 * one dimension (radius) rather than area. Each wedge is separately tappable
 * because a phone has no hover.
 */
export function NativePolarAreaChart({
  segments,
  size = 240,
  max,
  isDark = false,
  palette,
  style,
  onSegmentPress,
}: NativePolarAreaChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Svg, G, Path, Circle } = primitives();

  if (segments.length === 0) {
    return (
      <View style={[{ width: size, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No segments to display</Text>
      </View>
    );
  }

  const centre = size / 2;
  const outer = centre - 8;
  const highest = Math.max(...segments.map((segment) => segment.value));
  const scaleMax = max ?? (highest || 1);
  const step = TAU / segments.length;

  return (
    <View style={[{ width: size }, style]}>
      <Svg width={size} height={size}>
        {segments.map((segment, index) => {
          const ratio = Math.max(0.04, Math.min(1, segment.value / scaleMax));
          const radius = outer * ratio;
          const start = index * step - step / 2;
          const end = start + step;
          const from = polar(start, radius, centre, centre);
          const to = polar(end, radius, centre, centre);
          const color = segment.color ?? seriesColor(index, palette);

          // Large-arc is always 0 here: a wedge never exceeds half the circle.
          const path = [
            `M ${centre} ${centre}`,
            `L ${from.x} ${from.y}`,
            `A ${radius} ${radius} 0 0 1 ${to.x} ${to.y}`,
            "Z",
          ].join(" ");

          return (
            <Path
              key={segment.label}
              d={path}
              fill={color}
              fillOpacity={active === null || active === index ? 0.85 : 0.4}
              stroke={theme.edge}
              strokeWidth={1}
              onPress={() => {
                setActive((current) => (current === index ? null : index));
                onSegmentPress?.(index);
              }}
            />
          );
        })}
        <Circle cx={centre} cy={centre} r={outer * 0.18} fill={theme.glass} />
      </Svg>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {segments.map((segment, index) => (
          <Pressable
            key={segment.label}
            accessibilityRole="button"
            accessibilityLabel={`${segment.label}: ${formatValue(segment.value)}`}
            onPress={() => {
              setActive((current) => (current === index ? null : index));
              onSegmentPress?.(index);
            }}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: segment.color ?? seriesColor(index, palette),
              }}
            />
            <Text style={{ fontSize: 10, color: theme.muted }}>{segment.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export interface NativePyramidLevel {
  label: string;
  value: number;
  color?: string;
}

export interface NativePyramidChartProps {
  levels: NativePyramidLevel[];
  /** Height of each level band. */
  levelHeight?: number;
  width?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onLevelPress?: (index: number) => void;
}

/**
 * Stacked bands that narrow toward the top.
 *
 * Bands are Views rather than SVG: each is a centred rectangle whose width is
 * the band's share of the widest level, which native layout computes exactly.
 */
export function NativePyramidChart({
  levels,
  levelHeight = 34,
  width = 320,
  isDark = false,
  palette,
  style,
  onLevelPress,
}: NativePyramidChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  if (levels.length === 0) {
    return (
      <View style={[{ width, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No levels to display</Text>
      </View>
    );
  }

  const widest = Math.max(...levels.map((level) => level.value)) || 1;

  return (
    <View style={[{ width }, style]}>
      {levels.map((level, index) => {
        const share = Math.max(0.06, level.value / widest);
        const color = level.color ?? seriesColor(index, palette);

        return (
          <Pressable
            key={level.label}
            accessibilityRole="button"
            accessibilityLabel={`${level.label}: ${formatValue(level.value)}`}
            onPress={() => {
              setActive((current) => (current === index ? null : index));
              onLevelPress?.(index);
            }}
            style={{ alignItems: "center", marginBottom: 2 }}
          >
            <View
              style={{
                width: `${share * 100}%`,
                height: levelHeight,
                borderRadius: 4,
                backgroundColor: color,
                opacity: active === null || active === index ? 1 : 0.45,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 10, fontWeight: "600", color: "#fff" }}
                numberOfLines={1}
              >
                {level.label} · {formatValue(level.value, { compact: true })}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface NativeLiveLineChartProps {
  labels: string[];
  series: NativeLineSeries[];
  width?: number;
  height?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
}

/**
 * A line chart that keeps only the most recent window of points.
 *
 * The caller pushes new values; this trims to `labels.length` so the window
 * slides instead of growing without bound. Pausing is the caller's decision —
 * a chart that stops itself would hide data the user expects to see arrive.
 */
export function NativeLiveLineChart(props: NativeLiveLineChartProps) {
  return <NativeLineChart {...props} smooth={false} showDots={false} />;
}
