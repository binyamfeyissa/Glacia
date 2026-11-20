// Wave 2 — Toggle.
//
// The donor's toggle button: a two-state button that reports `pressed`, is not
// a checkbox, and can be controlled or internal. Dressed as a glass control at
// the 28 / 34 / 44 button scale.

import { useState, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

export interface ToggleProps {
  /** Controlled pressed state. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Read-only alias of `pressed`, matching the web package's naming. */
  selected?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  variant?: "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isDark?: boolean;
  testID?: string;
}

const HEIGHTS = { sm: 28, md: 34, lg: 44 } as const;
const FONT = { sm: 13, md: 15, lg: 16 } as const;

export function Toggle({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  selected,
  icon,
  children,
  variant = "glass",
  size = "md",
  disabled = false,
  accessibilityLabel,
  style,
  textStyle,
  isDark: isDarkProp,
  testID,
}: ToggleProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();

  const [internal, setInternal] = useState(defaultPressed);
  const pressed = pressedProp !== undefined ? pressedProp : selected !== undefined ? selected : internal;

  const toggle = () => {
    const next = !pressed;
    if (pressedProp === undefined) setInternal(next);
    hapticSelection();
    onPressedChange?.(next);
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: pressed, disabled }}
      disabled={disabled}
      onPress={toggle}
      style={[{ alignSelf: "flex-start", opacity: disabled ? 0.38 : 1 }, style]}
    >
      <Glass
        effect={variant === "ghost" ? "none" : "regular"}
        surface="control"
        isDark={isDark}
        pressed={pressed}
        style={{
          height: HEIGHTS[size],
          paddingHorizontal: size === "sm" ? 10 : 14,
          borderRadius: radii.pill,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: pressed && variant === "ghost" ? theme.wash : undefined,
        }}
      >
        {icon ? <View>{icon}</View> : null}
        {typeof children === "string" ? (
          <RNText
            style={[
              {
                fontSize: FONT[size],
                fontWeight: pressed ? "600" : "500",
                color: theme.foreground,
              },
              textStyle,
            ]}
          >
            {children}
          </RNText>
        ) : (
          children
        )}
      </Glass>
    </Pressable>
  );
}
