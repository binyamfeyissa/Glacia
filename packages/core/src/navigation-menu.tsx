import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { cx } from "./internal/cx";

export const NavigationMenu = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(function NavigationMenu({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cx("gl-navigation-menu", className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
});

export const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={cx("gl-glass gl-navigation-menu-list", className)}
      {...props}
    />
  );
});

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const NavigationMenuTrigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={cx("gl-navigation-menu-trigger", className)}
      {...props}
    >
      {children}
      <span className="gl-nav-chevron" aria-hidden="true">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2.5 3.5L5 6L7.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </NavigationMenuPrimitive.Trigger>
  );
});

export const NavigationMenuContent = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cx("gl-glass gl-navigation-menu-content", className)}
      {...props}
    />
  );
});

export const NavigationMenuLink = NavigationMenuPrimitive.Link;

export const NavigationMenuViewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(function NavigationMenuViewport({ className, ...props }, ref) {
  return (
    <div className="gl-navigation-menu-viewport-wrapper">
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        className={cx("gl-glass gl-navigation-menu-viewport", className)}
        {...props}
      />
    </div>
  );
});

export const NavigationMenuIndicator = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(function NavigationMenuIndicator({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      className={cx("gl-navigation-menu-indicator", className)}
      {...props}
    >
      <div className="gl-navigation-menu-indicator-arrow" />
    </NavigationMenuPrimitive.Indicator>
  );
});
