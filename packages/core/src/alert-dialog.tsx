import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { AlertDialog as RadixAlertDialog } from "radix-ui";
import { cx } from "./internal/cx";

export const AlertDialog = RadixAlertDialog.Root;
export const AlertDialogTrigger = RadixAlertDialog.Trigger;
export const AlertDialogPortal = RadixAlertDialog.Portal;

export const AlertDialogOverlay = forwardRef<
  ElementRef<typeof RadixAlertDialog.Overlay>,
  ComponentPropsWithoutRef<typeof RadixAlertDialog.Overlay>
>(function AlertDialogOverlay({ className, ...props }, ref) {
  return (
    <RadixAlertDialog.Overlay
      ref={ref}
      className={cx("gl-dialog-overlay", className)}
      {...props}
    />
  );
});

export const AlertDialogContent = forwardRef<
  ElementRef<typeof RadixAlertDialog.Content>,
  ComponentPropsWithoutRef<typeof RadixAlertDialog.Content>
>(function AlertDialogContent({ className, children, ...props }, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <RadixAlertDialog.Content
        ref={ref}
        className={cx("gl-glass gl-dialog-content gl-alert-dialog-content", className)}
        {...props}
      >
        {children}
      </RadixAlertDialog.Content>
    </AlertDialogPortal>
  );
});

export const AlertDialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AlertDialogHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-dialog-header", className)} {...props} />;
  },
);

export const AlertDialogTitle = forwardRef<
  ElementRef<typeof RadixAlertDialog.Title>,
  ComponentPropsWithoutRef<typeof RadixAlertDialog.Title>
>(function AlertDialogTitle({ className, ...props }, ref) {
  return <RadixAlertDialog.Title ref={ref} className={cx("gl-dialog-title", className)} {...props} />;
});

export const AlertDialogDescription = forwardRef<
  ElementRef<typeof RadixAlertDialog.Description>,
  ComponentPropsWithoutRef<typeof RadixAlertDialog.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return (
    <RadixAlertDialog.Description
      ref={ref}
      className={cx("gl-dialog-description", className)}
      {...props}
    />
  );
});

export const AlertDialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AlertDialogFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-dialog-footer", className)} {...props} />;
  },
);

export const AlertDialogAction = forwardRef<
  ElementRef<typeof RadixAlertDialog.Action>,
  ComponentPropsWithoutRef<typeof RadixAlertDialog.Action>
>(function AlertDialogAction({ className, ...props }, ref) {
  return (
    <RadixAlertDialog.Action
      ref={ref}
      className={cx("gl-glass gl-button", className)}
      data-variant="filled"
      {...props}
    />
  );
});

export const AlertDialogCancel = forwardRef<
  ElementRef<typeof RadixAlertDialog.Cancel>,
  ComponentPropsWithoutRef<typeof RadixAlertDialog.Cancel>
>(function AlertDialogCancel({ className, ...props }, ref) {
  return (
    <RadixAlertDialog.Cancel
      ref={ref}
      className={cx("gl-glass gl-button", className)}
      {...props}
    />
  );
});
