import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cx } from "./internal/cx";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;
export const HoverCardPortal = HoverCardPrimitive.Portal;

export const HoverCardContent = forwardRef<
  ElementRef<typeof HoverCardPrimitive.Content>,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(function HoverCardContent(
  { className, align = "center", sideOffset = 6, children, ...props },
  ref
) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cx("gl-glass gl-hover-card-content", className)}
        {...props}
      >
        {children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
});
