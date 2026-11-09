import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cx } from "./internal/cx";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cx("gl-sheet-overlay", className)}
      {...props}
    />
  );
});

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Side from which the sheet enters: 'right' (default), 'left', 'top', or 'bottom'. */
  side?: "top" | "bottom" | "left" | "right";
}

export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { side = "right", className, children, ...props },
  ref
) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-side={side}
        className={cx("gl-glass gl-sheet-content", className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="gl-sheet-close" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("gl-sheet-header", className)} {...props} />
);

export const SheetFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("gl-sheet-footer", className)} {...props} />
);

export const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cx("gl-sheet-title", className)}
      {...props}
    />
  );
});

export const SheetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cx("gl-sheet-description", className)}
      {...props}
    />
  );
});
