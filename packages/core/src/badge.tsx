import {
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { className, variant = "default", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("gl-glass gl-badge", className)}
      data-variant={variant}
      {...props}
    />
  );
});
