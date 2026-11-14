import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Popover as RadixPopover } from "radix-ui";
import { cx } from "./internal/cx";

export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;

/**
 * A positioning anchor that is not a visible control.
 *
 * `Anchor` renders a real element, so exporting it raw put a second marker on
 * screen next to the trigger — the "two arrows" bug. It is display: none here,
 * which is what an anchor is for: it marks a point for the popover to line up
 * with, and nothing else.
 */
export const PopoverAnchor = forwardRef<
  ElementRef<typeof RadixPopover.Anchor>,
  ComponentPropsWithoutRef<typeof RadixPopover.Anchor>
>(function PopoverAnchor({ className, ...props }, ref) {
  return (
    <RadixPopover.Anchor
      ref={ref}
      className={cx("gl-popover-anchor", className)}
      {...props}
    />
  );
});

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
