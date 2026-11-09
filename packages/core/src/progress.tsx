import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Progress as RadixProgress } from "radix-ui";
import { cx } from "./internal/cx";

export const Progress = forwardRef<
  ElementRef<typeof RadixProgress.Root>,
  ComponentPropsWithoutRef<typeof RadixProgress.Root>
>(function Progress({ className, value, ...props }, ref) {
  return (
    <RadixProgress.Root
      ref={ref}
      className={cx("gl-glass gl-progress", className)}
      {...props}
    >
      <RadixProgress.Indicator
        className="gl-progress-indicator"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </RadixProgress.Root>
  );
});
