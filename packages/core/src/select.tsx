import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Select as RadixSelect } from "radix-ui";
import { cx } from "./internal/cx";

export const Select = RadixSelect.Root;
export const SelectGroup = RadixSelect.Group;
export const SelectValue = RadixSelect.Value;

export const SelectTrigger = forwardRef<
  ElementRef<typeof RadixSelect.Trigger>,
  ComponentPropsWithoutRef<typeof RadixSelect.Trigger>
>(function SelectTrigger({ className, children, ...props }, ref) {
  return (
    <RadixSelect.Trigger
      ref={ref}
      className={cx("gl-glass gl-select-trigger", className)}
      {...props}
    >
      {children}
      <RadixSelect.Icon asChild>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="gl-select-icon"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
});

export const SelectContent = forwardRef<
  ElementRef<typeof RadixSelect.Content>,
  ComponentPropsWithoutRef<typeof RadixSelect.Content>
>(function SelectContent(
  { className, children, position = "popper", ...props },
  ref,
) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        ref={ref}
        position={position}
        className={cx("gl-glass gl-select-content", className)}
        {...props}
      >
        <RadixSelect.Viewport className="gl-select-viewport">
          {children}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
});

export const SelectItem = forwardRef<
  ElementRef<typeof RadixSelect.Item>,
  ComponentPropsWithoutRef<typeof RadixSelect.Item>
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <RadixSelect.Item
      ref={ref}
      className={cx("gl-select-item", className)}
      {...props}
    >
      <span className="gl-select-item-indicator">
        <RadixSelect.ItemIndicator>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="gl-check-icon"
          >
            <polyline points="3 8 6 11 13 4" />
          </svg>
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
});

export const SelectLabel = forwardRef<
  ElementRef<typeof RadixSelect.Label>,
  ComponentPropsWithoutRef<typeof RadixSelect.Label>
>(function SelectLabel({ className, ...props }, ref) {
  return <RadixSelect.Label ref={ref} className={cx("gl-select-label", className)} {...props} />;
});

export const SelectSeparator = forwardRef<
  ElementRef<typeof RadixSelect.Separator>,
  ComponentPropsWithoutRef<typeof RadixSelect.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
  return <RadixSelect.Separator ref={ref} className={cx("gl-select-separator", className)} {...props} />;
});
