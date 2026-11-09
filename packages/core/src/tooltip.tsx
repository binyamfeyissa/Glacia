import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Tooltip as RadixTooltip } from "radix-ui";
import { cx } from "./internal/cx";

export const TooltipProvider = RadixTooltip.Provider;
export const Tooltip = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;

export const TooltipContent = forwardRef<
  ElementRef<typeof RadixTooltip.Content>,
  ComponentPropsWithoutRef<typeof RadixTooltip.Content>
>(function TooltipContent(
  { className, sideOffset = 6, ...props },
  ref,
) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cx("gl-glass gl-tooltip-content", className)}
        {...props}
      />
    </RadixTooltip.Portal>
  );
});
