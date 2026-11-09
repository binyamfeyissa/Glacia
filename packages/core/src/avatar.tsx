import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Avatar as RadixAvatar } from "radix-ui";
import { cx } from "./internal/cx";

export const Avatar = forwardRef<
  ElementRef<typeof RadixAvatar.Root>,
  ComponentPropsWithoutRef<typeof RadixAvatar.Root>
>(function Avatar({ className, ...props }, ref) {
  return (
    <RadixAvatar.Root
      ref={ref}
      className={cx("gl-glass gl-avatar", className)}
      {...props}
    />
  );
});

export const AvatarImage = forwardRef<
  ElementRef<typeof RadixAvatar.Image>,
  ComponentPropsWithoutRef<typeof RadixAvatar.Image>
>(function AvatarImage({ className, ...props }, ref) {
  return (
    <RadixAvatar.Image
      ref={ref}
      className={cx("gl-avatar-image", className)}
      {...props}
    />
  );
});

export const AvatarFallback = forwardRef<
  ElementRef<typeof RadixAvatar.Fallback>,
  ComponentPropsWithoutRef<typeof RadixAvatar.Fallback>
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <RadixAvatar.Fallback
      ref={ref}
      className={cx("gl-avatar-fallback", className)}
      {...props}
    />
  );
});
