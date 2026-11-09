import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Tabs as RadixTabs } from "radix-ui";
import { cx } from "./internal/cx";

export const Tabs = forwardRef<
  ElementRef<typeof RadixTabs.Root>,
  ComponentPropsWithoutRef<typeof RadixTabs.Root>
>(function Tabs({ className, ...props }, ref) {
  return (
    <RadixTabs.Root
      ref={ref}
      className={cx("gl-tabs", className)}
      {...props}
    />
  );
});

export const TabsList = forwardRef<
  ElementRef<typeof RadixTabs.List>,
  ComponentPropsWithoutRef<typeof RadixTabs.List>
>(function TabsList({ className, ...props }, ref) {
  return (
    <RadixTabs.List
      ref={ref}
      className={cx("gl-glass gl-tabs-list", className)}
      {...props}
    />
  );
});

export const TabsTrigger = forwardRef<
  ElementRef<typeof RadixTabs.Trigger>,
  ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <RadixTabs.Trigger
      ref={ref}
      className={cx("gl-tabs-trigger", className)}
      {...props}
    />
  );
});

export const TabsContent = forwardRef<
  ElementRef<typeof RadixTabs.Content>,
  ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <RadixTabs.Content
      ref={ref}
      className={cx("gl-tabs-content", className)}
      {...props}
    />
  );
});
