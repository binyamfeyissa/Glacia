import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { usePress } from "./internal/press";
import { useRefraction } from "./internal/refraction";
import { useControllable } from "./internal/controllable";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Uncontrolled default pressed state. */
  defaultPressed?: boolean;
  /** Callback fired when pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
  /** Visual variant: 'glass' (subtle frosted, default), 'outline', or 'filled'. */
  variant?: "glass" | "outline" | "filled";
  /** Size: 'sm' (32px), 'md' (40px, default), 'lg' (48px). */
  size?: "sm" | "md" | "lg";
  /** Optional leading icon. */
  icon?: ReactNode;
}

export const Toggle: ForwardRefExoticComponent<
  ToggleProps & RefAttributes<HTMLButtonElement>
> = /* @__PURE__ */ forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      variant = "glass",
      size = "md",
      icon,
      className,
      children,
      onClick,
      ...props
    },
    forwardedRef
  ) {
    const ref = useRef<HTMLButtonElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    usePress(ref);
    useRefraction(ref);

    const [isPressed, setIsPressed] = useControllable(
      controlledPressed,
      defaultPressed,
      onPressedChange,
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        setIsPressed(!isPressed);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        data-variant={variant}
        data-size={size}
        className={cx("gl-glass gl-toggle", className)}
        onClick={handleClick}
        {...props}
      >
        {icon && <span className="gl-toggle-icon">{icon}</span>}
        {children && <span className="gl-toggle-label">{children}</span>}
      </button>
    );
  }
);
