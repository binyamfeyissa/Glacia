import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { cx } from "./internal/cx";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogPortal = RadixDialog.Portal;
export const DialogClose = RadixDialog.Close;

export const DialogOverlay = forwardRef<
  ElementRef<typeof RadixDialog.Overlay>,
  ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <RadixDialog.Overlay
      ref={ref}
      className={cx("gl-dialog-overlay", className)}
      {...props}
    />
  );
});

export const DialogContent = forwardRef<
  ElementRef<typeof RadixDialog.Content>,
  ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(function DialogContent({ className, children, ...props }, ref) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialog.Content
        ref={ref}
        className={cx("gl-glass gl-dialog-content", className)}
        {...props}
      >
        {children}
        <RadixDialog.Close className="gl-dialog-close" aria-label="Close">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </DialogPortal>
  );
});

export const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-dialog-header", className)} {...props} />;
  },
);

export const DialogTitle = forwardRef<
  ElementRef<typeof RadixDialog.Title>,
  ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return <RadixDialog.Title ref={ref} className={cx("gl-dialog-title", className)} {...props} />;
});

export const DialogDescription = forwardRef<
  ElementRef<typeof RadixDialog.Description>,
  ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <RadixDialog.Description ref={ref} className={cx("gl-dialog-description", className)} {...props} />
  );
});

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-dialog-footer", className)} {...props} />;
  },
);
