import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export type UptimeStatus = "up" | "degraded" | "down";

export interface UptimeSegment {
  /** Health of this slice of time. */
  status: UptimeStatus;
  /** Label for the slice, shown as its tooltip (e.g. "Nov 24 — all systems normal"). */
  label?: string;
}

export interface UptimeStripProps extends HTMLAttributes<HTMLDivElement> {
  /** One segment per day (e.g. 45 days), oldest first. */
  segments: UptimeSegment[];
  /** Overall uptime percentage. When omitted it is computed from the segments. */
  overall?: number;
  /** Label shown next to the percentage (default "uptime"). */
  overallLabel?: string;
}

/**
 * A Liquid Glass uptime strip — the segmented bar of daily health shown on
 * status pages. Reference is Progress: a row of tinted segments on a glass
 * surface, up `--gl-on`, degraded the kit's amber `--gl-chart-3`, down
 * `--gl-destructive`.
 */
export const UptimeStrip: ForwardRefExoticComponent<
  UptimeStripProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, UptimeStripProps>(
  function UptimeStrip(
    { segments, overall, overallLabel = "uptime", className, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    useRefraction(ref);

    const computed =
      segments.length === 0
        ? 100
        : (segments.filter((segment) => segment.status === "up").length /
            segments.length) *
          100;
    const value = overall ?? computed;

    return (
      <div
        ref={ref}
        className={cx("gl-glass gl-uptime-strip", className)}
        role="img"
        aria-label={`${value.toFixed(1)}% ${overallLabel} over ${segments.length} days`}
        suppressHydrationWarning
        {...props}
      >
        <div className="gl-uptime-strip-bar" aria-hidden>
          {segments.map((segment, index) => (
            <span
              key={index}
              className="gl-uptime-strip-segment"
              data-status={segment.status}
              title={segment.label}
            />
          ))}
        </div>
        <span className="gl-uptime-strip-overall">
          <span className="gl-uptime-strip-value">{value.toFixed(1)}%</span>{" "}
          {overallLabel}
        </span>
      </div>
    );
  },
);
