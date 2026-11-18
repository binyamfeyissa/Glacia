import { forwardRef, useState, type ReactNode } from "react";
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

// The web control scale: 28 / 34 / 44, one horizontal padding and one type
// size for every button, and the inherited 400 weight rather than a 500.
const sizeHeights = {
  sm: 28,
  md: 34,
  lg: 44,
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
  const [held, setHeld] = useState(false);
  const height = sizeHeights[size];

  const buttonStyle: ViewStyle = {
    height,
    borderRadius: height / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
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
    color: variant === "filled" ? themeColors.onTint : tint || themeColors.foreground,
    fontSize: 14,
    fontWeight: "400",
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
      onPressIn={() => setHeld(true)}
      onPressOut={() => setHeld(false)}
      style={({ pressed }: { pressed: boolean }) => ({ opacity: pressed && !disabled ? 0.85 : 1 })}
      {...props}
    >
      <Glass
        effect={variant === "ghost" ? "none" : "regular"}
        surface="control"
        pressed={held && !disabled}
        interactive={!disabled}
        isDark={isDark}
        style={buttonStyle}
      >
        {icon ? <View style={{ marginRight: children ? 7 : 0 }}>{icon}</View> : null}
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
