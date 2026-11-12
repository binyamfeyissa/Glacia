import { NativeLineChart, type NativeLineSeries } from "./LineChart";

export interface NativeAreaChartProps {
  labels: string[];
  series: NativeLineSeries[];
  width?: number;
  height?: number;
  smooth?: boolean;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onPointPress?: (index: number) => void;
}

/**
 * A continuous series with its area filled.
 *
 * This is NativeLineChart drawing filled: the same scales, axis ticks and
 * touch targets, so the two stay consistent when used side by side.
 */
export function NativeAreaChart(props: NativeAreaChartProps) {
  return <NativeLineChart {...props} area />;
}

export interface NativeMirrorAreaSeries {
  name: string;
  /** Positive values drawn upward. */
  above: number[];
  /** Positive values drawn downward. */
  below: number[];
}

export interface NativeMirrorAreaChartProps {
  labels: string[];
  series: NativeMirrorAreaSeries;
  width?: number;
  height?: number;
  aboveColor?: string;
  belowColor?: string;
  isDark?: boolean;
  style?: any;
}

/**
 * Two series mirrored across a shared centre line.
 *
 * The below series is negated and drawn on the same axis as the above series,
 * so both directions are measured against one honest scale rather than two
 * charts that could be scaled differently.
 */
export function NativeMirrorAreaChart({
  labels,
  series,
  aboveColor = "#0088ff",
  belowColor = "#ff375f",
  ...rest
}: NativeMirrorAreaChartProps) {
  return (
    <NativeLineChart
      {...rest}
      labels={labels}
      area
      series={[
        { name: `${series.name} (above)`, values: series.above, color: aboveColor },
        {
          name: `${series.name} (below)`,
          values: series.below.map((v) => -Math.abs(v)),
          color: belowColor,
        },
      ]}
    />
  );
}
