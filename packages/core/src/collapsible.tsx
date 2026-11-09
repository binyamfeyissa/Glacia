import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { cx } from "./internal/cx";

export const Collapsible = CollapsiblePrimitive.Root;

export const CollapsibleTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(function CollapsibleTrigger({ className, children, ...props }, ref) {
  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={cx("gl-collapsible-trigger", className)}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Trigger>
  );
});

export const CollapsibleContent = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Content>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(function CollapsibleContent({ className, children, ...props }, ref) {
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cx("gl-collapsible-content", className)}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Content>
  );
});
