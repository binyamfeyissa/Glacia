import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Separator as RadixSeparator } from "radix-ui";
import { cx } from "./internal/cx";

export const Separator = forwardRef<
  ElementRef<typeof RadixSeparator.Root>,
  ComponentPropsWithoutRef<typeof RadixSeparator.Root>
>(function Separator(
  { className, orientation = "horizontal", decorative = true, ...props },
  ref,
) {
  return (
    <RadixSeparator.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cx(
        "gl-separator",
        orientation === "horizontal" ? "gl-separator-h" : "gl-separator-v",
        className,
      )}
      {...props}
    />
  );
});
