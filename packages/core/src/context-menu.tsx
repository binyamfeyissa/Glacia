import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { cx } from "./internal/cx";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export const ContextMenuContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(function ContextMenuContent({ className, children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cx("gl-glass gl-context-menu-content", className)}
        {...props}
      >
        {children}
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  );
});

export const ContextMenuItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    destructive?: boolean;
    inset?: boolean;
  }
>(function ContextMenuItem(
  { className, destructive, inset, children, ...props },
  ref
) {
  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      data-destructive={destructive ? "" : undefined}
      data-inset={inset ? "" : undefined}
      className={cx("gl-context-menu-item", className)}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Item>
  );
});

export const ContextMenuSeparator = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(function ContextMenuSeparator({ className, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cx("gl-context-menu-separator", className)}
      {...props}
    />
  );
});

export const ContextMenuShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cx("gl-context-menu-shortcut", className)}
      {...props}
    />
  );
};
