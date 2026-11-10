import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

export interface ActivityViewProps extends HTMLAttributes<HTMLDivElement> {
  /** Title above the activity ring or chart. */
  title?: string;
  /** Subtitle or value. */
  subtitle?: string;
  /** An icon or ring shown as the visual. */
  visual?: ReactNode;
  /** Compact or full (default) size. */
  size?: "compact" | "full";
}

/**
 * An Activity View — iOS-style rings, charts, or metrics in a glass card.
 *
 * Use it inside a Widget or Card.
 */
export const ActivityView: ForwardRefExoticComponent<ActivityViewProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  ActivityViewProps
>(function ActivityView(
  { title, subtitle, visual, size = "full", className, children, ...props },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      className={cx("gl-glass gl-activity-view", `gl-activity-${size}`, className)}
      {...props}
    >
      {visual && <div className="gl-activity-visual">{visual}</div>}
      {(title || subtitle) && (
        <div className="gl-activity-content">
          {title && <span className="gl-activity-title">{title}</span>}
          {subtitle && <span className="gl-activity-subtitle">{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
});