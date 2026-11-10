import {
  forwardRef,
  type HTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation of buttons in the group. Defaults to 'horizontal'. */
  orientation?: "horizontal" | "vertical";
  /** Size for all buttons in the group: 'sm' (32px), 'md' (40px, default), 'lg' (48px). */
  size?: "sm" | "md" | "lg";
  /** Variant style for the group container. Defaults to 'segmented'. */
  variant?: "segmented" | "attached" | "ghost";
}

export const ButtonGroup: ForwardRefExoticComponent<
  ButtonGroupProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    {
      orientation = "horizontal",
      size = "md",
      variant = "segmented",
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="group"
        className={cx("gl-button-group", variant === "segmented" && "gl-glass", className)}
        data-orientation={orientation}
        data-size={size}
        data-variant={variant}
        {...props}
      >
        {children}
      </div>
    );
  }
);
