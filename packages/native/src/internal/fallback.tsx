import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radii } from "./tokens";
import { primitives } from "./primitives";

export interface FallbackGlassProps {
  effect?: "clear" | "regular" | "none";
  tintColor?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  isDark?: boolean;
}

/**
 * Glacia's own glass surface for every platform where Apple's material is not
 * available: Android, iOS before 26, and Expo Go.
 *
 * It renders the resolver's real React Native `View` with the same shape and
 * layout as the native glass, so switching branches never shifts the layout.
 */
export const FallbackGlassView = forwardRef<any, FallbackGlassProps>(function FallbackGlassView(
  {
    effect = "regular",
    tintColor,
    testID,
    style,
    children,
    isDark = false,
    ...props
  },
  ref,
) {
  const themeColors = isDark ? colors.dark : colors.light;
  const { View } = primitives();

  const bg =
    effect === "none"
      ? "transparent"
      : effect === "clear"
        ? isDark
          ? "rgba(28, 28, 30, 0.35)"
          : "rgba(255, 255, 255, 0.35)"
        : tintColor || themeColors.glass;

  const containerStyle: ViewStyle = {
    backgroundColor: bg,
    borderColor: themeColors.edge,
    borderWidth: 0.5,
    borderRadius: radii.md,
    overflow: "hidden",
    ...(style as ViewStyle),
  };

  return (
    <View ref={ref} testID={testID} style={containerStyle} {...props}>
      {children}
    </View>
  );
});
