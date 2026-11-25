import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

/** Tint for a bar. Maps to the kit's existing tokens only. */
export type GanttBarTint = "fill" | "on" | "destructive" | "muted";

export interface GanttBarData {
  /** Label shown inside the bar. */
  label?: ReactNode;
  /** Start position as a fraction of the row (0–1). */
  start: number;
  /** End position as a fraction of the row (0–1). */
  end: number;
  /** Tint of the bar; defaults to `fill` (`--gl-fill`). */
  tint?: GanttBarTint;
}

export interface GanttRowData {
  /** Row label. */
  label: ReactNode;
  /** Bars on this row. */
  bars: GanttBarData[];
}

export interface GanttProps extends HTMLAttributes<HTMLDivElement> {
  /** Rows to render. */
  rows: GanttRowData[];
  /**
   * `timeline` puts a row's bars on one lane; `workload` stacks each bar
   * on its own lane so overlapping bars never collide.
   */
  variant?: "timeline" | "workload";
}

/**
 * A Gantt chart — a Card surface of labelled rows with bars positioned
 * by `start`/`end` fractions. Bar styling copies Progress's track/fill
 * pattern (rounded track in `--gl-selection`, fill in the tint token).
 */
export const Gantt: ForwardRefExoticComponent<GanttProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, GanttProps>(function Gantt(
    { rows, variant = "timeline", className, children, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <div
        ref={ref}
        className={cx("gl-glass gl-card gl-gantt", className)}
        data-variant={variant === "timeline" ? undefined : variant}
        {...props}
      >
        {rows.map((row, index) => (
          <GanttRow key={index} label={row.label} bars={row.bars} variant={variant} />
        ))}
        {children}
      </div>
    );
  });

export interface GanttRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Row label. */
  label: ReactNode;
  /** Bars on this row. When omitted, render `GanttBar` children. */
  bars?: GanttBarData[];
  /** `workload` stacks each bar on its own lane. */
  variant?: "timeline" | "workload";
  children?: ReactNode;
}

export const GanttRow: ForwardRefExoticComponent<GanttRowProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, GanttRowProps>(function GanttRow(
    { label, bars, variant = "timeline", className, children, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <div
        ref={ref}
        className={cx("gl-gantt-row", className)}
        data-variant={variant === "timeline" ? undefined : variant}
        {...props}
      >
        <div className="gl-gantt-label">{label}</div>
        {variant === "workload" ? (
          <div className="gl-gantt-lanes">
            {bars
              ? bars.map((bar, index) => (
                  <div key={index} className="gl-gantt-lane">
                    <GanttBar {...bar} />
                  </div>
                ))
              : children}
          </div>
        ) : (
          <div className="gl-gantt-track">
            {bars
              ? bars.map((bar, index) => <GanttBar key={index} {...bar} />)
              : children}
          </div>
        )}
      </div>
    );
  });

export interface GanttBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Label shown inside the bar. */
  label?: ReactNode;
  /** Start position as a fraction of the row (0–1). */
  start: number;
  /** End position as a fraction of the row (0–1). */
  end: number;
  /** Tint of the bar; defaults to `fill` (`--gl-fill`). */
  tint?: GanttBarTint;
  children?: ReactNode;
}

export const GanttBar: ForwardRefExoticComponent<GanttBarProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, GanttBarProps>(function GanttBar(
    { label, start, end, tint = "fill", className, children, "aria-label": ariaLabel, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    const clampedStart = Math.min(1, Math.max(0, start));
    const clampedEnd = Math.min(1, Math.max(clampedStart, end));

    return (
      <div
        ref={ref}
        role="img"
        aria-label={
          // An explicit label wins; otherwise a string label names the bar
          // with its range. A non-string label with no aria-label leaves the
          // bar unnamed, so pass aria-label for rich labels.
          ariaLabel ??
          (typeof label === "string"
            ? `${label}: ${Math.round(clampedStart * 100)}% to ${Math.round(clampedEnd * 100)}%`
            : undefined)
        }
        className={cx("gl-gantt-bar", className)}
        data-tint={tint === "fill" ? undefined : tint}
        style={
          {
            left: `${clampedStart * 100}%`,
            width: `${(clampedEnd - clampedStart) * 100}%`,
          } as CSSProperties
        }
        {...props}
      >
        {label && <span className="gl-gantt-bar-label">{label}</span>}
        {children}
      </div>
    );
  });
