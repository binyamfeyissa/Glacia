import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Label } from "./Label";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface FieldProps {
  label?: string;
  /** Helper text shown under the control. */
  description?: string;
  /** Error text. Overrides `description` and tints the label. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Label, control and message stacked in the order assistive tech announces
 * them, so a caller never has to place these three by hand.
 */
export function Field({
  label,
  description,
  error,
  required = false,
  disabled = false,
  isDark: isDarkProp,
  children,
  style,
}: FieldProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();
  const message = error ?? description;

  return (
    <View style={{ gap: 7, ...(style as ViewStyle) }}>
      {label && (
        <Label required={required} disabled={disabled} isDark={isDark}>
          {label}
        </Label>
      )}

      {children}

      {message && (
        <Text
          accessibilityRole={error ? "alert" : "text"}
          style={{
            fontSize: 12,
            color: error ? theme.destructive : theme.muted,
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

