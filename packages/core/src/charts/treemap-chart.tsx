"use client";

import { useState } from "react";

import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { formatValue, seriesColor } from "./scales";

export interface TreemapItem {
  label: string;
  value: number;
  color?: string;
}

export interface TreemapChartProps {
  items: TreemapItem[];
  height?: number;
  /** Gap between tiles. */
  gap?: number;
  format?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

interface Tile {
  item: TreemapItem;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Area-proportional nested rectangles.
 *
 * Uses the squarified layout: tiles are placed in rows chosen so their aspect
 * ratios stay close to 1:1. A naive slice-and-dice layout produces long thin
 * slivers that are hard to compare and impossible to label.
 */
function squarify(items: TreemapItem[], width: number, height: number, gap: number): Tile[] {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  if (total <= 0) return [];

  const sorted = [...items].sort((a, b) => b.value - a.value);
  const tiles: Tile[] = [];

  let x = 0;
  let y = 0;
  let remainingWidth = width;
  let remainingHeight = height;
  let index = 0;

  while (index < sorted.length) {
    const horizontal = remainingWidth >= remainingHeight;
    const side = horizontal ? remainingHeight : remainingWidth;
    if (side <= 0) break;

    // Grow a row while it keeps improving the average aspect ratio.
    let row: TreemapItem[] = [];
    let rowTotal = 0;
    let bestRatio = Infinity;

    while (index + row.length < sorted.length) {
      const candidate = sorted[index + row.length]!;
      const probe = [...row, candidate];
      const probeTotal = rowTotal + Math.max(0, candidate.value);
      const thickness = (probeTotal / total) * (horizontal ? remainingWidth : remainingHeight);

      const ratios = probe.map((item) => {
        const extent = extentOf(item, probeTotal, side);
        return Math.max(thickness / extent, extent / thickness);
      });
      const worst = Math.max(...ratios);

      if (row.length > 0 && worst > bestRatio) break;
      row = probe;
      rowTotal = probeTotal;
      bestRatio = worst;
    }

    if (row.length === 0) break;

    const thickness = (rowTotal / total) * (horizontal ? remainingWidth : remainingHeight);
    let offset = 0;
    const rowExtent = side;

    for (const item of row) {
      const extent = extentOf(item, rowTotal, rowExtent);
      const tile: Tile = horizontal
        ? { item, x, y: y + offset, width: thickness, height: extent }
        : { item, x: x + offset, y, width: extent, height: thickness };
      tiles.push({
        ...tile,
        x: tile.x + gap / 2,
        y: tile.y + gap / 2,
        width: Math.max(0, tile.width - gap),
        height: Math.max(0, tile.height - gap),
      });
      offset += extent;
    }

    if (horizontal) {
      x += thickness;
      remainingWidth -= thickness;
    } else {
      y += thickness;
      remainingHeight -= thickness;
    }
    index += row.length;
  }

  return tiles;
}

function extentOf(item: TreemapItem, rowTotal: number, side: number): number {
  const share = rowTotal > 0 ? Math.max(0, item.value) / rowTotal : 0;
  return share * side;
}

/** Hierarchical composition shown as proportional tiles. */
export function TreemapChart({
  items,
  height = 240,
  gap = 4,
  format,
  palette,
  className,
  ariaLabel,
}: TreemapChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  // A fixed nominal width keeps proportions stable; the SVG scales to fit.
  const nominalWidth = 480;

  if (items.length === 0) {
    return <ChartEmpty label="No items to display" />;
  }

  const tiles = squarify(items, nominalWidth, height, gap);
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  const fmt = (value: number) => (format ? format(value) : formatValue(value, { compact: true }));

  return (
    <div className={className}>
      <div className="gl-chart-wrap">
        <svg
          viewBox={`0 0 ${nominalWidth} ${height}`}
          width="100%"
          height={height}
          role="img"
          aria-label={
            ariaLabel ?? `Treemap of ${items.length} items: ${items.map((i) => i.label).join(", ")}`
          }
          preserveAspectRatio="none"
        >
          {tiles.map((tile, i) => {
            const originalIndex = items.indexOf(tile.item);
            const color = tile.item.color ?? seriesColor(originalIndex, palette);
            const showLabel = tile.width > 46 && tile.height > 26;
            const showValue = tile.width > 46 && tile.height > 42;

            return (
              <g
                key={tile.item.label}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={tile.x}
                  y={tile.y}
                  width={tile.width}
                  height={tile.height}
                  rx={6}
                  fill={color}
                  opacity={hover === null || hover === i ? 0.9 : 0.45}
                  style={{ transition: "opacity 140ms ease" }}
                />
                {showLabel && (
                  <text
                    x={tile.x + 8}
                    y={tile.y + 19}
                    className="gl-chart-treemap-label"
                    fill="var(--gl-chart-on-tile, #fff)"
                  >
                    {tile.item.label}
                  </text>
                )}
                {showValue && (
                  <text
                    x={tile.x + 8}
                    y={tile.y + 35}
                    className="gl-chart-treemap-value"
                    fill="var(--gl-chart-on-tile, #fff)"
                    opacity={0.75}
                  >
                    {fmt(tile.item.value)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <ChartTooltip visible={hover !== null} x={0} y={0} align="left">
          {hover !== null && (
            <>
              <span className="gl-chart-tooltip-title">{tiles[hover]!.item.label}</span>
              <TooltipRow
                color={tiles[hover]!.item.color ?? seriesColor(items.indexOf(tiles[hover]!.item), palette)}
                label="value"
                value={fmt(tiles[hover]!.item.value)}
              />
              <TooltipRow
                label="share"
                value={`${Math.round((tiles[hover]!.item.value / total) * 100)}%`}
              />
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}
