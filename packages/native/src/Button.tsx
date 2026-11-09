import { forwardRef, type ReactNode } from "react";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";

export interface ButtonProps {
  variant?: "glass" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
  icon?: ReactNode;
  children?: ReactNode;
  style?: any;
  tint?: string;
  isDark?: boolean;
}

const sizeHeights = {
  sm: 32,
  md: 40,
  lg: 48,
};

export const Button = forwardRef<any, ButtonProps>(function Button(
  {
    variant = "glass",
    size = "md",
    disabled = false,
    onPress,
    accessibilityLabel,
    icon,
    children,
    style,
    tint,
    isDark = false,
    ...props
  },
  ref,
) {
  const themeColors = isDark ? colors.dark : colors.light;
  const height = sizeHeights[size];

  const buttonStyle = {
    height,
    borderRadius: height / 2,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: size === "sm" ? 12 : size === "lg" ? 22 : 16,
    opacity: disabled ? 0.38 : 1,
    backgroundColor:
      variant === "filled"
        ? tint || themeColors.fill
        : variant === "ghost"
        ? "transparent"
        : undefined,
    ...style,
  };

  const textStyle = {
    color: variant === "filled" ? "#FFFFFF" : tint || themeColors.foreground,
    fontSize: size === "sm" ? 13 : size === "lg" ? 16 : 14,
    fontWeight: "500" as const,
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={accessibilityLabel}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onPress}
      style={{ display: "inline-block", cursor: disabled ? "default" : "pointer" }}
      {...props}
    >
      <Glass
        effect={variant === "ghost" ? "none" : "regular"}
        interactive={!disabled}
        style={buttonStyle}
      >
        {icon && <span style={{ marginRight: children ? 8 : 0 }}>{icon}</span>}
        {typeof children === "string" ? <span style={textStyle}>{children}</span> : children}
      </Glass>
    </div>
  );
});
