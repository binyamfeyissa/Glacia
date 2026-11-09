import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Popover as RadixPopover } from "radix-ui";
import { cx } from "./internal/cx";

export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;

export const PopoverContent = forwardRef<
  ElementRef<typeof RadixPopover.Content>,
  ComponentPropsWithoutRef<typeof RadixPopover.Content>
>(function PopoverContent(
  { className, align = "center", sideOffset = 6, children, ...props },
  ref,
) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cx("gl-glass gl-popover-content", className)}
        {...props}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
});
