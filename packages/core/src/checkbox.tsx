import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Checkbox as RadixCheckbox } from "radix-ui";
import { cx } from "./internal/cx";

export const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  ComponentPropsWithoutRef<typeof RadixCheckbox.Root>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <RadixCheckbox.Root
      ref={ref}
      className={cx("gl-glass gl-checkbox", className)}
      {...props}
    >
      <RadixCheckbox.Indicator className="gl-checkbox-indicator">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="gl-checkbox-icon"
        >
          <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
        </svg>
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
});
