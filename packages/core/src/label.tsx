import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Label as RadixLabel } from "radix-ui";
import { cx } from "./internal/cx";

export interface LabelProps extends ComponentPropsWithoutRef<typeof RadixLabel.Root> {}

export const Label = forwardRef<
  ElementRef<typeof RadixLabel.Root>,
  LabelProps
>(function Label({ className, ...props }, ref) {
  return (
    <RadixLabel.Root
      ref={ref}
      className={cx("gl-label", className)}
      {...props}
    />
  );
});
