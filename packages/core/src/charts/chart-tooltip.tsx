"use client";

import type { ReactNode } from "react";

import { useRef } from "react";
import { useRefraction } from "../internal/refraction";

/**
 * The tooltip surface for charts.
 *
 * It is the library's actual Glass primitive, not a lookalike: it refracts the
 * chart beneath it through the same lens as every other Glacia surface. Charts
 * position it and pass content in; the material is never reimplemented here.
 */
export function ChartTooltip({
  x,
  y,
  visible,
  align = "auto",
  children,
}: {
  x: number;
  y: number;
  visible: boolean;
  align?: "auto" | "left" | "right";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useRefraction(ref);

  return (
    <div
      ref={ref}
      className="gl-glass gl-chart-tooltip"
      data-visible={visible ? "" : undefined}
      data-align={align === "auto" ? undefined : align}
      style={{ left: x, top: y }}
      role="tooltip"
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}

/** One line inside a tooltip: a colour swatch, a name and a value. */
export function TooltipRow({
  color,
  label,
  value,
}: {
  color?: string;
  label: string;
  value: string | number;
}) {
  return (
    <span className="gl-chart-tooltip-row">
      {color && <span className="gl-chart-tooltip-swatch" style={{ background: color }} />}
      <span className="gl-chart-tooltip-label">{label}</span>
      <span className="gl-chart-tooltip-value">{value}</span>
    </span>
  );
}
