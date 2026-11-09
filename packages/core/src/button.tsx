import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { usePress } from "./internal/press";
import { useRefraction } from "./internal/refraction";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shown before the label. On its own, the button is a circle; give it an `aria-label`. */
  icon?: ReactNode;
  /** `glass` is clear frosted; `filled` fills it with accent colour; `ghost` has no background until hovered. */
  variant?: "glass" | "filled" | "ghost";
  /** Button size: 'sm' (32px), 'md' (40px, default), 'lg' (48px). */
  size?: "sm" | "md" | "lg";
  /** Marks an action that deletes or can't be undone. Shorthand for a red `tint`. */
  destructive?: boolean;
  /** Any CSS colour. Tints a glass button's label, or a filled button's fill. */
  tint?: string;
}

export const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>> = /* @__PURE__ */ forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(
  { icon, variant = "glass", size = "md", destructive, tint, children, className, style, type = "button", ...props },
  forwardedRef,
) {
  const ref = useRef<HTMLButtonElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);
  usePress(ref);
  useRefraction(ref);

  return (
    <button
      ref={ref}
      type={type}
      className={cx("gl-glass gl-button", className)}
      data-icon={icon == null ? undefined : children == null ? "only" : ""}
      data-variant={variant === "glass" ? undefined : variant}
      data-size={size === "md" ? undefined : size}
      data-destructive={destructive ? "" : undefined}
      data-tint={tint ? "" : undefined}
      style={tint ? ({ ...style, "--gl-tint": tint } as CSSProperties) : style}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
});
