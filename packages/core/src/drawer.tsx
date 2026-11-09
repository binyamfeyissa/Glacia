import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cx } from "./internal/cx";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerPortal = DialogPrimitive.Portal;
export const DrawerClose = DialogPrimitive.Close;

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DrawerOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cx("gl-drawer-overlay", className)}
      {...props}
    />
  );
});

export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(function DrawerContent({ className, children, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cx("gl-glass gl-drawer-content", className)}
        {...props}
      >
        <div className="gl-drawer-handle" aria-hidden="true" />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const DrawerHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("gl-drawer-header", className)} {...props} />
);

export const DrawerFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("gl-drawer-footer", className)} {...props} />
);

export const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DrawerTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cx("gl-drawer-title", className)}
      {...props}
    />
  );
});

export const DrawerDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DrawerDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cx("gl-drawer-description", className)}
      {...props}
    />
  );
});
