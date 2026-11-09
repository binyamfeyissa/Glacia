import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { cx } from "./internal/cx";

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(function ToastViewport({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      className={cx("gl-toast-viewport", className)}
      {...props}
    />
  );
});

export interface ToastProps
  extends ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: "default" | "destructive" | "success";
}

export const Toast = forwardRef<
  ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(function Toast({ className, variant = "default", children, ...props }, ref) {
  return (
    <ToastPrimitive.Root
      ref={ref}
      data-variant={variant}
      className={cx("gl-glass gl-toast-hud", className)}
      {...props}
    >
      {children}
    </ToastPrimitive.Root>
  );
});

export const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitive.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(function ToastAction({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Action
      ref={ref}
      className={cx("gl-toast-action", className)}
      {...props}
    />
  );
});

export const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(function ToastClose({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Close
      ref={ref}
      className={cx("gl-toast-close", className)}
      aria-label="Close"
      {...props}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </ToastPrimitive.Close>
  );
});

export const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(function ToastTitle({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Title
      ref={ref}
      className={cx("gl-toast-title", className)}
      {...props}
    />
  );
});

export const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(function ToastDescription({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Description
      ref={ref}
      className={cx("gl-toast-description", className)}
      {...props}
    />
  );
});
