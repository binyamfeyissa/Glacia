import { useMemo, useState } from "react";

import { colors } from "../internal/tokens";
import { primitives } from "./primitives";
import { formatValue, linearScale, niceDomain, seriesColor, ticks } from "./scales";

export interface NativeCandle {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface NativeCandlestickChartProps {
  candles: NativeCandle[];
  width?: number;
  height?: number;
  isDark?: boolean;
  style?: any;
  onCandlePress?: (index: number) => void;
}

const PADDING = { top: 12, right: 8, bottom: 24, left: 42 };

/**
 * Open, high, low and close for each period.
 *
 * A filled body means the period closed up and a hollow body means it closed
 * down, which is the convention traders read without a legend. Each candle is
 * tappable to reveal the four prices, replacing the web hover tooltip.
 */
export function NativeCandlestickChart({
  candles,
  width = 320,
  height = 200,
  isDark = false,
  style,
  onCandlePress,
}: NativeCandlestickChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Svg, G, Line, Rect, SvgText } = primitives();

  const up = "#34c759";
  const down = "#ff3b30";

  const plot = {
    x: PADDING.left,
    y: PADDING.top,
    width: Math.max(0, width - PADDING.left - PADDING.right),
    height: Math.max(0, height - PADDING.top - PADDING.bottom),
  };
  const right = plot.x + plot.width;
  const bottom = plot.y + plot.height;

  const domain = useMemo(() => {
    const highs = candles.map((c) => c.high).filter(Number.isFinite);
    const lows = candles.map((c) => c.low).filter(Number.isFinite);
    if (!highs.length || !lows.length) return niceDomain(0, 1, 4);
    return niceDomain(Math.min(...lows), Math.max(...highs), 4);
  }, [candles.map((c) => `${c.high},${c.low}`).join("|")]);

  const y = linearScale(domain, [bottom, plot.y], { nice: false });

  if (candles.length === 0) {
    return (
      <View style={[{ width, height, alignItems: "center", justifyContent: "center" }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No candles to display</Text>
      </View>
    );
  }

  const step = plot.width / candles.length;
  const bodyWidth = Math.min(14, step * 0.6);
  const yTicks = ticks(domain, 4);

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
            strokeOpacity={0.22}
            strokeWidth={1}
          />
        ))}

        {candles.map((candle, index) => {
          const rising = candle.close >= candle.open;
          const color = rising ? up : down;
          const cx = plot.x + step * index + step / 2;
          const bodyTop = y(Math.max(candle.open, candle.close));
          const bodyBottom = y(Math.min(candle.open, candle.close));
          const isActive = active === index;

          return (
            <G
              key={candle.label}
              onPress={() => {
                setActive((current) => (current === index ? null : index));
                onCandlePress?.(index);
              }}
            >
              {/* Wick */}
              <Line
                x1={cx}
                x2={cx}
                y1={y(candle.high)}
                y2={y(candle.low)}
                stroke={color}
                strokeWidth={1}
              />
              {/* Body: filled when up, hollow when down. */}
              <Rect
                x={cx - bodyWidth / 2}
                y={bodyTop}
                width={bodyWidth}
                height={Math.max(1, bodyBottom - bodyTop)}
                rx={1}
                fill={rising ? color : "transparent"}
                stroke={color}
                strokeWidth={1}
                fillOpacity={isActive ? 1 : 0.9}
              />
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
      </Svg>

      {active !== null && candles[active] && (
        <Text style={{ fontSize: 10, color: theme.muted, marginTop: 4 }}>
          {candles[active]!.label} · O {formatValue(candles[active]!.open)} · H{" "}
          {formatValue(candles[active]!.high)} · L {formatValue(candles[active]!.low)} · C{" "}
          {formatValue(candles[active]!.close)}
        </Text>
      )}
    </View>
  );
}

export interface NativeTreemapItem {
  label: string;
  value: number;
  color?: string;
}

export interface NativeTreemapChartProps {
  items: NativeTreemapItem[];
  width?: number;
  height?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onItemPress?: (index: number) => void;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Squarified treemap: rectangles sized by value, packed to stay close to square.
 *
 * A naive slice-and-dice layout produces slivers that cannot hold a label. This
 * alternates the split direction and lays each row out along the shorter side,
 * so tiles keep a usable aspect ratio.
 */
function squarify(values: number[], box: Box, output: Box[]) {
  if (values.length === 0) return;
  if (values.length === 1) {
    output.push({ ...box });
    return;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    // Equal shares when the values carry no weight.
    output.push({ ...box });
    return;
  }

  // Split the larger side so both halves stay as square as possible.
  let split = 1;
  let accumulated = values[0] ?? 0;
  let best = Math.abs(accumulated / total - 0.5);
  for (let i = 2; i < values.length; i++) {
    accumulated += values[i - 1] ?? 0;
    const ratio = accumulated / total;
    const distance = Math.abs(ratio - 0.5);
    if (distance < best) {
      best = distance;
      split = i;
    }
  }

  const firstShare = values.slice(0, split).reduce((sum, value) => sum + value, 0) / total;

  if (box.w >= box.h) {
    const w = box.w * firstShare;
    squarify(values.slice(0, split), { x: box.x, y: box.y, w, h: box.h }, output);
    squarify(values.slice(split), { x: box.x + w, y: box.y, w: box.w - w, h: box.h }, output);
  } else {
    const h = box.h * firstShare;
    squarify(values.slice(0, split), { x: box.x, y: box.y, w: box.w, h }, output);
    squarify(values.slice(split), { x: box.x, y: box.y + h, w: box.w, h: box.h - h }, output);
  }
}

/** Proportional rectangles for part-to-whole comparison. */
export function NativeTreemapChart({
  items,
  width = 320,
  height = 200,
  isDark = false,
  palette,
  style,
  onItemPress,
}: NativeTreemapChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  if (items.length === 0) {
    return (
      <View style={[{ width, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No items to display</Text>
      </View>
    );
  }

  // Larger first keeps the layout stable and the important tiles big.
  const ordered = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.value - a.item.value);

  const boxes: Box[] = [];
  squarify(
    ordered.map((entry) => entry.item.value),
    { x: 0, y: 0, w: width, h: height },
    boxes,
  );

  return (
    <View style={[{ width, height }, style]}>
      {boxes.map((box, i) => {
        const entry = ordered[i]!;
        const color = entry.item.color ?? seriesColor(i, palette);
        const showLabel = box.w > 46 && box.h > 22;

        return (
          <Pressable
            key={entry.item.label}
            accessibilityRole="button"
            accessibilityLabel={`${entry.item.label}: ${formatValue(entry.item.value)}`}
            onPress={() => {
              setActive((current) => (current === entry.index ? null : entry.index));
              onItemPress?.(entry.index);
            }}
            style={{
              position: "absolute",
              left: box.x,
              top: box.y,
              width: box.w,
              height: box.h,
              padding: 3,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 4,
                backgroundColor: color,
                opacity: active === null || active === entry.index ? 0.9 : 0.45,
                padding: 4,
                justifyContent: "flex-start",
                overflow: "hidden",
              }}
            >
              {showLabel && (
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 9, fontWeight: "600", color: "#fff" }}
                >
                  {entry.item.label}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface NativeSankeyNode {
  id: string;
  label: string;
}

export interface NativeSankeyLink {
  from: string;
  to: string;
  value: number;
}

export interface NativeSankeyChartProps {
  nodes: NativeSankeyNode[];
  links: NativeSankeyLink[];
  width?: number;
  height?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
}

/**
 * Flow between stages, drawn as stacked columns joined by bands.
 *
 * Columns are assigned by longest path from a source, so a node always sits
 * after everything feeding it. Rendering uses Views rather than SVG because the
 * bands are axis-aligned rectangles.
 */
export function NativeSankeyChart({
  nodes,
  links,
  width = 320,
  height = 200,
  isDark = false,
  palette,
  style,
}: NativeSankeyChartProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();

  if (nodes.length === 0 || links.length === 0) {
    return (
      <View style={[{ width, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No flows to display</Text>
      </View>
    );
  }

  // Longest-path column assignment; cycles fall back to the current depth.
  const depth = new Map<string, number>();
  for (const node of nodes) depth.set(node.id, 0);

  for (let pass = 0; pass < nodes.length; pass++) {
    let changed = false;
    for (const link of links) {
      const from = depth.get(link.from) ?? 0;
      const current = depth.get(link.to) ?? 0;
      if (from + 1 > current) {
        depth.set(link.to, from + 1);
        changed = true;
      }
    }
    if (!changed) break;
  }

  const columns = new Map<number, NativeSankeyNode[]>();
  for (const node of nodes) {
    const level = depth.get(node.id) ?? 0;
    const list = columns.get(level) ?? [];
    list.push(node);
    columns.set(level, list);
  }

  const levels = [...columns.keys()].sort((a, b) => a - b);
  const columnWidth = 10;
  const gap = levels.length > 1 ? (width - columnWidth * levels.length) / (levels.length - 1) : 0;

  return (
    <View style={[{ width, height }, style]}>
      {nodes.map((node) => {
        const level = depth.get(node.id) ?? 0;
        const columnIndex = levels.indexOf(level);
        const siblings = columns.get(level) ?? [node];
        const position = siblings.indexOf(node);
        const slot = height / siblings.length;

        return (
          <View
            key={node.id}
            style={{
              position: "absolute",
              left: columnIndex * (columnWidth + gap),
              top: position * slot,
              width: columnWidth,
              height: Math.max(4, slot - 4),
              borderRadius: 2,
              backgroundColor: seriesColor(columnIndex, palette),
            }}
          />
        );
      })}

      {levels.map((level, i) => (
        <Text
          key={level}
          style={{
            position: "absolute",
            left: Math.min(width - 40, i * (columnWidth + gap) - 6),
            bottom: -16,
            fontSize: 9,
            color: theme.muted,
            width: 52,
            textAlign: "center",
          }}
        >
          {i === 0 ? "Start" : i === levels.length - 1 ? "End" : `Stage ${i}`}
        </Text>
      ))}
    </View>
  );
}

export interface NativeBumpSeries {
  name: string;
  /** Rank per period; 1 is best. */
  ranks: number[];
  color?: string;
}

export interface NativeBumpChartProps {
  labels: string[];
  series: NativeBumpSeries[];
  width?: number;
  height?: number;
  isDark?: boolean;
  palette?: readonly string[];
  style?: any;
  onPointPress?: (seriesIndex: number, periodIndex: number) => void;
}

/** Rank changes over time, where the vertical position is the rank itself. */
export function NativeBumpChart({
  labels,
  series,
  width = 320,
  height = 200,
  isDark = false,
  palette,
  style,
  onPointPress,
}: NativeBumpChartProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Svg, G, Line, Circle, SvgText } = primitives();

  const periods = labels.length;

  if (periods === 0 || series.length === 0) {
    return (
      <View style={[{ width, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No rankings to display</Text>
      </View>
    );
  }

  const allRanks = series.flatMap((entry) => entry.ranks).filter(Number.isFinite);
  const worst = allRanks.length ? Math.max(...allRanks) : 1;
  const best = allRanks.length ? Math.min(...allRanks) : 1;

  const padding = { top: 10, right: 10, bottom: 22, left: 10 };
  const plotWidth = Math.max(0, width - padding.left - padding.right);
  const plotHeight = Math.max(0, height - padding.top - padding.bottom);

  // Rank 1 sits at the top, so the axis is inverted.
  const y = (rank: number) => {
    if (worst === best) return padding.top + plotHeight / 2;
    return padding.top + ((rank - best) / (worst - best)) * plotHeight;
  };
  const x = (period: number) =>
    padding.left + (periods === 1 ? plotWidth / 2 : (period / (periods - 1)) * plotWidth);

  return (
    <View style={style}>
      <Svg width={width} height={height}>
        {series.map((entry, si) => {
          const color = entry.color ?? seriesColor(si, palette);
          return (
            <G key={entry.name}>
              {entry.ranks.slice(0, -1).map((rank, pi) => {
                const next = entry.ranks[pi + 1];
                if (next == null) return null;
                return (
                  <Line
                    key={pi}
                    x1={x(pi)}
                    y1={y(rank)}
                    x2={x(pi + 1)}
                    y2={y(next)}
                    stroke={color}
                    strokeWidth={2}
                  />
                );
              })}
              {entry.ranks.map((rank, pi) => (
                <Circle
                  key={pi}
                  cx={x(pi)}
                  cy={y(rank)}
                  r={4}
                  fill={color}
                  onPress={() => onPointPress?.(si, pi)}
                />
              ))}
            </G>
          );
        })}

        {labels.map((label, pi) => (
          <SvgText
            key={label}
            x={x(pi)}
            y={height - 6}
            fill={theme.muted}
            fontSize={9}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

export interface NativeHexPoint {
  x: number;
  y: number;
  /** Drives the bin's colour. */
  value: number;
  label?: string;
}

export interface NativeHexChartProps {
  points: NativeHexPoint[];
  /** Bin radius in points. */
  radius?: number;
  width?: number;
  height?: number;
  isDark?: boolean;
  style?: any;
  onBinPress?: (index: number) => void;
}

/**
 * Points aggregated into hexagonal bins whose colour is the mean value.
 *
 * Binning keeps thousands of points legible: reading one mark's exact position
 * matters less than seeing where density is concentrated.
 */
export function NativeHexChart({
  points,
  radius = 9,
  width = 320,
  height = 200,
  isDark = false,
  style,
  onBinPress,
}: NativeHexChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Svg, G, Path } = primitives();

  if (points.length === 0) {
    return (
      <View style={[{ width, alignItems: "center", paddingVertical: 20 }, style]}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>No points to display</Text>
      </View>
    );
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs) || 1;
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys) || 1;

  const hexWidth = Math.sqrt(3) * radius;
  const columns = Math.max(1, Math.floor(width / hexWidth));
  const rowHeight = 1.5 * radius;
  const rows = Math.max(1, Math.floor(height / rowHeight));

  // Bin by nearest grid cell centre.
  const bins = new Map<string, { sum: number; count: number; cx: number; cy: number }>();
  for (const point of points) {
    const col = Math.min(columns - 1, Math.max(0, Math.floor(((point.x - minX) / (maxX - minX || 1)) * columns)));
    const row = Math.min(rows - 1, Math.max(0, Math.floor(((point.y - minY) / (maxY - minY || 1)) * rows)));
    const key = `${col}:${row}`;
    const existing = bins.get(key);
    const cx = col * hexWidth + hexWidth / 2 + (row % 2 ? hexWidth / 2 : 0);
    const cy = row * rowHeight + rowHeight / 2;
    if (existing) {
      existing.sum += point.value;
      existing.count += 1;
    } else {
      bins.set(key, { sum: point.value, count: 1, cx, cy });
    }
  }

  const means = [...bins.values()].map((bin) => bin.sum / bin.count);
  const lowest = Math.min(...means);
  const highest = Math.max(...means);
  const span = highest - lowest;

  const hexPath = (cx: number, cy: number) => {
    const points_: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      points_.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
    }
    return "M " + points_.join(" L ") + " Z";
  };

  return (
    <View style={style}>
      <Svg width={width} height={height}>
        {[...bins.values()].map((bin, index) => {
          const mean = bin.sum / bin.count;
          const t = span === 0 ? 0.5 : (mean - lowest) / span;
          // Blue ramp from low to high density.
          const red = Math.round(210 - t * 130);
          const green = Math.round(225 - t * 90);
          const blue = Math.round(250 - t * 15);
          const color = `rgb(${red}, ${green}, ${blue})`;

          return (
            <G key={index}>
              <Path
                d={hexPath(bin.cx, bin.cy)}
                fill={color}
                fillOpacity={active === null || active === index ? 1 : 0.4}
                stroke={theme.edge}
                strokeWidth={0.5}
                onPress={() => {
                  setActive((current) => (current === index ? null : index));
                  onBinPress?.(index);
                }}
              />
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
