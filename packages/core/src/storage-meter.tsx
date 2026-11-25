import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

/** Tint for a segment. Maps to the kit's existing tokens only. */
export type StorageMeterTint = "fill" | "on" | "destructive" | "muted";

export interface StorageMeterSegment {
  /** Legend label for the segment. */
  label: string;
  /** Amount of storage used, in the same units as `total`. */
  value: number;
  /** Tint of the segment; defaults to `fill` (`--gl-fill`). */
  tint?: StorageMeterTint;
}

export interface StorageMeterProps extends HTMLAttributes<HTMLDivElement> {
  /** Stacked segments. Their widths are `value / total`. */
  segments: StorageMeterSegment[];
  /** Total capacity, in the same units as the segment values. */
  total: number;
  /** Show the legend under the meter. Defaults to true. */
  showLegend?: boolean;
}

/**
 * A stacked horizontal storage meter — a Progress track split into
 * tinted segments, with an optional legend. Segment widths copy
 * Progress's track/fill pattern; tints use existing tokens only:
 * `fill` → `--gl-fill`, `on` → `--gl-on`,
 * `destructive` → `--gl-destructive`, `muted` → `--gl-muted`.
 */
export const StorageMeter: ForwardRefExoticComponent<
  StorageMeterProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, StorageMeterProps>(function StorageMeter(
  { segments, total, showLegend = true, className, ...props },
  forwardedRef,
) {
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);

  const used = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div ref={ref} className={cx("gl-storage-meter", className)} {...props}>
      <div
        className="gl-glass gl-progress gl-storage-meter-track"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={used}
        aria-label="Storage used"
      >
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="gl-storage-meter-segment"
            data-tint={segment.tint ?? "fill"}
            style={{ width: `${total > 0 ? (segment.value / total) * 100 : 0}%` }}
          />
        ))}
      </div>
      {showLegend && (
        <ul className="gl-storage-meter-legend">
          {segments.map((segment) => (
            <li key={segment.label} className="gl-storage-meter-legend-item">
              <span
                className="gl-storage-meter-swatch"
                data-tint={segment.tint ?? "fill"}
                aria-hidden
              />
              <span className="gl-storage-meter-legend-label">{segment.label}</span>
              <span className="gl-storage-meter-legend-value">{segment.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
