import {
  forwardRef,
  type HTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Size for the input group: 'sm' (32px), 'md' (40px, default), 'lg' (48px). */
  size?: "sm" | "md" | "lg";
  /** Optional disabled state propagated to children. */
  disabled?: boolean;
}

export const InputGroup: ForwardRefExoticComponent<
  InputGroupProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup({ size = "md", disabled, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cx("gl-input-group", className)}
        data-size={size}
        data-disabled={disabled ? "" : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
  /** Alignment side: 'leading' (prefix) or 'trailing' (suffix). */
  align?: "leading" | "trailing";
  /** Clickable interactive addon (e.g. icon button). */
  interactive?: boolean;
}

export const InputGroupAddon: ForwardRefExoticComponent<
  InputGroupAddonProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, InputGroupAddonProps>(
  function InputGroupAddon(
    { align = "leading", interactive, className, children, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cx("gl-input-group-addon", className)}
        data-align={align}
        data-interactive={interactive ? "" : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
