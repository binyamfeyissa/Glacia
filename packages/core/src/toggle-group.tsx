import * as React from "react";
import { ToggleGroup as RadixToggleGroup } from "radix-ui";

export type ToggleGroupProps = (
  | ({ type: "single" } & RadixToggleGroup.ToggleGroupSingleProps)
  | ({ type: "multiple" } & RadixToggleGroup.ToggleGroupMultipleProps)
) & {
  variant?: "glass" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof RadixToggleGroup.Root>,
  ToggleGroupProps
>(({ className = "", variant = "glass", size = "md", children, ...props }, ref) => {
  return (
    <RadixToggleGroup.Root
      ref={ref}
      className={`gl-toggle-group ${variant === "glass" ? "gl-glass" : ""} gl-toggle-group-${variant} gl-toggle-group-${size} ${className}`}
      {...(props as any)}
    >
      {children}
    </RadixToggleGroup.Root>
  );
});
ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixToggleGroup.Item> {
  variant?: "glass" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof RadixToggleGroup.Item>,
  ToggleGroupItemProps
>(({ className = "", children, ...props }, ref) => {
  return (
    <RadixToggleGroup.Item
      ref={ref}
      className={`gl-toggle-group-item ${className}`}
      {...props}
    >
      {children}
    </RadixToggleGroup.Item>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";
