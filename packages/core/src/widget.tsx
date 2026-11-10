import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

export interface WidgetProps extends HTMLAttributes<HTMLDivElement> {
  /** Widget size: 'sm' (2×2 grid units), 'md' (2×4, default), 'lg' (4×4). */
  size?: "sm" | "md" | "lg";
  /** Content slotted into the top-left corner. */
  leading?: ReactNode;
  /** Content slotted into the top-right corner. */
  trailing?: ReactNode;
}

/**
 * A Liquid Glass widget card — the kind shown on an iOS Home Screen.
 *
 * Sits with other widgets in a grid and bends whatever wallpaper or page
 * content sits behind it.
 */
export const Widget: ForwardRefExoticComponent<WidgetProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  WidgetProps
>(function Widget(
  { size = "md", leading, trailing, className, children, ...props },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      className={cx("gl-glass gl-widget", `gl-widget-${size}`, className)}
      {...props}
    >
      {(leading || trailing) && (
        <div className="gl-widget-header">
          <span className="gl-widget-leading">{leading}</span>
          <span className="gl-widget-trailing">{trailing}</span>
        </div>
      )}
      <div className="gl-widget-body">{children}</div>
    </div>
  );
});