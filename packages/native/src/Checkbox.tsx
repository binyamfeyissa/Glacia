// Wave 2 — Checkbox.
//
// The donor's checkbox semantics: `role="checkbox"`, checked / mixed states
// exposed to screen readers, a label that is part of the same press target, and
// controlled-or-internal state. Dressed as the family's small glass square.

import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Checkbox({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  indeterminate = false,
  disabled = false,
  isDark: isDarkProp,
  style,
  testID,
}: CheckboxProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();

  const [internal, setInternal] = useState(defaultChecked);
  const checked = checkedProp !== undefined ? checkedProp : internal;
  const on = checked || indeterminate;

  const toggle = () => {
    const next = !checked;
    if (checkedProp === undefined) setInternal(next);
    hapticSelection();
    onCheckedChange?.(next);
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityLabel={label ?? "Checkbox"}
      accessibilityState={{ checked: indeterminate ? "mixed" : checked, disabled }}
      disabled={disabled}
      onPress={toggle}
      style={[
        { flexDirection: "row", alignItems: "center", gap: 10, opacity: disabled ? 0.38 : 1 },
        style,
      ]}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: radii.sm,
          borderWidth: 1.5,
          borderColor: on ? theme.fill : theme.separator,
          backgroundColor: on ? theme.fill : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {indeterminate ? (
          <View style={{ width: 10, height: 2, borderRadius: radii.pill, backgroundColor: theme.onTint }} />
        ) : checked ? (
          <RNText style={{ fontSize: 13, fontWeight: "800", color: theme.onTint }}>✓</RNText>
        ) : null}
      </View>
      {label || description ? (
        <View style={{ flex: 1 }}>
          {label ? (
            <RNText style={{ ...typeScale.body, color: theme.foreground }}>{label}</RNText>
          ) : null}
          {description ? (
            <RNText style={{ ...typeScale.caption, color: theme.muted }}>{description}</RNText>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}
