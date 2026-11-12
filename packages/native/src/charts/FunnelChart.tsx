import { useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { formatValue, seriesColor } from "./scales";

export interface NativeFunnelStage {
  label: string;
  value: number;
  color?: string;
}

export interface NativeFunnelChartProps {
  stages: NativeFunnelStage[];
  width?: number;
  stageHeight?: number;
  /** Value the first stage is measured against. Defaults to its own value. */
  baseline?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onStagePress?: (index: number) => void;
}

/**
 * A sequence of stages where each narrows the one before it.
 *
 * Built from plain Views rather than SVG: a funnel is a set of proportional
 * rectangles, so vector drawing would add a dependency for nothing. Each row
 * shows its own value, its share of entry, and the step conversion — the three
 * numbers a funnel is actually read for.
 */
export function NativeFunnelChart({
  stages,
  width = 320,
  stageHeight = 38,
  baseline,
  isDark = false,
  palette,
  style,
  onStagePress,
}: NativeFunnelChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  if (stages.length === 0) {
    return (
      <View style={[{ width, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No stages to display</Text>
      </View>
    );
  }

  const entry = baseline ?? stages[0]?.value ?? 1;
  const widest = Math.max(entry, ...stages.map((s) => s.value)) || 1;

  return (
    <View style={[{ width }, style]}>
      {stages.map((stage, i) => {
        const previous = i === 0 ? null : stages[i - 1]!.value;
        const stepRate = previous && previous > 0 ? stage.value / previous : null;
        const share = entry > 0 ? stage.value / entry : 0;
        const color = stage.color ?? seriesColor(i, palette);
        const widthPercent = Math.max(0.02, stage.value / widest);

        return (
          <Pressable
            key={stage.label}
            accessibilityRole="button"
            accessibilityLabel={`${stage.label}: ${formatValue(stage.value)}, ${Math.round(
              share * 100,
            )} percent of entry`}
            onPress={() => {
              setActive((current) => (current === i ? null : i));
              onStagePress?.(i);
            }}
            style={{ marginBottom: i < stages.length - 1 ? 10 : 0 }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ color: theme.foreground, fontSize: 12, fontWeight: "500" }}>
                {stage.label}
              </Text>
              <Text style={{ color: theme.muted, fontSize: 12 }}>
                {formatValue(stage.value, { compact: true })}
              </Text>
            </View>

            <View
              style={{
                height: stageHeight,
                borderRadius: 10,
                backgroundColor: isDark ? "rgba(235,235,245,0.08)" : "rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${widthPercent * 100}%`,
                  height: "100%",
                  borderRadius: 10,
                  backgroundColor: color,
                  opacity: active === null || active === i ? 1 : 0.5,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 3 }}>
              <Text style={{ color: theme.muted, fontSize: 10 }}>
                {Math.round(share * 100)}% of entry
              </Text>
              {stepRate !== null && (
                <Text style={{ color: theme.muted, fontSize: 10 }}>
                  {Math.round(stepRate * 100)}% from previous
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
