import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { RadioGroup as RadixRadioGroup } from "radix-ui";
import { cx } from "./internal/cx";

export const RadioGroup = forwardRef<
  ElementRef<typeof RadixRadioGroup.Root>,
  ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>
>(function RadioGroup({ className, ...props }, ref) {
  return (
    <RadixRadioGroup.Root
      ref={ref}
      className={cx("gl-radio-group", className)}
      {...props}
    />
  );
});

export const RadioGroupItem = forwardRef<
  ElementRef<typeof RadixRadioGroup.Item>,
  ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>
>(function RadioGroupItem({ className, ...props }, ref) {
  return (
    <RadixRadioGroup.Item
      ref={ref}
      className={cx("gl-glass gl-radio-item", className)}
      {...props}
    >
      <RadixRadioGroup.Indicator className="gl-radio-indicator">
        <span className="gl-radio-dot" />
      </RadixRadioGroup.Indicator>
    </RadixRadioGroup.Item>
  );
});
