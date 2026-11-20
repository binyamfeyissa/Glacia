// Wave 2 — Alert.
//
// The donor's static callout: a named region with a title and description, not a
// tap target. Dressed on the family's glass with the same radius and type steps
// as Card, tinted by tone rather than by a second surface.

import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export type AlertTone = "default" | "info" | "success" | "warning" | "destructive";

export interface AlertProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  tone?: AlertTone;
  /** Optional dismiss control. */
  onDismiss?: () => void;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Alert({
  title,
  description,
  icon,
  tone = "default",
  onDismiss,
  isDark: isDarkProp,
  style,
  testID,
}: AlertProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();

  const accent =
    tone === "destructive"
      ? theme.destructive
      : tone === "success"
        ? theme.on
        : tone === "warning"
          ? theme.warning
          : tone === "info"
            ? theme.info
            : theme.foreground;

  return (
    <Glass
      effect="regular"
      surface="panel"
      isDark={isDark}
      testID={testID}
      accessibilityRole="alert"
      role="alert"
      style={[{ borderRadius: radii.lg, padding: 14 }, style]}
    >
      <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
        {icon ? <View style={{ marginTop: 1 }}>{icon}</View> : null}
        <View style={{ flex: 1, gap: 3 }}>
          <RNText style={{ ...typeScale.label, color: accent }}>{title}</RNText>
          {description ? (
            <RNText style={{ ...typeScale.caption, color: theme.muted }}>{description}</RNText>
          ) : null}
        </View>
        {onDismiss ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            onPress={onDismiss}
            hitSlop={8}
          >
            <RNText style={{ fontSize: 13, color: theme.muted }}>✕</RNText>
          </Pressable>
        ) : null}
      </View>
    </Glass>
  );
}
