import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { ScrollArea as RadixScrollArea } from "radix-ui";
import { cx } from "./internal/cx";

export const ScrollArea = forwardRef<
  ElementRef<typeof RadixScrollArea.Root>,
  ComponentPropsWithoutRef<typeof RadixScrollArea.Root>
>(function ScrollArea({ className, children, ...props }, ref) {
  return (
    <RadixScrollArea.Root
      ref={ref}
      className={cx("gl-scroll-area", className)}
      {...props}
    >
      <RadixScrollArea.Viewport className="gl-scroll-viewport">
        {children}
      </RadixScrollArea.Viewport>
      <ScrollBar />
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  );
});

export const ScrollBar = forwardRef<
  ElementRef<typeof RadixScrollArea.ScrollAreaScrollbar>,
  ComponentPropsWithoutRef<typeof RadixScrollArea.ScrollAreaScrollbar>
>(function ScrollBar({ className, orientation = "vertical", ...props }, ref) {
  return (
    <RadixScrollArea.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cx(
        "gl-scrollbar",
        orientation === "vertical" ? "gl-scrollbar-v" : "gl-scrollbar-h",
        className,
      )}
      {...props}
    >
      <RadixScrollArea.ScrollAreaThumb className="gl-glass gl-scrollbar-thumb" />
    </RadixScrollArea.ScrollAreaScrollbar>
  );
});
