// Wave 2 — Badge.
//
// The donor's badge is a short, non-interactive count/label that is announced as
// one unit. Dressed as the family's capsule: the same 28dp small height as the
// button scale, the same pill radius, the same type step.

import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface BadgeProps {
  children?: ReactNode;
  tone?: "fill" | "destructive" | "success" | "muted";
  /** Wraps the badge around a control, e.g. an icon button with a count. */
  overlay?: ReactNode;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Badge({
  children,
  tone = "fill",
  overlay,
  isDark: isDarkProp,
  style,
  testID,
}: BadgeProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText } = primitives();

  const background =
    tone === "destructive"
      ? theme.destructive
      : tone === "success"
        ? theme.on
        : tone === "muted"
          ? theme.wash
          : theme.fill;
  const color = tone === "muted" ? theme.foreground : theme.onTint;

  const badge = (
    <View
      testID={testID}
      accessible
      accessibilityRole="text"
      style={[
        {
          minHeight: 20,
          minWidth: 20,
          paddingHorizontal: 7,
          borderRadius: radii.pill,
          backgroundColor: background,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <RNText style={{ ...typeScale.caption, fontWeight: "700", color }}>{children}</RNText>
      ) : (
        children
      )}
    </View>
  );

  if (!overlay) return badge;
  return (
    <View style={{ alignSelf: "flex-start" }}>
      {overlay}
      <View style={{ position: "absolute", top: -6, right: -6 }}>{badge}</View>
    </View>
  );
}
