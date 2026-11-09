import {
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("gl-glass gl-skeleton", className)}
      {...props}
    />
  );
});
