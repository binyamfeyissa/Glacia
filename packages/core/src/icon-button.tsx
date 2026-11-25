import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";

import { Button, type ButtonProps } from "./button";

export interface IconButtonProps extends Omit<ButtonProps, "icon" | "children"> {
  /** The icon. IconButton never has a label: `aria-label` is required. */
  icon: ReactNode;
  /** Required: the accessible name, since there is no visible label. */
  "aria-label": string;
}

/**
 * A Button with icon-only children, typed so it can only be used that way:
 * an icon is required and so is an `aria-label`. Renders exactly what
 * Button renders for icon-only children (a circle, `data-icon="only"`),
 * with the same glass / filled / ghost variants, sizes, destructive tint
 * and refraction — no new visuals.
 */
export const IconButton: ForwardRefExoticComponent<
  IconButtonProps & RefAttributes<HTMLButtonElement>
> = /* @__PURE__ */ forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon, variant = "glass", size = "md", destructive, tint, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLButtonElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <Button
        ref={ref}
        icon={icon}
        variant={variant}
        size={size}
        destructive={destructive}
        tint={tint}
        {...props}
      />
    );
  },
);
