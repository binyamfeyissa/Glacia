import { useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { formatValue } from "./scales";

export interface NativeWaterfallStep {
  label: string;
  /** Signed change. A step with `isTotal` set is drawn as an absolute bar. */
  value: number;
  isTotal?: boolean;
}

export interface NativeWaterfallChartProps {
  steps: NativeWaterfallStep[];
  width?: number;
  height?: number;
  isDark?: boolean;
  style?: any;
  onStepPress?: (index: number) => void;
}

const PADDING = { top: 12, right: 8, bottom: 26, left: 42 };

/**
 * How a running total moves step by step.
 *
 * Each bar starts where the previous one ended, so the reader sees the bridge
 * from opening to closing balance rather than a set of unrelated changes.
 * Increases and decreases are coloured differently, and totals span the axis.
 */
export function NativeWaterfallChart({
  steps,
  width = 320,
  height = 200,
  isDark = false,
  style,
  onStepPress,
}: NativeWaterfallChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Svg, G, Line, Rect, SvgText } = primitives();

  if (steps.length === 0) {
    return (
      <View style={[{ width, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No steps to display</Text>
      </View>
    );
  }

  const up = "#34c759";
  const down = "#ff375f";

  const plot = {
    x: PADDING.left,
    y: PADDING.top,
    width: Math.max(0, width - PADDING.left - PADDING.right),
    height: Math.max(0, height - PADDING.top - PADDING.bottom),
  };
  const right = plot.x + plot.width;
  const bottom = plot.y + plot.height;

  // Bounds come from the running totals, not the raw deltas: a −50 midway
  // through a climb needs the axis to reach below zero only if the running
  // total actually does.
  let running = 0;
  const geometry = steps.map((step) => {
    const start = step.isTotal ? 0 : running;
    const end = step.isTotal ? step.value : running + step.value;
    if (!step.isTotal) running = end;
    return {
      start,
      end,
      low: Math.min(start, end),
      high: Math.max(start, end),
    };
  });

  const lows = geometry.map((g) => g.low);
  const highs = geometry.map((g) => g.high);
  const min = Math.min(0, ...lows);
  const max = Math.max(0, ...highs);
  const span = max - min || 1;

  const y = (value: number) => bottom - ((value - min) / span) * plot.height;
  const stepWidth = plot.width / steps.length;
  const barWidth = Math.min(34, stepWidth * 0.6);

  const zeroY = y(0);

  return (
    <View style={style}>
      <Svg width={width} height={height}>
        <Line
          x1={plot.x}
          x2={right}
          y1={zeroY}
          y2={zeroY}
          stroke={theme.axis}
          strokeOpacity={0.4}
          strokeWidth={1}
        />

        {geometry.map((g, i) => {
          const step = steps[i]!;
          const top = y(g.high);
          const barHeight = Math.max(1, y(g.low) - top);
          const color = step.isTotal ? seriesTotalColor(isDark) : step.value >= 0 ? up : down;
          const x = plot.x + stepWidth * i + (stepWidth - barWidth) / 2;

          return (
            <G key={step.label}>
              <Rect
                x={x}
                y={top}
                width={barWidth}
                height={barHeight}
                rx={3}
                fill={color}
                fillOpacity={active === null || active === i ? 1 : 0.45}
                onPress={() => {
                  setActive((current) => (current === i ? null : i));
                  onStepPress?.(i);
                }}
              />
              {/* Connector to the next bar's baseline, so the accumulation reads. */}
              {i < steps.length - 1 && !steps[i + 1]!.isTotal && (
                <Line
                  x1={x + barWidth}
                  x2={plot.x + stepWidth * (i + 1) + (stepWidth - barWidth) / 2}
                  y1={y(g.end)}
                  y2={y(g.end)}
                  stroke={theme.axis}
                  strokeOpacity={0.4}
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
              )}
              <SvgText
                x={x + barWidth / 2}
                y={height - 8}
                fill={theme.muted}
                fontSize={8}
                textAnchor="middle"
              >
                {step.label}
              </SvgText>
            </G>
          );
        })}

        {[max, min].map((value, i) => (
          <SvgText
            key={`y-${i}`}
            x={plot.x - 6}
            y={y(value) + 3}
            fill={theme.muted}
            fontSize={9}
            textAnchor="end"
          >
            {formatValue(value, { compact: true })}
          </SvgText>
        ))}
      </Svg>

      {active !== null && (
        <Text style={{ color: theme.foreground, fontSize: 11, marginTop: 6 }}>
          {steps[active]!.label}: {steps[active]!.value >= 0 ? "+" : ""}
          {formatValue(steps[active]!.value)}
          {steps[active]!.isTotal
            ? " (total)"
            : ` → ${formatValue(geometry[active]!.end)} running`}
        </Text>
      )}
    </View>
  );
}

/** Totals are neutral so they do not read as a gain or loss. */
function seriesTotalColor(isDark: boolean) {
  return isDark ? "#8e8e93" : "#3c3c43";
}
