import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { DropdownMenu as RadixDropdownMenu } from "radix-ui";
import { cx } from "./internal/cx";

export const DropdownMenu = RadixDropdownMenu.Root;
export const DropdownMenuTrigger = RadixDropdownMenu.Trigger;
export const DropdownMenuGroup = RadixDropdownMenu.Group;
export const DropdownMenuPortal = RadixDropdownMenu.Portal;
export const DropdownMenuRadioGroup = RadixDropdownMenu.RadioGroup;

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Content>,
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>
>(function DropdownMenuContent(
  { className, sideOffset = 6, ...props },
  ref,
) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cx("gl-glass gl-dropdown-content", className)}
        {...props}
      />
    </RadixDropdownMenu.Portal>
  );
});

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Item>,
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item> & {
    destructive?: boolean;
    inset?: boolean;
  }
>(function DropdownMenuItem({ className, destructive, inset, ...props }, ref) {
  return (
    <RadixDropdownMenu.Item
      ref={ref}
      className={cx("gl-dropdown-item", inset && "gl-dropdown-inset", className)}
      data-destructive={destructive ? "" : undefined}
      {...props}
    />
  );
});

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Label>,
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label> & {
    inset?: boolean;
  }
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
  return (
    <RadixDropdownMenu.Label
      ref={ref}
      className={cx("gl-dropdown-label", inset && "gl-dropdown-inset", className)}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof RadixDropdownMenu.Separator>,
  ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <RadixDropdownMenu.Separator
      ref={ref}
      className={cx("gl-dropdown-separator", className)}
      {...props}
    />
  );
});

export const DropdownMenuShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cx("gl-dropdown-shortcut", className)} {...props} />;
};
