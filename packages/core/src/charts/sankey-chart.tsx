"use client";

import { useState } from "react";

import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";
import { formatValue, seriesColor } from "./scales";

export interface SankeyNode {
  id: string;
  label?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
  /** Width of a node bar. */
  nodeWidth?: number;
  format?: (value: number) => string;
  palette?: readonly string[];
  className?: string;
  ariaLabel?: string;
}

interface LaidOutNode {
  id: string;
  label: string;
  column: number;
  x: number;
  y: number;
  height: number;
  value: number;
}

/**
 * Flow between a source and a target.
 *
 * Nodes are assigned to columns by longest-path depth from a root, so a link
 * always travels left to right. Node heights are proportional to the flow
 * through them, which makes conservation visible: what enters a node equals
 * what leaves it.
 */
export function SankeyChart({
  nodes,
  links,
  height = 260,
  nodeWidth = 12,
  format,
  palette,
  className,
  ariaLabel,
}: SankeyChartProps) {
  const [hover, setHover] = useState<string | null>(null);
  const nominalWidth = 520;

  if (nodes.length === 0 || links.length === 0) {
    return <ChartEmpty label="No flows to display" />;
  }

  // Longest-path column assignment.
  const column = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  const outgoing = new Map<string, SankeyLink[]>();
  for (const link of links) {
    const list = outgoing.get(link.source) ?? [];
    list.push(link);
    outgoing.set(link.source, list);
  }
  // Relax edges repeatedly; the graph is small and a finite loop avoids
  // recursion depth problems and cycles hanging the render.
  for (let pass = 0; pass < nodes.length; pass++) {
    let changed = false;
    for (const link of links) {
      const from = column.get(link.source) ?? 0;
      const to = column.get(link.target) ?? 0;
      if (to <= from) {
        column.set(link.target, from + 1);
        changed = true;
      }
    }
    if (!changed) break;
  }

  const columnCount = Math.max(...nodes.map((n) => column.get(n.id) ?? 0)) + 1;
  const perColumn = new Map<number, string[]>();
  for (const node of nodes) {
    const c = column.get(node.id) ?? 0;
    perColumn.set(c, [...(perColumn.get(c) ?? []), node.id]);
  }

  const incoming = new Map<string, number>();
  const outTotal = new Map<string, number>();
  for (const link of links) {
    incoming.set(link.target, (incoming.get(link.target) ?? 0) + link.value);
    outTotal.set(link.source, (outTotal.get(link.source) ?? 0) + link.value);
  }
  const nodeValue = (id: string) => Math.max(incoming.get(id) ?? 0, outTotal.get(id) ?? 0);

  const maxColumnValue = Math.max(
    ...[...perColumn.values()].map((ids) => ids.reduce((sum, id) => sum + nodeValue(id), 0)),
    1,
  );

  const nodeGap = 8;
  const columnWidth = 20;
  const availableWidth = nominalWidth - nodeWidth;
  const laid = new Map<string, LaidOutNode>();

  for (const [c, ids] of perColumn) {
    const totalValue = ids.reduce((sum, id) => sum + nodeValue(id), 0) || 1;
    const usable = height - nodeGap * (ids.length - 1);
    let y = 0;
    for (const id of ids) {
      const h = Math.max(4, (nodeValue(id) / totalValue) * usable);
      laid.set(id, {
        id,
        label: nodes.find((n) => n.id === id)?.label ?? id,
        column: c,
        x: (c / Math.max(1, columnCount - 1 || 1)) * availableWidth,
        y,
        height: h,
        value: nodeValue(id),
      });
      y += h + nodeGap;
    }
  }

  // Track how much of each node's height has been used, so links stack down
  // each node rather than all starting at its top.
  const usedOut = new Map<string, number>();
  const usedIn = new Map<string, number>();

  const ribbons = links.map((link, i) => {
    const from = laid.get(link.source);
    const to = laid.get(link.target);
    if (!from || !to) return null;

    const fromSpan = (link.value / (nodeValue(from.id) || 1)) * from.height;
    const toSpan = (link.value / (nodeValue(to.id) || 1)) * to.height;

    const y0 = from.y + (usedOut.get(from.id) ?? 0);
    const y1 = to.y + (usedIn.get(to.id) ?? 0);
    usedOut.set(from.id, (usedOut.get(from.id) ?? 0) + fromSpan);
    usedIn.set(to.id, (usedIn.get(to.id) ?? 0) + toSpan);

    const x0 = from.x + nodeWidth;
    const x1 = to.x;
    const midX = (x0 + x1) / 2;

    // A cubic with horizontal control points gives the flowing shape.
    const path = [
      `M ${x0} ${y0}`,
      `C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`,
      `L ${x1} ${y1 + toSpan}`,
      `C ${midX} ${y1 + toSpan}, ${midX} ${y0 + fromSpan}, ${x0} ${y0 + fromSpan}`,
      "Z",
    ].join(" ");

    return { path, key: `${link.source}-${link.target}-${i}`, color: seriesColor(i, palette), link };
  });

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
            ariaLabel ?? `Sankey diagram with ${nodes.length} nodes and ${links.length} flows`
          }
          preserveAspectRatio="none"
        >
          {ribbons.map((ribbon) =>
            ribbon ? (
              <path
                key={ribbon.key}
                d={ribbon.path}
                fill={ribbon.color}
                opacity={hover === null || hover === ribbon.link.source ? 0.42 : 0.12}
                style={{ transition: "opacity 140ms ease" }}
              />
            ) : null,
          )}

          {[...laid.values()].map((node) => (
            <g
              key={node.id}
              onPointerEnter={() => setHover(node.id)}
              onPointerLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={nodeWidth}
                height={node.height}
                rx={3}
                fill={hover === node.id ? "var(--gl-chart-1, #0088ff)" : "var(--gl-foreground)"}
                opacity={hover === null || hover === node.id ? 0.85 : 0.35}
              />
              <text
                x={node.x + nodeWidth + 6}
                y={node.y + Math.min(node.height / 2 + 4, node.height)}
                className="gl-chart-sankey-label"
                fill="currentColor"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <ChartTooltip visible={hover !== null} x={0} y={0} align="left">
          {hover !== null && laid.has(hover) && (
            <>
              <span className="gl-chart-tooltip-title">{laid.get(hover)!.label}</span>
              <TooltipRow label="flow" value={fmt(laid.get(hover)!.value)} />
              <TooltipRow label="in" value={fmt(incoming.get(hover) ?? 0)} />
              <TooltipRow label="out" value={fmt(outTotal.get(hover) ?? 0)} />
            </>
          )}
        </ChartTooltip>
      </div>
    </div>
  );
}
