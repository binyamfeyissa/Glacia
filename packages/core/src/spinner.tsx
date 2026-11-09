import {
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
  { className, size = "md", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cx("gl-spinner", className)}
      data-size={size}
      {...props}
    >
      <span className="gl-spinner-ring" />
    </div>
  );
});
