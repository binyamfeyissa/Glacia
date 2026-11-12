import { useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { formatValue } from "./scales";

export interface NativeHeatmapChartProps {
  /** One row per series, each holding one value per column. */
  rows: { label: string; values: number[] }[];
  columns: string[];
  cellSize?: number;
  cellGap?: number;
  isDark?: boolean;
  /** Colour for the lowest and highest values. Defaults to a blue ramp. */
  minColor?: string;
  maxColor?: string;
  style?: any;
  onCellPress?: (rowIndex: number, columnIndex: number) => void;
}

/** Parses "#rrggbb" into channels; anything else falls back to grey. */
function parseHex(hex: string): [number, number, number] {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return [128, 128, 128];
  const int = parseInt(match[1]!, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** Linear blend between two hex colours, so a ramp needs no colour library. */
function mix(from: string, to: string, t: number): string {
  const a = parseHex(from);
  const b = parseHex(to);
  const clamped = Math.max(0, Math.min(1, t));
  const channels = a.map((channel, i) => Math.round(channel + (b[i]! - channel) * clamped));
  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
}

/**
 * A grid where colour encodes magnitude.
 *
 * Cells are Views rather than SVG rects: the grid is uniform, so native layout
 * positions it exactly and text stays crisp without vector text.
 */
export function NativeHeatmapChart({
  rows,
  columns,
  cellSize = 28,
  cellGap = 3,
  isDark = false,
  minColor = "#e8eef7",
  maxColor = "#0088ff",
  style,
  onCellPress,
}: NativeHeatmapChartProps) {
  const [active, setActive] = useState<{ r: number; c: number } | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  if (rows.length === 0 || columns.length === 0) {
    return (
      <View style={[{ alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No cells to display</Text>
      </View>
    );
  }

  const all = rows.flatMap((row) => row.values).filter(Number.isFinite);
  const min = all.length ? Math.min(...all) : 0;
  const max = all.length ? Math.max(...all) : 1;
  const span = max - min;

  // A flat grid would otherwise tint every cell the same; centre it instead.
  const position = (value: number) => (span === 0 ? 0.5 : (value - min) / span);
  const labelWidth = 54;

  return (
    <View style={style}>
      <View style={{ flexDirection: "row", marginLeft: labelWidth }}>
        {columns.map((column) => (
          <View key={column} style={{ width: cellSize + cellGap, alignItems: "center" }}>
            <Text style={{ color: theme.muted, fontSize: 9 }} numberOfLines={1}>
              {column}
            </Text>
          </View>
        ))}
      </View>

      {rows.map((row, r) => (
        <View key={row.label} style={{ flexDirection: "row", alignItems: "center", marginTop: cellGap }}>
          <View style={{ width: labelWidth }}>
            <Text style={{ color: theme.foreground, fontSize: 10 }} numberOfLines={1}>
              {row.label}
            </Text>
          </View>

          {columns.map((column, c) => {
            const value = row.values[c];
            const isActive = active?.r === r && active?.c === c;
            const tint = value == null ? "transparent" : mix(minColor, maxColor, position(value));

            return (
              <Pressable
                key={column}
                accessibilityRole="button"
                accessibilityLabel={`${row.label} ${column}: ${
                  value == null ? "no data" : formatValue(value)
                }`}
                onPress={() => {
                  if (value == null) return;
                  setActive((current) => (current?.r === r && current?.c === c ? null : { r, c }));
                  onCellPress?.(r, c);
                }}
                style={{
                  width: cellSize,
                  height: cellSize,
                  marginRight: cellGap,
                  borderRadius: 6,
                  backgroundColor: tint,
                  borderWidth: isActive ? 2 : 0,
                  borderColor: theme.foreground,
                }}
              />
            );
          })}
        </View>
      ))}

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginLeft: labelWidth }}>
        <Text style={{ color: theme.muted, fontSize: 9, marginRight: 5 }}>
          {formatValue(min, { compact: true })}
        </Text>
        <View
          style={{
            width: 70,
            height: 6,
            borderRadius: 3,
            backgroundColor: mix(minColor, maxColor, 0.5),
          }}
        />
        <Text style={{ color: theme.muted, fontSize: 9, marginLeft: 5 }}>
          {formatValue(max, { compact: true })}
        </Text>
      </View>

      {active !== null && rows[active.r]?.values[active.c] != null && (
        <Text style={{ color: theme.foreground, fontSize: 11, marginTop: 8, marginLeft: labelWidth }}>
          {rows[active.r]!.label} · {columns[active.c]}:{" "}
          {formatValue(rows[active.r]!.values[active.c]!)}
        </Text>
      )}
    </View>
  );
}
