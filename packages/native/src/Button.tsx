import { forwardRef, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface ButtonProps {
  variant?: "glass" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
  icon?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
  isDark?: boolean;
  /** Passed through to the pressable root so the button is testable. */
  testID?: string;
}

const sizeHeights = {
  sm: 32,
  md: 40,
  lg: 48,
};

/**
 * A pressable button on Glacia's glass.
 *
 * The root is a Pressable so it gets the platform's own press semantics
 * (focus, screen-reader activation, pressed feedback) while the material —
 * Apple's glass on iOS 26+, Glacia's tint elsewhere — comes from `Glass`.
 */
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
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { Pressable, View, Text } = primitives();
  const height = sizeHeights[size];

  const buttonStyle: ViewStyle = {
    height,
    borderRadius: height / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: size === "sm" ? 12 : size === "lg" ? 22 : 16,
    opacity: disabled ? 0.38 : 1,
    backgroundColor:
      variant === "filled"
        ? tint || themeColors.fill
        : variant === "ghost"
          ? "transparent"
          : undefined,
    ...(style as ViewStyle),
  };

  const textStyle: TextStyle = {
    color: variant === "filled" ? "#FFFFFF" : tint || themeColors.foreground,
    fontSize: size === "sm" ? 13 : size === "lg" ? 16 : 14,
    fontWeight: "500",
  };

  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed && !disabled ? 0.85 : 1 })}
      {...props}
    >
      <Glass
        effect={variant === "ghost" ? "none" : "regular"}
        interactive={!disabled}
        isDark={isDark}
        style={buttonStyle}
      >
        {icon ? <View style={{ marginRight: children ? 8 : 0 }}>{icon}</View> : null}
        {typeof children === "string" ? (
          // A string label is text: it needs Text to inherit font and colour.
          <Text style={textStyle} numberOfLines={1}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Glass>
    </Pressable>
  );
});
