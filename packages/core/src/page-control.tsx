import {
  forwardRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

export interface PageControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** How many dots to show. */
  count: number;
  /** The dot that is currently filled (0-based). */
  index: number;
  /** Called when the user taps a dot. */
  onChange?: (index: number) => void;
  /** Tint the active dot. Defaults to the page's accent. */
  tint?: string;
  /** Hide the dots while there is only one page. */
  hidesForSinglePage?: boolean;
}

/**
 * An iOS page control: a row of dots showing which page you are on.
 *
 * Tapping a dot calls `onChange` with its index. The active dot is filled and
 * moves in a spring, as the system one does.
 */
export const PageControl: ForwardRefExoticComponent<PageControlProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, PageControlProps>(function PageControl(
    { count, index, onChange, tint, hidesForSinglePage = true, className, style, ...props },
    forwardedRef,
  ) {
    if (hidesForSinglePage && count <= 1) return null;
    return (
      <div
        ref={forwardedRef}
        role="tablist"
        aria-label="Page control"
        className={cx("gl-glass gl-page-control", className)}
        style={tint ? ({ ...style, "--gl-page-tint": tint } as CSSProperties) : style}
        {...props}
      >
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Page ${i + 1} of ${count}`}
            className={cx(
              "gl-page-dot",
              i === index && "gl-page-dot-active",
              // iOS shows the active dot wider than the rest.
              i === index && "gl-page-dot-wide",
            )}
            onClick={() => onChange?.(i)}
          />
        ))}
      </div>
    );
  });

export interface PageDotsProps {
  count: number;
  index: number;
  onChange?: (index: number) => void;
  tint?: string;
  className?: string;
}

/**
 * A bare page control with no glass plate behind it, for sitting directly
 * over a photo or a carousel. Same dots, same spring.
 */
export function PageDots({ count, index, onChange, tint, className }: PageDotsProps) {
  if (count <= 1) return null;
  return (
    <div
      role="tablist"
      aria-label="Page control"
      className={cx("gl-page-control gl-page-control-bare", className)}
      style={tint ? ({ "--gl-page-tint": tint } as CSSProperties) : undefined}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Page ${i + 1} of ${count}`}
          className={cx("gl-page-dot", i === index && "gl-page-dot-active", i === index && "gl-page-dot-wide")}
          onClick={() => onChange?.(i)}
        />
      ))}
    </div>
  );
}